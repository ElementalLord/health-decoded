export const explainItBackMilestoneIds = [
  "blood-glucose",
  "insulin",
  "insulin-resistance",
  "type-2-diabetes",
  "a1c",
  "a1c-vs-glucose",
  "carbohydrates",
  "serving-size",
  "total-vs-added-sugars",
  "total-carbohydrate",
] as const;

export const storyMilestoneIds = [
  "marcus-parking-lot",
  "asha-rice-on-the-table",
  "nora-prescription-bag",
  "devon-number-screen",
] as const;

export const resourceMilestoneIds = [
  "type-2-diabetes-basics",
  "understanding-a1c",
  "monitoring-blood-sugar",
  "diabetes-meal-planning",
  "cultural-foods",
  "physical-activity",
  "diabetes-treatments",
  "low-blood-sugar",
  "managing-sick-days",
  "heart-disease-and-stroke",
  "kidney-health",
  "eye-health",
  "foot-care",
  "oral-health",
  "diabetes-and-mental-health",
  "diabetes-education-and-support",
  "financial-help",
  "emergency-preparedness",
] as const;

export type ExplainItBackMilestoneId = (typeof explainItBackMilestoneIds)[number];
export type StoryMilestoneId = (typeof storyMilestoneIds)[number];
export type ResourceMilestoneId = (typeof resourceMilestoneIds)[number];

function includes<const T extends readonly string[]>(
  values: T,
  value: unknown,
): value is T[number] {
  return typeof value === "string" && values.includes(value as T[number]);
}

export const isExplainItBackMilestoneId = (value: unknown): value is ExplainItBackMilestoneId =>
  includes(explainItBackMilestoneIds, value);

export const isStoryMilestoneId = (value: unknown): value is StoryMilestoneId =>
  includes(storyMilestoneIds, value);

export const isResourceMilestoneId = (value: unknown): value is ResourceMilestoneId =>
  includes(resourceMilestoneIds, value);
