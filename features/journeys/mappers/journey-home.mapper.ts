import type {
  ConfidenceLevel,
  JourneyAssignmentRow,
  JourneyHomeViewModel,
  LessonProgressRow,
} from "@/features/journeys/types/journey-home";

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
  };
}
