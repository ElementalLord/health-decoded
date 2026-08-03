import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import {
  foundationJourneyLessonIds,
  milestoneDefinitionById,
} from "@/features/achievements/content/milestone-definitions";
import type { EarnedMilestone, MilestoneEvent } from "@/features/achievements/types/milestone";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { recordQualifyingLearningActivity } from "@/features/streaks/services/learning-streak.server";
import type { QualifyingLearningEvent } from "@/features/streaks/types/learning-streak";
import { getServerDatabaseClient } from "@/lib/database/server";
import { unexpectedError } from "@/lib/errors/application-error";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";

const logger = createServerLogger();

function qualifyingStreakEvent(event: MilestoneEvent): QualifyingLearningEvent | null {
  switch (event.event) {
    case "lesson_completed":
    case "myth_round_completed":
    case "myth_replay_completed":
    case "caregiver_module_completed":
    case "verified_support_resource_opened":
      return event.event;
    case "appointment_summary_completed":
      return event.completedSectionCount >= 4 ? event.event : null;
    default:
      return null;
  }
}

function idsForEvent(event: Exclude<MilestoneEvent, { event: "lesson_completed" }>) {
  switch (event.event) {
    case "myth_round_completed":
      return ["MILESTONE-MYTH-CHECKER"];
    case "myth_replay_completed":
      return ["MILESTONE-SECOND-LOOK"];
    case "myth_sources_reviewed":
      return event.distinctClaimCount >= 3 ? ["MILESTONE-EVIDENCE-SEEKER"] : [];
    case "appointment_priorities_completed":
      return event.priorityCount >= 3 ? ["MILESTONE-PRIORITIES-SET"] : [];
    case "appointment_questions_completed":
      return event.questionCount >= 3 && event.categoryCount >= 2
        ? ["MILESTONE-QUESTIONS-READY"]
        : [];
    case "appointment_summary_completed":
      return event.completedSectionCount >= 4 ? ["MILESTONE-APPOINTMENT-READY"] : [];
    case "appointment_summary_exported":
      return event.hasSummary ? ["MILESTONE-PLAN-IN-HAND"] : [];
    case "caregiver_module_completed":
      return event.moduleId === "CG-M2"
        ? ["MILESTONE-SUPPORT-WITH-PERMISSION"]
        : ["MILESTONE-CONVERSATION-BUILDER"];
    case "verified_support_resource_opened":
      return event.resourceId === "diabetes-education-and-support"
        ? ["MILESTONE-FOUND-TRUSTED-SUPPORT"]
        : [];
  }
}

async function lessonMilestoneIds(userId: string) {
  const database = await getServerDatabaseClient();
  const response = await database
    .from("lesson_progress")
    .select("journey_lesson_id, user_journeys!inner(user_id)")
    .eq("status", "completed")
    .eq("user_journeys.user_id", userId);
  if (response.error || !response.data) return [];
  const distinct = new Set(response.data.map((row) => row.journey_lesson_id));
  const ids: string[] = [];
  if (distinct.size >= 1) ids.push("MILESTONE-FIRST-STEP");
  if (distinct.size >= 10) ids.push("MILESTONE-LEARNING-IN-MOTION");
  if (foundationJourneyLessonIds.every((id) => distinct.has(id)))
    ids.push("MILESTONE-FOUNDATION-COMPLETE");
  return ids;
}

export async function recognizeMilestoneEvent(
  event: MilestoneEvent,
  options: { recordStreak?: boolean } = {},
): Promise<Result<readonly string[]>> {
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);
  const streakEvent = qualifyingStreakEvent(event);
  if (options.recordStreak && streakEvent) await recordQualifyingLearningActivity(streakEvent);
  const database = await getServerDatabaseClient();
  const candidateIds =
    event.event === "lesson_completed"
      ? await lessonMilestoneIds(user.data.id)
      : idsForEvent(event);
  const validIds = [...new Set(candidateIds)].filter((id) => milestoneDefinitionById.has(id));
  if (!validIds.length) return ok([]);

  const existing = await database
    .from("user_milestones")
    .select("milestone_id")
    .eq("user_id", user.data.id)
    .in("milestone_id", validIds);
  if (existing.error || !existing.data) {
    logger.error("milestones.existing_lookup_failed", { error_code: existing.error?.code });
    return err(unexpectedError());
  }
  const existingIds = new Set(existing.data.map((row) => row.milestone_id));
  const newlyUnlocked = validIds.filter((id) => !existingIds.has(id));

  if (newlyUnlocked.length) {
    const inserted = await database.from("user_milestones").upsert(
      newlyUnlocked.map((milestoneId) => ({ user_id: user.data.id, milestone_id: milestoneId })),
      { onConflict: "user_id,milestone_id", ignoreDuplicates: true },
    );
    if (inserted.error) {
      logger.error("milestones.unlock_failed", { error_code: inserted.error.code });
      return err(unexpectedError());
    }
  }

  const earned = await database
    .from("user_milestones")
    .select("milestone_id")
    .eq("user_id", user.data.id);
  if (!earned.error && earned.data) {
    const categories = new Set(
      earned.data.flatMap(({ milestone_id: id }) => {
        const category = milestoneDefinitionById.get(id)?.category;
        return category && category !== "toolkit" ? [category] : [];
      }),
    );
    const toolkitId = "MILESTONE-PERSONAL-TOOLKIT";
    if (categories.size >= 4 && !earned.data.some(({ milestone_id: id }) => id === toolkitId)) {
      const toolkit = await database
        .from("user_milestones")
        .upsert(
          { user_id: user.data.id, milestone_id: toolkitId },
          { onConflict: "user_id,milestone_id", ignoreDuplicates: true },
        );
      if (!toolkit.error) newlyUnlocked.push(toolkitId);
    }
  }
  if (
    options.recordStreak &&
    !streakEvent &&
    newlyUnlocked.some((id) => id !== "MILESTONE-PERSONAL-TOOLKIT")
  ) {
    await recordQualifyingLearningActivity("milestone_earned");
  }
  return ok(newlyUnlocked);
}

export async function getEarnedMilestones(): Promise<Result<readonly EarnedMilestone[]>> {
  noStore();
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);
  // Reconcile historical lesson progress so learners receive milestones earned
  // before this feature existed. No lesson content or health data is copied.
  await recognizeMilestoneEvent({ event: "lesson_completed" });
  const database = await getServerDatabaseClient();
  const response = await database
    .from("user_milestones")
    .select("milestone_id, unlocked_at")
    .eq("user_id", user.data.id)
    .order("unlocked_at", { ascending: false });
  if (response.error || !response.data) return err(unexpectedError());
  return ok(
    response.data.flatMap((row) => {
      const definition = milestoneDefinitionById.get(row.milestone_id);
      return definition ? [{ definition, unlockedAt: row.unlocked_at }] : [];
    }),
  );
}
