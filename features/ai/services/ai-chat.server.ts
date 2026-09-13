import "server-only";

import {
  AI_DEFAULT_TEMPERATURE,
  AI_REGENERATION_TEMPERATURE,
} from "@/features/ai/constants/ai-models";
import { buildAiPrompt } from "@/features/ai/prompts/prompt-builder";
import {
  allCredibleSources,
  type AiCredibleSourceContext,
} from "@/features/ai/data/credible-sources";
import { reviewedSuggestedAnswerFor } from "@/features/ai/data/reviewed-suggested-answers";
import { loadTrustedAiContext } from "@/features/ai/services/ai-context.server";
import { sanitizeAiConversationHistory } from "@/features/ai/services/ai-conversation-safety";
import { logAiOperation } from "@/features/ai/services/ai-logging.server";
import {
  buildReviewedCorpusPrompt,
  buildReviewedCorpusResponseJsonSchema,
  buildReviewedEvidenceFallback,
  parseAndValidateReviewedCorpusOutput,
  reviewedCorpusSystemInstruction,
} from "@/features/ai/services/ai-grounding";
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
    const publicFallbackSources = metadata.credibleSources.filter((source) =>
      fallbackSources.some((retrieved) => retrieved.href === source.href),
    );
    if (publicFallbackSources.length) {
      yield {
        credibleSources: publicFallbackSources,
        suggestedQuestions: metadata.suggestedQuestions,
        type: "context",
      };
    }
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

async function* providerFallbackEvents(
  retrievedSources: readonly AiCredibleSourceContext[],
  metadata: AiContextMetadata,
  question: string,
  previousAnswers: readonly string[],
  previousQuestion?: string,
  generateFromReviewedCorpus = false,
  signal?: AbortSignal,
): AsyncGenerator<AiChatStreamEvent> {
  const structured = generateFromReviewedCorpus
    ? await aiProvider.generateStructuredResponse(
        {
          prompt: buildReviewedCorpusPrompt({
            previousAnswers,
            previousQuestion,
            question,
            sources: allCredibleSources,
          }),
          responseJsonSchema: buildReviewedCorpusResponseJsonSchema(allCredibleSources),
          systemInstruction: reviewedCorpusSystemInstruction,
        },
        signal,
      )
    : null;

  if (structured?.ok) {
    try {
      const validated = parseAndValidateReviewedCorpusOutput(
        JSON.parse(structured.text) as unknown,
        allCredibleSources,
        { ...(previousQuestion ? { previousQuestion } : {}), question },
      );
      if (validated) {
        if (validated.sources.length) {
          yield {
            credibleSources: validated.sources.map(({ href, organization, title }) => ({
              href,
              organization,
              title,
            })),
            suggestedQuestions: metadata.suggestedQuestions,
            type: "context",
          };
        }
        yield { text: validated.answer, type: "delta" };
        yield { type: "done" };
        return;
      }
    } catch {
      // Fall through to the deterministic reviewed-evidence safety net.
    }
  }

  yield* reviewedFallbackEvents(retrievedSources, metadata, question, previousAnswers);
}

async function* recordCompletedLearningExchange(
  events: AsyncGenerator<AiChatStreamEvent>,
  loggingContext: Omit<Parameters<typeof logAiOperation>[0], "outcome">,
): AsyncGenerator<AiChatStreamEvent> {
  for await (const event of events) {
    if (event.type === "done") {
      await recordLearningExchangeSafely(loggingContext);
    }
    yield event;
  }
}

async function recordLearningExchangeSafely(
  loggingContext: Omit<Parameters<typeof logAiOperation>[0], "outcome">,
) {
  try {
    await recordQualifyingLearningActivity("ai_learning_exchange_completed");
  } catch {
    // Streak recording is optional and must never invalidate a completed answer.
    logAiOperation({ ...loggingContext, outcome: "unexpected" });
  }
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
      data: recordCompletedLearningExchange(
        reviewedFallbackEvents(
          retrievedSources,
          context.data.metadata,
          input.message,
          previousAnswers,
        ),
        loggingContext,
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
      data: recordCompletedLearningExchange(
        providerFallbackEvents(
          retrievedSources,
          context.data.metadata,
          input.message,
          previousAnswers,
          priorUserMessages.at(-1),
        ),
        loggingContext,
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
      data: recordCompletedLearningExchange(
        providerFallbackEvents(
          retrievedSources,
          context.data.metadata,
          input.message,
          previousAnswers,
        ),
        loggingContext,
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
        recordAiProviderFailure(outcome);
        logAiOperation({
          ...loggingContext,
          duration_bucket: durationBucket(Date.now() - startedAt),
          outcome,
        });
        for await (const event of recordCompletedLearningExchange(
          providerFallbackEvents(
            retrievedSources,
            context.data.metadata,
            input.message,
            previousAnswers,
            priorUserMessages.at(-1),
            true,
            signal,
          ),
          loggingContext,
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
      if (!signal?.aborted && providerResult.text.trim().length > 0) {
        await recordLearningExchangeSafely(loggingContext);
      }
      yield { type: "done" };
      logAiOperation({
        ...loggingContext,
        duration_bucket: durationBucket(Date.now() - startedAt),
        outcome,
      });
    })(),
  };
}
