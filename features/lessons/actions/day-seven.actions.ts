"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const daySevenEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["individual_fit", "same_for_everyone", "replace_habits"]),
      stage: z.literal("personalization"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["contact_care_team", "stop_immediately", "double_next_dose"]),
      stage: z.literal("side_effect"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["tool_not_judgment", "proof_of_failure", "final_stage"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DaySevenEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly details: readonly string[];
  readonly heading: string;
};

export type DaySevenEvaluationResult =
  | { readonly data: DaySevenEvaluationFeedback; readonly ok: true }
  | { readonly message: string; readonly ok: false };

export async function evaluateDaySevenAction(input: unknown): Promise<DaySevenEvaluationResult> {
  const parsed = daySevenEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "We could not reveal that explanation right now.", ok: false };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { message: "Your session has ended. Please sign in again.", ok: false };
  }

  const data = parsed.data;
  if (data.stage === "personalization") {
    const accurate = data.answer === "individual_fit";
    return {
      data: {
        accurate,
        body: accurate
          ? "Medication choice is individualized. A clinician considers glucose patterns, heart and kidney health, other medicines, side effects, cost, and what matters to the person."
          : "There is no single diabetes medicine that fits every person, and medicine does not replace food, movement, sleep, or other parts of care.",
        details: [
          "Metformin is common, but it is not automatic or universal.",
          "A treatment plan can change as the person’s needs and evidence change.",
        ],
        heading: accurate
          ? "The plan is fitted—not assigned as a grade."
          : "Bring the person back into the plan.",
      },
      ok: true,
    };
  }

  if (data.stage === "side_effect") {
    const accurate = data.answer === "contact_care_team";
    return {
      data: {
        accurate,
        body: accurate
          ? "Side effects and worries belong in a conversation with the prescribing care team. They can help decide what the symptom means and whether the plan should change."
          : "Do not stop, skip, double, or otherwise change a prescribed medicine on your own. Contact the prescribing care team for guidance.",
        details: [
          "Urgent or severe symptoms need prompt medical help.",
          "General education cannot decide whether a personal prescription should change.",
        ],
        heading: accurate
          ? "A question is part of safe care."
          : "Pause before changing the prescription.",
      },
      ok: true,
    };
  }

  const accurate = data.answer === "tool_not_judgment";
  return {
    data: {
      accurate,
      body: accurate
        ? "Medication is one tool that can support the body. Needing it is not a moral verdict, and insulin is treatment—not punishment or proof of failure."
        : "Day 7 releases the idea that treatment measures worth. Medicines, including insulin, are tools chosen for what the body needs.",
      details: [
        "Healthy habits and medication can work together.",
        "Know the medicine’s name, why it was chosen, and what questions to bring to the care team.",
      ],
      heading: accurate ? "That is the heart of Day 7." : "Keep the tool; release the judgment.",
    },
    ok: true,
  };
}
