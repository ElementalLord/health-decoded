import "server-only";

import { createServerLogger } from "@/lib/logging/server";

type AiDurationBucket = "under_100ms" | "under_1s" | "over_1s";
type AiRequestSizeBucket = "small" | "medium" | "large";
type AiInputCountBucket = "one" | "few" | "many";

type AiOperationLog = {
  readonly operation: "chat_request";
  readonly outcome: "not_available";
  readonly duration_bucket: AiDurationBucket;
  readonly request_size_bucket: AiRequestSizeBucket;
  readonly input_count_bucket: AiInputCountBucket;
  readonly correlation_id: string;
};

const logger = createServerLogger();

export function logAiOperation(event: AiOperationLog) {
  logger.info("ai.operation", event);
}
