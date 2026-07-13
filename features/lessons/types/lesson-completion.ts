export type CompleteCurrentLessonRpcRow = {
  first_time_completion: boolean;
  journey_completed: boolean;
  lesson_completed_at: string;
  next_day: number | null;
  next_route: string | null;
  total_xp_awarded: number;
  xp_awarded: number;
};

export type LessonCompletionResult = {
  firstTimeCompletion: boolean;
  journeyCompleted: boolean;
  lessonCompletedAt: string;
  nextDay: number | null;
  nextRoute: string | null;
  totalXpAwarded: number;
  xpAwarded: number;
};
