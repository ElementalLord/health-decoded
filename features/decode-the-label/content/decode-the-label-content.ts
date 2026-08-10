import type {
  DecodeLabelQuestion,
  NutritionLabel,
} from "@/features/decode-the-label/types/decode-the-label";

export const crackerLabel = {
  name: "Whole Grain Crackers",
  servingSize: "16 crackers (30g)",
  servingsPerContainer: "about 5",
  calories: "140",
  totalFat: "4g",
  saturatedFat: "0.5g",
  sodium: "210mg",
  totalCarbohydrate: "22g",
  dietaryFiber: "4g",
  totalSugars: "3g",
  addedSugars: "2g",
  protein: "3g",
} as const satisfies NutritionLabel;

export const plainYogurtLabel = {
  name: "Plain Greek Yogurt",
  servingSize: "3/4 cup",
  calories: "120",
  totalCarbohydrate: "7g",
  dietaryFiber: "0g",
  addedSugars: "0g",
  protein: "16g",
} as const satisfies NutritionLabel;

export const fruitYogurtLabel = {
  name: "Fruit-Flavored Yogurt",
  servingSize: "3/4 cup",
  calories: "150",
  totalCarbohydrate: "19g",
  dietaryFiber: "0g",
  addedSugars: "12g",
  protein: "10g",
} as const satisfies NutritionLabel;

