import "server-only";

import type { LessonCompletionResult } from "@/features/lessons/types/lesson-completion";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";
import type { Database } from "@/types/database";

const logger = createServerLogger();

type CompleteCurrentLessonRpcRow =
  Database["public"]["Functions"]["complete_current_lesson"]["Returns"][number];

export type CompleteLessonServiceError = "requirements_incomplete" | "unavailable";

function mapCompletionResult(row: CompleteCurrentLessonRpcRow): LessonCompletionResult | null {
  if (
    typeof row.first_time_completion !== "boolean" ||
    typeof row.journey_completed !== "boolean" ||
    typeof row.lesson_completed_at !== "string" ||
    !Number.isInteger(row.total_xp_awarded) ||
    !Number.isInteger(row.xp_awarded) ||
    row.total_xp_awarded < 0 ||
    row.xp_awarded < 0 ||
    (row.next_day !== null && (!Number.isInteger(row.next_day) || row.next_day < 1)) ||
    (row.next_route !== null && !/^\/lessons\/[1-9][0-9]*$/.test(row.next_route))
  ) {
    return null;
  }

  if (row.journey_completed ? row.next_day !== null || row.next_route !== null : false) return null;
  if (
    row.next_day === null ? row.next_route !== null : row.next_route !== `/lessons/${row.next_day}`
  ) {
    return null;
  }

  return {
    firstTimeCompletion: row.first_time_completion,
    journeyCompleted: row.journey_completed,
    lessonCompletedAt: row.lesson_completed_at,
    nextDay: row.next_day,
    nextRoute: row.next_route,
    totalXpAwarded: row.total_xp_awarded,
    xpAwarded: row.xp_awarded,
  };
}

export async function completeLesson(
  lessonProgressId: string,
): Promise<Result<LessonCompletionResult, CompleteLessonServiceError>> {
  const database = await getServerDatabaseClient();
  const response = await database.rpc("complete_current_lesson", {
    p_lesson_progress_id: lessonProgressId,
  });
  const row = response.data?.[0];

  if (response.error) {
    if (response.error.code === "P0001") return err("requirements_incomplete");

    logger.error("lesson_completion.operation_failed");
    return err("unavailable");
  }

  if (!row) {
    logger.error("lesson_completion.missing_result");
    return err("unavailable");
  }

  const result = mapCompletionResult(row);
  if (!result) {
    logger.error("lesson_completion.invalid_result");
    return err("unavailable");
  }

  return ok(result);
}
