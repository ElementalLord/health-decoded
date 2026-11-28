import { type2DiabetesResources } from "@/content/resources/type-2-diabetes-resources";
import {
  decodeLabelQuestions,
  fruitYogurtLabel,
  plainYogurtLabel,
} from "@/features/decode-the-label/content/decode-the-label-content";
import type { DecodeLabelQuestion } from "@/features/decode-the-label/types/decode-the-label";
import { explainItBackChallenges } from "@/features/explain-it-back/content/explain-it-back-content";
import { buildExplainFeedback } from "@/features/explain-it-back/services/explain-it-back-evaluator";
import { medicalGlossary } from "@/features/glossary/content/medical-glossary";
import { mythCheckCards } from "@/features/mythbusters/content/myth-check-cards";
import { mythCheckSourceById } from "@/features/mythbusters/content/myth-check-sources";
import type { MythCheckVerdict } from "@/features/mythbusters/types/myth-check";
import { ashaRiceOnTheTableStory } from "@/features/stories/content/asha-rice-on-the-table";
import { devonNumberScreenStory } from "@/features/stories/content/devon-number-screen";
import { marcusParkingLotStory } from "@/features/stories/content/marcus-parking-lot";
import { noraPrescriptionBagStory } from "@/features/stories/content/nora-prescription-bag";

/*
 * Everything the public landing page lets visitors try comes from the same source-backed content
 * the signed-in app uses. This module trims it down on the server so the client components only
 * receive the few fields they render.
 */

export type LandingSource = { readonly organization: string; readonly url: string };

export type LandingMythCard = {
  readonly id: string;
  readonly claim: string;
  readonly verdict: MythCheckVerdict;
  readonly explanation: string;
  readonly takeaway: string;
  readonly source: LandingSource | null;
};

const LANDING_MYTH_IDS = [
  "MYTH-BASICS-01",
  "MYTH-FOOD-02",
  "MYTH-MONITORING-02",
  "MYTH-FOOD-04",
  "MYTH-TREATMENT-01",
] as const;

export function getLandingMythCards(): LandingMythCard[] {
  return LANDING_MYTH_IDS.flatMap((id) => {
    const card = mythCheckCards.find((candidate) => candidate.id === id);
    if (!card || card.status !== "source-backed") return [];
    const source = card.sourceIds
      .map((sourceId) => mythCheckSourceById.get(sourceId))
      .find((candidate) => candidate !== undefined);
    return [
      {
        id: card.id,
        claim: card.claim,
        verdict: card.verdict,
        explanation: card.explanation,
        takeaway: card.takeaway,
        source: source ? { organization: source.organization, url: source.url } : null,
      },
    ];
  });
}

export const totalMythCardCount = mythCheckCards.filter(
  (card) => card.status === "source-backed",
).length;

export const landingGlossary = medicalGlossary;
export const landingGlossarySuggestions = [
  "A1C",
  "Insulin resistance",
  "Hypoglycemia",
  "Carbohydrate",
];

export const landingLabels = { plain: plainYogurtLabel, fruit: fruitYogurtLabel } as const;
export const landingLabelQuestions: readonly DecodeLabelQuestion[] = decodeLabelQuestions.filter(
  (question) => ["DTL-Q09", "DTL-Q10", "DTL-Q11"].includes(question.id),
);

export type LandingStory = {
  readonly slug: string;
  readonly name: string;
  readonly title: string;
  readonly introduction: string;
  readonly imagePath: string;
  readonly imageAlt: string;
  readonly timeLabel: string;
};

export const landingStories: readonly LandingStory[] = [
  marcusParkingLotStory,
  ashaRiceOnTheTableStory,
  noraPrescriptionBagStory,
  devonNumberScreenStory,
].map((story) => ({
  slug: story.slug,
  name: story.characterName,
  title: story.title,
  introduction: story.introduction,
  imagePath: story.imagePath,
  imageAlt: story.imageAlt,
  timeLabel: story.estimatedTimeLabel ?? `About ${story.estimatedMinutes} minutes`,
}));

export type LandingExplainSample = {
  readonly id: "got_it" | "almost_there" | "try_again";
  readonly answer: string;
  readonly label: string;
  readonly covered: readonly string[];
  readonly missing?: string;
  readonly correction?: string;
};

export type LandingExplainDemo = {
  readonly title: string;
  readonly prompt: string;
  readonly samples: readonly LandingExplainSample[];
};

/**
 * The real Explain It Back activity sends a visitor's own words to the AI evaluator, which needs an
 * account. The landing demo instead walks through the challenge's three reviewed sample answers and
 * shows the same feedback the evaluator builds for each of them.
 */
