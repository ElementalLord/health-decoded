import "server-only";

import { buildAiPrompt } from "@/features/ai/prompts/prompt-builder";
import { loadTrustedAiContext } from "@/features/ai/services/ai-context.server";
import { logAiOperation } from "@/features/ai/services/ai-logging.server";
import { assessAiSafety } from "@/features/ai/services/ai-safety.server";
import type { AiChatRequest, AiChatServiceResult } from "@/features/ai/types/ai";
import { aiProvider } from "@/services/ai/provider";

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

export async function requestAiChat(input: AiChatRequest): Promise<AiChatServiceResult> {
  const startedAt = Date.now();
  const correlationId = crypto.randomUUID();
  const inputCount = 1 + (input.messages?.length ?? 0);
  const safety = assessAiSafety(input.message);

  if (safety.kind === "redirect") {
    logAiOperation({
      operation: "chat_request",
      outcome: "refused",
      duration_bucket: durationBucket(Date.now() - startedAt),
      request_size_bucket: requestSizeBucket(input.message.length),
      input_count_bucket: inputCountBucket(inputCount),
      correlation_id: correlationId,
    });
    return { ok: true, data: { assistantMessage: safety.message } };
  }

  const context = await loadTrustedAiContext({
    lessonId: input.lessonId,
    medicationId: input.medicationId,
    userId: input.userId,
  });

  if (!context.ok) {
    logAiOperation({
      operation: "chat_request",
      outcome: "context",
      duration_bucket: durationBucket(Date.now() - startedAt),
      request_size_bucket: requestSizeBucket(input.message.length),
      input_count_bucket: inputCountBucket(inputCount),
      correlation_id: correlationId,
    });
    return { ok: false, category: "context" };
  }

  const prompt = buildAiPrompt({
    context: context.data,
    message: input.message,
    ...(input.messages ? { messages: input.messages } : {}),
  });
  const response = await aiProvider.generateResponse(prompt);
  const outcome = response.ok ? "success" : response.category;

  logAiOperation({
    operation: "chat_request",
    outcome,
    duration_bucket: durationBucket(Date.now() - startedAt),
    request_size_bucket: requestSizeBucket(input.message.length),
    input_count_bucket: inputCountBucket(inputCount),
    correlation_id: correlationId,
  });

  return response.ok
    ? { ok: true, data: { assistantMessage: response.text } }
    : { ok: false, category: response.category };
}
