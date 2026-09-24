import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import {
  foundationJourneyLessonIds,
  milestoneDefinitionById,
  milestoneDefinitions,
  milestonePathwayById,
} from "@/features/achievements/content/milestone-definitions";
import type {
  EarnedMilestone,
  MilestoneCollectionItem,
  MilestoneEvent,
  MilestoneProgress,
} from "@/features/achievements/types/milestone";
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
    case "explain_it_back_completed":
    case "spaced_review_completed":
    case "decode_label_completed":
    case "interactive_story_completed":
      return null;
    case "caregiver_module_progressed":
      return event.centralIdeaReached && event.coreApplicationCompleted && event.takeawayViewed
        ? "caregiver_module_completed"
        : null;
    case "myth_sources_reviewed":
      return event.distinctClaimCount >= 3 ? event.event : null;
    case "appointment_priorities_completed":
      return event.priorityCount >= 3 ? event.event : null;
    case "appointment_questions_completed":
      return event.questionCount >= 3 && event.categoryCount >= 2 ? event.event : null;
    case "appointment_summary_completed":
      return event.completedSectionCount >= 4 ? event.event : null;
    case "appointment_summary_exported":
      return event.hasSummary ? event.event : null;
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
    case "explain_it_back_completed":
      return ["MILESTONE-IN-YOUR-OWN-WORDS"];
    case "spaced_review_completed":
      return ["MILESTONE-MEMORY-IN-MOTION"];
    case "decode_label_completed":
      return ["MILESTONE-LABEL-WISE"];
    case "interactive_story_completed":
      return ["MILESTONE-STORY-EXPLORER"];
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
      return {
        "CG-M1": ["MILESTONE-CONVERSATION-BUILDER"],
        "CG-M2": ["MILESTONE-SUPPORT-WITH-PERMISSION"],
        "CG-M3": ["MILESTONE-EVERYDAY-ALLY"],
        "CG-M4": ["MILESTONE-STEADY-SUPPORT"],
        "CG-M5": ["MILESTONE-SUSTAINABLE-SUPPORT"],
      }[event.moduleId];
    case "caregiver_module_progressed":
      return [];
    case "verified_support_resource_opened":
      return event.resourceId === "diabetes-education-and-support"
        ? ["MILESTONE-FOUND-TRUSTED-SUPPORT"]
        : [];
  }
}

