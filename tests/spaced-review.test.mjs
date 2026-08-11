import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import { explainItBackChallenges } from "../features/explain-it-back/content/explain-it-back-content.ts";
import { explainItBackRequestSchema } from "../features/explain-it-back/schemas/explain-it-back.schema.ts";
import { lessonIdByDay } from "../features/cohesion/content/concept-registry.ts";
import { recommendNextStep } from "../features/next-step/lib/recommend-next-step.ts";
import { spacedReviewConfig } from "../features/spaced-review/config/spaced-review.config.ts";
import { spacedReviewConcepts } from "../features/spaced-review/content/review-concepts.ts";
import {
  initializeReviewState,
  reviewPromptCopy,
  scheduleReviewResult,
  selectReviewCandidate,
  shouldOfferAutomaticReview,
} from "../features/spaced-review/lib/spaced-review-scheduler.ts";

const at = (value) => new Date(`${value}T00:00:00Z`);
const candidate = (overrides = {}) => ({
  ...initializeReviewState("a1c", "2026-07-01T00:00:00.000Z"),
  group: "Foundations",
  title: "A1C",
  ...overrides,
});
const dueAt = (daysAgo, now = at("2026-08-10")) => new Date(now.getTime() - daysAgo * 86_400_000).toISOString();

test("all approved Explain It Back challenges are reviewable without new medical content", () => {
  assert.equal(spacedReviewConcepts.length, 10);
  assert.deepEqual(spacedReviewConcepts.map(({ challengeId }) => challengeId), explainItBackChallenges.map(({ id }) => id));
  assert.deepEqual(spacedReviewConcepts.filter(({ learnedFromLessonIds }) => !learnedFromLessonIds.length).map(({ challengeId }) => challengeId), ["serving-size", "total-vs-added-sugars"]);
  assert.equal(new Set(spacedReviewConcepts.map(({ challengeId }) => challengeId)).size, 10);
  const lessonIds = new Set(Object.values(lessonIdByDay));
  assert.equal(spacedReviewConcepts.flatMap(({ learnedFromLessonIds }) => learnedFromLessonIds).every((id) => lessonIds.has(id)), true);
  assert.equal(spacedReviewConfig.initialIntervalDays > 0, true);
  assert.equal(spacedReviewConfig.successIntervalsDays.every((days) => days > 0), true);
});

test("linked lesson exposure initializes the first due date three days after earliest learning", () => {
  const state = initializeReviewState("a1c", "2026-08-01T12:00:00.000Z");
  assert.equal(state.nextDueAt, "2026-08-04T12:00:00.000Z");
  assert.equal(spacedReviewConcepts.find(({ challengeId }) => challengeId === "a1c").learnedFromLessonIds.length, 1);
  assert.equal(spacedReviewConcepts.find(({ challengeId }) => challengeId === "serving-size").learnedFromLessonIds.length, 0);
});

test("successful reviews progress through 7, 14, 30, and 60 day intervals", () => {
  let state = candidate();
  const intervals = [];
  for (let index = 0; index < 5; index += 1) {
    const now = at(`2026-08-${String(index + 1).padStart(2, "0")}`);
    state = scheduleReviewResult({ state, verdict: "got_it", now, hadRetry: false, exampleViewed: false });
    intervals.push((Date.parse(state.nextDueAt) - now.getTime()) / 86_400_000);
  }
  assert.deepEqual(intervals, [7, 14, 30, 60, 60]);
});

test("retry success, almost there, try again, and example viewing use gentle reinforcement intervals", () => {
  const state = candidate();
  const now = at("2026-08-10");
  const days = (verdict, hadRetry, exampleViewed) => (Date.parse(scheduleReviewResult({ state, verdict, now, hadRetry, exampleViewed }).nextDueAt) - now.getTime()) / 86_400_000;
  assert.equal(days("got_it", true, false), 4);
  assert.equal(days("almost_there", false, false), 2);
  assert.equal(days("try_again", false, false), 1);
  assert.equal(days("got_it", false, true), 1);
  assert.equal(scheduleReviewResult({ state, verdict: "got_it", now, hadRetry: true, exampleViewed: false }).successfulReviewCount, 0);
  assert.deepEqual(state, candidate(), "abandoning without a result leaves state unchanged");
});

