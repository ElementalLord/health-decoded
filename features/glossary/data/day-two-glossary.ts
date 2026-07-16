export type GlossaryEntry = {
  readonly definition: string;
  readonly id: string;
  readonly simpleExplanation: string;
  readonly term: string;
};

export const dayTwoGlossary: readonly GlossaryEntry[] = [
  {
    definition: "A type of sugar the body uses for energy.",
    id: "glossary-glucose",
    simpleExplanation: "Glucose travels through the blood so cells can use or store it.",
    term: "Glucose",
  },
  {
    definition: "A hormone made by the pancreas that helps the body manage glucose.",
    id: "glossary-insulin",
    simpleExplanation:
      "Insulin sends signals that help many cells take in glucose and helps control how much glucose the liver releases.",
    term: "Insulin",
  },
  {
    definition:
      "A condition in which cells do not respond to insulin as effectively as they should.",
    id: "glossary-insulin-resistance",
    simpleExplanation: "The body needs more insulin to produce the same glucose-managing response.",
    term: "Insulin resistance",
  },
  {
    definition:
      "An organ that makes insulin and other substances involved in digestion and blood-glucose regulation.",
    id: "glossary-pancreas",
    simpleExplanation: "For this lesson, the pancreas matters because it makes insulin.",
    term: "Pancreas",
  },
  {
    definition: "An organ that stores and releases glucose as part of the body’s energy system.",
    id: "glossary-liver",
    simpleExplanation:
      "The liver can release glucose between meals and overnight. In Type 2 diabetes, it may release more glucose than the body can manage effectively.",
    term: "Liver",
  },
  {
    definition: "A basic living unit that makes up the body’s tissues and organs.",
    id: "glossary-cell",
    simpleExplanation: "Many cells use glucose for energy.",
    term: "Cell",
  },
  {
    definition:
      "A chemical messenger made in the body that sends signals to other cells or organs.",
    id: "glossary-hormone",
    simpleExplanation: "Insulin is a hormone because it carries instructions through the body.",
    term: "Hormone",
  },
] as const;
