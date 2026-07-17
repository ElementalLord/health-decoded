import type { GlossaryEntry } from "@/features/glossary/data/day-two-glossary";

export const dayFourGlossary: readonly GlossaryEntry[] = [
  {
    definition:
      "A nutrient found in foods such as grains, fruit, milk, beans, and starchy vegetables.",
    id: "glossary-carbohydrate",
    simpleExplanation:
      "The body breaks many carbohydrates into glucose. Carbohydrate amount, type, and meal context can shape the blood-glucose response.",
    term: "Carbohydrate",
  },
  {
    definition: "A type of carbohydrate in plant foods that the body does not fully digest.",
    id: "glossary-fiber",
    simpleExplanation:
      "Fiber supports digestion and fullness and can slow how quickly a meal’s carbohydrate is absorbed.",
    term: "Fiber",
  },
  {
    definition: "Vegetables that generally contain less starch and carbohydrate per serving.",
    id: "glossary-nonstarchy-vegetables",
    simpleExplanation:
      "Examples include leafy greens, broccoli, peppers, cucumbers, and green beans.",
    term: "Nonstarchy vegetables",
  },
  {
    definition:
      "Grains processed to remove parts of the original grain, including much of its fiber.",
    id: "glossary-refined-grains",
    simpleExplanation:
      "White bread and white rice are common examples. They are not forbidden, but they often contain less fiber than whole-grain versions.",
    term: "Refined grains",
  },
  {
    definition: "A visual meal-planning guide using sections of a roughly nine-inch plate.",
    id: "glossary-plate-method",
    simpleExplanation:
      "A common starting point is half nonstarchy vegetables, one quarter protein, and one quarter carbohydrate foods.",
    term: "Plate method",
  },
  {
    definition: "A meal that includes more than one nutrient or food group in useful proportions.",
    id: "glossary-balanced-meal",
    simpleExplanation:
      "Balance adds nourishment and context. It does not require every meal to look identical or perfect.",
    term: "Balanced meal",
  },
  {
    definition: "A drink with added or naturally occurring sugars that contribute carbohydrate.",
    id: "glossary-sugary-drink",
    simpleExplanation:
      "Liquid carbohydrate can raise blood glucose quickly because it usually contains little fiber.",
    term: "Sugar-sweetened drink",
  },
] as const;
