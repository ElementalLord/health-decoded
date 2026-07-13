import "server-only";

import { logAiOperation } from "@/features/ai/services/ai-logging.server";
import type { AiChatRequest, AiUnavailableResponse } from "@/features/ai/types/ai";

const unavailableResponse: AiUnavailableResponse = {
  error: {
    code: "AI_NOT_AVAILABLE",
    message: "The AI assistant is not available yet.",
  },
};

function getRequestSizeBucket(messageCount: number) {
  if (messageCount === 1) return "small" as const;
  if (messageCount <= 4) return "medium" as const;
  return "large" as const;
}

function getInputCountBucket(messageCount: number) {
  if (messageCount === 1) return "one" as const;
  if (messageCount <= 4) return "few" as const;
  return "many" as const;
}

/**
 * The AI domain boundary. Provider execution, prompt construction, retrieval,
 * quotas, and conversation persistence are intentionally deferred.
 */
export async function requestAiChat(input: AiChatRequest): Promise<AiUnavailableResponse> {
  const startedAt = Date.now();

  logAiOperation({
    operation: "chat_request",
    outcome: "not_available",
    duration_bucket: Date.now() - startedAt < 100 ? "under_100ms" : "under_1s",
    request_size_bucket: getRequestSizeBucket(input.messages.length),
    input_count_bucket: getInputCountBucket(input.messages.length),
    correlation_id: crypto.randomUUID(),
  });

  return unavailableResponse;
}