export async function recognizeMilestoneEvent(
  event: MilestoneEvent,
  options: { recordStreak?: boolean } = {},
): Promise<Result<readonly string[]>> {
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);
  const streakEvent = qualifyingStreakEvent(event);
  const database = await getServerDatabaseClient();
  const streakPromise =
    options.recordStreak && streakEvent
      ? recordQualifyingLearningActivity(streakEvent)
      : Promise.resolve(null);
  let newlyUnlocked: string[] = [];

  if (event.event === "lesson_completed") {
    const [reconciled] = await Promise.all([
      database.rpc("reconcile_current_user_lesson_milestones"),
      streakPromise,
    ]);
    if (reconciled.error || !reconciled.data) {
      logger.error("milestones.lesson_reconciliation_failed", {
        error_code: reconciled.error?.code,
      });
      return err(unexpectedError());
    }
    newlyUnlocked = reconciled.data.filter((id) => milestoneDefinitionById.has(id));
  } else if (
    event.event === "caregiver_module_completed" ||
    event.event === "caregiver_module_progressed"
  ) {
    const completedEvent = event.event === "caregiver_module_completed";
    const [recorded] = await Promise.all([
      database.rpc("record_caregiver_milestone_progress", {
        p_module_id: event.moduleId,
        p_central_idea_reached: completedEvent || event.centralIdeaReached,
        p_core_application_completed: completedEvent || event.coreApplicationCompleted,
        p_takeaway_viewed: completedEvent || event.takeawayViewed,
      }),
      streakPromise,
    ]);
    const row = recorded.data?.[0];
    if (recorded.error || !row) {
      logger.error("milestones.caregiver_progress_failed", {
        error_code: recorded.error?.code,
      });
      return err(unexpectedError());
    }
    newlyUnlocked =
      row.newly_unlocked && row.milestone_id && milestoneDefinitionById.has(row.milestone_id)
        ? [row.milestone_id]
        : [];
  } else if (
    event.event === "explain_it_back_completed" ||
    event.event === "interactive_story_completed" ||
    event.event === "verified_support_resource_opened"
  ) {
    const activity =
      event.event === "explain_it_back_completed"
        ? { type: "explain_it_back", itemId: event.challengeId }
        : event.event === "interactive_story_completed"
          ? { type: "interactive_story", itemId: event.storyId }
          : { type: "trusted_resource", itemId: event.resourceId };
    const [recorded] = await Promise.all([
      database.rpc("record_milestone_activity", {
        p_activity_type: activity.type,
        p_item_id: activity.itemId,
      }),
      streakPromise,
    ]);
    const row = recorded.data?.[0];
    if (recorded.error || !row) {
      logger.error("milestones.activity_progress_failed", {
        activity_type: activity.type,
        error_code: recorded.error?.code,
      });
      return err(unexpectedError());
    }
    newlyUnlocked = row.newly_unlocked_ids.filter((id) => milestoneDefinitionById.has(id));
  } else {
    const candidateIds = idsForEvent(event);
    const validIds = [...new Set(candidateIds)].filter((id) => milestoneDefinitionById.has(id));
    if (validIds.length) {
      const [existing] = await Promise.all([
        database.from("user_milestones").select("milestone_id").eq("user_id", user.data.id),
        streakPromise,
      ]);
      if (existing.error || !existing.data) {
        logger.error("milestones.existing_lookup_failed", { error_code: existing.error?.code });
        return err(unexpectedError());
      }
      const existingIds = new Set(existing.data.map((row) => row.milestone_id));
      newlyUnlocked = validIds.filter((id) => !existingIds.has(id));
      if (newlyUnlocked.length) {
        const inserted = await database.from("user_milestones").upsert(
          newlyUnlocked.map((milestoneId) => ({
            user_id: user.data.id,
            milestone_id: milestoneId,
          })),
          { onConflict: "user_id,milestone_id", ignoreDuplicates: true },
        );
        if (inserted.error) {
          logger.error("milestones.unlock_failed", { error_code: inserted.error.code });
          return err(unexpectedError());
        }
      }
    } else {
      await streakPromise;
    }
  }

  const earned = await database
    .from("user_milestones")
    .select("milestone_id")
    .eq("user_id", user.data.id);
  if (earned.error || !earned.data) {
    logger.error("milestones.earned_lookup_failed", { error_code: earned.error?.code });
    return err(unexpectedError());
  }
  const earnedIds = new Set(earned.data.map((row) => row.milestone_id));
  const categories = new Set(
    [...earnedIds].flatMap((id) => {
      const category = milestoneDefinitionById.get(id)?.category;
      return category && category !== "toolkit" ? [category] : [];
    }),
  );
  const toolkitId = "MILESTONE-PERSONAL-TOOLKIT";
  if (categories.size >= 4 && !earnedIds.has(toolkitId)) {
    const toolkit = await database
      .from("user_milestones")
      .upsert(
        { user_id: user.data.id, milestone_id: toolkitId },
        { onConflict: "user_id,milestone_id", ignoreDuplicates: true },
      );
    if (toolkit.error) {
      logger.error("milestones.toolkit_unlock_failed", { error_code: toolkit.error.code });
      return err(unexpectedError());
    }
    newlyUnlocked.push(toolkitId);
  }
  return ok(newlyUnlocked);
}

export async function getEarnedMilestones(): Promise<Result<readonly EarnedMilestone[]>> {
  noStore();
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);
  const database = await getServerDatabaseClient();
  const activityReconciled = await database.rpc("reconcile_current_user_activity_milestones");
  if (activityReconciled.error) {
    // A staggered migration must never blank the collection. Once available,
    // this repairs every durable activity-derived milestone on the next read.
    logger.error("milestones.activity_reconciliation_failed", {
      error_code: activityReconciled.error.code,
    });
  }
  // Reconcile historical lesson progress so learners receive milestones earned
  // before this feature existed. No lesson content or health data is copied.
  const reconciled = await recognizeMilestoneEvent({ event: "lesson_completed" });
  if (!reconciled.ok) {
    // Reconciliation is additive maintenance, not a prerequisite for reading the
    // collection. A migration rolling out behind the app must never blank every
    // milestone the learner has already earned.
    logger.error("milestones.background_reconciliation_failed");
  }
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

export async function getMilestoneCollection(): Promise<
  Result<readonly MilestoneCollectionItem[]>
