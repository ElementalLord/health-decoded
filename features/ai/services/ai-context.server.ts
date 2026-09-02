import "server-only";

import {
  type AiCredibleSourceContext,
  credibleSourcesForQuestion,
  publicCredibleSources,
} from "@/features/ai/data/credible-sources";
import { selectSuggestedQuestions } from "@/features/ai/data/suggested-questions";
import type { TrustedAiPromptContext } from "@/features/ai/prompts/prompt-builder";
import type { AiContextMetadata } from "@/features/ai/types/ai";
import { dayTwoGlossary } from "@/features/glossary/data/day-two-glossary";

type ContextResult =
  | {
      readonly ok: true;
      readonly data: {
        readonly metadata: AiContextMetadata;
        readonly promptContext: TrustedAiPromptContext;
        readonly retrievedSources: readonly AiCredibleSourceContext[];
      };
    }
  | { readonly ok: false };

function terms(message: string) {
  return message.toLocaleLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) ?? [];
}

function glossaryFor(message: string) {
  const questionTerms = terms(message);
  return dayTwoGlossary.filter((entry) =>
    questionTerms.some((term) => entry.term.toLocaleLowerCase().includes(term)),
  );
}

function suggestions(context: TrustedAiPromptContext) {
  if (context.glossary?.length) {
    return selectSuggestedQuestions(
      context.glossary.map((entry) => `What exactly is ${entry.term}?`),
    );
  }
  return selectSuggestedQuestions();
}

/** Builds a question-specific evidence set without loading the learner's current lesson. */
export function loadTrustedAiContext({
  message,
  messages,
}: {
  readonly message: string;
  readonly messages?: readonly { readonly content: string; readonly role: "assistant" | "user" }[];
}): Promise<ContextResult> {
  const retrievalQuery = [
    ...(messages ?? []).filter(({ role }) => role === "user").map(({ content }) => content),
    message,
  ]
    .slice(-3)
    .join(" ");
  const credibleSources = credibleSourcesForQuestion(retrievalQuery);
  const baseContext: TrustedAiPromptContext = {
    credibleSources,
    glossary: glossaryFor(message),
  };
  return Promise.resolve({
    ok: true as const,
    data: {
      metadata: {
        credibleSources: publicCredibleSources(credibleSources),
        suggestedQuestions: suggestions(baseContext),
      },
      promptContext: baseContext,
      retrievedSources: credibleSources,
    },
  });
}
