"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const dayElevenEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["risk_not_destiny", "inevitable", "single_high"]),
      stage: z.literal("risk"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["screen_before_symptoms", "wait_for_symptoms", "screen_only_if_worse"]),
      stage: z.literal("silent_screening"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["keep_showing_up", "cancel_until_perfect", "avoid_results"]),
      stage: z.literal("showing_up"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["find_early_changes", "prove_nothing_is_wrong", "replace_daily_care"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DayElevenEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly heading: string;
};

export type DayElevenEvaluationResult =
  | { readonly data: DayElevenEvaluationFeedback; readonly ok: true }
  | { readonly message: string; readonly ok: false };

export async function evaluateDayElevenAction(input: unknown): Promise<DayElevenEvaluationResult> {
  const parsed = dayElevenEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "We could not reveal that explanation right now.", ok: false };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { message: "Your session has ended. Please sign in again.", ok: false };
  }

  const data = parsed.data;
  if (data.stage === "risk") {
    const accurate = data.answer === "risk_not_destiny";
    return {
      data: {
        accurate,
        body: accurate
          ? "Complications are possibilities, not promises. Longer-term patterns matter, and every appointment, screening, medication taken as prescribed, and supportive daily habit adds another layer of protection."
          : "A single high reading is information, not a forecast, and a diagnosis does not write the ending. Risk can often be reduced or delayed through steady care and early screening.",
        heading: accurate ? "Risk is not destiny." : "The future is still being shaped.",
      },
      ok: true,
    };
  }

  if (data.stage === "silent_screening") {
    const accurate = data.answer === "screen_before_symptoms";
    return {
      data: {
        accurate,
        body: accurate
          ? "That is the quiet strength of screening. Eye, kidney, and blood-pressure changes can begin without obvious symptoms, so checking early creates more time and more options."
          : "Waiting to feel a change can miss the most useful window. Screening is designed to notice some changes before symptoms announce them, when there may be more ways to respond.",
        heading: accurate
          ? "No symptoms can still be the right time to look."
          : "Screening does not need a symptom to be useful.",
      },
      ok: true,
    };
  }

  if (data.stage === "showing_up") {
    const accurate = data.answer === "keep_showing_up";
    return {
      data: {
        accurate,
        body: accurate
          ? "Exactly. Preventive care is not a reward for a perfect week. Honest check-ins help your care team see patterns, adjust support, and protect what matters next."
          : "Avoiding a visit can feel safer in the moment, but it removes information and support. You never have to earn care by being perfect; showing up honestly is itself a protective action.",
        heading: accurate ? "Showing up counts as care." : "Care is not a test you have to pass.",
      },
      ok: true,
    };
  }

  const accurate = data.answer === "find_early_changes";
  return {
    data: {
      accurate,
      body: accurate
        ? "Beautifully put. Clear vision today does not rule out early retinal changes. Diabetes eye screening looks beneath how vision feels so changes can be found and addressed earlier."
        : "Screening cannot promise that nothing will ever change, and it does not replace everyday care. Its purpose is to look for early changes that may not affect vision yet, so there is time to respond.",
      heading: accurate
        ? "You found the reason behind the check."
        : "The check is an early-warning tool, not a guarantee.",
    },
    ok: true,
  };
}
