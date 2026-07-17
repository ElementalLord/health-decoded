"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const dayFiveEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["muscles_use_glucose", "work_off_food", "glucose_disappears"]),
      stage: z.literal("mechanism"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["regular_activity", "one_hard_workout", "exercise_cures"]),
      stage: z.literal("sensitivity"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["supports_fuel_use", "guarantees_number", "repays_meal"]),
      stage: z.literal("after_meal"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["more_accurate", "myth"]),
      stage: z.literal("myth"),
      statement: z.number().int().min(0).max(2),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["ask_care_team", "stop_medicine", "push_through"]),
      stage: z.literal("safety"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["movement_is_tool", "only_gym_counts", "perfect_or_none"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DayFiveEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly heading: string;
  readonly details: readonly string[];
};

export type DayFiveEvaluationResult =
  | { readonly ok: true; readonly data: DayFiveEvaluationFeedback }
  | { readonly ok: false; readonly message: string };

const mechanismFeedback: Record<
  "muscles_use_glucose" | "work_off_food" | "glucose_disappears",
  DayFiveEvaluationFeedback
> = {
  muscles_use_glucose: {
    accurate: true,
    body: "Contracting muscles need fuel. They can take up glucose and use it for energy during activity, including through a pathway that does not depend entirely on insulin.",
    heading: "The fuel has somewhere useful to go.",
    details: [
      "Movement is not punishment for eating.",
      "A person’s glucose response can vary with activity, timing, medicines, and other factors.",
    ],
  },
  work_off_food: {
    accurate: false,
    body: "Movement can help muscles use glucose, but it is not a way to repay or erase a meal. Food provides fuel; activity gives working muscles a reason to use some of it.",
    heading: "Keep the mechanism; leave out the punishment.",
    details: [
      "One meal is not a debt.",
      "Movement supports health even when weight does not change.",
    ],
  },
  glucose_disappears: {
    accurate: false,
    body: "Glucose does not vanish. Working muscle cells take up glucose and use or store it as part of the body’s normal energy system.",
    heading: "Used is different from erased.",
    details: [
      "Muscles are major users of glucose.",
      "The visual is a teaching model, not a prediction of anyone’s reading.",
    ],
  },
};

const sensitivityFeedback: Record<
  "regular_activity" | "one_hard_workout" | "exercise_cures",
  DayFiveEvaluationFeedback
> = {
  regular_activity: {
    accurate: true,
    body: "Regular physical activity can improve insulin sensitivity, meaning cells respond more effectively to the insulin that is available.",
    heading: "The signal can be heard more clearly.",
    details: [
      "Contracting muscle can also take up glucose during activity.",
      "Movement is one part of diabetes care, alongside food, medicines, monitoring when prescribed, sleep, and support.",
    ],
  },
  one_hard_workout: {
    accurate: false,
    body: "One intense workout is not required. Repeatable activity—including smaller bouts—can be a more useful starting point than one exhausting effort.",
    heading: "Consistency matters more than heroics.",
    details: [
      "Starting gradually can reduce injury risk.",
      "An activity that fits real life is easier to return to.",
    ],
  },
  exercise_cures: {
    accurate: false,
    body: "Physical activity is a powerful management tool, but it is not a guaranteed cure and it does not replace an individualized care plan.",
    heading: "Helpful does not mean magical.",
    details: [
      "Responses differ from person to person.",
      "Medicines should never be changed because of a general lesson.",
    ],
  },
};

const afterMealFeedback: Record<
  "supports_fuel_use" | "guarantees_number" | "repays_meal",
  DayFiveEvaluationFeedback
> = {
  supports_fuel_use: {
    accurate: true,
    body: "A short, comfortable walk after a meal can be one practical way to let working muscles use fuel. It is an option—not a requirement or a promise about a specific reading.",
    heading: "A small window can hold a useful choice.",
    details: [
      "A seated or adapted movement can also count.",
      "The best timing and amount depend on the person and their care plan.",
    ],
  },
  guarantees_number: {
    accurate: false,
    body: "Movement can affect blood glucose, but no short walk guarantees a particular number. Intensity, duration, food, stress, medicines, and the individual all matter.",
    heading: "Useful is not the same as predictable.",
    details: [
      "Later monitoring lessons can help people notice personal patterns when monitoring is prescribed.",
      "This lesson teaches a mechanism, not a target result.",
    ],
  },
  repays_meal: {
    accurate: false,
    body: "A meal does not need to be repaid. Movement can support glucose use and wellbeing without becoming compensation for eating.",
    heading: "No food debt is being collected.",
    details: [
      "Food and movement both support the body.",
      "A sustainable routine should protect dignity, not create guilt.",
    ],
  },
};

const mythAnswers = ["myth", "more_accurate", "myth"] as const;
const mythBodies = [
  "Physical activity includes much more than gym workouts. Walking, household tasks, gardening, dancing, and adapted seated movement can all be meaningful.",
  "Smaller bouts can count. The useful question is what can be repeated safely, not whether it looks like a formal workout.",
  "Movement supports glucose use, heart health, strength, sleep, mood, and function even when the scale does not change.",
] as const;

export async function evaluateDayFiveAction(input: unknown): Promise<DayFiveEvaluationResult> {
  const parsed = dayFiveEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "We could not reveal that explanation right now." };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { ok: false, message: "Your session has ended. Please sign in again." };
  }

  const data = parsed.data;
  if (data.stage === "mechanism") return { ok: true, data: mechanismFeedback[data.answer] };
  if (data.stage === "sensitivity") return { ok: true, data: sensitivityFeedback[data.answer] };
  if (data.stage === "after_meal") return { ok: true, data: afterMealFeedback[data.answer] };
  if (data.stage === "myth") {
    const accurate = data.answer === mythAnswers[data.statement];
    return {
      ok: true,
      data: {
        accurate,
        body: mythBodies[data.statement]!,
        heading: accurate ? "That makes room for real life." : "That rule is too narrow.",
        details: [
          "The body responds to movement, not to whether it happened in a gym.",
          "An approachable activity is more useful when it can be repeated.",
        ],
      },
    };
  }
  if (data.stage === "safety") {
    const accurate = data.answer === "ask_care_team";
    return {
      ok: true,
      data: {
        accurate,
        body: accurate
          ? "Insulin and some diabetes medicines can increase the risk of low blood glucose during or after activity. The care team can explain whether monitoring, food, or medicine planning is needed."
          : "Do not stop medicine or push through concerning symptoms. People using insulin or medicines that can cause lows should ask their care team how to move safely.",
        heading: accurate
          ? "Safety can be planned without fear."
          : "Pause before changing the plan.",
        details: [
          "General education cannot determine a person’s low-glucose risk.",
          "New, vigorous, or difficult activity may need individualized guidance.",
        ],
      },
    };
  }

  const accurate = data.answer === "movement_is_tool";
  return {
    ok: true,
    data: {
      accurate,
      body: accurate
        ? "Working muscles use glucose, regular activity can improve insulin sensitivity, and small, safe bouts can count. Movement is a tool—not a punishment or a perfection test."
        : "The lesson is not asking for a gym membership or a perfect routine. It is asking for one safe, repeatable way to let your muscles work.",
      heading: accurate
        ? "That is the lesson in plain language."
        : "Bring the idea back to real life.",
      details: [
        "Movement can be adapted to ability and circumstances.",
        "A personal care plan still guides medicines, monitoring, and safety.",
      ],
    },
  };
}
