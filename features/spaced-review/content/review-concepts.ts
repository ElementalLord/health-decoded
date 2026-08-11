// @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
import { conceptRegistry } from "../../cohesion/content/concept-registry.ts";
import {
  explainItBackChallenges,
  getExplainItBackChallenge,
// @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
} from "../../explain-it-back/content/explain-it-back-content.ts";
import type { HealthDecodedConcept } from "@/features/cohesion/types/concept";

const reviewConceptRegistry: readonly HealthDecodedConcept[] = conceptRegistry;

export const spacedReviewConcepts = explainItBackChallenges.map((challenge) => {
  const concept = reviewConceptRegistry.find((entry) => entry.explainItBackIds?.includes(challenge.id));
  return {
    challengeId: challenge.id,
    group: challenge.group,
    title: challenge.title,
    learnedFromLessonIds: concept?.lessonIds ?? [],
  };
});

export const spacedReviewConceptByChallengeId = new Map<string, (typeof spacedReviewConcepts)[number]>(
  spacedReviewConcepts.map((concept) => [concept.challengeId, concept]),
);

export function isReviewableChallengeId(value: string) {
  return spacedReviewConceptByChallengeId.has(value) && Boolean(getExplainItBackChallenge(value));
}
