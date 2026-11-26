import {
  decodeLabelQuestions,
  fruitYogurtLabel,
  plainYogurtLabel,
} from "@/features/decode-the-label/content/decode-the-label-content";
import type { DecodeLabelQuestion } from "@/features/decode-the-label/types/decode-the-label";
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

export type LandingStoryChoice = {
  readonly setup: readonly string[];
  readonly prompt: string;
  readonly options: readonly { id: string; label: string; feedback: string }[];
  readonly learningPoint: string;
  readonly after: readonly string[];
};

export function getMarcusChoice(): LandingStoryChoice | null {
  const scene = marcusParkingLotStory.scenes.find((candidate) => candidate.id === "then-come-home");
  if (!scene || !("interaction" in scene) || !scene.interaction) return null;
  const options = scene.interaction.options.flatMap((option) =>
    "feedback" in option && typeof option.feedback === "string"
      ? [{ id: option.id, label: option.label, feedback: option.feedback }]
      : [],
  );
  if (options.length === 0) return null;
  return {
    setup: scene.paragraphs,
    prompt: scene.interaction.prompt,
    options,
    learningPoint: scene.interaction.learningPoint,
    after: "paragraphsAfterInteraction" in scene ? (scene.paragraphsAfterInteraction ?? []) : [],
  };
}
