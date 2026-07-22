"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const daySixEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["two_timeframes", "erase_food", "only_weight"]),
      stage: z.literal("recap"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["varies", "guaranteed_drop", "proof_of_failure"]),
      stage: z.literal("variation"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["ask_care_team", "skip_medicine", "ignore_symptoms"]),
      stage: z.literal("safety"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["useful_tool", "food_payment", "perfect_workout"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DaySixEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly details: readonly string[];
  readonly heading: string;
};

export type DaySixEvaluationResult =
  | { readonly data: DaySixEvaluationFeedback; readonly ok: true }
  | { readonly message: string; readonly ok: false };

const recapFeedback: Record<
  "two_timeframes" | "erase_food" | "only_weight",
  DaySixEvaluationFeedback
> = {
  two_timeframes: {
    accurate: true,
    body: "Working muscles can use glucose during activity, and regular activity can improve insulin sensitivity over time. Day 6 is about finding practical moments to use that tool.",
    details: [
      "Movement is one part of diabetes care, not a replacement for the rest of the plan.",
      "The amount and timing that fit will differ from person to person.",
    ],
    heading: "You kept both timeframes.",
  },
  erase_food: {
    accurate: false,
    body: "Movement does not erase or repay food. It gives working muscles a reason to use fuel and can support the body in many other ways.",
    details: ["Meals are not debts.", "Post-meal movement is an option, not a rule or punishment."],
    heading: "Keep the fuel story; remove the food debt.",
  },
  only_weight: {
    accurate: false,
    body: "Movement can support glucose use, heart health, strength, mood, sleep, and function even when weight does not change.",
    details: [
      "The lesson is about using a body tool, not chasing a scale result.",
      "Approachable movement can be adapted to ability and circumstances.",
    ],
    heading: "The benefits are wider than weight.",
  },
};

const variationFeedback: Record<
  "varies" | "guaranteed_drop" | "proof_of_failure",
  DaySixEvaluationFeedback
> = {
  varies: {
    accurate: true,
    body: "The effect of activity can vary with the activity, food, timing, medicines, stress, sleep, and the person. A useful action does not promise one exact reading.",
    details: [
      "When monitoring is part of a care plan, patterns can be more informative than one result.",
      "General education cannot predict an individual glucose response.",
    ],
    heading: "Expect a range of responses.",
  },
  guaranteed_drop: {
    accurate: false,
    body: "Movement often helps glucose management, but one walk cannot guarantee a particular reading. Bodies and circumstances differ.",
    details: [
      "Intensity, duration, meal composition, medicines, sleep, and stress can all matter.",
      "The plan can still be useful without a guaranteed number.",
    ],
    heading: "Helpful is not the same as predictable.",
  },
  proof_of_failure: {
    accurate: false,
    body: "One unexpected reading cannot show whether movement was useful overall. It is one piece of context for the care plan, and movement has benefits beyond a single glucose value.",
    details: [
      "Movement has benefits beyond a single glucose value.",
      "Questions about personal readings belong with the healthcare team.",
    ],
    heading: "One result cannot summarize the activity.",
  },
};

export async function evaluateDaySixAction(input: unknown): Promise<DaySixEvaluationResult> {
  const parsed = daySixEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "We could not reveal that explanation right now.", ok: false };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { message: "Your session has ended. Please sign in again.", ok: false };
  }

  const data = parsed.data;
  if (data.stage === "recap") return { data: recapFeedback[data.answer], ok: true };
  if (data.stage === "variation") return { data: variationFeedback[data.answer], ok: true };

  if (data.stage === "safety") {
    const accurate = data.answer === "ask_care_team";
    return {
      data: {
        accurate,
        body: accurate
          ? "Insulin and some diabetes medicines can increase low-glucose risk during or after activity. The care team can explain whether monitoring, food, or medicine planning is needed."
          : "Do not skip medicine or ignore concerning symptoms. If insulin or a medicine that can cause lows is part of the plan, ask the care team how to move safely.",
        details: [
          "General education cannot determine a person’s individual low-glucose risk.",
          "Medicine changes belong with the prescribing clinician.",
        ],
        heading: accurate
          ? "Personalization is part of safety."
          : "Pause before changing the plan.",
      },
      ok: true,
    };
  }

  const accurate = data.answer === "useful_tool";
  return {
    data: {
      accurate,
      body: accurate
        ? "A usable movement option accounts for the body, the setting, the action, a clear finish point, and an approachable duration. That is practical design, not a test of motivation."
        : "Bring the answer back to fit: the useful option is safe for the person, possible in the setting, and clear enough to begin and finish without becoming punishment.",
      details: [
        "A post-meal walk is one timing option, not a requirement or a promise.",
        "Place, position, pace, and duration can all be adjusted.",
      ],
      heading: accurate
        ? "That is movement placement in plain language."
        : "Design the conditions before judging the effort.",
    },
    ok: true,
  };
}
