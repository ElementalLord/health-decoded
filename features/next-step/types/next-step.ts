export type NextStepRecommendation = {
  id: string;
  type:
    | "continue-lesson"
    | "next-lesson"
    | "myth-check"
    | "appointment-prep"
    | "trusted-resource"
    | "glossary";
  title: string;
  reason: string;
  actionLabel: string;
  route: string;
  estimatedMinutes?: number;
  priority: number;
  optional: boolean;
};

export type NextStepSelection = {
  primary: NextStepRecommendation;
  alternatives: readonly NextStepRecommendation[];
};

export type RecommendationProgress = {
  completedLessonCount: number;
  currentLesson: {
    dayNumber: number;
    estimatedMinutes: number;
    status: "not_started" | "in_progress";
    title: string;
  } | null;
  earnedMilestoneIds: ReadonlySet<string>;
  lastDismissed: { id: string; date: string } | null;
  today: string;
};
