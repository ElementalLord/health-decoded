import "server-only";

import {
  type AiCredibleSourceContext,
  credibleSourcesForQuestion,
  publicCredibleSources,
} from "@/features/ai/data/credible-sources";
import { selectSuggestedQuestions } from "@/features/ai/data/suggested-questions";
import type { TrustedAiPromptContext } from "@/features/ai/prompts/prompt-builder";
import type { AiContextMetadata, AiRelatedContent } from "@/features/ai/types/ai";
import { dayTwoGlossary } from "@/features/glossary/data/day-two-glossary";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";

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

const logger = createServerLogger();

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
  if (context.lesson) {
    return selectSuggestedQuestions([
      `Can you explain ${context.lesson.title.toLocaleLowerCase()} more simply?`,
      "Why does this matter in everyday life?",
      "What is the key takeaway from today’s lesson?",
      "How could I summarize this lesson in my own words?",
      "What is one idea from this lesson that I can remember this week?",
    ]);
  }
  if (context.glossary?.length) {
    return selectSuggestedQuestions(
      context.glossary.map((entry) => `What exactly is ${entry.term}?`),
    );
  }
  return selectSuggestedQuestions();
}

/** Adds authoritative references and any available reviewed, published learning context. */
export async function loadTrustedAiContext({
  message,
  messages,
  userId,
}: {
  readonly message: string;
  readonly messages?: readonly { readonly content: string; readonly role: "assistant" | "user" }[];
  readonly userId: string;
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
  const baseResult = {
    ok: true as const,
    data: {
      metadata: {
        credibleSources: publicCredibleSources(credibleSources),
        relatedContent: [],
        suggestedQuestions: suggestions(baseContext),
      },
      promptContext: baseContext,
      retrievedSources: credibleSources,
    },
  };
  const database = await getServerDatabaseClient();
  const journeyResult = await database
    .from("user_journeys")
    .select("journey_id, current_journey_lesson_id")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("last_active_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (journeyResult.error) {
    logger.error("ai_context.load_failed", {
      error_code: journeyResult.error.code,
      operation: "journey",
    });
    return baseResult;
  }

  if (!journeyResult.data?.current_journey_lesson_id) {
    return baseResult;
  }

  const assignmentResult = await database
    .from("journey_lessons")
    .select("day_number, lesson_id")
    .eq("id", journeyResult.data.current_journey_lesson_id)
    .eq("journey_id", journeyResult.data.journey_id)
    .eq("status", "published")
    .maybeSingle();
  if (assignmentResult.error || !assignmentResult.data) {
    logger.error("ai_context.load_failed", {
      error_code: assignmentResult.error?.code ?? "not_found",
      operation: "assignment",
    });
    return baseResult;
  }

  const lessonResult = await database
    .from("lessons")
    .select("title, learning_objective, key_takeaway, subtitle")
    .eq("id", assignmentResult.data.lesson_id)
    .eq("status", "published")
    .maybeSingle();
  if (lessonResult.error || !lessonResult.data) {
    logger.error("ai_context.load_failed", {
      error_code: lessonResult.error?.code ?? "not_found",
      operation: "lesson",
    });
    return baseResult;
  }

  const lesson = lessonResult.data;
  const promptContext: TrustedAiPromptContext = {
    ...baseContext,
    lesson: {
      dayNumber: assignmentResult.data.day_number,
      objective: lesson.learning_objective,
      summary: lesson.key_takeaway ?? lesson.subtitle ?? lesson.learning_objective,
      title: lesson.title,
    },
  };
  const relatedContent: AiRelatedContent[] = [
    { href: `/lessons/${assignmentResult.data.day_number}`, kind: "lesson", title: lesson.title },
  ];
  return {
    ok: true,
    data: {
      metadata: {
        credibleSources: publicCredibleSources(credibleSources),
        relatedContent,
        suggestedQuestions: suggestions(promptContext),
      },
      promptContext,
      retrievedSources: credibleSources,
    },
  };
}
