import { type CaregiverContent } from "@/lib/database/models";
import { toResult } from "@/lib/database/query";
import { getServerDatabaseClient } from "@/lib/database/server";
import type { Result } from "@/lib/result/result";

export async function listPublishedCaregiverContent(): Promise<Result<CaregiverContent[]>> {
  const database = await getServerDatabaseClient();
  const response = await database
    .from("caregiver_content")
    .select(
      "id, slug, journey_lesson_id, title, content_blocks, support_tip, what_not_to_say, conversation_prompt",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return toResult(response as unknown as { data: CaregiverContent[] | null; error: null });
}