> {
  noStore();
  const earned = await getEarnedMilestones();
  if (!earned.ok) return err(earned.error);
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);

  const earnedById = new Map(earned.data.map((entry) => [entry.definition.id, entry]));
  const database = await getServerDatabaseClient();
  const [lessonResponse, caregiverResponse, activityResponse] = await Promise.all([
    database
      .from("lesson_progress")
      .select("id, journey_lesson_id, user_journeys!inner(user_id)")
      .eq("status", "completed")
      .eq("user_journeys.user_id", user.data.id),
    database
      .from("user_caregiver_module_progress")
      .select("module_id, central_idea_reached, core_application_completed, takeaway_viewed")
      .eq("user_id", user.data.id),
    database
      .from("user_milestone_activity_progress")
      .select("activity_type, item_id")
      .eq("user_id", user.data.id),
  ]);

  const completedLessonIds = new Set<string>();
  const lessonProgressIds: string[] = [];
  const lessonProgressAvailable = !lessonResponse.error && Boolean(lessonResponse.data);
  if (lessonProgressAvailable && lessonResponse.data) {
    for (const row of lessonResponse.data) {
      completedLessonIds.add(row.journey_lesson_id);
      lessonProgressIds.push(row.id);
    }
  } else {
    logger.error("milestones.progress_lookup_failed", {
      error_code: lessonResponse.error?.code,
    });
  }

  let reflectionCount = 0;
  let reflectionProgressAvailable = lessonProgressAvailable && lessonProgressIds.length === 0;
  if (lessonProgressIds.length) {
    const reflectionResponse = await database
      .from("reflection_entries")
      .select("lesson_progress_id")
      .in("lesson_progress_id", lessonProgressIds);
    if (!reflectionResponse.error && reflectionResponse.data) {
      reflectionCount = new Set(reflectionResponse.data.map((row) => row.lesson_progress_id)).size;
      reflectionProgressAvailable = true;
    } else {
      logger.error("milestones.reflection_progress_lookup_failed", {
        error_code: reflectionResponse.error?.code,
      });
    }
  }

  const lessonCount = completedLessonIds.size;
  const foundationCount = foundationJourneyLessonIds.filter((id) =>
    completedLessonIds.has(id),
  ).length;
  const categoryCount = new Set(
    earned.data.flatMap(({ definition }) =>
      definition.category === "toolkit" ? [] : [definition.category],
    ),
  ).size;
  const progressById = new Map<string, MilestoneProgress>(
    milestoneDefinitions.flatMap((definition) => {
      const pathway = milestonePathwayById.get(definition.id);
      if (!pathway) return [];
      return [
        [
          definition.id,
          {
            current: earnedById.has(definition.id) ? pathway.target : 0,
            target: pathway.target,
            unit: pathway.unit,
          },
        ] as const,
      ];
    }),
  );
  progressById.set("MILESTONE-PERSONAL-TOOLKIT", {
    current: categoryCount,
    target: 4,
    unit: "milestone categories explored",
  });
  if (lessonProgressAvailable) {
    progressById.set("MILESTONE-FIRST-STEP", {
      current: lessonCount,
      target: 1,
      unit: "lesson completed",
    });
    progressById.set("MILESTONE-BUILDING-RHYTHM", {
      current: lessonCount,
      target: 3,
      unit: "lessons completed",
    });
    progressById.set("MILESTONE-WEEK-OF-LEARNING", {
      current: lessonCount,
      target: 7,
      unit: "lessons completed",
    });
    progressById.set("MILESTONE-LEARNING-IN-MOTION", {
      current: lessonCount,
      target: 10,
      unit: "lessons completed",
    });
    progressById.set("MILESTONE-FOUNDATION-COMPLETE", {
      current: foundationCount,
      target: 14,
      unit: "Foundation lessons completed",
    });
  }
  if (reflectionProgressAvailable) {
    progressById.set("MILESTONE-THOUGHTFUL-REFLECTION", {
      current: reflectionCount,
      target: 3,
      unit: "lesson reflections saved",
    });
  }

  const caregiverMilestoneByModule = new Map([
    ["CG-M1", "MILESTONE-CONVERSATION-BUILDER"],
    ["CG-M2", "MILESTONE-SUPPORT-WITH-PERMISSION"],
    ["CG-M3", "MILESTONE-EVERYDAY-ALLY"],
    ["CG-M4", "MILESTONE-STEADY-SUPPORT"],
    ["CG-M5", "MILESTONE-SUSTAINABLE-SUPPORT"],
  ]);
  if (!caregiverResponse.error && caregiverResponse.data) {
    let completedCaregiverModules = 0;
    for (const row of caregiverResponse.data) {
      const milestoneId = caregiverMilestoneByModule.get(row.module_id);
      if (!milestoneId) continue;
      progressById.set(milestoneId, {
        current:
          Number(row.central_idea_reached) +
          Number(row.core_application_completed) +
          Number(row.takeaway_viewed),
        target: 3,
        unit: "module steps completed",
      });
      if (row.central_idea_reached && row.core_application_completed && row.takeaway_viewed) {
        completedCaregiverModules += 1;
      }
    }
    progressById.set("MILESTONE-CIRCLE-OF-SUPPORT", {
      current: completedCaregiverModules,
      target: 5,
      unit: "caregiver modules completed",
    });
  } else {
    logger.error("milestones.caregiver_progress_lookup_failed", {
      error_code: caregiverResponse.error?.code,
    });
  }

  if (!activityResponse.error && activityResponse.data) {
    const activityIds = (activityType: string) =>
      new Set(
        activityResponse.data
          .filter((row) => row.activity_type === activityType)
          .map((row) => row.item_id),
      );
    const explainedConcepts = activityIds("explain_it_back");
    const completedStories = activityIds("interactive_story");
    const openedResources = activityIds("trusted_resource");
    progressById.set("MILESTONE-IN-YOUR-OWN-WORDS", {
      current: Math.max(
        explainedConcepts.size,
        Number(earnedById.has("MILESTONE-IN-YOUR-OWN-WORDS")),
      ),
      target: 1,
      unit: "concept explained clearly",
    });
    progressById.set("MILESTONE-CONCEPTS-MADE-CLEAR", {
      current: explainedConcepts.size,
      target: 3,
      unit: "distinct concepts explained clearly",
    });
    progressById.set("MILESTONE-STORY-EXPLORER", {
      current: Math.max(completedStories.size, Number(earnedById.has("MILESTONE-STORY-EXPLORER"))),
      target: 1,
      unit: "interactive story completed",
    });
    progressById.set("MILESTONE-MANY-PERSPECTIVES", {
      current: completedStories.size,
      target: 4,
      unit: "distinct interactive stories completed",
    });
    progressById.set("MILESTONE-FOUND-TRUSTED-SUPPORT", {
      current: Math.max(
        Number(openedResources.has("diabetes-education-and-support")),
        Number(earnedById.has("MILESTONE-FOUND-TRUSTED-SUPPORT")),
      ),
      target: 1,
      unit: "verified guide opened",
    });
    progressById.set("MILESTONE-RESOURCE-NAVIGATOR", {
      current: openedResources.size,
      target: 3,
      unit: "distinct verified guides opened",
    });
  } else {
    logger.error("milestones.activity_progress_lookup_failed", {
      error_code: activityResponse.error?.code,
    });
  }

  return ok(
    milestoneDefinitions.map((definition) => ({
      definition,
      unlockedAt: earnedById.get(definition.id)?.unlockedAt ?? null,
      progress: progressById.get(definition.id) ?? null,
    })),
  );
}

export async function getPendingMilestoneAnnouncements(): Promise<Result<readonly string[]>> {
  noStore();
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);
  const database = await getServerDatabaseClient();
  const response = await database
    .from("user_milestones")
    .select("milestone_id")
    .eq("user_id", user.data.id)
    .is("announced_at", null)
    .order("unlocked_at", { ascending: true });
  if (response.error || !response.data) {
    logger.error("milestones.pending_lookup_failed", { error_code: response.error?.code });
    return err(unexpectedError());
  }
  return ok(
    response.data.map((row) => row.milestone_id).filter((id) => milestoneDefinitionById.has(id)),
  );
}

export async function acknowledgeMilestoneAnnouncements(
  milestoneIds: readonly string[],
): Promise<Result<undefined>> {
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);
  const validIds = [...new Set(milestoneIds)].filter((id) => milestoneDefinitionById.has(id));
  if (!validIds.length) return ok(undefined);
  const database = await getServerDatabaseClient();
  const response = await database.rpc("acknowledge_milestone_announcements", {
    p_milestone_ids: validIds,
  });
  if (response.error) {
    logger.error("milestones.announcement_ack_failed", { error_code: response.error.code });
    return err(unexpectedError());
  }
  return ok(undefined);
}
