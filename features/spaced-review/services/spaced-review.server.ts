import "server-only";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { spacedReviewConceptByChallengeId } from "@/features/spaced-review/content/review-concepts";
import {
  reviewPromptCopy,
  selectReviewCandidate,
  shouldOfferAutomaticReview,
} from "@/features/spaced-review/lib/spaced-review-scheduler";
import type {
  ReviewCandidate,
  SpacedReviewOpportunity,
} from "@/features/spaced-review/types/spaced-review";
import type { ExplainVerdict } from "@/features/explain-it-back/types/explain-it-back";
import { getServerDatabaseClient } from "@/lib/database/server";
import { unexpectedError } from "@/lib/errors/application-error";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";
import { settleOptional } from "@/lib/reliability/dependency-boundary";

const logger = createServerLogger();

type ReviewRow = {
  challenge_id: string;
  learned_at: string;
  last_reviewed_at: string | null;
  last_verdict: string | null;
  successful_review_count: number;
  next_due_at: string;
  last_prompted_at: string | null;
  dismissed_until: string | null;
  automatic_prompt_history: string[] | null;
};

function mapState(row: ReviewRow): ReviewCandidate | null {
  const concept = spacedReviewConceptByChallengeId.get(row.challenge_id);
  if (
    !concept ||
    !Number.isInteger(row.successful_review_count) ||
    row.successful_review_count < 0 ||
    !Number.isFinite(Date.parse(row.learned_at)) ||
    !Number.isFinite(Date.parse(row.next_due_at)) ||
    (row.last_verdict !== null &&
      !["got_it", "almost_there", "try_again"].includes(row.last_verdict))
  )
    return null;
  return {
    challengeId: row.challenge_id,
    learnedAt: row.learned_at,
    lastReviewedAt: row.last_reviewed_at,
    lastVerdict: row.last_verdict as ExplainVerdict | null,
    successfulReviewCount: row.successful_review_count,
    nextDueAt: row.next_due_at,
    lastPromptedAt: row.last_prompted_at,
    dismissedUntil: row.dismissed_until,
    automaticPromptHistory: row.automatic_prompt_history ?? [],
    group: concept.group,
    title: concept.title,
  };
}

export async function getSpacedReviewOpportunity(input: {
  manual: boolean;
  now?: Date;
}): Promise<Result<SpacedReviewOpportunity>> {
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);
  const database = await getServerDatabaseClient();
  const initialized = await database.rpc("initialize_spaced_review_from_lessons");
  if (initialized.error) {
    logger.error("spaced_review.initialize_failed", { error_code: initialized.error.code });
    return err(unexpectedError());
  }
  const response = await database
    .from("user_spaced_review_state")
    .select(
      "challenge_id, learned_at, last_reviewed_at, last_verdict, successful_review_count, next_due_at, last_prompted_at, dismissed_until, automatic_prompt_history",
    )
    .eq("user_id", user.data.id);
  if (response.error) {
    logger.error("spaced_review.load_failed", { error_code: response.error.code });
    return err(unexpectedError());
  }
  const candidates = (response.data ?? []).map((row) => mapState(row as ReviewRow));
  if (!candidates.every(Boolean)) return err(unexpectedError());
  const validCandidates = candidates as ReviewCandidate[];
  const now = input.now ?? new Date();
  const mostRecent = [...validCandidates]
    .filter(({ lastReviewedAt }) => lastReviewedAt)
    .sort((left, right) => Date.parse(right.lastReviewedAt!) - Date.parse(left.lastReviewedAt!))[0];
  const selection = selectReviewCandidate({
    candidates: validCandidates,
    now,
    manual: input.manual,
    lastSelectedId: mostRecent?.challengeId ?? null,
  });
  const lastPromptedAt =
    validCandidates
      .map(({ lastPromptedAt }) => lastPromptedAt)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1) ?? null;
  const dismissedUntil =
    validCandidates
      .map(({ dismissedUntil }) => dismissedUntil)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1) ?? null;
  const promptHistory = validCandidates.flatMap(
    ({ automaticPromptHistory }) => automaticPromptHistory,
  );
  const automaticEligible = shouldOfferAutomaticReview({
    selection,
    now,
    lastPromptedAt,
    dismissedUntil,
    promptHistory,
  });
  return ok({
    ...selection,
    automaticEligible,
    promptCopy: selection.candidate ? reviewPromptCopy(selection.candidate, now) : null,
  });
}

export async function recordExplainItBackLearning(challengeId: string) {
  const response = await settleOptional(
    async () => {
      const database = await getServerDatabaseClient();
      return database.rpc("record_explain_it_back_learning", { p_challenge_id: challengeId });
    },
    null,
    () => logger.error("spaced_review.practice_learning_rejected"),
  );
  if (!response || response.error)
    logger.error("spaced_review.practice_learning_failed", { error_code: response?.error?.code });
  return Boolean(response && !response.error);
}

export async function recordSpacedReviewResult(input: {
  challengeId: string;
  verdict: ExplainVerdict;
  hadRetry: boolean;
  exampleViewed: boolean;
  resultToken: string;
}) {
  const response = await settleOptional(
    async () => {
      const database = await getServerDatabaseClient();
      return database.rpc("record_spaced_review_result", {
        p_challenge_id: input.challengeId,
        p_verdict: input.verdict,
        p_had_retry: input.hadRetry,
        p_example_viewed: input.exampleViewed,
        p_result_token: input.resultToken,
      });
    },
    null,
    () => logger.error("spaced_review.result_rejected"),
  );
  if (!response || response.error)
    logger.error("spaced_review.result_failed", { error_code: response?.error?.code });
  return Boolean(response && !response.error);
}

export async function recordSpacedReviewExample(challengeId: string, sessionId: string) {
  const response = await settleOptional(async () => {
    const database = await getServerDatabaseClient();
    return database.rpc("record_spaced_review_example", {
      p_challenge_id: challengeId,
      p_session_id: sessionId,
    });
  }, null);
  return Boolean(response && !response.error);
}

export async function recordSpacedReviewPrompt(challengeId: string, promptToken: string) {
  const response = await settleOptional(async () => {
    const database = await getServerDatabaseClient();
    return database.rpc("record_spaced_review_prompt", {
      p_challenge_id: challengeId,
      p_prompt_token: promptToken,
    });
  }, null);
  return Boolean(response && !response.error);
}

export async function snoozeSpacedReviewPrompts(challengeId: string) {
  const response = await settleOptional(async () => {
    const database = await getServerDatabaseClient();
    return database.rpc("snooze_spaced_review_prompts", { p_challenge_id: challengeId });
  }, null);
  return Boolean(response && !response.error);
}
