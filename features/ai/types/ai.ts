import type { AiChatRequestInput } from "@/features/ai/schemas/ai-chat.schema";

export type AiChatRequest = AiChatRequestInput & {
  readonly networkKey: string;
  readonly userId: string;
};

export type AiChatResponse = {
  readonly assistantMessage: string;
};

export type AiCredibleSource = {
  readonly citedText?: string | undefined;
  readonly href: string;
  readonly organization: string;
  readonly title: string;
};

export type AiContextMetadata = {
  readonly credibleSources: readonly AiCredibleSource[];
  readonly suggestedQuestions: readonly string[];
};

export type AiChatStreamEvent =
  | { readonly type: "delta"; readonly text: string }
  | (AiContextMetadata & { readonly type: "context" })
  | {
      readonly code: "AI_CONFIGURATION_ERROR" | "AI_RATE_LIMITED" | "AI_TIMEOUT" | "AI_UNAVAILABLE";
      readonly type: "error";
    }
  | { readonly type: "done" };

export type AiChatFailureCategory =
  "configuration" | "context" | "rate_limited" | "refused" | "timeout" | "unexpected";

export type AiChatServiceResult =
  | { readonly ok: true; readonly data: AiChatResponse }
  | { readonly ok: false; readonly category: AiChatFailureCategory };
