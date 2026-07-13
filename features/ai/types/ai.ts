export type AiMessageRole = "assistant" | "user";

export type AiMessage = {
  readonly role: AiMessageRole;
  readonly content: string;
};

export type AiChatRequest = {
  readonly messages: readonly AiMessage[];
};

export type AiUnavailableResponse = {
  readonly error: {
    readonly code: "AI_NOT_AVAILABLE";
    readonly message: "The AI assistant is not available yet.";
  };
};

export type AiRequestOutcome = "not_available";
