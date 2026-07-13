import type { LessonActivity } from "@/features/activities/types/activity";

export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export type TextContentBlock = {
  type: "text";
  heading?: string | undefined;
  body: string;
};

export type CalloutContentBlock = {
  type: "callout";
  title: string;
  body: string;
};

export type SummaryContentBlock = {
  type: "summary";
  title?: string | undefined;
  points: string[];
};

export type ImageContentBlock = {
  type: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string | undefined;
};

export type LessonContentBlock =
  TextContentBlock | CalloutContentBlock | SummaryContentBlock | ImageContentBlock;

export type LessonPlayerViewModel = {
  accessMode: "active" | "review";
  activities: LessonActivity[];
  blocks: LessonContentBlock[];
  dayNumber: number;
  estimatedMinutes: number;
  initialBlockIndex: number;
  learningObjective: string;
  lessonProgressId: string;
  subtitle: string | null;
  title: string;
};

// TODO: Replace these temporary interfaces after Supabase types can be generated locally.
export type BeginOrResumeLessonRpcRow = {
  authorized_lesson_progress_id: string;
  authorized_lesson_status: LessonProgressStatus;
  authorized_last_viewed_block: number;
};

export type SaveLessonPositionRpcRow = {
  saved_last_viewed_block: number;
  saved_lesson_progress_id: string;
};
