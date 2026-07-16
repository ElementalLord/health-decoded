import "server-only";

import { buildAiPrompt } from "@/features/ai/prompts/prompt-builder";
import { loadTrustedAiContext } from "@/features/ai/services/ai-context.server";
import { logAiOperation } from "@/features/ai/services/ai-logging.server";
import { consumeAiRequestSlot } from "@/features/ai/services/ai-rate-limit.server";
import { AiResponseStreamNormalizer } from "@/features/ai/services/ai-response-normalizer";
import { assessAiSafety } from "@/features/ai/services/ai-safety.server";
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
  const safety = assessAiSafety(input.message);
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

  if (!consumeAiRequestSlot(input.userId)) {
    logAiOperation({ ...loggingContext, outcome: "rate_limited" });
    return { ok: false, category: "rate_limited" };
  }

  if (safety.kind === "refuse") {
    logAiOperation({ ...loggingContext, outcome: "refused", refusal_type: safety.refusalType });
    return refusalStream(safety.message);
  }

  const context = await loadTrustedAiContext({
    message: input.message,
    userId: input.userId,
  });

  if (!context.ok) {
    logAiOperation({ ...loggingContext, outcome: "context" });
    return { ok: false, category: "context" };
  }

  const prompt = buildAiPrompt({
    context: context.data.promptContext,
    message: input.message,
    ...(input.messages?.length
      ? {
          messages: input.messages.filter(
            (entry) => entry.role === "assistant" || assessAiSafety(entry.content).kind === "allow",
          ),
        }
      : {}),
  });

  return {
    ok: true,
    data: (async function* () {
      let outcome: "configuration" | "rate_limited" | "success" | "timeout" | "unexpected" =
        "success";
      const normalizer = new AiResponseStreamNormalizer();

      yield {
        lessonUsed: Boolean(context.data.promptContext.lesson),
        relatedContent: context.data.metadata.relatedContent,
        suggestedQuestions: context.data.metadata.suggestedQuestions,
        type: "context",
      };

      for await (const event of aiProvider.generateResponseStream(prompt, signal)) {
        if (signal?.aborted) return;

        if (event.kind === "text") {
          const normalizedText = normalizer.append(event.text);
          if (normalizedText) yield { text: normalizedText, type: "delta" };
          continue;
        }

        outcome = event.category;
        logAiOperation({
          ...loggingContext,
          duration_bucket: durationBucket(Date.now() - startedAt),
          outcome,
        });
        yield { code: providerErrorCode(event.category), type: "error" };
        return;
      }

      const finalText = normalizer.finish();
      if (!finalText) {
        logAiOperation({
          ...loggingContext,
          duration_bucket: durationBucket(Date.now() - startedAt),
          outcome: "unexpected",
        });
        yield { code: "AI_UNAVAILABLE", type: "error" };
        return;
      }
      yield { text: finalText, type: "delta" };
      yield { type: "done" };
      logAiOperation({
        ...loggingContext,
        duration_bucket: durationBucket(Date.now() - startedAt),
        outcome,
      });
    })(),
  };
}
