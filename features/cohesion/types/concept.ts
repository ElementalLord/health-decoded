export const conceptIds = [
  "blood-glucose",
  "insulin",
  "insulin-resistance",
  "type-2-diabetes",
  "a1c",
  "a1c-vs-glucose",
  "carbohydrates",
  "serving-size",
  "nutrition-labels",
  "total-carbohydrate",
  "added-sugars",
  "fiber",
] as const;

export type ConceptId = (typeof conceptIds)[number];
export type FeatureType =
  | "lesson"
  | "glossary"
  | "myth-check"
  | "explain-it-back"
  | "decode-the-label"
  | "resource"
  | "story"
  | "caregiver"
  | "ai"
  | "journey";
export type RelationshipType = "learn" | "practice" | "review" | "clarify" | "verify";

export type ConceptDestination = {
  readonly feature: FeatureType;
  readonly id: string;
  readonly relationship: RelationshipType;
  readonly title: string;
  readonly href: string;
};

export type HealthDecodedConcept = {
  readonly id: ConceptId;
  readonly title: string;
  readonly aliases?: readonly string[];
  readonly lessonIds?: readonly string[];
  readonly glossaryIds?: readonly string[];
  readonly mythCheckIds?: readonly string[];
  readonly explainItBackIds?: readonly string[];
  readonly decodeTheLabelIds?: readonly string[];
  readonly resourceIds?: readonly string[];
  readonly storyIds?: readonly string[];
  readonly caregiverIds?: readonly string[];
  readonly approvedSourceIds?: readonly string[];
  readonly destinations: readonly ConceptDestination[];
};

export type NextLearningAction = ConceptDestination & {
  readonly conceptId: ConceptId;
};