test("a due weak concept outranks a stronger concept due five days earlier", () => {
  const now = at("2026-08-10");
  const result = selectReviewCandidate({ now, manual: false, candidates: [candidate({ challengeId: "a1c", nextDueAt: dueAt(5), lastVerdict: "got_it" }), candidate({ challengeId: "insulin-resistance", title: "Insulin resistance", nextDueAt: dueAt(0), lastVerdict: "try_again" })] });
  assert.equal(result.candidate?.challengeId, "insulin-resistance");
});

test("a severely overdue concept outranks a slightly overdue equally strong concept", () => {
  const now = at("2026-08-10");
  const result = selectReviewCandidate({ now, manual: false, candidates: [candidate({ challengeId: "a1c", nextDueAt: dueAt(20), lastVerdict: "got_it" }), candidate({ challengeId: "insulin", title: "Insulin", nextDueAt: dueAt(1), lastVerdict: "got_it" })] });
  assert.equal(result.candidate?.challengeId, "a1c");
});

test("Foundations is only the final tie-breaker", () => {
  const now = at("2026-08-10");
  const food = candidate({ challengeId: "carbohydrates", title: "Carbohydrates", group: "Food & labels", nextDueAt: dueAt(2) });
  const foundation = candidate({ challengeId: "insulin", title: "Insulin", nextDueAt: dueAt(2) });
  assert.equal(selectReviewCandidate({ candidates: [food, foundation], now, manual: false }).candidate?.challengeId, "insulin");
  assert.equal(selectReviewCandidate({ candidates: [food, candidate({ ...foundation, nextDueAt: dueAt(1) })], now, manual: false }).candidate?.challengeId, "carbohydrates");
});

test("manual review chooses one closest eligible concept and has an intentional empty result", () => {
  const now = at("2026-08-10");
  const future = [candidate({ challengeId: "a1c", nextDueAt: "2026-08-20T00:00:00.000Z" }), candidate({ challengeId: "insulin", title: "Insulin", nextDueAt: "2026-08-12T00:00:00.000Z" })];
  assert.equal(selectReviewCandidate({ candidates: future, now, manual: true }).candidate?.challengeId, "insulin");
  assert.equal(selectReviewCandidate({ candidates: future, now, manual: false }).candidate, null);
  assert.equal(selectReviewCandidate({ candidates: [], now, manual: true }).candidate, null);
});

test("automatic prompts require a due concept and respect gap, weekly cap, and snooze", () => {
  const now = at("2026-08-10");
  const selection = { candidate: candidate({ nextDueAt: dueAt(1) }), due: true };
  const base = { selection, now, lastPromptedAt: null, dismissedUntil: null, promptHistory: [] };
  assert.equal(shouldOfferAutomaticReview(base), true);
  assert.equal(shouldOfferAutomaticReview({ ...base, selection: { ...selection, due: false } }), false);
  assert.equal(shouldOfferAutomaticReview({ ...base, lastPromptedAt: "2026-08-09T12:00:00.000Z" }), false);
  assert.equal(shouldOfferAutomaticReview({ ...base, promptHistory: ["2026-08-04T00:00:00.000Z", "2026-08-06T00:00:00.000Z", "2026-08-08T00:00:00.000Z"] }), false);
  assert.equal(shouldOfferAutomaticReview({ ...base, dismissedUntil: "2026-08-11T00:00:00.000Z" }), false);
  assert.equal(selectReviewCandidate({ candidates: [selection.candidate], now, manual: true }).candidate?.challengeId, "a1c", "manual review remains available while prompts are snoozed");
});

test("review copy stays natural and never uses pressure language", () => {
  const copy = reviewPromptCopy(candidate(), at("2026-08-10"));
  assert.match(copy, /quick review|little while|few days/);
  assert.doesNotMatch(copy, /overdue|failed|weak|score|streak|mastery/i);
});

