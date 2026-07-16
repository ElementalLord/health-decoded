import type { LessonActivity } from "@/features/activities/types/activity";
import { buildLessonComposition } from "@/features/lessons/mappers/lesson-composition.mapper";
import type {
  LessonContentBlock,
  LessonPlayerViewModel,
} from "@/features/lessons/types/lesson-player";

type LessonPlayerMapperInput = {
  activities: LessonActivity[];
  blocks: LessonContentBlock[];
  dayNumber: number;
  estimatedMinutes: number;
  keyTakeaway: string | null;
  lastViewedBlock: number;
  learningObjective: string;
  lessonProgressId: string;
  status: string;
  subtitle: string | null;
  title: string;
};

export function mapLessonPlayer({
  activities,
  blocks,
  dayNumber,
  estimatedMinutes,
  keyTakeaway,
  lastViewedBlock,
  learningObjective,
  lessonProgressId,
  status,
  subtitle,
  title,
}: LessonPlayerMapperInput): LessonPlayerViewModel | null {
  if (blocks.length === 0 || !["not_started", "in_progress", "completed"].includes(status)) {
    return null;
  }

  const accessMode = status === "completed" ? "review" : "active";
  const initialBlockIndex =
    accessMode === "review" ? -1 : Math.min(Math.max(lastViewedBlock, -1), blocks.length - 1);
  const composition = buildLessonComposition(blocks, activities);
  if (!composition) return null;

  return {
    accessMode,
    activities,
    blocks,
    composition,
    dayNumber,
    estimatedMinutes,
    initialBlockIndex,
    keyTakeaway: keyTakeaway ?? learningObjective,
    learningObjective,
    lessonProgressId,
    subtitle,
    title,
  };
}
