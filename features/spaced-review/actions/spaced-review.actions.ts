"use server";

import { z } from "zod";

import { isReviewableChallengeId } from "@/features/spaced-review/content/review-concepts";
import {
  recordSpacedReviewExample,
  recordSpacedReviewPrompt,
  snoozeSpacedReviewPrompts,
} from "@/features/spaced-review/services/spaced-review.server";

const reviewEventSchema = z.object({ challengeId: z.string().min(1).max(80), token: z.uuid() }).strict();

function parseEvent(input: unknown) {
  const parsed = reviewEventSchema.safeParse(input);
  return parsed.success && isReviewableChallengeId(parsed.data.challengeId) ? parsed.data : null;
}
export async function recordSpacedReviewExampleAction(input: unknown) {
  const event = parseEvent(input);
  return { ok: event ? await recordSpacedReviewExample(event.challengeId, event.token) : false } as const;
}

export async function recordSpacedReviewPromptAction(input: unknown) {
  const event = parseEvent(input);
  return { ok: event ? await recordSpacedReviewPrompt(event.challengeId, event.token) : false } as const;
}

export async function snoozeSpacedReviewPromptsAction(input: unknown) {
  const parsed = z.object({ challengeId: z.string().min(1).max(80) }).strict().safeParse(input);
  return { ok: parsed.success && isReviewableChallengeId(parsed.data.challengeId) ? await snoozeSpacedReviewPrompts(parsed.data.challengeId) : false } as const;
}
