"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const dayThirteenEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["name_impact", "prove_worth", "stay_silent"]),
      stage: z.literal("stigma_myth"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["ask_first", "monitor_choices", "take_over"]),
      stage: z.literal("support_or_control"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["clear_boundary", "full_defense", "accept_commentary"]),
      stage: z.literal("boundary"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["simple_request", "skip_silently", "share_everything"]),
      stage: z.literal("workplace_request"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["respects_choice", "controls_choices", "avoids_topic"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DayThirteenEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly heading: string;
};

export type DayThirteenEvaluationResult =
  | { readonly data: DayThirteenEvaluationFeedback; readonly ok: true }
  | { readonly message: string; readonly ok: false };

export async function evaluateDayThirteenAction(
  input: unknown,
): Promise<DayThirteenEvaluationResult> {
  const parsed = dayThirteenEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { message: "We could not reveal that explanation right now.", ok: false };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { message: "Your session has ended. Please sign in again.", ok: false };
  }

  const data = parsed.data;

  if (data.stage === "stigma_myth") {
    const accurate = data.answer === "name_impact";
    return {
      data: {
        accurate,
        body: accurate
          ? "Naming the impact keeps the response grounded in what happened. A limit can be brief, and the person affected gets to decide whether education, distance, or ending the conversation is right for them."
          : "A person does not owe a full medical defense, and good intentions do not erase impact. They can name what landed, set a boundary, and choose how much conversation to offer.",
        heading: accurate
          ? "Impact named; choice preserved."
          : "The response still belongs to the person affected.",
      },
      ok: true,
    };
  }

  if (data.stage === "support_or_control") {
    const accurate = data.answer === "ask_first";
    return {
      data: {
        accurate,
        body: accurate
          ? "Yes. Asking first protects the person's independence and makes room for the kind of help they actually want. Support joins the plan; it does not seize the steering wheel."
          : "Watching, correcting, or deciding for someone can turn concern into surveillance. A more supportive first move is to ask what would help, listen to the answer, and respect a no.",
        heading: accurate ? "Support begins with permission." : "Concern still needs consent.",
      },
      ok: true,
    };
  }

  if (data.stage === "boundary") {
    const accurate = data.answer === "clear_boundary";
    return {
      data: {
        accurate,
        body: accurate
          ? "Right. The response acknowledges concern, names the limit, and points toward the care plan without inviting a debate. A boundary can be both warm and firm."
          : "You do not owe a full medical defense, and repeated commentary does not become helpful because someone means well. A short, respectful limit can protect both your peace and the relationship.",
        heading: accurate
          ? "Clear is kind to both people."
          : "A shorter boundary can carry more calm.",
      },
      ok: true,
    };
  }

  if (data.stage === "workplace_request") {
    const accurate = data.answer === "simple_request";
    return {
      data: {
        accurate,
        body: accurate
          ? "Exactly. The request shares only what is useful: the timing need and a workable alternative. People can choose how much health information to disclose; support does not require telling everyone everything."
          : "Silence can leave the practical need invisible, while sharing every detail may be more than the person wants. A brief request can explain what is needed without surrendering privacy.",
        heading: accurate
          ? "Specific need, chosen amount of detail."
          : "Disclosure can stay small and purposeful.",
      },
      ok: true,
    };
  }

  const accurate = data.answer === "respects_choice";
  return {
    data: {
      accurate,
      body: accurate
        ? "That is the heart of this lesson. Helpful support listens, asks, respects the person's choices, and offers practical help without blame. It can make care lighter without taking it over."
        : "Support is not control, and it is not pretending diabetes never exists. The useful middle is respectful involvement: ask, listen, offer, and check what still fits.",
      heading: accurate
        ? "You can explain support without surrendering independence."
        : "Bring choice back into the definition.",
    },
    ok: true,
  };
}
