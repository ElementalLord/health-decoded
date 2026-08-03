"use server";

import { revalidatePath } from "next/cache";

import { recognizeMilestoneEvent } from "@/features/achievements/services/milestones.server";
import type { MilestoneEvent } from "@/features/achievements/types/milestone";

function isCount(value: unknown) {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 100;
}

function parseEvent(input: unknown): MilestoneEvent | null {
  if (!input || typeof input !== "object" || !("event" in input)) return null;
  const value = input as Record<string, unknown>;
  switch (value.event) {
    case "myth_round_completed":
    case "myth_replay_completed":
      return { event: value.event };
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
        ? { event: value.event, questionCount: Number(value.questionCount), categoryCount: Number(value.categoryCount) }
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
      return value.moduleId === "CG-M1" || value.moduleId === "CG-M2"
        ? { event: value.event, moduleId: value.moduleId }
        : null;
    case "verified_support_resource_opened":
      return value.resourceId === "diabetes-education-and-support"
        ? { event: value.event, resourceId: value.resourceId }
        : null;
    default:
      return null;
  }
}

export async function recognizeMilestoneAction(input: unknown) {
  const event = parseEvent(input);
  if (!event) return { ok: false as const, milestoneIds: [] as string[] };
  const recognized = await recognizeMilestoneEvent(event, { recordStreak: true });
  if (!recognized.ok) return { ok: false as const, milestoneIds: [] as string[] };
  revalidatePath("/milestones");
  revalidatePath("/journey");
  return { ok: true as const, milestoneIds: [...recognized.data] };
}
