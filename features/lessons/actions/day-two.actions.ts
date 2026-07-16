"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const dayTwoEvaluationSchema = z.discriminatedUnion("stage", [
  z.object({ answer: z.enum(["A", "B", "C"]), stage: z.literal("connection") }).strict(),
  z
    .object({ answer: z.enum(["insulin", "oxygen", "cholesterol"]), stage: z.literal("glucose") })
    .strict(),
  z.object({ answer: z.enum(["A", "B", "C"]), stage: z.literal("resistance") }).strict(),
  z
    .object({
      order: z.array(z.enum(["A", "B", "C", "D", "E"])).length(5),
      stage: z.literal("process"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["too_simple", "more_accurate"]),
      statement: z.number().int().min(0).max(3),
      stage: z.literal("cause"),
    })
    .strict(),
  z.object({ answer: z.enum(["A", "B", "C"]), stage: z.literal("teach_back") }).strict(),
]);

export type DayTwoEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly heading: string;
};

export type DayTwoEvaluationResult =
  | { readonly ok: true; readonly data: DayTwoEvaluationFeedback }
  | { readonly ok: false; readonly message: string };

const connectionFeedback: Record<"A" | "B" | "C", DayTwoEvaluationFeedback> = {
  A: {
    accurate: true,
    body: "The challenge in Type 2 diabetes is not that glucose has no purpose. It is that too much remains in the blood instead of being managed effectively.",
    heading: "Glucose is a source of energy.",
  },
  B: {
    accurate: false,
    body: "Glucose is not simply a waste product. It is an important source of energy for the body.",
    heading: "Here is the connection.",
  },
  C: {
    accurate: false,
    body: "The pancreas does not make glucose as a medicine. The pancreas makes insulin, which helps the body manage glucose.",
    heading: "This idea is easy to mix up.",
  },
};

const resistanceFeedback: Record<"A" | "B" | "C", DayTwoEvaluationFeedback> = {
  A: {
    accurate: true,
    body: "For a time, the body may work harder behind the scenes. A person may have no idea this is happening.",
    heading: "The pancreas may respond by making more insulin.",
  },
  B: {
    accurate: false,
    body: "The pancreas cannot stop all glucose from entering the blood. Glucose is also an important source of energy.",
    heading: "Let’s look at the system again.",
  },
  C: {
    accurate: false,
    body: "The body does not manage glucose by turning it into oxygen.",
    heading: "Here is the connection.",
  },
};

const causeAnswers = ["too_simple", "more_accurate", "too_simple", "more_accurate"] as const;
const causeFeedback = [
  "One food or meal does not explain a condition that usually develops over time.",
  "Food matters, but it is only one part of the body’s glucose system.",
  "Body size can relate to risk, but people across a range of body sizes can develop Type 2 diabetes.",
  "Food, movement, medication, and monitoring will make more sense once you understand the system they affect.",
] as const;

export async function evaluateDayTwoAction(input: unknown): Promise<DayTwoEvaluationResult> {
  const parsed = dayTwoEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "We could not reveal that connection right now." };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { ok: false, message: "Your session has ended. Please sign in again." };
  }

  const data = parsed.data;
  if (data.stage === "connection") return { ok: true, data: connectionFeedback[data.answer] };
  if (data.stage === "glucose") {
    return {
      ok: true,
      data:
        data.answer === "insulin"
          ? {
              accurate: true,
              body: "Insulin sends signals that help many cells take in and use glucose.",
              heading: "Insulin helps glucose move into many cells.",
            }
          : {
              accurate: false,
              body:
                data.answer === "oxygen"
                  ? "Oxygen is important for energy, but insulin is the signal that helps many cells take in glucose."
                  : "Cholesterol has other roles in the body. Insulin is the signal that helps many cells take in glucose.",
              heading: "The main distinction is insulin.",
            },
    };
  }
  if (data.stage === "resistance") return { ok: true, data: resistanceFeedback[data.answer] };
  if (data.stage === "process") {
    const accurate = data.order.join("") === "ABCDE";
    return {
      ok: true,
      data: accurate
        ? {
            accurate: true,
            body: "The assembled steps show how reduced insulin response can increase the demand placed on the pancreas.",
            heading: "That is the basic pattern.",
          }
        : {
            accurate: false,
            body: "Cells usually become less responsive before the pancreas has trouble meeting the increased insulin demand.",
            heading: "Two parts need another look.",
          },
    };
  }
  if (data.stage === "cause") {
    const accurate = data.answer === causeAnswers[data.statement];
    return {
      ok: true,
      data: {
        accurate,
        body: causeFeedback[data.statement]!,
        heading: accurate ? "Here is the connection." : "This explanation is too simple.",
      },
    };
  }

  const teachBackFeedback: Record<"A" | "B" | "C", DayTwoEvaluationFeedback> = {
    A: {
      accurate: true,
      body: "Type 2 diabetes can involve both reduced response to insulin and an insulin supply that no longer meets the body’s needs.",
      heading: "That is the central idea.",
    },
    B: {
      accurate: false,
      body: "Your body still uses glucose for energy. The problem is that glucose is not being managed as effectively as it should be.",
      heading: "The main distinction is how glucose is managed.",
    },
    C: {
      accurate: false,
      body: "One food does not permanently turn off insulin. Type 2 diabetes usually develops gradually through several interacting factors.",
      heading: "This did not happen because of one food.",
    },
  };
  return { ok: true, data: teachBackFeedback[data.answer] };
}
