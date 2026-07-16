import type {
  ConfidenceLevel,
  JourneyAssignmentRow,
  JourneyHomeViewModel,
  LessonProgressRow,
} from "@/features/journeys/types/journey-home";

const reviewStageDefinitions = [
  { dayRange: "Days 1–30", maximumDay: 30, minimumDay: 1, stageNumber: 1, title: "Understanding" },
  { dayRange: "Days 31–60", maximumDay: 60, minimumDay: 31, stageNumber: 2, title: "Adjusting" },
  { dayRange: "Days 61–90", maximumDay: 90, minimumDay: 61, stageNumber: 3, title: "Living" },
] as const;

type JourneyHomeMapperInput = {
  assignments: JourneyAssignmentRow[];
  completedAt: string | null;
  confidenceLevel: ConfidenceLevel | null;
  journeyTitle: string;
  progressRows: LessonProgressRow[];
};

export function mapJourneyHome({
  assignments,
  completedAt,
  confidenceLevel,
  journeyTitle,
  progressRows,
}: JourneyHomeMapperInput): JourneyHomeViewModel | null {
  if (
    assignments.length === 0 ||
    progressRows.some(
      (progress) => !["not_started", "in_progress", "completed"].includes(progress.status),
    )
  ) {
    return null;
  }

  const progressByAssignment = new Map(
    progressRows.map((progress) => [progress.journey_lesson_id, progress]),
  );
  const completedLessons = progressRows.filter(
    (progress) => progress.status === "completed",
  ).length;
  const totalDays = assignments.length;
  const percentage = Math.min(100, Math.round((completedLessons / totalDays) * 100));
  const completedAssignmentIds = new Set(
    progressRows
      .filter((progress) => progress.status === "completed")
      .map((progress) => progress.journey_lesson_id),
  );
  const reviewStages = reviewStageDefinitions.map((stageDefinition) => ({
    dayRange: stageDefinition.dayRange,
    lessons: assignments
      .filter(
        (assignment) =>
          completedAssignmentIds.has(assignment.id) &&
          assignment.day_number >= stageDefinition.minimumDay &&
          assignment.day_number <= stageDefinition.maximumDay,
      )
      .map((assignment) => ({
        dayNumber: assignment.day_number,
        estimatedMinutes: assignment.lessons.estimated_minutes,
        subtitle: assignment.lessons.subtitle,
        title: assignment.lessons.title,
      })),
    stageNumber: stageDefinition.stageNumber,
    title: stageDefinition.title,
  }));
  const baseProgress = {
    completedLessons,
    currentDay: Math.min(totalDays, completedLessons + 1),
    percentage,
    totalDays,
  };

  if (completedAt || completedLessons >= totalDays) {
    return {
      kind: "complete",
      journeyTitle,
      progress: { ...baseProgress, currentDay: totalDays, percentage: 100 },
      reviewStages,
    };
  }

  const currentAssignment = assignments.find(
    (assignment) => progressByAssignment.get(assignment.id)?.status !== "completed",
  );
  if (!currentAssignment) return null;

  const currentProgress = progressByAssignment.get(currentAssignment.id);

  return {
    kind: "ready",
    journeyTitle,
    currentLesson: {
      lessonId: currentAssignment.lessons.id,
      journeyLessonId: currentAssignment.id,
      lessonProgressId: currentProgress?.id ?? null,
      dayNumber: currentAssignment.day_number,
      title: currentAssignment.lessons.title,
      subtitle: currentAssignment.lessons.subtitle,
      whyItMatters: currentAssignment.lessons.learning_objective,
      estimatedMinutes: currentAssignment.lessons.estimated_minutes,
      status:
        currentProgress?.status === "in_progress" || currentProgress?.status === "completed"
          ? currentProgress.status
          : "not_started",
    },
    progress: {
      ...baseProgress,
      currentDay: currentAssignment.day_number,
    },
    confidenceLevel,
    reviewStages,
  };
}
