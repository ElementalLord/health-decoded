"use server";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { matchPairResponseSchema } from "@/features/activities/schemas/activity-response.schema";
import { getServerDatabaseClient } from "@/lib/database/server";
import { createServerLogger } from "@/lib/logging/server";

const logger = createServerLogger();

export type ActivityEvaluationResult =
  | { ok: true; isComplete: boolean; isCorrect: boolean; feedback: string }
  | { ok: false; message: string };

export async function evaluateMatchPairAction(input: unknown): Promise<ActivityEvaluationResult> {
  const parsed = matchPairResponseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Complete each pair before checking your response." };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { ok: false, message: "We could not check that response right now. Please try again." };
  }

  const database = await getServerDatabaseClient();
  const response = await database.rpc("evaluate_match_pair_activity", {
    p_activity_id: parsed.data.activityId,
    p_lesson_progress_id: parsed.data.lessonProgressId,
    p_response: { pairs: parsed.data.pairs },
  });
  const evaluated = response.data?.[0];

  if (response.error || !evaluated || !evaluated.feedback_message) {
    logger.error("activities.evaluation_failed");
    return { ok: false, message: "We could not check that response right now. Please try again." };
  }

  return {
    ok: true,
    feedback: evaluated.feedback_message,
    isComplete: evaluated.is_complete,
    isCorrect: evaluated.is_correct,
  };
}
