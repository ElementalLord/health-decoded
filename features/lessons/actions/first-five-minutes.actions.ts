"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const predictionSchema = z
  .object({
    answer: z.enum(["yes", "not_sure", "no"]),
    prediction: z.enum(["self_blame", "symptoms"]),
  })
  .strict();

export type PredictionReveal = {
  readonly body: string;
  readonly heading: string;
};

export type RevealPredictionResult =
  | { readonly ok: true; readonly data: PredictionReveal }
  | { readonly ok: false; readonly message: string };

const selfBlameReveal: PredictionReveal = {
  body: "Type 2 diabetes is a medical condition. Many things can affect whether it develops, including family history, age, biology, environment, and access to care.",
  heading: "No. This diagnosis is not a report card.",
};

const symptomReveal: PredictionReveal = {
  body: "Many people feel completely normal when they are diagnosed. That is why blood tests matter, even when someone does not feel sick.",
  heading: "Actually, people do not always feel it.",
};

export async function revealPredictionAction(input: unknown): Promise<RevealPredictionResult> {
  const parsed = predictionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "We could not reveal that idea right now." };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { ok: false, message: "Your session has ended. Please sign in again." };
  }

  return {
    ok: true,
    data: parsed.data.prediction === "self_blame" ? selfBlameReveal : symptomReveal,
  };
}
