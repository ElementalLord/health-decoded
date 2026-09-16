import "server-only";
import { uniqueCitations } from "@/features/ai/data/unique-citations";

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
import { diabetesSourceBank } from "@/features/ai/data/diabetes-knowledge";
import { loadTrustedAiContext } from "@/features/ai/services/ai-context.server";
import { sanitizeAiConversationHistory } from "@/features/ai/services/ai-conversation-safety";
import { conversationReplyFor } from "@/features/ai/services/ai-conversation-replies";
import { logAiOperation } from "@/features/ai/services/ai-logging.server";
import {
  AI_INSUFFICIENT_EVIDENCE_MESSAGE,
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
    preferredSources.length ? 2 : 8,
  );
  return (async function* () {
    const fallbackAnswer = buildReviewedEvidenceFallback({
      previousAnswers,
      question,
      sources: fallbackSources,
    });
    // Topic cards share source URLs. Build citations from the bounded evidence
    // itself, rather than re-expanding every metadata entry with a matching URL.
    const publicFallbackSources = [
      ...new Map(
        fallbackSources.map(
          ({ href, organization, title }) => [href, { href, organization, title }] as const,
        ),
      ).values(),
    ].slice(0, 8);
    if (publicFallbackSources.length && !fallbackAnswer.startsWith("I don’t know your name")) {
      yield {
        credibleSources: publicFallbackSources,
        suggestedQuestions: metadata.suggestedQuestions,
        type: "context",
      };
    }
    yield {
      text: fallbackAnswer,
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
): AsyncGenerator<AiChatStreamEvent> {
  yield* reviewedFallbackEvents(retrievedSources, metadata, question, previousAnswers);
}

async function* recordCompletedLearningExchange(
  events: AsyncGenerator<AiChatStreamEvent>,
  loggingContext: Omit<Parameters<typeof logAiOperation>[0], "outcome">,
): AsyncGenerator<AiChatStreamEvent> {
  for await (const event of events) {
    yield event;
    if (event.type === "done") {
      await recordLearningExchangeSafely(loggingContext);
    }
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

  const conversationReply = conversationReplyFor(input.message);
  if (conversationReply) {
    logAiOperation({ ...loggingContext, outcome: "success" });
    return refusalStream(conversationReply);
  }

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
      // Established knowledge comes first. Search is only an extension for a
      // genuinely missing fact, never a prerequisite for ordinary education.
      const knowledgeSources = diabetesSourceBank([...allCredibleSources, ...retrievedSources]);
      let knowledgeResult: Awaited<ReturnType<typeof aiProvider.generateStructuredResponse>>;
      try {
        knowledgeResult = await aiProvider.generateStructuredResponse(
          {
            prompt: buildReviewedCorpusPrompt({
              previousAnswers,
              previousQuestion: priorUserMessages.at(-1),
              question: input.message,
              sources: knowledgeSources,
            }),
            responseJsonSchema: buildReviewedCorpusResponseJsonSchema(knowledgeSources),
            systemInstruction: reviewedCorpusSystemInstruction,
            temperature: input.regenerate ? AI_REGENERATION_TEMPERATURE : AI_DEFAULT_TEMPERATURE,
          },
          signal,
        );
      } catch {
        knowledgeResult = { ok: false, category: "unexpected" };
      }
      let knowledgeAnswer: ReturnType<typeof parseAndValidateReviewedCorpusOutput> = null;
      if (knowledgeResult.ok) {
        try {
          knowledgeAnswer = parseAndValidateReviewedCorpusOutput(
            JSON.parse(knowledgeResult.text) as unknown,
            knowledgeSources,
          );
        } catch {
          // Malformed model output must never replace a source-backed answer.
        }
      }
      if (knowledgeAnswer && knowledgeAnswer.answer !== AI_INSUFFICIENT_EVIDENCE_MESSAGE) {
        recordAiProviderSuccess();
        if (knowledgeAnswer.sources.length) {
          yield {
            credibleSources: uniqueCitations(
              knowledgeAnswer.sources.map(({ href, organization, title }) => ({
                href,
                organization,
                title,
              })),
            ),
            suggestedQuestions: context.data.metadata.suggestedQuestions,
            type: "context",
          };
        }
        yield { text: knowledgeAnswer.answer, type: "delta" };
        yield { type: "done" };
        if (!signal?.aborted) await recordLearningExchangeSafely(loggingContext);
        logAiOperation({ ...loggingContext, outcome: "success" });
        return;
      }
      // A provider failure cannot be fixed by making a search request through
      // that same provider. Use the bundled evidence immediately in that case.
      if (
        !knowledgeResult.ok ||
        !knowledgeAnswer ||
        signal?.aborted ||
        !consumeAiProviderBudget().allowed
      ) {
        if (!knowledgeResult.ok) {
          recordAiProviderFailure(
            knowledgeResult.category === "refused" ? "unexpected" : knowledgeResult.category,
          );
        }
        yield* recordCompletedLearningExchange(
          reviewedFallbackEvents(
            retrievedSources,
            context.data.metadata,
            input.message,
            previousAnswers,
          ),
          loggingContext,
        );
        return;
      }
      let outcome: "configuration" | "rate_limited" | "success" | "timeout" | "unexpected" =
        "success";
      let providerResult: Awaited<ReturnType<typeof aiProvider.generateGroundedResponse>>;
      try {
        providerResult = await aiProvider.generateGroundedResponse(
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
      } catch {
        providerResult = { ok: false, category: "unexpected" };
      }
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
          ),
          loggingContext,
        )) {
          yield event;
        }
        return;
      }
      yield {
        credibleSources: uniqueCitations(providerResult.sources),
        suggestedQuestions: context.data.metadata.suggestedQuestions,
        type: "context",
      };
      recordAiProviderSuccess();
      yield { text: providerResult.text, type: "delta" };
      yield { type: "done" };
      if (!signal?.aborted && providerResult.text.trim().length > 0) {
        await recordLearningExchangeSafely(loggingContext);
      }
      logAiOperation({
        ...loggingContext,
        duration_bucket: durationBucket(Date.now() - startedAt),
        outcome,
      });
    })(),
  };
}
