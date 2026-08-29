import type { StoryPreviewStatus } from "@/features/stories/types/interactive-story";

type StoryProgressSummary = Record<string, { status: StoryPreviewStatus }>;

const recommendationRank: Record<StoryPreviewStatus, number> = {
  "in-progress": 0,
  "not-started": 1,
  completed: 2,
};

export function prioritizeStorySlugs(
  storySlugs: readonly string[],
  progressByStory: StoryProgressSummary,
) {
  return [...storySlugs].sort((firstSlug, secondSlug) => {
    const firstStatus = progressByStory[firstSlug]?.status ?? "not-started";
    const secondStatus = progressByStory[secondSlug]?.status ?? "not-started";

    return recommendationRank[firstStatus] - recommendationRank[secondStatus];
  });
}

export function getRecommendedStorySlug(
  storySlugs: readonly string[],
  progressByStory: StoryProgressSummary,
) {
  return prioritizeStorySlugs(storySlugs, progressByStory).find(
    (slug) => progressByStory[slug]?.status !== "completed",
  );
}
