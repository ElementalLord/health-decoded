import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { calculateLearningStreak } from "../features/streaks/lib/calculate-learning-streak.ts";
import { resolveLearningTimezone } from "../features/streaks/lib/learning-timezone.ts";

const initial = {
  currentStreak: 0,
  longestStreak: 0,
  freezeBalance: 2,
  lastQualifiedDate: null,
  timezone: "America/Chicago",
  pendingNotice: null,
};

test("first qualifying day starts at one with two starting freezes", () => {
  const result = calculateLearningStreak(initial, "2026-08-03");
  assert.equal(result.currentStreak, 1);
  assert.equal(result.longestStreak, 1);
  assert.equal(result.freezeBalance, 2);
});

test("multiple events on the same local day count once", () => {
  const first = calculateLearningStreak(initial, "2026-08-03");
  const duplicate = calculateLearningStreak(first, "2026-08-03");
  assert.equal(duplicate.currentStreak, 1);
  assert.equal(duplicate.dayRecorded, false);
});

test("a direct event and its newly unlocked milestone count once", async () => {
  const directEvent = calculateLearningStreak(initial, "2026-08-03");
  const milestoneFromSameSource = calculateLearningStreak(directEvent, "2026-08-03");
  assert.equal(milestoneFromSameSource.currentStreak, 1);
  assert.equal(milestoneFromSameSource.dayRecorded, false);
  const service = await readFile(
    new URL("../features/achievements/services/milestones.server.ts", import.meta.url),
    "utf8",
  );
  assert.match(service, /options\.recordStreak &&\s*!streakEvent/);
});

test("next-day activity increases the streak", () => {
  const monday = calculateLearningStreak(initial, "2026-08-03");
  const tuesday = calculateLearningStreak(monday, "2026-08-04");
  assert.equal(tuesday.currentStreak, 2);
  assert.equal(tuesday.freezeBalance, 2);
});

test("one missed day consumes one freeze and preserves continuity", () => {
  const monday = calculateLearningStreak(initial, "2026-08-03");
  const wednesday = calculateLearningStreak(monday, "2026-08-05");
  assert.equal(wednesday.currentStreak, 3);
  assert.equal(wednesday.freezeBalance, 1);
  assert.equal(wednesday.freezeUsed, 1);
});

test("two missed days consume both freezes", () => {
  const monday = calculateLearningStreak(initial, "2026-08-03");
  const thursday = calculateLearningStreak(monday, "2026-08-06");
  assert.equal(thursday.currentStreak, 4);
  assert.equal(thursday.freezeBalance, 0);
  assert.equal(thursday.freezeUsed, 2);
});

test("an unbridgeable gap resets without wasting freezes", () => {
  const monday = calculateLearningStreak(initial, "2026-08-03");
  const friday = calculateLearningStreak(monday, "2026-08-07");
  assert.equal(friday.currentStreak, 1);
  assert.equal(friday.freezeBalance, 2);
  assert.equal(friday.freezeUsed, 0);
  assert.equal(friday.pendingNotice, "streak_reset");
});

test("freeze balance cannot become negative", () => {
  const state = {
    ...initial,
    currentStreak: 3,
    longestStreak: 3,
    freezeBalance: 0,
    lastQualifiedDate: "2026-08-03",
  };
  const result = calculateLearningStreak(state, "2026-08-05");
  assert.equal(result.freezeBalance, 0);
  assert.equal(result.currentStreak, 1);
});

test("server architecture rejects client dates and arbitrary streak values", async () => {
  const [action, service, migration] = await Promise.all([
    readFile(
      new URL("../features/achievements/actions/milestone.actions.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../features/streaks/services/learning-streak.server.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../supabase/migrations/20260803000001_personalized_next_step_and_learning_streak.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);
  assert.doesNotMatch(action, /activityDate|currentStreak|freezeBalance/);
  assert.doesNotMatch(action, /case "lesson_completed"/);
  assert.match(service, /record_learning_activity/);
  assert.match(migration, /clock_timestamp\(\) at time zone v_timezone/);
  assert.match(migration, /pg_timezone_names/);
  assert.match(migration, /on conflict \(user_id, activity_date\) do nothing/);
  assert.match(migration, /freeze_balance pg_catalog\.int4 not null default 2/);
  assert.match(migration, /milestone_earned/);
  assert.match(migration, /milestone_id <> 'MILESTONE-PERSONAL-TOOLKIT'/);
  assert.doesNotMatch(migration, /users initialize own learning streak/);
  assert.match(migration, /create or replace function public\.initialize_learning_streak/);
  assert.ok((migration.match(/security definer\nset search_path = ''/g) ?? []).length >= 4);
  assert.doesNotMatch(migration, /p_activity_date|p_current_streak|p_freeze_balance/);
});

test("timezone fallback prefers saved, then browser, then UTC", () => {
  assert.equal(
    resolveLearningTimezone("America/Chicago", "America/New_York"),
    "America/Chicago",
  );
  assert.equal(resolveLearningTimezone(null, "America/New_York"), "America/New_York");
  assert.equal(resolveLearningTimezone("not/a-zone", "also/not-a-zone"), "UTC");
});

test("starting freezes are persisted once per user", async () => {
  const migration = await readFile(
    new URL(
      "../supabase/migrations/20260803000001_personalized_next_step_and_learning_streak.sql",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(migration, /user_id pg_catalog\.uuid primary key/);
  assert.match(migration, /on conflict \(user_id\) do nothing/);
  assert.doesNotMatch(migration, /freeze_balance\s*=\s*2/);
});
