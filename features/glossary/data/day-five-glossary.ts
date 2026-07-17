import type { GlossaryEntry } from "@/features/glossary/data/day-two-glossary";

export const dayFiveGlossary: readonly GlossaryEntry[] = [
  {
    definition: "Any body movement that uses energy.",
    id: "glossary-physical-activity",
    simpleExplanation:
      "Walking, household tasks, dancing, gardening, adapted seated movement, and planned exercise can all be physical activity.",
    term: "Physical activity",
  },
  {
    definition: "Planned physical activity done to support fitness, function, or health.",
    id: "glossary-exercise",
    simpleExplanation:
      "Exercise is one kind of physical activity. Movement does not have to be a formal workout to count.",
    term: "Exercise",
  },
  {
    definition: "How effectively the body’s cells respond to insulin.",
    id: "glossary-insulin-sensitivity",
    simpleExplanation:
      "Regular physical activity can improve insulin sensitivity, helping available insulin send its signal more effectively.",
    term: "Insulin sensitivity",
  },
  {
    definition: "Activity that raises heart rate and breathing for a period of time.",
    id: "glossary-aerobic-activity",
    simpleExplanation:
      "Walking, cycling, swimming, and dancing are common examples. The activity can be adapted to the person.",
    term: "Aerobic activity",
  },
  {
    definition: "Activity that makes muscles work against resistance.",
    id: "glossary-strength-training",
    simpleExplanation:
      "Resistance bands, weights, wall push-ups, and adapted bodyweight movements are examples.",
    term: "Strength training",
  },
  {
    definition: "Time spent sitting, reclining, or otherwise moving very little while awake.",
    id: "glossary-sedentary-time",
    simpleExplanation:
      "Brief standing or movement breaks can interrupt long periods of sitting when they are safe and possible.",
    term: "Sedentary time",
  },
  {
    definition: "A brief period of movement after eating.",
    id: "glossary-post-meal-movement",
    simpleExplanation:
      "A comfortable walk is one option. It can help working muscles use fuel, but it does not guarantee a specific glucose result.",
    term: "Post-meal movement",
  },
] as const;
