export const confidenceLevels = ["not_yet", "somewhat", "confident"] as const;

export type ConfidenceLevel = (typeof confidenceLevels)[number];

export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export type CurrentLessonSummary = {
  lessonId: string;
  journeyLessonId: string;
  lessonProgressId: string | null;
  dayNumber: number;
  title: string;
  subtitle: string | null;
  whyItMatters: string;
  estimatedMinutes: number;
  status: LessonProgressStatus;
};

export type JourneyProgressSummary = {
  completedLessons: number;
  currentDay: number;
  percentage: number;
  totalDays: number;
};

export type CompletedLessonReviewItem = {
  dayNumber: number;
  estimatedMinutes: number;
  subtitle: string | null;
  title: string;
};

export type JourneyReviewStage = {
  dayRange: string;
  lessons: CompletedLessonReviewItem[];
  stageNumber: 1 | 2 | 3;
  title: string;
};

export type JourneyHomeReady = {
  kind: "ready";
  journeyTitle: string;
  currentLesson: CurrentLessonSummary;
  progress: JourneyProgressSummary;
  confidenceLevel: ConfidenceLevel | null;
  reviewStages: JourneyReviewStage[];
};

export type JourneyHomeComplete = {
  kind: "complete";
  journeyTitle: string;
  progress: JourneyProgressSummary;
  reviewStages: JourneyReviewStage[];
};

export type JourneyHomeViewModel = JourneyHomeReady | JourneyHomeComplete;

export type JourneyAssignmentRow = {
  id: string;
  day_number: number;
  display_order: number;
  lessons: {
    id: string;
    title: string;
    subtitle: string | null;
    learning_objective: string;
    estimated_minutes: number;
  };
};

export type LessonProgressRow = {
  id: string;
  journey_lesson_id: string;
  status: string;
};