export function getLandingExplainDemo(): LandingExplainDemo | null {
  const challenge = explainItBackChallenges.find((candidate) => candidate.id === "blood-glucose");
  if (!challenge) return null;
  const [firstConcept] = challenge.essentialConcepts;
  const [firstMisconception] = challenge.misconceptions;
  if (!firstConcept || !firstMisconception) return null;

  const essentialIds = challenge.essentialConcepts.map(({ id }) => id);
  const classify = (
    verdict: LandingExplainSample["id"],
    covered: readonly string[],
    contradictions: readonly string[],
  ) =>
    buildExplainFeedback(
      {
        verdict,
        coveredConceptIds: covered,
        missingEssentialConceptIds: essentialIds.filter((id) => !covered.includes(id)),
        contradictionIds: contradictions,
        offTopic: false,
        personalMedicalContent: false,
      },
      challenge,
    );

  const samples: [LandingExplainSample["id"], string, ReturnType<typeof classify>][] = [
    ["got_it", challenge.passingExample, classify("got_it", essentialIds, [])],
    ["almost_there", challenge.almostExample, classify("almost_there", [firstConcept.id], [])],
    ["try_again", challenge.failingExample, classify("try_again", [], [firstMisconception.id])],
  ];

  return {
    title: challenge.title,
    prompt: challenge.prompt,
    samples: samples.map(([id, answer, feedback]) => ({
      id,
      answer,
      label: feedback.label,
      covered: feedback.covered,
      ...(feedback.missing ? { missing: feedback.missing } : {}),
      ...(feedback.correction ? { correction: feedback.correction } : {}),
    })),
  };
}

export type LandingConfusedPair = {
  readonly term: string;
  readonly confusedWith: string;
  readonly explanation: string;
};

/** A few "not the same as" notes so visitors see what the glossary adds beyond a definition. */
export function getLandingConfusedPairs(limit = 3): LandingConfusedPair[] {
  const preferred = ["A1C", "Hypoglycemia", "Insulin resistance", "Carbohydrate", "Blood glucose"];
  const withNotes = medicalGlossary.filter((entry) => entry.commonlyConfusedWith);
  const ordered = [
    ...preferred.flatMap((term) =>
      withNotes.filter((entry) => entry.term.toLowerCase() === term.toLowerCase()),
    ),
    ...withNotes,
  ];
  // Skip repeats, including the same pair seen from the other side (A1C vs. glucose and back).
  const seen = new Set<string>();
  return ordered
    .filter((entry) => {
      const key = [entry.term, entry.commonlyConfusedWith!.term]
        .map((term) => term.toLowerCase().replace(/ reading$/, ""))
        .sort()
        .join("|");
      if (seen.has(entry.id) || seen.has(key)) return false;
      seen.add(entry.id);
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map((entry) => ({
      term: entry.term,
      confusedWith: entry.commonlyConfusedWith!.term,
      explanation: entry.commonlyConfusedWith!.explanation,
    }));
}

export type LandingResource = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly source: string;
  readonly minutes: number;
  readonly url: string;
  readonly image: string;
  readonly imageAlt: string;
};

// The same reviewed CDC and NIDDK guides and artwork the Resources page uses.
const landingResourceVisuals = {
  "type-2-diabetes-basics": {
    image: "/resources/type-2-diabetes-basics-watercolor.jpg",
    imageAlt: "An overhead watercolor still life of everyday Type 2 diabetes care essentials",
  },
  "understanding-a1c": {
    image: "/resources/a1c-explained-watercolor.jpg",
    imageAlt: "A symbolic watercolor of an A1C blood sample connected across three months",
  },
  "diabetes-meal-planning": {
    image: "/resources/american-balanced-plate-watercolor.jpg",
    imageAlt:
      "An overhead watercolor of grilled chicken, sweet potatoes, green vegetables, and salad",
  },
  "diabetes-and-mental-health": {
    image: "/resources/mental-health-watercolor.jpg",
    imageAlt: "A reflective watercolor of a person journaling by a rainy window with a cat",
  },
} as const;

export const landingResources: readonly LandingResource[] = Object.entries(
  landingResourceVisuals,
).flatMap(([id, visual]) => {
  const resource = type2DiabetesResources.find((candidate) => candidate.id === id);
  if (!resource) return [];
  return [
    {
      id,
      title: resource.title,
      description: resource.description,
      source: resource.organization.startsWith("Centers") ? "CDC" : "NIDDK",
      minutes: resource.reading_minutes,
      url: resource.url,
      ...visual,
    },
  ];
});

export const totalResourceCount = type2DiabetesResources.length;
