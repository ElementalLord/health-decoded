import type { AiCredibleSource } from "@/features/ai/types/ai";

export type AiCredibleSourceContext = AiCredibleSource & {
  readonly summary: string;
};

const sources = {
  a1c: {
    href: "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test",
    organization: "NIDDK",
    summary:
      "The A1C test reflects average blood glucose over roughly the past three months and is used for diabetes diagnosis and management.",
    title: "The A1C Test & Diabetes",
  },
  basics: {
    href: "https://www.cdc.gov/diabetes/about/",
    organization: "CDC",
    summary:
      "Diabetes affects how the body turns food into energy; insulin helps glucose enter cells, and diabetes can involve too little insulin or reduced response to it.",
    title: "Diabetes Basics",
  },
  exercise: {
    href: "https://www.cdc.gov/diabetes/living-with/physical-activity.html",
    organization: "CDC",
    summary:
      "Regular physical activity is an important part of diabetes management and can help the body use insulin more effectively.",
    title: "Get Active",
  },
  healthyLiving: {
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/healthy-living-with-diabetes",
    organization: "NIDDK",
    summary:
      "Healthy living with diabetes includes sustainable eating, physical activity, sleep, and weight-management habits tailored with a health care team when needed.",
    title: "Healthy Living with Diabetes",
  },
  insulinResistance: {
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance",
    organization: "NIDDK",
    summary:
      "Insulin resistance occurs when cells do not respond well to insulin, which can contribute to higher blood glucose and prediabetes.",
    title: "Insulin Resistance & Prediabetes",
  },
  medicines: {
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments",
    organization: "NIDDK",
    summary:
      "Diabetes medicines work in different ways; metformin generally reduces glucose made by the liver and helps the body use insulin better.",
    title: "Insulin, Medicines, & Other Diabetes Treatments",
  },
  nutrition: {
    href: "https://www.cdc.gov/diabetes/healthy-eating/",
    organization: "CDC",
    summary:
      "Food choices and meal patterns can affect blood glucose, and healthy eating is a core part of living well with diabetes.",
    title: "Healthy Eating",
  },
  overview: {
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview",
    organization: "NIDDK",
    summary:
      "Diabetes occurs when blood glucose is too high; the NIDDK overview covers causes, testing, management, healthy living, and prevention of complications.",
    title: "Diabetes Overview",
  },
} as const satisfies Record<string, AiCredibleSourceContext>;

function uniqueSources(selected: readonly AiCredibleSourceContext[]) {
  return [...new Map(selected.map((source) => [source.href, source])).values()].slice(0, 3);
}

/** Selects authoritative patient-education references relevant to a general question. */
export function credibleSourcesForQuestion(message: string): readonly AiCredibleSourceContext[] {
  const normalized = message.toLocaleLowerCase();

  if (/\b(a1c|hba1c|hemoglobin a1c)\b/.test(normalized)) {
    return uniqueSources([sources.a1c, sources.overview, sources.basics]);
  }
  if (/\b(metformin|insulin|medicine|medication|drug)\b/.test(normalized)) {
    return uniqueSources([sources.medicines, sources.overview, sources.basics]);
  }
  if (/\b(exercise|walk|walking|movement|workout|active|activity)\b/.test(normalized)) {
    return uniqueSources([sources.exercise, sources.healthyLiving, sources.overview]);
  }
  if (/\b(food|meal|eat|eating|carb|carbohydrate|nutrition|fruit|bread|plate)\b/.test(normalized)) {
    return uniqueSources([sources.nutrition, sources.healthyLiving, sources.overview]);
  }
  if (/\b(insulin resistance|prediabetes)\b/.test(normalized)) {
    return uniqueSources([sources.insulinResistance, sources.overview, sources.basics]);
  }

  return uniqueSources([sources.overview, sources.basics]);
}

export function publicCredibleSources(
  selected: readonly AiCredibleSourceContext[],
): readonly AiCredibleSource[] {
  return selected.map(({ href, organization, title }) => ({ href, organization, title }));
}
