export type AiChatRequest = {
  readonly message: string;
  readonly lessonId?: string | undefined;
  readonly medicationId?: string | undefined;
};

export type AiChatResponse = {
  readonly assistantMessage: string;
};

export type AiChatFailureCategory =
  "configuration" | "context" | "rate_limited" | "refused" | "timeout" | "unexpected";

export type AiChatServiceResult =
  | { readonly ok: true; readonly data: AiChatResponse }
  | { readonly ok: false; readonly category: AiChatFailureCategory };
