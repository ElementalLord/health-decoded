import "server-only";

import {
  AI_DEFAULT_TEMPERATURE,
  AI_REGENERATION_TEMPERATURE,
} from "@/features/ai/constants/ai-models";
import { buildAiPrompt } from "@/features/ai/prompts/prompt-builder";
import type { AiCredibleSourceContext } from "@/features/ai/data/credible-sources";
import { reviewedSuggestedAnswerFor } from "@/features/ai/data/reviewed-suggested-answers";
import { loadTrustedAiContext } from "@/features/ai/services/ai-context.server";
import { sanitizeAiConversationHistory } from "@/features/ai/services/ai-conversation-safety";
import { logAiOperation } from "@/features/ai/services/ai-logging.server";
import { buildReviewedEvidenceFallback } from "@/features/ai/services/ai-grounding";
import {
  consumeAiProviderBudget,
  recordAiProviderFailure,
  recordAiProviderSuccess,
} from "@/features/ai/services/ai-provider-guard.server";
import {
  consumeAiRequestSlot,
  fingerprintAiRequest,
} from "@/features/ai/services/ai-rate-limit.server";
import { assessAiSafety, buildAiSafetyInput } from "@/features/ai/services/ai-safety.server";
import { recordQualifyingLearningActivity } from "@/features/streaks/services/learning-streak.server";
import type {
  AiChatFailureCategory,
  AiChatRequest,
  AiChatStreamEvent,
  AiContextMetadata,
} from "@/features/ai/types/ai";
import { aiProvider } from "@/services/ai/provider";

type AiChatStreamResult =
  | { readonly ok: true; readonly data: AsyncGenerator<AiChatStreamEvent> }
  | { readonly ok: false; readonly category: AiChatFailureCategory };

function durationBucket(duration: number) {
  if (duration < 100) return "under_100ms" as const;
  if (duration < 1_000) return "under_1s" as const;
  return "over_1s" as const;
}

function requestSizeBucket(length: number) {
  if (length <= 300) return "small" as const;
  if (length <= 1_000) return "medium" as const;
  return "large" as const;
}

function inputCountBucket(count: number) {
  if (count === 1) return "one" as const;
  if (count <= 3) return "few" as const;
  return "many" as const;
}

function refusalStream(message: string, metadata?: AiContextMetadata): AiChatStreamResult {
  return {
    ok: true,
    data: (async function* () {
      if (metadata?.credibleSources.length) {
        yield { ...metadata, type: "context" };
      }
      yield { text: message, type: "delta" };
      yield { type: "done" };
    })(),
  };
}

function reviewedFallbackEvents(
  retrievedSources: readonly AiCredibleSourceContext[],
  metadata: AiContextMetadata,
  question: string,
  previousAnswers: readonly string[],
): AsyncGenerator<AiChatStreamEvent> {
  const reviewedSuggestedAnswer = reviewedSuggestedAnswerFor(question);
  const preferredSources = reviewedSuggestedAnswer
    ? retrievedSources.filter((source) =>
        reviewedSuggestedAnswer.reviewedSourceKeys.includes(source.id),
      )
    : [];
  const fallbackSources = (preferredSources.length ? preferredSources : retrievedSources).slice(
    0,
    2,
  );
  return (async function* () {
    yield {
      credibleSources: metadata.credibleSources.filter((source) =>
        fallbackSources.some((retrieved) => retrieved.href === source.href),
      ),
      suggestedQuestions: metadata.suggestedQuestions,
      type: "context",
    };
    yield {
      text: buildReviewedEvidenceFallback({
        previousAnswers,
        question,
        sources: fallbackSources,
      }),
      type: "delta",
    };
    yield { type: "done" };
  })();
}

function providerFallbackEvents(
  retrievedSources: readonly AiCredibleSourceContext[],
  metadata: AiContextMetadata,
  question: string,
  previousAnswers: readonly string[],
): AsyncGenerator<AiChatStreamEvent> {
  if (retrievedSources.length > 0) {
    return reviewedFallbackEvents(retrievedSources, metadata, question, previousAnswers);
  }

  return (async function* () {
    yield { code: "AI_UNAVAILABLE", type: "error" };
  })();
}

