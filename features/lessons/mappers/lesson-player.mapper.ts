import type {
  LessonContentBlock,
  LessonPlayerViewModel,
  LessonProgressStatus,
} from "@/features/lessons/types/lesson-player";

type LessonPlayerMapperInput = {
  blocks: LessonContentBlock[];
  dayNumber: number;
  estimatedMinutes: number;
  lastViewedBlock: number;
  learningObjective: string;
  lessonProgressId: string;
  status: LessonProgressStatus;
  subtitle: string | null;
  title: string;
};

export function mapLessonPlayer({
  blocks,
  dayNumber,
  estimatedMinutes,
  lastViewedBlock,
  learningObjective,
  lessonProgressId,
  status,
  subtitle,
  title,
}: LessonPlayerMapperInput): LessonPlayerViewModel | null {
  if (blocks.length === 0) return null;

  const accessMode = status === "completed" ? "review" : "active";
  const initialBlockIndex =
    accessMode === "review" ? -1 : Math.min(Math.max(lastViewedBlock, -1), blocks.length - 1);

  return {
    accessMode,
    blocks,
    dayNumber,
    estimatedMinutes,
    initialBlockIndex,
    learningObjective,
    lessonProgressId,
    subtitle,
    title,
  };
}
