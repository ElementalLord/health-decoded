// @ts-expect-error -- Node's built-in TypeScript test runner requires an explicit extension.
import { spacedReviewConfig } from "../config/spaced-review.config.ts";
import type {
  ReviewCandidate,
  ReviewSelection,
  SpacedReviewState,
} from "@/features/spaced-review/types/spaced-review";
import type { ExplainVerdict } from "@/features/explain-it-back/types/explain-it-back";

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

function addDays(now: Date, days: number) {
  return new Date(now.getTime() + days * DAY_MS).toISOString();
}

export function initializeReviewState(challengeId: string, learnedAt: string): SpacedReviewState {
  return {
    challengeId,
    learnedAt,
    lastReviewedAt: null,
    lastVerdict: null,
    successfulReviewCount: 0,
    nextDueAt: addDays(new Date(learnedAt), spacedReviewConfig.initialIntervalDays),
    lastPromptedAt: null,
    dismissedUntil: null,
    automaticPromptHistory: [],
  };
}

export function scheduleReviewResult(input: {
  state: SpacedReviewState;
  verdict: ExplainVerdict;
  now: Date;
  hadRetry: boolean;
  exampleViewed: boolean;
}): SpacedReviewState {
  let intervalDays: number;
  let successfulReviewCount = input.state.successfulReviewCount;
  if (input.exampleViewed) intervalDays = spacedReviewConfig.exampleViewedIntervalDays;
  else if (input.verdict === "almost_there") intervalDays = spacedReviewConfig.almostThereIntervalDays;
  else if (input.verdict === "try_again") intervalDays = spacedReviewConfig.tryAgainIntervalDays;
  else if (input.hadRetry) intervalDays = spacedReviewConfig.retrySuccessIntervalDays;
  else {
    intervalDays = spacedReviewConfig.successIntervalsDays[Math.min(successfulReviewCount, spacedReviewConfig.successIntervalsDays.length - 1)]!;
    successfulReviewCount += 1;
  }
  return {
    ...input.state,
    lastReviewedAt: input.now.toISOString(),
    lastVerdict: input.verdict,
    successfulReviewCount,
    nextDueAt: addDays(input.now, intervalDays),
  };
}

function performanceWeight(candidate: ReviewCandidate) {
  if (candidate.lastVerdict === "try_again") return spacedReviewConfig.scoring.tryAgainPerformance;
  if (candidate.lastVerdict === "almost_there") return spacedReviewConfig.scoring.almostTherePerformance;
  if (candidate.lastVerdict === null) return spacedReviewConfig.scoring.neverReviewedPerformance;
  return 0;
}

export function candidateScore(candidate: ReviewCandidate, now: Date, lastSelectedId?: string | null) {
  const overdueDays = (now.getTime() - Date.parse(candidate.nextDueAt)) / DAY_MS;
  const repeatPenalty =
    candidate.challengeId === lastSelectedId && candidate.lastVerdict !== "try_again"
      ? spacedReviewConfig.scoring.recentRepeatPenalty
      : 0;
  return (
    overdueDays * spacedReviewConfig.scoring.overduePerDay +
    performanceWeight(candidate) +
    Math.max(0, 4 - candidate.successfulReviewCount) *
      spacedReviewConfig.scoring.fewerSuccessPerStep -
    repeatPenalty
  );
}

function compareCandidates(left: ReviewCandidate, right: ReviewCandidate, now: Date, lastSelectedId?: string | null) {
  const scoreDifference = candidateScore(right, now, lastSelectedId) - candidateScore(left, now, lastSelectedId);
  if (scoreDifference !== 0) return scoreDifference;
  const lastReviewDifference = Date.parse(left.lastReviewedAt ?? left.learnedAt) - Date.parse(right.lastReviewedAt ?? right.learnedAt);
  if (lastReviewDifference !== 0) return lastReviewDifference;
  if (left.group !== right.group) return left.group === "Foundations" ? -1 : 1;
  return left.challengeId.localeCompare(right.challengeId);
}

export function selectReviewCandidate(input: {
  candidates: readonly ReviewCandidate[];
  now: Date;
  manual: boolean;
  lastSelectedId?: string | null;
}): ReviewSelection {
  if (!input.candidates.length) return { candidate: null, due: false };
  const due = input.candidates.filter((candidate) => Date.parse(candidate.nextDueAt) <= input.now.getTime());
  if (due.length) return { candidate: [...due].sort((a, b) => compareCandidates(a, b, input.now, input.lastSelectedId))[0]!, due: true };
  if (!input.manual) return { candidate: null, due: false };
  const candidate = [...input.candidates].sort((left, right) => {
    const dueDifference = Date.parse(left.nextDueAt) - Date.parse(right.nextDueAt);
    if (dueDifference !== 0) return dueDifference;
    return compareCandidates(left, right, input.now, input.lastSelectedId);
  })[0]!;
  return { candidate, due: false };
}

export function shouldOfferAutomaticReview(input: {
  selection: ReviewSelection;
  now: Date;
  lastPromptedAt: string | null;
  dismissedUntil: string | null;
  promptHistory: readonly string[];
}) {
  if (!input.selection.candidate || !input.selection.due) return false;
  if (input.dismissedUntil && Date.parse(input.dismissedUntil) > input.now.getTime()) return false;
  if (input.lastPromptedAt && input.now.getTime() - Date.parse(input.lastPromptedAt) < spacedReviewConfig.minAutoPromptGapHours * HOUR_MS) return false;
  const sevenDaysAgo = input.now.getTime() - 7 * DAY_MS;
  return input.promptHistory.filter((timestamp) => Date.parse(timestamp) >= sevenDaysAgo).length < spacedReviewConfig.maxAutoPromptsPer7Days;
}

export function reviewPromptCopy(candidate: ReviewCandidate, now: Date) {
  const ageDays = Math.max(0, Math.floor((now.getTime() - Date.parse(candidate.learnedAt)) / DAY_MS));
  if (ageDays <= 6) return `You learned about ${candidate.title} a few days ago. Can you still explain it in your own words?`;
  if (ageDays <= 20) return `It’s been a little while since you worked with ${candidate.title}. Can you explain it in your own words?`;
  return `Let’s bring ${candidate.title} back for a quick review. Can you explain it in your own words?`;
}
