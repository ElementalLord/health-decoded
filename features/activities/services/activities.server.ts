import "server-only";

import { mapLessonActivity } from "@/features/activities/mappers/activity.mapper";
import type { LessonActivity } from "@/features/activities/types/activity";
import { unexpectedError } from "@/lib/errors/application-error";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";

const logger = createServerLogger();

export async function getPublishedLessonActivities(
  lessonId: string,
  lessonProgressId: string,
): Promise<Result<LessonActivity[]>> {
  const database = await getServerDatabaseClient();
  const [activitiesResponse, progressResponse] = await Promise.all([
    database
      .from("activities")
      .select("id, activity_type, title, instructions, configuration")
      .eq("lesson_id", lessonId)
      .eq("status", "published")
      .order("display_order", { ascending: true }),
    database
      .from("activity_progress")
      .select("activity_id, status")
      .eq("lesson_progress_id", lessonProgressId),
  ]);
  const activities = activitiesResponse.data;
  const progressRows = progressResponse.data;

  if (activitiesResponse.error || progressResponse.error || !activities || !progressRows) {
    logger.error("activities.load_failed");
    return err(unexpectedError());
  }

  const completionByActivity = new Map(
    progressRows.map((progress) => [progress.activity_id, progress.status === "completed"]),
  );
  const mappedActivities = activities.map((activity) =>
    mapLessonActivity(activity, completionByActivity.get(activity.id) ?? false),
  );

  const validActivities = mappedActivities.filter(
    (activity): activity is LessonActivity => activity !== null,
  );

  if (validActivities.length !== mappedActivities.length) {
    logger.error("activities.invalid_public_configuration");
    return err(unexpectedError());
  }

  return ok(validActivities);
}
