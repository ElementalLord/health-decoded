"use client";

import { recognizeMilestoneAction } from "@/features/achievements/actions/milestone.actions";
import type { MilestoneEvent } from "@/features/achievements/types/milestone";

export const MILESTONE_RECOGNIZED_EVENT = "health-decoded:milestone-recognized";

export async function recognizeMilestone(event: MilestoneEvent) {
  const result = await recognizeMilestoneAction(event);
  if (!result.ok || !result.milestoneIds.length) return;
  window.dispatchEvent(
    new CustomEvent(MILESTONE_RECOGNIZED_EVENT, { detail: result.milestoneIds }),
  );
}
