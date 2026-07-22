"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const dayEightEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["pattern", "single_reading", "perfect_number"]),
      stage: z.literal("pattern"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["curiosity", "self_blame", "change_treatment"]),
      stage: z.literal("surprise"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["different_questions", "cgm_for_everyone", "a1c_right_now"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DayEightEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly heading: string;
};

export type DayEightEvaluationResult =
  | { readonly data: DayEightEvaluationFeedback; readonly ok: true }
  | { readonly message: string; readonly ok: false };

export async function evaluateDayEightAction(input: unknown): Promise<DayEightEvaluationResult> {
  const parsed = dayEightEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "We could not reveal that explanation right now.", ok: false };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { message: "Your session has ended. Please sign in again.", ok: false };
  }

  const data = parsed.data;
  if (data.stage === "pattern") {
    const accurate = data.answer === "pattern";
    return {
      data: {
        accurate,
        body: accurate
          ? "A repeated pattern gives the care team more context than one isolated moment. The goal is not a flat line; it is a useful question."
          : "One reading can be useful, but it cannot describe a whole week. Look for repeated context before drawing a broader conclusion.",
        heading: accurate
          ? "Follow the pattern, not the pressure."
          : "Let one moment stay one moment.",
      },
      ok: true,
    };
  }

  if (data.stage === "surprise") {
    const accurate = data.answer === "curiosity";
    return {
      data: {
        accurate,
        body: accurate
          ? "Curiosity creates room for context: food, movement, sleep, stress, illness, medication, and timing can all matter."
          : "A surprising reading is not enough reason to change a treatment plan on your own. Record the context and follow the plan your care team gave you.",
        heading: accurate ? "Curiosity is useful data care." : "Pause before changing the plan.",
      },
      ok: true,
    };
  }

  const accurate = data.answer === "different_questions";
  return {
    data: {
      accurate,
      body: accurate
        ? "A1C offers a longer view, a finger-stick captures one moment, and a CGM can show movement across many moments. A clinician decides which information is useful for an individual plan."
        : "The tools are not interchangeable: A1C is not a live reading, and a CGM is not required for every person with Type 2 diabetes.",
      heading: accurate
        ? "Three tools. Three kinds of context."
        : "Give each tool its own question.",
    },
    ok: true,
  };
}
