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
  keyTakeaway: string;
  learningObjective: string;
  lessonProgressId: string;
  subtitle: string | null;
  title: string;
};
