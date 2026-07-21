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
      answer: z.enum(["next_decision", "week_ruined", "make_up_for_it"]),
      stage: z.literal("setback"),
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

  if (data.stage === "setback") {
    const accurate = data.answer === "next_decision";
    return {
      data: {
        accurate,
        body: accurate
          ? "A party, a missed walk, a tired evening, none of them erase your progress. Ask “what is the healthiest thing I can do next?” and take that one step, without guilt."
          : "Writing off the whole week, or punishing yourself to make up for one evening, turns one moment into many. Your routine is still there, and returning to it after interruptions is what makes it last.",
        heading: accurate
          ? "The next step is the whole plan."
          : "One evening is a pause, not a verdict.",
      },
      ok: true,
    };
  }

  const accurate = data.answer === "consistency_routines";
  return {
    data: {
      accurate,
      body: accurate
        ? "Simple routines make healthy choices easier, and returning to them after interruptions is what makes them last. Consistency, not perfection, is what quietly adds up."
        : "No one makes perfect choices every day, and motivation fades by evening. Routines are stronger than both: decide once, repeat gently, and come back without guilt.",
      heading: accurate
        ? "That is the secret, gently put."
        : "Perfection and motivation both run out.",
    },
    ok: true,
  };
}
