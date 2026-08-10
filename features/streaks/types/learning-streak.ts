export const qualifyingLearningEvents = [
  "lesson_completed",
  "myth_round_completed",
  "myth_replay_completed",
  "appointment_summary_completed",
  "caregiver_module_completed",
  "verified_support_resource_opened",
  "milestone_earned",
  "ai_learning_exchange_completed",
  "clinician_questions_prepared",
] as const;

export type QualifyingLearningEvent = (typeof qualifyingLearningEvents)[number];

export type LearningStreak = {
  currentStreak: number;
  longestStreak: number;
  freezeBalance: number;
  lastQualifiedDate: string | null;
  timezone: string;
  pendingNotice: "freeze_used" | "streak_reset" | null;
  isStreakActive: boolean;
};

export type StreakCalculation = LearningStreak & {
  freezeUsed: number;
  dayRecorded: boolean;
};
