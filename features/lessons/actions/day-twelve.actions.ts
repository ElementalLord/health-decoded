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
      answer: z.enum(["call_with_details", "guess_medicine", "wait_without_plan"]),
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
    const accurate = data.answer === "call_with_details";
    return {
      data: {
        accurate,
        body: accurate
          ? "A concise handoff gives the care team usable context: what changed, what the written plan says, what has already been done, the exact medicines involved, and the question that needs an answer."
          : "Do not improvise a medicine rule or ignore uncertainty because symptoms seem mild. Use the written plan and contact the care team with specific details when an instruction is unclear.",
        heading: accurate
          ? "That call carries the information forward."
          : "Replace guessing with a specific handoff.",
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
        ? "That is the heart of flexible self-care. Pause, understand what changed, choose one workable response, and adjust again if needed."
        : "Waiting for a ceremonial restart or trying to punish the past keeps the disruption in charge. The next useful decision can be small, imperfect, and available right now.",
      heading: accurate ? "Adaptability keeps care moving." : "You do not need a perfect restart.",
    },
    ok: true,
  };
}
