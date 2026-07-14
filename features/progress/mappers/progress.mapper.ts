import {
  confidenceLabels,
  type ConfidenceHistoryEntry,
  type CompletedLessonHistoryEntry,
  type ProgressAssignmentRow,
  type ProgressConfidenceRow,
  type ProgressLessonRow,
  type ProgressMilestone,
  type ProgressViewModel,
} from "@/features/progress/types/progress";

type ProgressMapperInput = {
  assignments: ProgressAssignmentRow[];
  completedAt: string | null;
  confidenceRows: ProgressConfidenceRow[];
  currentJourneyLessonId: string | null;
  journeyTitle: string;
  progressRows: ProgressLessonRow[];
};

function getConfidenceLabel(
  value: string,
): (typeof confidenceLabels)[keyof typeof confidenceLabels] | null {
  return value in confidenceLabels
    ? confidenceLabels[value as keyof typeof confidenceLabels]
    : null;
}

export function mapProgress({
  assignments,
  completedAt,
  confidenceRows,
  currentJourneyLessonId,
  journeyTitle,
  progressRows,
}: ProgressMapperInput): ProgressViewModel | null {
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
  const confidenceByProgress = new Map(
    confidenceRows
      .map(
        (confidence) =>
          [confidence.lesson_progress_id, getConfidenceLabel(confidence.confidence_level)] as const,
      )
      .filter((entry): entry is [string, NonNullable<(typeof entry)[1]>] => entry[1] !== null),
  );
  const completedLessons = progressRows.filter((progress) => progress.status === "completed");
  const totalLessons = assignments.length;
  const percentage = Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));
  const journeyComplete = completedAt !== null || completedLessons.length === totalLessons;
  const pointedProgress = currentJourneyLessonId
    ? progressByAssignment.get(currentJourneyLessonId)
    : undefined;
  const currentAssignmentId = journeyComplete
    ? null
    : pointedProgress?.status !== "completed"
      ? currentJourneyLessonId
      : assignments.find(
          (assignment) => progressByAssignment.get(assignment.id)?.status !== "completed",
        )?.id;

  const milestones: ProgressMilestone[] = assignments.map((assignment) => {
    const progress = progressByAssignment.get(assignment.id);
    const confidenceLabel = progress ? (confidenceByProgress.get(progress.id) ?? null) : null;

    if (progress?.status === "completed") {
      return {
        confidenceLabel,
        dayNumber: assignment.day_number,
        lessonTitle: assignment.lessons.title,
        state: confidenceLabel ? "completed_with_check_in" : "completed",
        xpAwarded: Math.max(0, progress.xp_awarded),
      };
    }

    if (assignment.id === currentAssignmentId) {
      return {
        confidenceLabel: null,
        dayNumber: assignment.day_number,
        lessonTitle: assignment.lessons.title,
        state: "current",
        xpAwarded: 0,
      };
    }

    return {
      confidenceLabel: null,
      dayNumber: assignment.day_number,
      lessonTitle: null,
      state: "locked",
      xpAwarded: 0,
    };
  });

  const confidenceHistory: ConfidenceHistoryEntry[] = confidenceRows
    .map((confidence) => {
      const progress = progressRows.find((row) => row.id === confidence.lesson_progress_id);
      const assignment = progress
        ? assignments.find((item) => item.id === progress.journey_lesson_id)
        : undefined;
      const confidenceLabel = getConfidenceLabel(confidence.confidence_level);

      return assignment && confidenceLabel
        ? {
            confidenceLabel,
            dayNumber: assignment.day_number,
            lessonTitle: assignment.lessons.title,
            recordedAt: confidence.created_at,
          }
        : null;
    })
    .filter((entry): entry is ConfidenceHistoryEntry => entry !== null)
    .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt))
    .slice(0, 5);

  const completedLessonsHistory: CompletedLessonHistoryEntry[] = assignments.flatMap(
    (assignment) => {
      const progress = progressByAssignment.get(assignment.id);
      if (!progress || progress.status !== "completed" || !progress.completed_at) return [];

      return [
        {
          completedAt: progress.completed_at,
          confidenceLabel: confidenceByProgress.get(progress.id) ?? null,
          dayNumber: assignment.day_number,
          lessonTitle: assignment.lessons.title,
          xpAwarded: Math.max(0, progress.xp_awarded),
        },
      ];
    },
  );

  return {
    completedLessons: completedLessons.length,
    completedLessonsHistory,
    confidenceHistory,
    journeyComplete,
    journeyTitle,
    milestones,
    percentage,
    totalConfidenceXp: completedLessons.reduce(
      (total, progress) => total + Math.max(0, progress.xp_awarded),
      0,
    ),
    totalLessons,
  };
}
