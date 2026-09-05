export type ProgressMilestoneState = "completed" | "current" | "locked";

export type ProgressMilestone = {
  dayNumber: number;
  estimatedMinutes: number;
  lessonTitle: string | null;
  subtitle: string | null;
  state: ProgressMilestoneState;
  xpAwarded: number;
};

export type CompletedLessonHistoryEntry = {
  completedAt: string;
  dayNumber: number;
  lessonTitle: string;
  xpAwarded: number;
};

export type ProgressViewModel = {
  completedLessons: number;
  journeyComplete: boolean;
  journeyTitle: string;
  milestones: ProgressMilestone[];
  percentage: number;
  totalLearningXp: number;
  totalLessons: number;
  completedLessonsHistory: CompletedLessonHistoryEntry[];
};

export type ProgressAssignmentRow = {
  day_number: number;
  display_order: number;
  id: string;
  lessons: { estimated_minutes: number; subtitle: string | null; title: string };
};

export type ProgressLessonRow = {
  completed_at: string | null;
  id: string;
  journey_lesson_id: string;
  status: string;
  xp_awarded: number;
};
