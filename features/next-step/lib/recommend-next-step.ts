import type {
  NextStepRecommendation,
  NextStepSelection,
  RecommendationProgress,
} from "@/features/next-step/types/next-step";
// @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
import { getNextLearningAction } from "../../cohesion/lib/get-next-learning-action.ts";

const optionalRecommendations: readonly NextStepRecommendation[] = [
  {
    id: "spaced-review",
    type: "spaced-review",
    title: "Bring one useful idea back",
    reason: "Health Decoded has a quick review ready from something you learned earlier.",
    actionLabel: "Review something",
    route: "/explain-it-back?mode=spaced-review",
    estimatedMinutes: 3,
    priority: 25,
    optional: true,
  },
  {
    id: "myth-check",
    type: "myth-check",
    title: "Check common diabetes myths",
    reason: "Review a few common diabetes claims and see what the evidence says.",
    actionLabel: "Start Myth Check",
    route: "/myth-check",
    estimatedMinutes: 5,
    priority: 30,
    optional: true,
  },
  {
    id: "appointment-prep",
    type: "appointment-prep",
    title: "Prepare questions for a future appointment",
    reason: "Organize questions for a future visit.",
    actionLabel: "Prepare questions",
    route: "/appointment-prep",
    estimatedMinutes: 10,
    priority: 40,
    optional: true,
  },
  {
    id: "trusted-resource",
    type: "trusted-resource",
    title: "Find trusted diabetes support",
    reason: "Find diabetes education and support beyond the app.",
    actionLabel: "Explore resources",
    route: "/resources#support-tools",
    estimatedMinutes: 5,
    priority: 50,
    optional: true,
  },
  {
    id: "medical-glossary",
    type: "glossary",
    title: "Explore the medical glossary",
    reason: "Look up unfamiliar diabetes terms.",
    actionLabel: "Open glossary",
    route: "/glossary",
    estimatedMinutes: 5,
    priority: 60,
    optional: true,
  },
];

const spacedReviewRecommendation = optionalRecommendations[0]!;
const mythCheckRecommendation = optionalRecommendations[1]!;
const appointmentRecommendation = optionalRecommendations[2]!;
const trustedResourceRecommendation = optionalRecommendations[3]!;
const glossaryRecommendation = optionalRecommendations[4]!;

function calendarDay(value: string) {
  return Math.floor(Date.parse(`${value}T00:00:00Z`) / 86_400_000);
}

function isDismissed(progress: RecommendationProgress, recommendation: NextStepRecommendation) {
  if (!recommendation.optional) return false;
  if (!progress.lastDismissed || progress.lastDismissed.id !== recommendation.id) return false;
  const elapsed = calendarDay(progress.today) - calendarDay(progress.lastDismissed.date);
  return elapsed >= 0 && elapsed < 7;
}

export function recommendNextStep(progress: RecommendationProgress): NextStepSelection {
  const candidates: NextStepRecommendation[] = [];
  if (progress.recentCompletedLessonId) {
    const continuation = getNextLearningAction({
      sourceType: "lesson",
      sourceId: progress.recentCompletedLessonId,
    });
    if (continuation) {
      candidates.push({
        id: `concept-practice-${continuation.conceptId}`,
        type: "concept-practice",
        title: continuation.title,
        reason: "Practice one idea from the lesson you just completed.",
        actionLabel: "Explain it back",
        route: continuation.href,
        estimatedMinutes: 3,
        priority: 5,
        optional: false,
      });
    }
  }
  if (progress.currentLesson) {
    const inProgress = progress.currentLesson.status === "in_progress";
    candidates.push({
      id: `${inProgress ? "continue" : "start"}-lesson-${progress.currentLesson.dayNumber}`,
      type: inProgress ? "continue-lesson" : "next-lesson",
      title: inProgress
        ? `Continue “${progress.currentLesson.title}”`
        : progress.currentLesson.title,
      reason: inProgress
        ? "You started this lesson earlier."
        : "This is the next lesson in your current section.",
      actionLabel: inProgress ? "Continue lesson" : "Start lesson",
      route: `/lessons/${progress.currentLesson.dayNumber}`,
      estimatedMinutes: progress.currentLesson.estimatedMinutes,
      priority: inProgress ? 10 : 20,
      optional: false,
    });
  }

  if (
    !progress.currentLesson ||
    (progress.completedLessonCount >= 3 &&
      !progress.earnedMilestoneIds.has("MILESTONE-MYTH-CHECKER"))
  ) {
    candidates.push(mythCheckRecommendation);
  }
  if (!progress.currentLesson && progress.hasDueSpacedReview) {
    candidates.push(spacedReviewRecommendation);
  }
  if (
    !progress.currentLesson ||
    (progress.completedLessonCount >= 5 &&
      !progress.earnedMilestoneIds.has("MILESTONE-APPOINTMENT-READY"))
  ) {
    candidates.push(appointmentRecommendation);
  }
  if (
    !progress.currentLesson ||
    (progress.completedLessonCount >= 3 &&
      !progress.earnedMilestoneIds.has("MILESTONE-FOUND-TRUSTED-SUPPORT"))
  ) {
    candidates.push(trustedResourceRecommendation);
  }
  if (!progress.currentLesson) candidates.push(glossaryRecommendation);

  const ordered = candidates.sort((left, right) => left.priority - right.priority);
  const eligible = ordered.filter((candidate) => !isDismissed(progress, candidate));
  const fallback = ordered.find((candidate) => !eligible.includes(candidate));
  const primary = eligible[0] ?? fallback ?? glossaryRecommendation;
  return { primary };
}

export function fallbackNextStepForJourney(
  journey: import("@/features/journeys/types/journey-home").JourneyHomeViewModel,
): NextStepSelection {
  if (journey.kind === "complete") return { primary: glossaryRecommendation };

  return recommendNextStep({
    completedLessonCount: journey.progress.completedLessons,
    currentLesson: {
      dayNumber: journey.currentLesson.dayNumber,
      estimatedMinutes: journey.currentLesson.estimatedMinutes,
      status: journey.currentLesson.status === "in_progress" ? "in_progress" : "not_started",
      title: journey.currentLesson.title,
    },
    earnedMilestoneIds: new Set(),
    lastDismissed: null,
    today: "1970-01-01",
  });
}