export async function createAiChatStream(
  input: AiChatRequest,
  signal?: AbortSignal,
): Promise<AiChatStreamResult> {
  const startedAt = Date.now();
  const correlationId = crypto.randomUUID();
  const inputCount = 1 + (input.messages?.length ?? 0);
  const priorUserMessages = (input.messages ?? [])
    .filter(({ role }) => role === "user")
    .map(({ content }) => content);
  const safety = assessAiSafety(buildAiSafetyInput({ message: input.message, priorUserMessages }));
  const requestCategory = safety.category;
  const loggingContext = {
    operation: "chat_request" as const,
    duration_bucket: durationBucket(Date.now() - startedAt),
    request_size_bucket: requestSizeBucket(input.message.length),
    input_count_bucket: inputCountBucket(inputCount),
    correlation_id: correlationId,
    request_category: requestCategory,
  };

  if (safety.kind === "refuse" && safety.refusalType === "emergency") {
    logAiOperation({ ...loggingContext, outcome: "refused", refusal_type: safety.refusalType });
    return refusalStream(safety.message);
  }

  const rateLimit = consumeAiRequestSlot({
    fingerprint: fingerprintAiRequest(input.message),
    networkKey: input.networkKey,
    sensitive: safety.category === "Prompt Injection / Abuse",
    userId: input.userId,
  });
  if (!rateLimit.allowed) {
    logAiOperation({
      ...loggingContext,
      outcome: "rate_limited",
      security_control: "duplicate_or_quota",
    });
    return { ok: false, category: "rate_limited" };
  }

  if (safety.kind === "refuse") {
    logAiOperation({ ...loggingContext, outcome: "refused", refusal_type: safety.refusalType });
    const refusalContext = await loadTrustedAiContext({
      message: input.message,
      ...(input.messages?.length ? { messages: input.messages } : {}),
    });
    return refusalStream(
      safety.message,
      refusalContext.ok ? refusalContext.data.metadata : undefined,
    );
  }

  const safeMessages = sanitizeAiConversationHistory(input.messages ?? []);

  const context = await loadTrustedAiContext({
    message: input.message,
    ...(safeMessages.length ? { messages: safeMessages } : {}),
  });

  if (!context.ok) {
    logAiOperation({ ...loggingContext, outcome: "context" });
    return { ok: false, category: "context" };
  }

  const retrievedSources = context.data.retrievedSources;
  const previousAnswers = safeMessages
    .filter(({ role }) => role === "assistant")
    .map(({ content }) => content);
  if (reviewedSuggestedAnswerFor(input.message)) {
    logAiOperation({ ...loggingContext, outcome: "success" });
    return {
      ok: true,
      data: reviewedFallbackEvents(
        retrievedSources,
        context.data.metadata,
        input.message,
        previousAnswers,
      ),
    };
  }

  let prompt: ReturnType<typeof buildAiPrompt>;
  try {
    prompt = buildAiPrompt({
      context: context.data.promptContext,
      message: input.message,
      ...(safeMessages.length ? { messages: safeMessages } : {}),
      regenerate: Boolean(input.regenerate),
    });
  } catch {
    logAiOperation({ ...loggingContext, outcome: "unexpected" });
    return {
      ok: true,
      data: providerFallbackEvents(
        retrievedSources,
        context.data.metadata,
        input.message,
        previousAnswers,
      ),
    };
  }

  const providerBudget = consumeAiProviderBudget();
  if (!providerBudget.allowed) {
    logAiOperation({
      ...loggingContext,
      outcome: providerBudget.reason === "budget" ? "rate_limited" : "unexpected",
      security_control: providerBudget.reason === "budget" ? "provider_budget" : "provider_circuit",
    });
    return {
      ok: true,
      data: providerFallbackEvents(
        retrievedSources,
        context.data.metadata,
        input.message,
        previousAnswers,
      ),
    };
  }

  return {
    ok: true,
    data: (async function* () {
      let outcome: "configuration" | "rate_limited" | "success" | "timeout" | "unexpected" =
        "success";
      const providerResult = await aiProvider.generateGroundedResponse(
        {
          ...prompt,
          relevanceContext: {
            ...(priorUserMessages.length ? { previousQuestion: priorUserMessages.at(-1) } : {}),
            question: input.message,
          },
          temperature: input.regenerate ? AI_REGENERATION_TEMPERATURE : AI_DEFAULT_TEMPERATURE,
        },
        signal,
      );
      if (!providerResult.ok) {
        outcome = providerResult.category === "refused" ? "unexpected" : providerResult.category;
        recordAiProviderFailure();
        logAiOperation({
          ...loggingContext,
          duration_bucket: durationBucket(Date.now() - startedAt),
          outcome,
        });
        for await (const event of providerFallbackEvents(
          retrievedSources,
          context.data.metadata,
          input.message,
          previousAnswers,
        )) {
          yield event;
        }
        return;
      }
      yield {
        credibleSources: providerResult.sources,
        suggestedQuestions: context.data.metadata.suggestedQuestions,
        type: "context",
      };
      recordAiProviderSuccess();
      yield { text: providerResult.text, type: "delta" };
      yield { type: "done" };
      // Completion telemetry is optional and must never delay or invalidate the answer.
      if (!signal?.aborted && providerResult.text.trim().length > 0) {
        void recordQualifyingLearningActivity("ai_learning_exchange_completed").catch(() =>
          logAiOperation({ ...loggingContext, outcome: "unexpected" }),
        );
      }
      logAiOperation({
        ...loggingContext,
        duration_bucket: durationBucket(Date.now() - startedAt),
        outcome,
      });
    })(),
  };
}
