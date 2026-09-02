import type { AiCredibleSource } from "@/features/ai/types/ai";

export type AiCredibleSourceContext = AiCredibleSource & {
  readonly id: string;
  readonly summary: string;
};

const sources = {
  a1c: {
    id: "NIDDK-A1C",
    href: "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test",
    organization: "NIDDK",
    summary:
      "The A1C test reflects average blood glucose over roughly the past three months and is used for diabetes diagnosis and management.",
    title: "The A1C Test & Diabetes",
  },
  basics: {
    id: "CDC-DIABETES-BASICS",
    href: "https://www.cdc.gov/diabetes/about/",
    organization: "CDC",
    summary:
      "Diabetes affects how the body turns food into energy; insulin helps glucose enter cells, and diabetes can involve too little insulin or reduced response to it.",
    title: "Diabetes Basics",
  },
  careSchedule: {
    id: "CDC-DIABETES-CARE-SCHEDULE",
    href: "https://www.cdc.gov/diabetes/treatment/your-diabetes-care-schedule.html",
    organization: "CDC",
    summary:
      "Regular diabetes care includes recurring appointments, laboratory tests, and preventive checks. Preparing questions and sharing concerns with the care team can help make visits more useful.",
    title: "Your Diabetes Care Schedule",
  },
  cgm: {
    id: "CDC-CONTINUOUS-GLUCOSE-MONITORS",
    href: "https://www.cdc.gov/diabetes/treatment/continuous-glucose-monitors.html",
    organization: "CDC",
    summary:
      "A continuous glucose monitor uses a sensor just under the skin to estimate glucose in the fluid between cells, updates readings every few minutes, and can show changes and trends over time.",
    title: "Continuous Glucose Monitors",
  },
  education: {
    id: "CDC-DIABETES-EDUCATION-SUPPORT",
    href: "https://www.cdc.gov/diabetes/education-support-programs/index.html",
    organization: "CDC",
    summary:
      "Diabetes self-management education and support helps people learn practical skills for everyday diabetes care, including eating, activity, medicines, monitoring, coping, and reducing risks.",
    title: "Diabetes Self-Management Education and Support",
  },
  exercise: {
    id: "CDC-PHYSICAL-ACTIVITY",
    href: "https://www.cdc.gov/diabetes/living-with/physical-activity.html",
    organization: "CDC",
    summary:
      "Regular physical activity is an important part of diabetes management and can help the body use insulin more effectively.",
    title: "Get Active",
  },
  healthyLiving: {
    id: "NIDDK-HEALTHY-LIVING",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/healthy-living-with-diabetes",
    organization: "NIDDK",
    summary:
      "Healthy living with diabetes includes sustainable eating, physical activity, sleep, and weight-management habits tailored with a health care team when needed.",
    title: "Healthy Living with Diabetes",
  },
  insulinResistance: {
    id: "NIDDK-INSULIN-RESISTANCE",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance",
    organization: "NIDDK",
    summary:
      "Insulin resistance occurs when cells do not respond well to insulin, which can contribute to higher blood glucose and prediabetes.",
    title: "Insulin Resistance & Prediabetes",
  },
  medicines: {
    id: "NIDDK-DIABETES-MEDICINES",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments",
    organization: "NIDDK",
    summary:
      "Diabetes medicines work in different ways; metformin generally reduces glucose made by the liver and helps the body use insulin better.",
    title: "Insulin, Medicines, & Other Diabetes Treatments",
  },
  mentalHealth: {
    id: "CDC-DIABETES-MENTAL-HEALTH",
    href: "https://www.cdc.gov/diabetes/living-with/mental-health.html",
    organization: "CDC",
    summary:
      "Stress hormones can make blood glucose rise or fall unpredictably, and the ongoing work of diabetes care can itself be a source of stress. Activity, relaxation, connection, and adequate sleep can support coping.",
    title: "Diabetes and Mental Health",
  },
  monitoring: {
    id: "CDC-MONITORING-BLOOD-SUGAR",
    href: "https://www.cdc.gov/diabetes/diabetes-testing/monitoring-blood-sugar.html",
    organization: "CDC",
    summary:
      "Blood glucose can change throughout the day in response to factors such as food, medicines, and physical activity. A meter measures one moment, while regular monitoring can reveal patterns over time.",
    title: "Monitoring Your Blood Sugar",
  },
  nutrition: {
    id: "CDC-HEALTHY-EATING",
    href: "https://www.cdc.gov/diabetes/healthy-eating/",
    organization: "CDC",
    summary:
      "Food choices and meal patterns can affect blood glucose, and healthy eating is a core part of living well with diabetes.",
    title: "Healthy Eating",
  },
  overview: {
    id: "NIDDK-DIABETES-OVERVIEW",
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

  const requiresSpecializedOrCurrentEvidence =
    /\b(?:latest|newest|current|202\d)\b.{0,60}\b(?:trial|drug|device|guideline|research|firmware|therapy|model|recommendation)s?\b|\b(?:pharmacokinetic|algorithm|firmware|genetics?|gene therap(?:y|ies)|transplant|antibiotic|surgery guideline|eligibility criteria|thresholds?|renal failure)\b/i;
  if (requiresSpecializedOrCurrentEvidence.test(message)) {
    return [];
  }

  if (/\b(a1c|hba1c|hemoglobin a1c)\b/.test(normalized)) {
    return uniqueSources([sources.a1c, sources.monitoring, sources.overview]);
  }
  if (/\b(continuous glucose monitor|cgm)\b/.test(normalized)) {
    return uniqueSources([sources.cgm, sources.monitoring, sources.overview]);
  }
  if (/\b(stress|stressed|anxiety|anxious|mental health|diabetes distress)\b/.test(normalized)) {
    return uniqueSources([sources.mentalHealth, sources.healthyLiving, sources.overview]);
  }
  if (/\b(sleep|sleeping|rest|circadian)\b/.test(normalized)) {
    return uniqueSources([sources.mentalHealth, sources.healthyLiving, sources.overview]);
  }
  if (
    /\b(checkups?|check-ups?|appointments?|healthcare visits?|health care visits?|doctor visits?|care team)\b/.test(
      normalized,
    )
  ) {
    return uniqueSources([sources.careSchedule, sources.education, sources.overview]);
  }
  if (
    /\b(diabetes education|self-management education|dsmes|learn about diabetes)\b/.test(normalized)
  ) {
    return uniqueSources([sources.education, sources.overview, sources.basics]);
  }
  if (/\b(insulin (?:resistance|sensitivity)|prediabetes)\b/.test(normalized)) {
    return uniqueSources([sources.insulinResistance, sources.exercise, sources.healthyLiving]);
  }
  if (/\b(metformin|insulin|medicine|medication|drug)\b/.test(normalized)) {
    return uniqueSources([sources.medicines, sources.overview, sources.basics]);
  }
  if (/\b(exercise|walk|walking|movement|workout|active|activity)\b/.test(normalized)) {
    return uniqueSources([sources.exercise, sources.healthyLiving, sources.overview]);
  }
  if (
    /\b(food|meal|eat|eating|carbs?|carbohydrates?|nutrition|fruit|bread|plate|serving size|added sugars?|total sugars?|fiber|food label|nutrition facts)\b/.test(
      normalized,
    )
  ) {
    return uniqueSources([sources.nutrition, sources.healthyLiving, sources.overview]);
  }
  if (
    /\b(monitor|monitoring|meter|fingerstick|throughout the day|change during the day)\b/.test(
      normalized,
    )
  ) {
    return uniqueSources([sources.monitoring, sources.overview, sources.basics]);
  }

  if (/\b(type\s*2|diabetes|blood sugar|glucose|insulin|pancreas)\b/.test(normalized)) {
    return uniqueSources([sources.overview, sources.basics]);
  }

  return [];
}

export function publicCredibleSources(
  selected: readonly AiCredibleSourceContext[],
): readonly AiCredibleSource[] {
  return selected.map(({ href, organization, title }) => ({ href, organization, title }));
}
