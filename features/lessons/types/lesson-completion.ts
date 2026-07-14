export type LessonCompletionResult = {
  firstTimeCompletion: boolean;
  journeyCompleted: boolean;
  lessonCompletedAt: string;
  nextDay: number | null;
  nextRoute: string | null;
  totalXpAwarded: number;
  xpAwarded: number;
};
