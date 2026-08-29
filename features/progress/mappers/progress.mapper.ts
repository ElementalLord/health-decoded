import {
  type CompletedLessonHistoryEntry,
  type ProgressAssignmentRow,
  type ProgressLessonRow,
  type ProgressMilestone,
  type ProgressViewModel,
} from "@/features/progress/types/progress";

type ProgressMapperInput = {
  assignments: ProgressAssignmentRow[];
  completedAt: string | null;
  currentJourneyLessonId: string | null;
  journeyTitle: string;
  progressRows: ProgressLessonRow[];
};

export function mapProgress({
  assignments,
  completedAt,
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
    if (progress?.status === "completed") {
      return {
        dayNumber: assignment.day_number,
        lessonTitle: assignment.lessons.title,
        state: "completed",
        xpAwarded: Math.max(0, progress.xp_awarded),
      };
    }

    if (assignment.id === currentAssignmentId) {
      return {
        dayNumber: assignment.day_number,
        lessonTitle: assignment.lessons.title,
        state: "current",
        xpAwarded: 0,
      };
    }

    return {
      dayNumber: assignment.day_number,
      lessonTitle: null,
      state: "locked",
      xpAwarded: 0,
    };
  });

  const completedLessonsHistory: CompletedLessonHistoryEntry[] = assignments.flatMap(
    (assignment) => {
      const progress = progressByAssignment.get(assignment.id);
      if (!progress || progress.status !== "completed" || !progress.completed_at) return [];

      return [
        {
          completedAt: progress.completed_at,
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
    journeyComplete,
    journeyTitle,
    milestones,
    percentage,
    totalLearningXp: completedLessons.reduce(
      (total, progress) => total + Math.max(0, progress.xp_awarded),
      0,
    ),
    totalLessons,
  };
}
