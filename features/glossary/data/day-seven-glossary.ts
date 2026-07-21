import type { GlossaryEntry } from "@/features/glossary/data/day-two-glossary";

export const daySevenGlossary: readonly GlossaryEntry[] = [
  {
    definition: "A medicine often used early in Type 2 diabetes care.",
    id: "glossary-metformin-day-seven",
    simpleExplanation:
      "Metformin commonly helps the liver release less glucose and can help the body respond to insulin. It is common, but it is not the right choice for every person.",
    term: "Metformin",
  },
  {
    definition: "An unwanted effect that can happen while taking a medicine.",
    id: "glossary-side-effect-day-seven",
    simpleExplanation:
      "A side effect is information to discuss with the prescribing care team. Do not change a prescribed medicine on your own.",
    term: "Side effect",
  },
  {
    definition: "Taking a medicine as agreed with the healthcare team.",
    id: "glossary-adherence-day-seven",
    simpleExplanation:
      "Real-life routines, cost, side effects, access, memory, and preferences can all affect adherence. Difficulties deserve problem-solving, not blame.",
    term: "Adherence",
  },
  {
    definition: "Blood glucose that has fallen below a safe level.",
    id: "glossary-hypoglycemia-day-seven",
    simpleExplanation:
      "Insulin and some medicines that increase insulin release can raise low-glucose risk. A person’s care team should explain their individual risk and safety plan.",
    term: "Hypoglycemia",
  },
  {
    definition: "A diabetes medicine that helps the kidneys release some glucose through urine.",
    id: "glossary-sglt2-day-seven",
    simpleExplanation:
      "Some medicines in this group may also offer heart or kidney benefits for certain people. The choice depends on the individual clinical picture.",
    term: "SGLT2 inhibitor",
  },
  {
    definition: "A medicine that works through incretin-related pathways.",
    id: "glossary-glp1-day-seven",
    simpleExplanation:
      "These medicines can affect glucose regulation, digestion, appetite, and fullness. Some may offer heart benefits for certain people.",
    term: "GLP-1 receptor agonist",
  },
] as const;
