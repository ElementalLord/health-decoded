import type { LessonActivity } from "@/features/activities/types/activity";
import type {
  LessonContentBlock,
  LessonPlayerViewModel,
} from "@/features/lessons/types/lesson-player";
import { isDevelopmentLesson } from "@/lib/content/development";

type LessonPlayerMapperInput = {
  activities: LessonActivity[];
  blocks: LessonContentBlock[];
  dayNumber: number;
  estimatedMinutes: number;
  keyTakeaway: string | null;
  lastViewedBlock: number;
  learningObjective: string;
  lessonProgressId: string;
  lessonId: string;
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
  lessonId,
  status,
  subtitle,
  title,
}: LessonPlayerMapperInput): LessonPlayerViewModel | null {
  if (blocks.length === 0 || !["not_started", "in_progress", "completed"].includes(status)) {
    return null;
  }

  const accessMode = status === "completed" ? "review" : "active";
  const isDevelopmentContent = isDevelopmentLesson(lessonId);
  const initialBlockIndex =
    accessMode === "review" ? -1 : Math.min(Math.max(lastViewedBlock, -1), blocks.length - 1);

  return {
    accessMode,
    activities,
    blocks,
    dayNumber,
    estimatedMinutes,
    initialBlockIndex,
    isDevelopmentContent,
    keyTakeaway: isDevelopmentContent
      ? "Reviewed lesson content has not been added yet."
      : (keyTakeaway ?? learningObjective),
    learningObjective: isDevelopmentContent
      ? "Use this preview to test the lesson experience while reviewed content is prepared."
      : learningObjective,
    lessonProgressId,
    subtitle: isDevelopmentContent ? null : subtitle,
    title: isDevelopmentContent ? "Lesson preview" : title,
  };
}
