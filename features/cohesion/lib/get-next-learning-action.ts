// @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
import { conceptRegistry } from "../content/concept-registry.ts";
import type {
  FeatureType,
  HealthDecodedConcept,
  NextLearningAction,
} from "@/features/cohesion/types/concept";

const sourceKeyByFeature = {
  lesson: "lessonIds",
  glossary: "glossaryIds",
  "myth-check": "mythCheckIds",
  "explain-it-back": "explainItBackIds",
  "decode-the-label": "decodeTheLabelIds",
  resource: "resourceIds",
  story: "storyIds",
  caregiver: "caregiverIds",
} as const;

type SourceFeature = keyof typeof sourceKeyByFeature;

function sourceIds(concept: HealthDecodedConcept, sourceType: SourceFeature) {
  return concept[sourceKeyByFeature[sourceType]];
}

export function getConceptsForSource(sourceType: SourceFeature, sourceId: string) {
  const registry: readonly HealthDecodedConcept[] = conceptRegistry;
  return registry.filter((concept) => sourceIds(concept, sourceType)?.includes(sourceId));
}

export function getNextLearningAction(input: {
  readonly sourceType: SourceFeature;
  readonly sourceId: string;
  readonly completedDestinationIds?: ReadonlySet<string>;
  readonly recentDestination?: { readonly feature: FeatureType; readonly id: string } | null;
  readonly registry?: readonly HealthDecodedConcept[];
}): NextLearningAction | null {
  const registry = input.registry ?? conceptRegistry;
  const concepts = registry.filter((concept) =>
    sourceIds(concept, input.sourceType)?.includes(input.sourceId),
  );

  for (const concept of concepts) {
    for (const destination of concept.destinations) {
      if (destination.feature === input.sourceType && destination.id === input.sourceId) continue;
      if (input.completedDestinationIds?.has(`${destination.feature}:${destination.id}`)) continue;
      if (
        input.recentDestination?.feature === destination.feature &&
        input.recentDestination.id === destination.id
      )
        continue;
      if (!destination.href.startsWith("/")) continue;
      return { ...destination, conceptId: concept.id };
    }
  }
  return null;
}
