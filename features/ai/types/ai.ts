import type { AiChatRequestInput } from "@/features/ai/schemas/ai-chat.schema";

export type AiChatRequest = AiChatRequestInput & {
  readonly userId: string;
};

export type AiChatResponse = {
  readonly assistantMessage: string;
};

export type AiRelatedContent =
  | {
      readonly href: string;
      readonly kind: "caregiver";
      readonly title: string;
    }
  | {
      readonly href: string;
      readonly kind: "lesson";
      readonly title: string;
    }
  | {
      readonly href: string;
      readonly kind: "medication";
      readonly title: string;
    }
  | {
      readonly href: string;
      readonly kind: "story";
      readonly title: string;
    };

export type AiContextMetadata = {
  readonly relatedContent: readonly AiRelatedContent[];
  readonly suggestedQuestions: readonly string[];
};

export type AiChatStreamEvent =
  | { readonly type: "delta"; readonly text: string }
  | (AiContextMetadata & { readonly lessonUsed: boolean; readonly type: "context" })
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
