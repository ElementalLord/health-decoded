import type { GlossaryEntry } from "@/features/glossary/data/day-two-glossary";

export const daySixGlossary: readonly GlossaryEntry[] = [
  {
    definition: "A brief period of physical activity rather than one long session.",
    id: "glossary-movement-bout",
    simpleExplanation:
      "A short walk, a few minutes of seated movement, or another brief activity can be one movement bout. Smaller bouts can be spread across a day.",
    term: "Movement bout",
  },
  {
    definition: "Interrupting a long period of sitting with standing or movement.",
    id: "glossary-sitting-break",
    simpleExplanation:
      "A sitting break can be brief and adapted. It gives muscles another chance to work without turning the moment into a full workout.",
    term: "Sitting break",
  },
  {
    definition: "A familiar event used as a reminder for a new behavior.",
    id: "glossary-habit-anchor",
    simpleExplanation:
      "Examples include finishing breakfast, ending a phone call, or starting an evening routine. The anchor helps answer, ‘When will I remember?’",
    term: "Habit anchor",
  },
  {
    definition: "A smaller or adapted version of the original plan used when circumstances change.",
    id: "glossary-backup-plan",
    simpleExplanation:
      "Rain, pain, energy, work, caregiving, or an unexpected day can change the plan. A backup keeps one possible action available without demanding perfection.",
    term: "Backup plan",
  },
  {
    definition: "Light or comfortable activity performed after eating.",
    id: "glossary-post-meal-movement-day-six",
    simpleExplanation:
      "A walk is one example. Working muscles can use glucose, but the activity does not erase the meal or guarantee a particular glucose reading.",
    term: "Post-meal movement",
  },
  {
    definition: "How effectively cells respond to insulin.",
    id: "glossary-insulin-sensitivity-day-six",
    simpleExplanation:
      "Regular physical activity can improve insulin sensitivity. This can help available insulin send its signal more effectively over time.",
    term: "Insulin sensitivity",
  },
] as const;
