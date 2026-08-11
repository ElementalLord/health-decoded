import type { ExplainVerdict } from "@/features/explain-it-back/types/explain-it-back";

export type SpacedReviewState = {
  challengeId: string;
  learnedAt: string;
  lastReviewedAt: string | null;
  lastVerdict: ExplainVerdict | null;
  successfulReviewCount: number;
  nextDueAt: string;
  lastPromptedAt: string | null;
  dismissedUntil: string | null;
  automaticPromptHistory: readonly string[];
};
export type ReviewCandidate = SpacedReviewState & {
  group: "Foundations" | "Food & labels";
  title: string;
};

export type ReviewSelection = {
  candidate: ReviewCandidate | null;
  due: boolean;
};

export type SpacedReviewOpportunity = ReviewSelection & {
  automaticEligible: boolean;
  promptCopy: string | null;
};
