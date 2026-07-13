export const confidenceLabels = {
  confident: "Pretty confident",
  not_yet: "Not very confident",
  somewhat: "Getting there",
} as const;

export type ConfidenceLevel = keyof typeof confidenceLabels;
export type ConfidenceLabel = (typeof confidenceLabels)[ConfidenceLevel];

export type ProgressMilestoneState = "completed_with_check_in" | "completed" | "current" | "locked";

export type ProgressMilestone = {
  confidenceLabel: ConfidenceLabel | null;
  dayNumber: number;
  lessonTitle: string | null;
  state: ProgressMilestoneState;
  xpAwarded: number;
};

export type ConfidenceHistoryEntry = {
  confidenceLabel: ConfidenceLabel;
  dayNumber: number;
  lessonTitle: string;
  recordedAt: string;
};

export type CompletedLessonHistoryEntry = {
  completedAt: string;
  confidenceLabel: ConfidenceLabel | null;
  dayNumber: number;
  lessonTitle: string;
  xpAwarded: number;
};

export type ProgressViewModel = {
  completedLessons: number;
  confidenceHistory: ConfidenceHistoryEntry[];
  journeyComplete: boolean;
  journeyTitle: string;
  milestones: ProgressMilestone[];
  percentage: number;
  totalConfidenceXp: number;
  totalLessons: number;
  completedLessonsHistory: CompletedLessonHistoryEntry[];
};

export type ProgressAssignmentRow = {
  day_number: number;
  display_order: number;
  id: string;
  lessons: { title: string };
};

export type ProgressLessonRow = {
  completed_at: string | null;
  id: string;
  journey_lesson_id: string;
  status: "not_started" | "in_progress" | "completed";
  xp_awarded: number;
};

export type ProgressConfidenceRow = {
  confidence_level: ConfidenceLevel;
  created_at: string;
  lesson_progress_id: string;
};
