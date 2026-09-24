"use server";

import {
  acknowledgeMilestoneAnnouncements,
  getPendingMilestoneAnnouncements,
  recognizeMilestoneEvent,
} from "@/features/achievements/services/milestones.server";
import {
  isExplainItBackMilestoneId,
  isResourceMilestoneId,
  isStoryMilestoneId,
} from "@/features/achievements/content/milestone-activity-ids";
import type { MilestoneEvent } from "@/features/achievements/types/milestone";
import { settleOptional } from "@/lib/reliability/dependency-boundary";

function isCount(value: unknown) {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 100;
}

function parseEvent(input: unknown): MilestoneEvent | null {
  if (!input || typeof input !== "object" || !("event" in input)) return null;
  const value = input as Record<string, unknown>;
  switch (value.event) {
    case "myth_round_completed":
    case "myth_replay_completed":
    case "spaced_review_completed":
    case "decode_label_completed":
      return { event: value.event };
    case "explain_it_back_completed":
      return isExplainItBackMilestoneId(value.challengeId)
        ? { event: value.event, challengeId: value.challengeId }
        : null;
    case "interactive_story_completed":
      return isStoryMilestoneId(value.storyId)
        ? { event: value.event, storyId: value.storyId }
        : null;
    case "myth_sources_reviewed":
      return isCount(value.distinctClaimCount)
        ? { event: value.event, distinctClaimCount: Number(value.distinctClaimCount) }
        : null;
    case "appointment_priorities_completed":
      return isCount(value.priorityCount)
        ? { event: value.event, priorityCount: Number(value.priorityCount) }
        : null;
    case "appointment_questions_completed":
      return isCount(value.questionCount) && isCount(value.categoryCount)
        ? {
            event: value.event,
            questionCount: Number(value.questionCount),
            categoryCount: Number(value.categoryCount),
          }
        : null;
    case "appointment_summary_completed":
      return isCount(value.completedSectionCount)
        ? { event: value.event, completedSectionCount: Number(value.completedSectionCount) }
        : null;
    case "appointment_summary_exported":
      return typeof value.hasSummary === "boolean"
        ? { event: value.event, hasSummary: value.hasSummary }
        : null;
    case "caregiver_module_completed":
      return value.moduleId === "CG-M1" ||
        value.moduleId === "CG-M2" ||
        value.moduleId === "CG-M3" ||
        value.moduleId === "CG-M4" ||
        value.moduleId === "CG-M5"
        ? { event: value.event, moduleId: value.moduleId }
        : null;
    case "caregiver_module_progressed":
      return (value.moduleId === "CG-M1" ||
        value.moduleId === "CG-M2" ||
        value.moduleId === "CG-M3" ||
        value.moduleId === "CG-M4" ||
        value.moduleId === "CG-M5") &&
        typeof value.centralIdeaReached === "boolean" &&
        typeof value.coreApplicationCompleted === "boolean" &&
        typeof value.takeawayViewed === "boolean"
        ? {
            event: value.event,
            moduleId: value.moduleId,
            centralIdeaReached: value.centralIdeaReached,
            coreApplicationCompleted: value.coreApplicationCompleted,
            takeawayViewed: value.takeawayViewed,
          }
        : null;
    case "verified_support_resource_opened":
      return isResourceMilestoneId(value.resourceId)
        ? { event: value.event, resourceId: value.resourceId }
        : null;
    default:
      return null;
  }
}

export async function recognizeMilestoneAction(input: unknown) {
  const event = parseEvent(input);
  if (!event)
    return { ok: false as const, retryable: false as const, milestoneIds: [] as string[] };
  const recognized = await settleOptional(
    () => recognizeMilestoneEvent(event, { recordStreak: true }),
    null,
  );
  if (!recognized?.ok)
    return { ok: false as const, retryable: true as const, milestoneIds: [] as string[] };
  return { ok: true as const, milestoneIds: [...recognized.data] };
}

export async function getPendingMilestoneAnnouncementsAction() {
  const pending = await settleOptional(() => getPendingMilestoneAnnouncements(), null);
  if (!pending?.ok) return { ok: false as const, milestoneIds: [] as string[] };
  return { ok: true as const, milestoneIds: [...pending.data] };
}

export async function acknowledgeMilestoneAnnouncementsAction(input: unknown) {
  if (!Array.isArray(input)) return { ok: false as const };
  const milestoneIds = input.filter(
    (value): value is string => typeof value === "string" && value.length <= 80,
  );
  if (milestoneIds.length !== input.length || milestoneIds.length > 50) {
    return { ok: false as const };
  }
  const acknowledged = await settleOptional(
    () => acknowledgeMilestoneAnnouncements(milestoneIds),
    null,
  );
  return { ok: Boolean(acknowledged?.ok) } as const;
}
