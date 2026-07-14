import "server-only";

import type { AiRefusalType, AiRequestCategory } from "@/features/ai/services/ai-safety.server";
import { createServerLogger } from "@/lib/logging/server";

type AiDurationBucket = "under_100ms" | "under_1s" | "over_1s";
type AiRequestSizeBucket = "small" | "medium" | "large";
type AiInputCountBucket = "one" | "few" | "many";

type AiOperationLog = {
  readonly operation: "chat_request";
  readonly outcome:
    "configuration" | "context" | "rate_limited" | "refused" | "success" | "timeout" | "unexpected";
  readonly duration_bucket: AiDurationBucket;
  readonly request_size_bucket: AiRequestSizeBucket;
  readonly input_count_bucket: AiInputCountBucket;
  readonly correlation_id: string;
  readonly request_category: AiRequestCategory;
  readonly refusal_type?: AiRefusalType;
};

const logger = createServerLogger();

export function logAiOperation(event: AiOperationLog) {
  logger.info("ai.operation", event);
}
