import "server-only";

import {
  AI_DEFAULT_TEMPERATURE,
  AI_REGENERATION_TEMPERATURE,
} from "@/features/ai/constants/ai-models";
import { buildAiPrompt } from "@/features/ai/prompts/prompt-builder";
import { loadTrustedAiContext } from "@/features/ai/services/ai-context.server";
import { logAiOperation } from "@/features/ai/services/ai-logging.server";
import {
  AI_INSUFFICIENT_EVIDENCE_MESSAGE,
  buildAiResponseJsonSchema,
  parseAndValidateAiGroundedOutput,
} from "@/features/ai/services/ai-grounding";
import { assessAiOutputSafety } from "@/features/ai/services/ai-output-safety";
import {
  consumeAiProviderBudget,
  recordAiProviderFailure,
  recordAiProviderSuccess,
} from "@/features/ai/services/ai-provider-guard.server";
import {
  consumeAiRequestSlot,
  fingerprintAiRequest,
} from "@/features/ai/services/ai-rate-limit.server";
import { assessAiSafety } from "@/features/ai/services/ai-safety.server";
import { recordQualifyingLearningActivity } from "@/features/streaks/services/learning-streak.server";
import type {
  AiChatFailureCategory,
  AiChatRequest,
  AiChatStreamEvent,
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

function providerErrorCode(category: AiChatFailureCategory) {
  if (category === "configuration") return "AI_CONFIGURATION_ERROR" as const;
  if (category === "rate_limited") return "AI_RATE_LIMITED" as const;
  if (category === "timeout") return "AI_TIMEOUT" as const;
  return "AI_UNAVAILABLE" as const;
}

function refusalStream(message: string): AiChatStreamResult {
  return {
    ok: true,
    data: (async function* () {
      yield { text: message, type: "delta" };
      yield { type: "done" };
    })(),
  };
}

export async function createAiChatStream(
  input: AiChatRequest,
  signal?: AbortSignal,
): Promise<AiChatStreamResult> {
  const startedAt = Date.now();
  const correlationId = crypto.randomUUID();
  const inputCount = 1 + (input.messages?.length ?? 0);
  const recentUserContext = (input.messages ?? [])
    .filter(({ role }) => role === "user")
    .slice(-2)
    .map(({ content }) => content)
    .join(" ");
  const safety = assessAiSafety(`${recentUserContext} ${input.message}`.trim());
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
    return refusalStream(safety.message);
  }

  for (const entry of input.messages ?? []) {
    if (entry.role === "user") {
      const historySafety = assessAiSafety(entry.content);
      if (historySafety.kind === "refuse") {
        logAiOperation({
          ...loggingContext,
          outcome: "refused",
          refusal_type: historySafety.refusalType,
        });
        return refusalStream(historySafety.message);
      }
    } else if (!assessAiOutputSafety(entry.content).safe) {
      logAiOperation({
        ...loggingContext,
        outcome: "refused",
        refusal_type: "prompt_injection",
      });
      return refusalStream(
        "I can’t use conversation history that contains unsafe or hidden instructions. Please start a new conversation and ask a Type 2 diabetes education question.",
      );
    }
  }

  const context = await loadTrustedAiContext({
    message: input.message,
    ...(input.messages ? { messages: input.messages } : {}),
    userId: input.userId,
  });

  if (!context.ok) {
    logAiOperation({ ...loggingContext, outcome: "context" });
    return { ok: false, category: "context" };
  }

  const retrievedSources = context.data.retrievedSources;
  if (retrievedSources.length === 0) {
    logAiOperation({ ...loggingContext, outcome: "refused", refusal_type: "unsupported_medical" });
    return refusalStream(AI_INSUFFICIENT_EVIDENCE_MESSAGE);
  }

  let prompt: ReturnType<typeof buildAiPrompt>;
  try {
    prompt = buildAiPrompt({
      context: context.data.promptContext,
      message: input.message,
      ...(input.messages?.length ? { messages: input.messages } : {}),
      regenerate: Boolean(input.regenerate),
    });
  } catch {
    logAiOperation({ ...loggingContext, outcome: "unexpected" });
    return { ok: false, category: "unexpected" };
  }

  const providerBudget = consumeAiProviderBudget();
  if (!providerBudget.allowed) {
    logAiOperation({
      ...loggingContext,
      outcome: providerBudget.reason === "budget" ? "rate_limited" : "unexpected",
      security_control: providerBudget.reason === "budget" ? "provider_budget" : "provider_circuit",
    });
    return {
      ok: false,
      category: providerBudget.reason === "budget" ? "rate_limited" : "unexpected",
    };
  }

  return {
    ok: true,
    data: (async function* () {
      let outcome: "configuration" | "rate_limited" | "success" | "timeout" | "unexpected" =
        "success";
      const providerResult = await aiProvider.generateStructuredResponse(
        {
          ...prompt,
          responseJsonSchema: buildAiResponseJsonSchema(retrievedSources),
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
        yield { code: providerErrorCode(outcome), type: "error" };
        return;
      }
      let rawOutput: unknown;
      try {
        rawOutput = JSON.parse(providerResult.text);
      } catch {
        rawOutput = null;
      }
      const validatedOutput = parseAndValidateAiGroundedOutput(rawOutput, retrievedSources);
      if (!validatedOutput) {
        recordAiProviderFailure();
        logAiOperation({
          ...loggingContext,
          duration_bucket: durationBucket(Date.now() - startedAt),
          outcome: "unexpected",
          security_control: "output_validation",
        });
        yield { code: "AI_UNAVAILABLE", type: "error" };
        return;
      }
      yield {
        credibleSources: context.data.metadata.credibleSources.filter((source) =>
          validatedOutput.sources.some((retrieved) => retrieved.href === source.href),
        ),
        lessonUsed: Boolean(context.data.promptContext.lesson),
        relatedContent: context.data.metadata.relatedContent,
        suggestedQuestions: context.data.metadata.suggestedQuestions,
        type: "context",
      };
      recordAiProviderSuccess();
      yield { text: validatedOutput.answer, type: "delta" };
      // This is deliberately server-side and occurs only after a non-refused, output-validated
      // educational response has been produced. No conversation content enters the streak system.
      if (!signal?.aborted && validatedOutput.answer.trim().length > 0) {
        await recordQualifyingLearningActivity("ai_learning_exchange_completed");
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
