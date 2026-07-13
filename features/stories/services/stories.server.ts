import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { developmentCompositeStories } from "@/content/stories/development-composites";
import { getServerDatabaseClient } from "@/lib/database/server";
import { notFoundError, unexpectedError } from "@/lib/errors/application-error";
import { err, ok, type Result } from "@/lib/result/result";
import { storySchema, type StoryViewModel } from "@/features/stories/schemas/story-content.schema";

const fields = "slug, title, introduction, content_blocks, key_takeaway, journey_week, version";
const isDevelopment = process.env.NODE_ENV === "development";

function mapStory(value: unknown, status: "development" | "published"): StoryViewModel | null {
  const record = value as Record<string, unknown>;
  const parsed = storySchema.safeParse({
    ...record,
    content_status: status,
    development_notice: status === "development" ? record.development_notice : null,
    estimated_reading_minutes: record.estimated_reading_minutes ?? 2,
    introduction: record.introduction,
  });
  return parsed.success ? parsed.data : null;
}

export async function listStories(): Promise<Result<StoryViewModel[]>> {
  noStore();
  if (isDevelopment)
    return ok(
      developmentCompositeStories.map((story) => mapStory(story, "development")!).filter(Boolean),
    );
  const database = await getServerDatabaseClient();
  const response = await database
    .from("patient_stories")
    .select(fields)
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  if (response.error) return err(unexpectedError());
  const stories = (response.data ?? []).map((story) => mapStory(story, "published"));
  return stories.every((story) => story) ? ok(stories as StoryViewModel[]) : err(unexpectedError());
}

export async function getStory(slug: string): Promise<Result<StoryViewModel>> {
  noStore();
  if (isDevelopment) {
    const story = developmentCompositeStories.find((item) => item.slug === slug);
    const mapped = story ? mapStory(story, "development") : null;
    return mapped ? ok(mapped) : err(notFoundError());
  }
  const database = await getServerDatabaseClient();
  const response = await database
    .from("patient_stories")
    .select(fields)
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .maybeSingle();
  if (response.error) return err(unexpectedError());
  if (!response.data) return err(notFoundError());
  const story = mapStory(response.data, "published");
  return story ? ok(story) : err(unexpectedError());
}
