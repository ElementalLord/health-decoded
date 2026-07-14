import type { AiChatRequestInput } from "@/features/ai/schemas/ai-chat.schema";

export type AiChatRequest = AiChatRequestInput & {
  readonly userId: string;
};

export type AiChatResponse = {
  readonly assistantMessage: string;
};

export type AiChatFailureCategory =
  "configuration" | "context" | "rate_limited" | "refused" | "timeout" | "unexpected";

export type AiChatServiceResult =
  | { readonly ok: true; readonly data: AiChatResponse }
  | { readonly ok: false; readonly category: AiChatFailureCategory };
