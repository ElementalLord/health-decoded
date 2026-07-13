import "server-only";

import type { AiMessage } from "@/features/ai/types/ai";

/**
 * Contract only. A later milestone will provide trusted educational context and
 * a reviewed system prompt; neither is accepted from the browser.
 */
export type TrustedAiPromptContext = Readonly<Record<never, never>>;

export type AiPromptBuildInput = {
  readonly messages: readonly AiMessage[];
  readonly context: TrustedAiPromptContext;
};

export type AiPrompt = {
  readonly messages: readonly AiMessage[];
};

export interface AiPromptBuilder {
  build(input: AiPromptBuildInput): AiPrompt;
}
