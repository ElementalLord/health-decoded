import { type Lesson } from "@/lib/database/models";
import { toResult } from "@/lib/database/query";
import { getServerDatabaseClient } from "@/lib/database/server";
import type { Result } from "@/lib/result/result";

export async function getPublishedLessonBySlug(slug: string): Promise<Result<Lesson>> {
  const database = await getServerDatabaseClient();
  const response = await database
    .from("lessons")
    .select(
      "id, slug, title, subtitle, primary_topic, learning_objective, estimated_minutes, content_blocks, key_takeaway",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return toResult(response as unknown as { data: Lesson | null; error: null });
}
