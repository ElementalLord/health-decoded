export const confidenceLevels = ["not_yet", "somewhat", "confident"] as const;

export type ConfidenceLevel = (typeof confidenceLevels)[number];

export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export type CurrentLessonSummary = {
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

export type JourneyHomeReady = {
  kind: "ready";
  journeyTitle: string;
  currentLesson: CurrentLessonSummary;
  progress: JourneyProgressSummary;
  confidenceLevel: ConfidenceLevel | null;
};

export type JourneyHomeComplete = {
  kind: "complete";
  journeyTitle: string;
  progress: JourneyProgressSummary;
};

export type JourneyHomeViewModel = JourneyHomeReady | JourneyHomeComplete;

// TODO: Replace these RPC result types after Supabase types can be generated locally.
export type InitializeJourneyRpcRow = {
  initialized_user_journey_id: string;
  initialized_lesson_progress_id: string;
  initialized_journey_lesson_id: string;
};

export type ConfidenceRpcRow = {
  confidence_check_in_id: string;
  saved_confidence_level: ConfidenceLevel;
};

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
  status: LessonProgressStatus;
};
