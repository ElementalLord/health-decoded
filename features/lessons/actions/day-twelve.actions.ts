"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const dayTwelveEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["best_available", "skip_to_compensate", "day_is_ruined"]),
      stage: z.literal("late_lunch"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["seek_urgent_help", "wait_it_out", "ignore_fluids"]),
      stage: z.literal("sick_day"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["follow_instructions", "double_next_dose", "stop_everything"]),
      stage: z.literal("missed_medication"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["adapt_next", "restart_monday", "make_up_for_it"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DayTwelveEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly heading: string;
};

export type DayTwelveEvaluationResult =
  | { readonly data: DayTwelveEvaluationFeedback; readonly ok: true }
  | { readonly message: string; readonly ok: false };

export async function evaluateDayTwelveAction(input: unknown): Promise<DayTwelveEvaluationResult> {
  const parsed = dayTwelveEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "We could not reveal that explanation right now.", ok: false };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { message: "Your session has ended. Please sign in again.", ok: false };
  }

  const data = parsed.data;
  if (data.stage === "late_lunch") {
    const accurate = data.answer === "best_available";
    return {
      data: {
        accurate,
        body: accurate
          ? "Exactly. A useful choice does not have to be an ideal choice. Notice what is available, choose what supports you now, and let the next decision be its own decision."
          : "Skipping food to erase a meal or declaring the day ruined adds pressure without solving the interruption. The stronger move is to choose the best available option now, then return to your usual pattern at the next opportunity.",
        heading: accurate
          ? "Good enough can be genuinely good."
          : "The day still has another decision in it.",
      },
      ok: true,
    };
  }

  if (data.stage === "sick_day") {
    const accurate = data.answer === "seek_urgent_help";
    return {
      data: {
        accurate,
        body: accurate
          ? "Yes. Repeated vomiting and being unable to keep fluids down can lead to dangerous dehydration and may need urgent evaluation. Use the person's sick-day instructions and seek urgent medical help; use emergency services for severe symptoms such as trouble breathing, confusion, or difficulty staying awake."
          : "Waiting without help is not the safe experiment here. When someone is vomiting repeatedly and cannot keep fluids down, use their sick-day instructions and seek urgent medical help. Severe breathing trouble, confusion, or difficulty staying awake calls for emergency services.",
        heading: accurate
          ? "This is a help-now signal."
          : "Move this situation into the help-now lane.",
      },
      ok: true,
    };
  }

  if (data.stage === "missed_medication") {
    const accurate = data.answer === "follow_instructions";
    return {
      data: {
        accurate,
        body: accurate
          ? "Right. The safe response depends on the exact medicine and timing. Check the written instructions and contact a pharmacist or diabetes care team if the answer is unclear. Do not double a dose unless a qualified clinician or the medicine instructions specifically say to."
          : "There is no one catch-up rule for every diabetes medicine. Do not double a dose or stop everything on your own. Check the medicine instructions and ask a pharmacist or diabetes care team what applies to that exact medicine and timing.",
        heading: accurate
          ? "Check first; do not improvise a dose."
          : "Medication details need a specific answer.",
      },
      ok: true,
    };
  }

  const accurate = data.answer === "adapt_next";
  return {
    data: {
      accurate,
      body: accurate
        ? "That is the heart of flexible self-care. Pause, understand what changed, choose one workable response, and adjust again if needed. A difficult moment is information, not a verdict."
        : "Waiting for a ceremonial restart or trying to punish the past keeps the disruption in charge. The next useful decision can be small, imperfect, and available right now.",
      heading: accurate ? "Adaptability keeps care moving." : "You do not need a perfect restart.",
    },
    ok: true,
  };
}
