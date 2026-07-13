import { type Activity } from "@/lib/database/models";
import { toResult } from "@/lib/database/query";
import { getServerDatabaseClient } from "@/lib/database/server";
import type { Result } from "@/lib/result/result";

export async function listPublishedActivitiesForLesson(
  lessonId: string,
): Promise<Result<Activity[]>> {
  const database = await getServerDatabaseClient();
  const response = await database
    .from("activities")
    .select(
      "id, lesson_id, display_order, activity_type, title, instructions, configuration, explanation",
    )
    .eq("lesson_id", lessonId)
    .eq("status", "published")
    .order("display_order", { ascending: true });

  return toResult(response as unknown as { data: Activity[] | null; error: null });
}