export const decodeLabelQuestions = [
  {
    id: "DTL-Q01",
    section: "warm-up",
    prompt: "Where would you find the serving size?",
    choices: [
      { id: "top", label: "Near the top of the nutrition label" },
      { id: "middle", label: "In the middle, beside total carbohydrate" },
      { id: "bottom", label: "At the bottom, below protein" },
    ],
    correctChoiceId: "top",
    correctFeedback:
      "Correct. Serving size appears near the top because every number below it is based on that amount.",
    incorrectFeedback:
      "Not quite. Look near the top of the label. Serving size comes before calories and the nutrient lines.",
  },
  {
    id: "DTL-Q02",
    section: "warm-up",
    prompt: "Which number shows the total carbohydrate in one serving?",
    choices: [
      { id: "22g", label: "22g" },
      { id: "4g", label: "4g" },
      { id: "3g", label: "3g" },
      { id: "210mg", label: "210mg" },
    ],
    correctChoiceId: "22g",
    correctFeedback:
      "Correct. Total carbohydrate is one useful place to start when learning how a food may fit into an eating plan.",
    incorrectFeedback: "Not quite. The line labeled Total Carbohydrate shows 22g for one serving.",
  },
  {
    id: "DTL-Q03",
    section: "warm-up",
    prompt: "How much fiber is in one serving?",
    choices: [
      { id: "0.5g", label: "0.5g" },
      { id: "2g", label: "2g" },
      { id: "4g", label: "4g" },
      { id: "22g", label: "22g" },
    ],
    correctChoiceId: "4g",
    correctFeedback: "Correct. This label lists 4g of dietary fiber in one serving.",
    incorrectFeedback:
      "Not quite. Dietary Fiber sits beneath Total Carbohydrate, and this label lists 4g.",
  },
  {
    id: "DTL-Q04",
    section: "warm-up",
    prompt: "Which line tells you how much sugar was added during processing?",
    choices: [
      { id: "total-sugars", label: "Total Sugars" },
      { id: "added-sugars", label: "Includes Added Sugars" },
      { id: "total-carbohydrate", label: "Total Carbohydrate" },
      { id: "calories", label: "Calories" },
    ],
    correctChoiceId: "added-sugars",
    correctFeedback:
      "Correct. Includes Added Sugars identifies sugar added during processing, rather than all sugars in the food.",
    incorrectFeedback: "Not quite. Look for the indented line labeled Includes Added Sugars.",
  },
  {
    id: "DTL-Q05",
    section: "warm-up",
    prompt: "If all the numbers are based on one serving, why does serving size matter?",
    choices: [
      {
        id: "amount",
        label: "Eating more or less changes how much of each nutrient you are actually getting",
      },
      { id: "quality", label: "It decides whether the food is healthy" },
      { id: "package", label: "It always describes the whole package" },
    ],
    correctChoiceId: "amount",
    correctFeedback:
      "Exactly. The label is a reference amount. What you eat may be more, less, or the same as that serving.",
    incorrectFeedback:
      "Not quite. Serving size matters because eating more or less changes the amount of every listed nutrient you get.",
  },
  {
    id: "DTL-Q06",
    section: "concept",
    prompt:
      "If you only have time to notice one carbohydrate-related line first, which one is usually the most useful starting point?",
    choices: [
      { id: "added-sugars", label: "Added sugars" },
      { id: "total-carbohydrate", label: "Total carbohydrate" },
      { id: "protein", label: "Protein" },
      { id: "sodium", label: "Sodium" },
    ],
    correctChoiceId: "total-carbohydrate",
    correctFeedback:
      "Correct. Total carbohydrate includes the carbohydrate types listed beneath it, so it gives the broadest starting point.",
    incorrectFeedback:
      "Not quite. Added sugars can be useful context, but Total Carbohydrate is usually the broader first line to notice.",
  },
  {
    id: "DTL-Q07",
    section: "concept",
    prompt: "True or false: A food with some added sugar is automatically off-limits.",
    choices: [
      { id: "true", label: "True" },
      { id: "false", label: "False" },
    ],
    correctChoiceId: "false",
    correctFeedback:
      "Correct. A label helps you understand a food. It does not divide foods into perfect and forbidden categories.",
    incorrectFeedback:
      "The best answer is false. Added sugar is useful information, but it does not automatically make a food off-limits.",
  },
  {
    id: "DTL-Q08",
    section: "concept",
    prompt: "Which statement is most accurate?",
    choices: [
      { id: "sugar-only", label: "Added sugars are the only thing that matters" },
      {
        id: "carb-start",
        label: "Total carbohydrate is often a better starting point than sugar alone",
      },
      { id: "fiber-never", label: "Fiber never matters" },
      { id: "protein-same", label: "Protein tells you the same thing as carbohydrate" },
    ],
    correctChoiceId: "carb-start",
    correctFeedback:
      "Correct. Start with total carbohydrate, then use fiber, added sugars, and protein for more context.",
    incorrectFeedback:
      "Not quite. Total carbohydrate is often the better starting point, with fiber, added sugars, and protein adding context.",
  },
  {
    id: "DTL-Q09",
    section: "comparison",
    prompt: "Which yogurt has more total carbohydrate per serving?",
    choices: [
      { id: "plain", label: "Plain Greek Yogurt" },
      { id: "fruit", label: "Fruit-Flavored Yogurt" },
      { id: "same", label: "They have the same amount" },
    ],
    correctChoiceId: "fruit",
    correctFeedback:
      "Correct. The fruit-flavored yogurt lists 19g, compared with 7g in the plain yogurt.",
    incorrectFeedback:
      "Look again at Total Carbohydrate. The fruit-flavored yogurt lists 19g per serving.",
  },
  {
    id: "DTL-Q10",
    section: "comparison",
    prompt: "Which yogurt has more protein per serving?",
    choices: [
      { id: "plain", label: "Plain Greek Yogurt" },
      { id: "fruit", label: "Fruit-Flavored Yogurt" },
      { id: "same", label: "They have the same amount" },
    ],
    correctChoiceId: "plain",
    correctFeedback:
      "Correct. The plain yogurt lists 16g of protein, compared with 10g in the fruit-flavored yogurt.",
    incorrectFeedback:
      "Look at the Protein line on both labels. The plain yogurt lists the larger amount: 16g.",
  },
  {
    id: "DTL-Q11",
    section: "comparison",
    prompt: "Which yogurt has more added sugar?",
    choices: [
      { id: "plain", label: "Plain Greek Yogurt" },
      { id: "fruit", label: "Fruit-Flavored Yogurt" },
      { id: "same", label: "They have the same amount" },
    ],
    correctChoiceId: "fruit",
    correctFeedback:
      "Correct. The fruit-flavored yogurt lists 12g of added sugar, while the plain yogurt lists 0g.",
    incorrectFeedback: "Look at Added Sugars on both labels. The fruit-flavored yogurt lists 12g.",
  },
  {
    id: "DTL-Q12",
    section: "comparison",
    prompt: "Which explanation is best?",
    choices: [
      { id: "bad", label: "The fruit-flavored yogurt is bad" },
      { id: "always", label: "The plain yogurt automatically fits everyone better" },
      {
        id: "context",
        label:
          "The labels show useful differences, but the better choice depends on the situation and how the food fits into the meal",
      },
      { id: "sugar-only", label: "Added sugar is the only thing that matters" },
    ],
    correctChoiceId: "context",
    correctFeedback:
      "Exactly. Labels provide context for a choice. They do not make the choice for every person or every situation.",
    incorrectFeedback:
      "The labels show meaningful differences, but no single line can decide what fits every person or situation.",
  },
] as const satisfies readonly DecodeLabelQuestion[];

export const decodeLabelSectionLabels = {
  "warm-up": "Read one label",
  concept: "What matters first",
  comparison: "Compare with context",
} as const;
