import type { LessonActivity } from "@/features/activities/types/activity";
import type {
  LessonContentBlock as ParsedLessonContentBlock,
  RenderableLessonContentBlock as ParsedRenderableLessonContentBlock,
} from "@/features/lessons/schemas/lesson-content.schema";

export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export type LessonContentBlock = ParsedLessonContentBlock;
export type RenderableLessonContentBlock = ParsedRenderableLessonContentBlock;

export type LessonCompositionItem =
  | {
      block: RenderableLessonContentBlock;
      blockIndex: number;
      key: string;
      kind: "content";
    }
  | {
      activity: LessonActivity;
      blockIndex: number;
      key: string;
      kind: "activity";
    };

export type LessonPlayerViewModel = {
  accessMode: "active" | "review";
  activities: LessonActivity[];
  blocks: LessonContentBlock[];
  composition: LessonCompositionItem[];
  dayNumber: number;
  estimatedMinutes: number;
  initialBlockIndex: number;
  keyTakeaway: string;
  learningObjective: string;
  lessonProgressId: string;
  subtitle: string | null;
  title: string;
};
