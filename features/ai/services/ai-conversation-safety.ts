// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { assessAiOutputSafety } from "./ai-output-safety.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { assessAiSafety, buildAiSafetyInput } from "./ai-safety-rules.ts";

export type AiConversationEntry = {
  readonly content: string;
  readonly role: "assistant" | "user";
};

/**
 * Removes an unsafe historical user turn and its paired assistant response.
 * History may add context, but it must never block or contaminate a later safe turn.
 */
export function sanitizeAiConversationHistory(
  messages: readonly AiConversationEntry[],
): readonly AiConversationEntry[] {
  const safeMessages: AiConversationEntry[] = [];
  const priorSafeUserMessages: string[] = [];
  let omitPairedAssistant = false;

  for (const entry of messages) {
    if (entry.role === "user") {
      const safetyInput = buildAiSafetyInput({
        message: entry.content,
        priorUserMessages: priorSafeUserMessages,
      });
      if (assessAiSafety(safetyInput).kind === "refuse") {
        omitPairedAssistant = true;
        continue;
      }
      omitPairedAssistant = false;
      priorSafeUserMessages.push(entry.content);
      safeMessages.push(entry);
      continue;
    }

    if (omitPairedAssistant) {
      omitPairedAssistant = false;
      continue;
    }
    if (!assessAiOutputSafety(entry.content).safe) continue;
    safeMessages.push(entry);
  }

  return safeMessages;
}
