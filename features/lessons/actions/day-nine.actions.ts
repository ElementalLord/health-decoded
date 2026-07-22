"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const dayNineEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["follow_plan", "wait_it_out", "exercise_through"]),
      stage: z.literal("low_response"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["prompt_care", "wait_days", "online_forums"]),
      stage: z.literal("high_urgent"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["prepared_not_panicked", "every_change_emergency", "handle_alone"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DayNineEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly heading: string;
};

export type DayNineEvaluationResult =
  | { readonly data: DayNineEvaluationFeedback; readonly ok: true }
  | { readonly message: string; readonly ok: false };

export async function evaluateDayNineAction(input: unknown): Promise<DayNineEvaluationResult> {
  const parsed = dayNineEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "We could not reveal that explanation right now.", ok: false };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { message: "Your session has ended. Please sign in again.", ok: false };
  }

  const data = parsed.data;
  if (data.stage === "low_response") {
    const accurate = data.answer === "follow_plan";
    return {
      data: {
        accurate,
        body: accurate
          ? "Possible lows deserve attention, not alarm. Check if your care team has asked you to, follow the plan they gave you, and afterwards think gently about what may have led up to it."
          : "A possible low is not something to ignore or push through with more activity. The safest first step is the plan your care team gave you, checking if instructed and responding the way they described.",
        heading: accurate ? "Attention first, plan second." : "Do not wait through a possible low.",
      },
      ok: true,
    };
  }

  if (data.stage === "high_urgent") {
    const accurate = data.answer === "prompt_care";
    return {
      data: {
        accurate,
        body: accurate
          ? "Persistent vomiting, trouble staying awake, breathing difficulty, or growing confusion are signals to seek medical care promptly. They are uncommon, and recognizing them is exactly what preparedness means."
          : "Urgent signals such as persistent vomiting or growing confusion should not wait days or be compared against strangers online. They deserve prompt medical care from professionals who know how to help.",
        heading: accurate
          ? "Urgent signals get prompt care."
          : "This is a moment for professionals.",
      },
      ok: true,
    };
  }

  const accurate = data.answer === "prepared_not_panicked";
  return {
    data: {
      accurate,
      body: accurate
        ? "Most blood sugar changes are manageable. High and low have different signals, your care team's plan guides the response, and medical help is there whenever symptoms are severe or do not improve."
        : "Preparedness is not the same as fear, and independence is not the same as isolation. Most changes are manageable with your care team's plan, and asking for help early is part of good self-care.",
      heading: accurate
        ? "Prepared, calm, and supported."
        : "Let preparedness replace both panic and isolation.",
    },
    ok: true,
  };
}
