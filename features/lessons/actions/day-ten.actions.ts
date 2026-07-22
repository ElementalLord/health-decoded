"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const dayTenEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["one_small_habit", "everything_at_once", "wait_for_motivation"]),
      stage: z.literal("first_habit"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["notice_completion", "raise_difficulty", "add_punishment"]),
      stage: z.literal("closure"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["consistency_routines", "perfect_choices", "motivation_daily"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DayTenEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly heading: string;
};

export type DayTenEvaluationResult =
  | { readonly data: DayTenEvaluationFeedback; readonly ok: true }
  | { readonly message: string; readonly ok: false };

export async function evaluateDayTenAction(input: unknown): Promise<DayTenEvaluationResult> {
  const parsed = dayTenEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "We could not reveal that explanation right now.", ok: false };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { message: "Your session has ended. Please sign in again.", ok: false };
  }

  const data = parsed.data;
  if (data.stage === "first_habit") {
    const accurate = data.answer === "one_small_habit";
    return {
      data: {
        accurate,
        body: accurate
          ? "A habit small enough to repeat on a tired Tuesday is strong enough to last. It becomes an anchor you can gently build on, no overhaul required."
          : "Changing everything overnight feels productive, but it usually exhausts the person doing it, and waiting for motivation hands your health to your busiest day. One small, repeatable habit outlasts both.",
        heading: accurate
          ? "Small enough to repeat is strong enough to last."
          : "Big overhauls burn bright, then fade.",
      },
      ok: true,
    };
  }

  if (data.stage === "closure") {
    const accurate = data.answer === "notice_completion";
    return {
      data: {
        accurate,
        body: accurate
          ? "A simple finish cue makes the completed action visible and lets the routine end. It does not require a bigger version, a special feeling, or a grade."
          : "Doubling the next version or grading an easy routine changes completion into pressure. A neutral check mark or kind closing phrase is enough.",
        heading: accurate ? "The loop has a clear ending." : "Completion does not need a penalty.",
      },
      ok: true,
    };
  }

  const accurate = data.answer === "consistency_routines";
  return {
    data: {
      accurate,
      body: accurate
        ? "Simple routines reduce decisions by linking an approachable action to an existing anchor, arranging a visible support, and marking a clear finish."
        : "Motivation and constant willpower are unreliable design tools. A routine is clearer: decide the anchor, action, environment support, and finish cue in advance.",
      heading: accurate ? "That is the routine recipe." : "Bring the design back into the answer.",
    },
    ok: true,
  };
}
