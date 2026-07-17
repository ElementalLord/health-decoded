import type { GlossaryEntry } from "@/features/glossary/data/day-two-glossary";

export const dayThreeGlossary: readonly GlossaryEntry[] = [
  {
    definition:
      "The amount, or concentration, of glucose present in the blood at a particular time.",
    id: "glossary-blood-glucose",
    simpleExplanation:
      "A blood-glucose test is a snapshot. The result can change as the body responds to food, movement, stress, illness, sleep, and medicine.",
    term: "Blood glucose",
  },
  {
    definition:
      "A blood test that estimates average glucose exposure over roughly the previous two to three months.",
    id: "glossary-a1c",
    simpleExplanation:
      "A1C looks at the percentage of hemoglobin with glucose attached. It is a wider window, not today’s live reading.",
    term: "A1C",
  },
  {
    definition: "A protein inside red blood cells that carries oxygen.",
    id: "glossary-hemoglobin",
    simpleExplanation:
      "Glucose can attach to hemoglobin while red blood cells circulate, which is what an A1C test measures.",
    term: "Hemoglobin",
  },
  {
    definition: "A blood-glucose test taken after a period without food, usually overnight.",
    id: "glossary-fasting-glucose",
    simpleExplanation:
      "This test gives a point-in-time reading under a more standardized condition: before eating that morning.",
    term: "Fasting glucose",
  },
  {
    definition:
      "A blood-glucose test taken at the time of testing without a required fasting period.",
    id: "glossary-random-glucose",
    simpleExplanation:
      "It is another snapshot. Timing, symptoms, and clinical context matter when a healthcare professional interprets it.",
    term: "Random glucose",
  },
  {
    definition:
      "A level used by clinicians as part of deciding whether results meet criteria for a condition.",
    id: "glossary-diagnostic-threshold",
    simpleExplanation:
      "A diagnostic threshold is not automatically a personal treatment goal and is not a grade.",
    term: "Diagnostic threshold",
  },
  {
    definition: "A repeated shape or tendency that becomes visible across more than one result.",
    id: "glossary-pattern",
    simpleExplanation:
      "Patterns place numbers beside timing and context. They are often more useful than focusing on one highest or lowest result.",
    term: "Pattern",
  },
] as const;
