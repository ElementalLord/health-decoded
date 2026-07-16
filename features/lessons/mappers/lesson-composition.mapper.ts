import type { LessonActivity } from "@/features/activities/types/activity";
import type {
  LessonCompositionItem,
  LessonContentBlock,
} from "@/features/lessons/types/lesson-player";

export function buildLessonComposition(
  blocks: LessonContentBlock[],
  activities: LessonActivity[],
): LessonCompositionItem[] | null {
  const activitiesById = new Map(activities.map((activity) => [activity.id, activity]));
  const placedActivityIds = new Set<string>();
  const composition: LessonCompositionItem[] = [];

  for (const [blockIndex, block] of blocks.entries()) {
    if (block.type === "activity") {
      const activity = activitiesById.get(block.activity_id);
      if (!activity || placedActivityIds.has(activity.id)) return null;

      placedActivityIds.add(activity.id);
      composition.push({
        activity,
        blockIndex,
        key: `activity-${activity.id}`,
        kind: "activity",
      });
      continue;
    }

    composition.push({
      block,
      blockIndex,
      key: `content-${blockIndex}`,
      kind: "content",
    });
  }

  const finalBlockIndex = Math.max(0, blocks.length - 1);
  for (const activity of activities) {
    if (placedActivityIds.has(activity.id)) continue;
    composition.push({
      activity,
      blockIndex: finalBlockIndex,
      key: `activity-${activity.id}`,
      kind: "activity",
    });
  }

  return composition;
}
