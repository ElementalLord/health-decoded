import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { getServerDatabaseClient } from "@/lib/database/server";
import { notFoundError, unexpectedError } from "@/lib/errors/application-error";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";
import { storySchema, type StoryViewModel } from "@/features/stories/schemas/story-content.schema";

const fields = "slug, title, introduction, content_blocks, key_takeaway, journey_week, version";
const logger = createServerLogger();

function mapStory(value: unknown): StoryViewModel | null {
  const record = value as Record<string, unknown>;
  const parsed = storySchema.safeParse({
    ...record,
    estimated_reading_minutes: record.estimated_reading_minutes ?? 2,
    introduction: record.introduction,
  });
  return parsed.success ? parsed.data : null;
}

export async function listStories(): Promise<Result<StoryViewModel[]>> {
  noStore();
  const database = await getServerDatabaseClient();
  const response = await database
    .from("patient_stories")
    .select(fields)
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  if (response.error) {
    logger.error("stories.list_failed", { error_code: response.error.code });
    return err(unexpectedError());
  }
  const stories = (response.data ?? []).map((story) => mapStory(story));
  if (!stories.every((story) => story)) {
    logger.error("stories.invalid_published_content");
    return err(unexpectedError());
  }
  return ok(stories as StoryViewModel[]);
}

export async function getStory(slug: string): Promise<Result<StoryViewModel>> {
  noStore();
  const database = await getServerDatabaseClient();
  const response = await database
    .from("patient_stories")
    .select(fields)
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .maybeSingle();
  if (response.error) {
    logger.error("stories.detail_failed", { error_code: response.error.code });
    return err(unexpectedError());
  }
  if (!response.data) return err(notFoundError());
  const story = mapStory(response.data);
  if (!story) {
    logger.error("stories.invalid_published_content");
    return err(unexpectedError());
  }
  return ok(story);
}
