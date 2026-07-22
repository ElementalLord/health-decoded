"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const dayFourEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["body_handling", "food_created_diabetes", "glucose_is_bad"]),
      stage: z.literal("digestion"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["carbohydrate", "protein", "fat"]),
      stage: z.literal("nutrient"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["whole_fruit", "juice_same", "fiber_blocks_all"]),
      stage: z.literal("fiber"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["balanced_plate", "remove_carbs", "all_rice"]),
      stage: z.literal("plate"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["water", "regular_soda", "fruit_juice"]),
      stage: z.literal("drink"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["build_balance", "ban_carbs", "find_perfect"]),
      stage: z.literal("restaurant"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["myth", "more_accurate"]),
      statement: z.number().int().min(0).max(3),
      stage: z.literal("myth"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["food_with_context", "carbs_forbidden", "perfect_diet"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DayFourEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly heading: string;
  readonly whyOthers: readonly string[];
};

export type DayFourEvaluationResult =
  | { readonly ok: true; readonly data: DayFourEvaluationFeedback }
  | { readonly ok: false; readonly message: string };

const digestionFeedback: Record<
  "body_handling" | "food_created_diabetes" | "glucose_is_bad",
  DayFourEvaluationFeedback
> = {
  body_handling: {
    accurate: true,
    body: "Food supplies nutrients and energy. In Type 2 diabetes, the challenge is that insulin does not help the body manage glucose as effectively as before, not that eating food is a failure.",
    heading: "Food enters a body that is already working differently.",
    whyOthers: [
      "A meal does not create Type 2 diabetes at the moment it is eaten.",
      "Glucose is a normal fuel; the concern is how much remains in the blood and for how long.",
    ],
  },
  food_created_diabetes: {
    accurate: false,
    body: "Food affects glucose, but one meal does not create Type 2 diabetes. The condition involves insulin resistance and, over time, not enough insulin for the body’s needs.",
    heading: "The meal reveals the system; it did not create it.",
    whyOthers: [
      "Food still provides necessary energy and nutrients.",
      "The body’s insulin response is the missing context.",
    ],
  },
  glucose_is_bad: {
    accurate: false,
    body: "Glucose is one of the body’s fuels. It becomes a health concern when the body cannot keep blood-glucose levels in a healthy range over time.",
    heading: "Glucose has a job; it is not a moral category.",
    whyOthers: [
      "Carbohydrate-containing foods can remain part of an eating plan.",
      "Type 2 diabetes is about glucose regulation, not the existence of glucose.",
    ],
  },
};

const nutrientFeedback: Record<"carbohydrate" | "protein" | "fat", DayFourEvaluationFeedback> = {
  carbohydrate: {
    accurate: true,
    body: "Carbohydrates generally have the largest immediate effect because digestion breaks them into glucose. Amount, fiber, processing, and what is eaten with them can all shape the response.",
    heading: "Carbohydrate takes the lead in this part of the story.",
    whyOthers: [
      "Protein supports tissues and satisfaction and usually has a smaller immediate glucose effect.",
      "Fat supports energy and vitamin absorption and usually has a smaller immediate glucose effect.",
    ],
  },
  protein: {
    accurate: false,
    body: "Protein matters for nourishment and satisfaction, but carbohydrate generally affects blood glucose more immediately.",
    heading: "Protein plays a different part.",
    whyOthers: [
      "Many carbohydrates are digested into glucose.",
      "Fat also plays important roles without usually creating the same immediate rise.",
    ],
  },
  fat: {
    accurate: false,
    body: "Fat is an important nutrient, but carbohydrate generally has the largest immediate effect on blood glucose.",
    heading: "Fat belongs on the team, but not in this answer.",
    whyOthers: [
      "Many carbohydrates are digested into glucose.",
      "Protein usually has a smaller immediate glucose effect as well.",
    ],
  },
};

const fiberFeedback: Record<
  "whole_fruit" | "juice_same" | "fiber_blocks_all",
  DayFourEvaluationFeedback
> = {
  whole_fruit: {
    accurate: true,
    body: "Whole fruit contains fiber and structure that usually slow digestion compared with juice. Both contain carbohydrate, but they do not necessarily move through digestion at the same speed.",
    heading: "The whole fruit keeps more of the natural speed bumps.",
    whyOthers: [
      "Juice can enter the bloodstream more quickly because much of the fruit’s structure is gone.",
      "Fiber can slow digestion; it does not prevent every rise in blood glucose.",
    ],
  },
  juice_same: {
    accurate: false,
    body: "Whole fruit and juice both contain carbohydrate, but whole fruit usually keeps more fiber and structure, which can slow digestion.",
    heading: "The source may be similar; the journey can be different.",
    whyOthers: [
      "Liquid carbohydrate often moves through digestion more quickly.",
      "Fiber changes speed, not whether carbohydrate exists.",
    ],
  },
  fiber_blocks_all: {
    accurate: false,
    body: "Fiber can slow digestion and support fullness, but it does not make carbohydrate disappear or block every blood-glucose rise.",
    heading: "Fiber is a helper, not a force field.",
    whyOthers: [
      "Whole fruit still contains carbohydrate.",
      "Juice usually contains less fiber than the whole fruit it came from.",
    ],
  },
};

const plateFeedback: Record<
  "balanced_plate" | "remove_carbs" | "all_rice",
  DayFourEvaluationFeedback
> = {
  balanced_plate: {
    accurate: true,
    body: "The plate method makes room for nonstarchy vegetables, protein, and carbohydrate. It is a visual starting point, not a rigid plate prescription for every meal.",
    heading: "You added balance without banning the rice.",
    whyOthers: [
      "Removing all carbohydrate is not the goal of the plate method.",
      "A plate made mostly from one carb food leaves less room for other nutrients and balance.",
    ],
  },
  remove_carbs: {
    accurate: false,
    body: "The plate method keeps a quarter of the plate for carbohydrate foods. The goal is balance and proportion, not removal.",
    heading: "The rice can stay on the plate.",
    whyOthers: [
      "Nonstarchy vegetables commonly fill half the plate.",
      "Protein and carbohydrate commonly share the remaining half.",
    ],
  },
  all_rice: {
    accurate: false,
    body: "Rice can be part of the meal, but a plate made almost entirely from rice does not use the plate method’s balance of vegetables, protein, and carbohydrate.",
    heading: "One food is carrying the whole meal.",
    whyOthers: [
      "The method adds foods rather than labeling rice as bad.",
      "A balanced plate gives different nutrients distinct roles.",
    ],
  },
};

const drinkFeedback: Record<"water" | "regular_soda" | "fruit_juice", DayFourEvaluationFeedback> = {
  water: {
    accurate: true,
    body: "Water hydrates without adding carbohydrate or sugar. Unsweetened or other low-calorie drinks can also be everyday options depending on a person’s needs and preferences.",
    heading: "Water is the clearest everyday default.",
    whyOthers: [
      "Regular soda delivers sugar in liquid form without fiber.",
      "Fruit juice contains carbohydrate and usually less fiber than whole fruit.",
    ],
  },
  regular_soda: {
    accurate: false,
    body: "Regular soda can raise blood glucose quickly because its sugar is already dissolved and has no fiber to slow digestion.",
    heading: "This drink moves quickly.",
    whyOthers: [
      "Water adds hydration without carbohydrate.",
      "Juice contains nutrients but can still raise glucose quickly.",
    ],
  },
  fruit_juice: {
    accurate: false,
    body: "Juice can contain vitamins, but it also contains carbohydrate in liquid form and usually much less fiber than whole fruit.",
    heading: "Fruit and fruit juice are not the same format.",
    whyOthers: [
      "Water is the simplest everyday drink without carbohydrate.",
      "Regular soda also delivers carbohydrate quickly and does not supply fruit’s fiber.",
    ],
  },
};

const mythAnswers = ["myth", "myth", "myth", "more_accurate"] as const;
const mythBodies = [
  "People with diabetes can eat carbohydrate foods. Amount, quality, balance, medicines, and individual needs all matter.",
  "Whole fruit provides carbohydrate along with fiber, vitamins, minerals, and structure. It can fit into many eating plans.",
  "One meal does not erase an entire pattern. A celebration can belong in a life that also supports health.",
  "The plate method is a flexible visual guide. Meals, cuisines, budgets, and individual care plans can look different.",
] as const;

export async function evaluateDayFourAction(input: unknown): Promise<DayFourEvaluationResult> {
  const parsed = dayFourEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "We could not reveal that explanation right now." };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { ok: false, message: "Your session has ended. Please sign in again." };
  }

  const data = parsed.data;
  if (data.stage === "digestion") return { ok: true, data: digestionFeedback[data.answer] };
  if (data.stage === "nutrient") return { ok: true, data: nutrientFeedback[data.answer] };
  if (data.stage === "fiber") return { ok: true, data: fiberFeedback[data.answer] };
  if (data.stage === "plate") return { ok: true, data: plateFeedback[data.answer] };
  if (data.stage === "drink") return { ok: true, data: drinkFeedback[data.answer] };
  if (data.stage === "restaurant") {
    const accurate = data.answer === "build_balance";
    return {
      ok: true,
      data: {
        accurate,
        body: accurate
          ? "Looking for a vegetable, a protein, a carbohydrate portion, and a drink that fits your needs turns the plate method into a flexible restaurant question."
          : "Eating out does not require banning every carbohydrate or discovering one universally correct menu item. A few practical additions or portion choices can create more balance.",
        heading: accurate
          ? "You looked for a workable meal."
          : "A restaurant meal does not require an exact calculation.",
        whyOthers: [
          "Carbohydrate foods can remain part of the meal.",
          "There may be several reasonable choices rather than one flawless answer.",
        ],
      },
    };
  }
  if (data.stage === "myth") {
    const accurate = data.answer === mythAnswers[data.statement];
    return {
      ok: true,
      data: {
        accurate,
        body: mythBodies[data.statement]!,
        heading: accurate
          ? "That leaves room for real life."
          : "That rule is more rigid than the evidence.",
        whyOthers: [
          "Useful guidance explains context instead of dividing food into moral categories.",
          "Individual meal plans may differ, so general education should not become a personal prescription.",
        ],
      },
    };
  }

  const accurate = data.answer === "food_with_context";
  return {
    ok: true,
    data: {
      accurate,
      body: accurate
        ? "Carbohydrate foods affect blood glucose, but they can remain part of meals. Fiber, balance, portions, patterns, preferences, and a person’s care plan all add context."
        : "Diabetes nutrition is not a ban list or a competition for one correct diet. The useful skill is building informed, repeatable meals that fit a person’s life and care plan.",
      heading: accurate
        ? "That is food confidence in plain language."
        : "Bring flexibility back to the explanation.",
      whyOthers: [
        "Carbohydrates do not need to disappear.",
        "No single eating pattern is right for every person.",
      ],
    },
  };
}
