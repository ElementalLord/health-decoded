import "server-only";

import { mapLessonPlayer } from "@/features/lessons/mappers/lesson-player.mapper";
import { lessonContentBlocksSchema } from "@/features/lessons/schemas/lesson-content.schema";
import type {
  BeginOrResumeLessonRpcRow,
  LessonPlayerViewModel,
} from "@/features/lessons/types/lesson-player";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";

const logger = createServerLogger();

type AuthorizedLessonRow = {
  last_viewed_block: number;
  journey_lessons: {
    day_number: number;
    lessons: {
      content_blocks: unknown;
      estimated_minutes: number;
      learning_objective: string;
      subtitle: string | null;
      title: string;
    };
  };
};

export type AuthorizedLessonResult =
  | { kind: "authorized"; data: LessonPlayerViewModel }
  | { kind: "denied" }
  | { kind: "unavailable" };

export async function getAuthorizedLesson(day: number): Promise<AuthorizedLessonResult> {
  const database = await getServerDatabaseClient();
  const beginResponse = await database.rpc("begin_or_resume_current_lesson", { p_day: day });
  const begun = (beginResponse.data as unknown as BeginOrResumeLessonRpcRow[] | null)?.[0];

  if (beginResponse.error || !begun) {
    logger.error("lesson_reader.access_denied");
    return { kind: "denied" };
  }

  const lessonResponse = await database
    .from("lesson_progress")
    .select(
      "last_viewed_block, journey_lessons!inner(day_number, lessons!inner(title, subtitle, learning_objective, estimated_minutes, content_blocks))",
    )
    .eq("id", begun.authorized_lesson_progress_id)
    .eq("journey_lessons.day_number", day)
    .eq("journey_lessons.status", "published")
    .maybeSingle();
  const lesson = lessonResponse.data as unknown as AuthorizedLessonRow | null;

  if (lessonResponse.error || !lesson) {
    logger.error("lesson_reader.published_lesson_unavailable");
    return { kind: "unavailable" };
  }

  const parsedBlocks = lessonContentBlocksSchema.safeParse(
    lesson.journey_lessons.lessons.content_blocks,
  );

  if (!parsedBlocks.success) {
    logger.error("lesson_reader.invalid_content_structure");
    return { kind: "unavailable" };
  }

  const viewModel = mapLessonPlayer({
    blocks: parsedBlocks.data,
    dayNumber: lesson.journey_lessons.day_number,
    estimatedMinutes: lesson.journey_lessons.lessons.estimated_minutes,
    lastViewedBlock: begun.authorized_last_viewed_block,
    learningObjective: lesson.journey_lessons.lessons.learning_objective,
    lessonProgressId: begun.authorized_lesson_progress_id,
    status: begun.authorized_lesson_status,
    subtitle: lesson.journey_lessons.lessons.subtitle,
    title: lesson.journey_lessons.lessons.title,
  });

  if (!viewModel) {
    logger.error("lesson_reader.empty_content");
    return { kind: "unavailable" };
  }

  return { kind: "authorized", data: viewModel };
}
