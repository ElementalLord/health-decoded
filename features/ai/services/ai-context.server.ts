import "server-only";

import { dayTwoGlossary } from "@/features/glossary/data/day-two-glossary";
import type { TrustedAiPromptContext } from "@/features/ai/prompts/prompt-builder";
import type { AiContextMetadata, AiRelatedContent } from "@/features/ai/types/ai";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";

type ContextResult =
  | {
      readonly ok: true;
      readonly data: {
        readonly metadata: AiContextMetadata;
        readonly promptContext: TrustedAiPromptContext;
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
    return [
      `Can you explain ${context.lesson.title.toLocaleLowerCase()} more simply?`,
      "Why does this matter in everyday life?",
      "What is the key takeaway from today’s lesson?",
    ];
  }
  if (context.glossary?.length) {
    return context.glossary.slice(0, 3).map((entry) => `What exactly is ${entry.term}?`);
  }
  return [
    "What is insulin resistance?",
    "What does metformin do?",
    "Can you explain Type 2 diabetes simply?",
  ];
}

/** Loads only reviewed, published learning content for the prompt. */
export async function loadTrustedAiContext({
  message,
  userId,
}: {
  readonly message: string;
  readonly userId: string;
}): Promise<ContextResult> {
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
    return { ok: false };
  }

  const baseContext: TrustedAiPromptContext = { glossary: glossaryFor(message) };
  if (!journeyResult.data?.current_journey_lesson_id) {
    return {
      ok: true,
      data: {
        metadata: { relatedContent: [], suggestedQuestions: suggestions(baseContext) },
        promptContext: baseContext,
      },
    };
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
    return { ok: false };
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
    return { ok: false };
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
      metadata: { relatedContent, suggestedQuestions: suggestions(promptContext) },
      promptContext,
    },
  };
}