test("persistence is metadata-only, idempotent, server-timed, and owner-scoped", async () => {
  const migration = await readFile(new URL("../supabase/migrations/20260810000003_spaced_review.sql", import.meta.url), "utf8");
  assert.match(migration, /primary key \(user_id, challenge_id\)/);
  assert.match(migration, /users read own spaced review state/);
  assert.match(migration, /auth\.uid\(\).*user_id|user_id = v_user_id/s);
  assert.match(migration, /last_result_token = p_result_token then return false/);
  assert.match(migration, /clock_timestamp\(\)/);
  assert.match(migration, /initialize_spaced_review_from_lessons/);
  assert.match(migration, /min\(progress\.completed_at\)/);
  assert.doesNotMatch(migration, /pg_catalog\.boolean/);
  assert.doesNotMatch(migration, /explanation\s+pg_catalog|response_text|prompt_text|medical_data/i);
  assert.doesNotMatch(migration, /policy .*insert|policy .*update/i);
});

test("review mode reuses Explain It Back and never exposes a topic picker or changes streaks", async () => {
  const [component, api, journey, streakTypes, milestones] = await Promise.all([
    readFile(new URL("../features/explain-it-back/components/explain-it-back-experience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/explain-it-back/evaluate/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/(app)/journey/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../features/streaks/types/learning-streak.ts", import.meta.url), "utf8"),
    readFile(new URL("../features/achievements/content/milestone-definitions.ts", import.meta.url), "utf8"),
  ]);
  assert.match(component, /mode === "practice"/);
  assert.match(component, /Nothing to review yet/);
  assert.match(component, /We couldn’t choose a review right now/);
  assert.match(api, /recordSpacedReviewResult/);
  assert.match(api, /result\.status === "evaluated"/);
  assert.ok(api.indexOf("if (!result.ok)") < api.indexOf("reviewRecorded = await recordSpacedReviewResult"), "evaluator failure returns before scheduling");
  assert.doesNotMatch(api, /recordQualifyingLearningActivity/);
  assert.match(journey, /JourneySpacedReview/);
  assert.doesNotMatch(streakTypes, /spaced.review/i);
  assert.doesNotMatch(milestones, /spaced.review|review streak|memory strength/i);
});

test("unknown challenges and malformed spaced-review requests are rejected", () => {
  assert.equal(explainItBackRequestSchema.safeParse({ challengeId: "unknown", explanation: "This is a useful explanation." }).success, false);
  assert.equal(explainItBackRequestSchema.safeParse({ challengeId: "a1c", explanation: "This is a useful explanation.", mode: "spaced-review" }).success, false);
});

test("Spaced Review is optional in Next Step and never replaces required learning", () => {
  const required = recommendNextStep({ completedLessonCount: 8, currentLesson: { dayNumber: 9, estimatedMinutes: 8, status: "not_started", title: "Lesson" }, earnedMilestoneIds: new Set(), lastDismissed: null, today: "2026-08-10", hasDueSpacedReview: true });
  assert.equal(required.primary.type, "next-lesson");
  const complete = recommendNextStep({ completedLessonCount: 14, currentLesson: null, earnedMilestoneIds: new Set(["MILESTONE-MYTH-CHECKER"]), lastDismissed: null, today: "2026-08-10", hasDueSpacedReview: true });
  assert.equal(complete.primary.type, "spaced-review");
});

test("automatic prompt integration exists only on Journey and protected content remains untouched", async () => {
  const protectedRoots = ["features/lessons/content", "features/caregiver/content", "features/stories/content", "content/resources"];
  for (const root of protectedRoots) {
    let names = [];
    try { names = await readdir(new URL(`../${root}/`, import.meta.url), { recursive: true }); } catch { continue; }
    for (const name of names.filter((value) => /\.(?:ts|sql)$/.test(value))) {
      const source = await readFile(new URL(`../${root}/${name}`, import.meta.url), "utf8");
      assert.doesNotMatch(source, /spaced.review/i, `${root}/${name}`);
    }
  }
  const promptComponent = await readFile(new URL("../features/spaced-review/components/journey-spaced-review.tsx", import.meta.url), "utf8");
  assert.match(promptComponent, /journeyPromptDelayMs/);
  assert.match(promptComponent, /Not now/);
  assert.doesNotMatch(promptComponent, /topic|shuffle|different concept|streak|score|overdue/i);
});
