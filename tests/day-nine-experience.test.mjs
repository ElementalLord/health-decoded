import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const player = readFileSync("features/lessons/components/lesson-player.tsx", "utf8");
const experience = readFileSync("features/lessons/components/day-nine-experience.tsx", "utf8");
const styles = readFileSync("features/lessons/components/day-nine-experience.module.css", "utf8");
const action = readFileSync("features/lessons/actions/day-nine.actions.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260721000001_day_nine_highs_lows_when_to_act.sql",
  "utf8",
);
const unlockMigration = readFileSync(
  "supabase/migrations/20260721000002_reopen_journey_for_day_nine.sql",
  "utf8",
);

test("Day 9 uses one custom nine-chapter experience", () => {
  assert.match(player, /if \(lesson\.dayNumber === 9\) return <DayNineExperience/);
  assert.match(experience, /const stageCount = 9/);
  assert.match(
    experience,
    /Knowing what to do is more powerful than being afraid of what might happen/,
  );
});

test("Day 9 includes distinct purposeful looping visual explanations", () => {
  assert.match(experience, /function SteadyBalanceAnimation/);
  assert.match(experience, /function SlowTideAnimation/);
  assert.match(experience, /function QuickBellAnimation/);
  assert.match(experience, /function ActionPathAnimation/);
  assert.match(experience, /function SteadyHandAnimation/);
  assert.ok(
    (experience.match(/repeatCount="indefinite"/g) ?? []).length >= 16,
    "expected multiple independently moving parts across all five visual explanations",
  );
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(experience, /type="range"/);
});

test("Day 9 visual metaphors keep their sequence and labels legible", () => {
  assert.match(experience, /YOUR BODY LIKES BALANCE/);
  assert.match(experience, /HIGH OFTEN BUILDS SLOWLY/);
  assert.match(experience, /LOWS OFTEN ANNOUNCE THEMSELVES QUICKLY/);
  assert.match(experience, /A CALM PATH BEATS A PANICKED GUESS/);
  assert.match(experience, /A SIGNAL ASKS FOR ATTENTION, NOT PANIC/);
  assert.match(experience, /PAUSE · BREATHE · FOLLOW YOUR PLAN/);
  assert.match(experience, /MOST MOMENTS USE THE CALM PATH · A FEW USE THE FAST LANE/);
  assert.match(experience, /Here is the use:/);
});

test("Day 9 distinguishes high from low signals and keeps sorting kind", () => {
  assert.match(experience, /side: "high"/);
  assert.match(experience, /side: "low"/);
  assert.match(experience, /OFTEN WITH HIGH · USUALLY GRADUAL/);
  assert.match(experience, /OFTEN WITH LOW · USUALLY QUICK/);
  assert.match(experience, /common-pattern practice, not a diagnosis/);
  assert.match(experience, /Gently: this one more often travels with/);
});

test("Day 9 teaches preparedness without prescribing treatment", () => {
  assert.match(experience, /It depends largely on which medications someone takes/);
  assert.match(experience, /the exact steps\s+belong to your personal plan/i);
  assert.match(experience, /Seek medical care promptly/);
  assert.doesNotMatch(experience, /mg\/dL|mmol\/L/);
  assert.doesNotMatch(experience, /15-15|fifteen grams/i);
  assert.doesNotMatch(experience, /target range|ideal number/i);
});

test("Day 9 keeps evaluation authenticated and help-seeking encouraged", () => {
  assert.match(action, /getAuthenticatedUser/);
  assert.match(action, /asking for help early is part of good self-care/i);
  assert.match(action, /deserve prompt medical care/);
  assert.match(experience, /not saved as health information/);
});

test("Day 9 is published and unlocks only after completed Day 8", () => {
  assert.match(migration, /highs-lows-and-knowing-when-to-act/);
  assert.match(migration, /30000000-0000-0000-0000-000000000009/);
  assert.match(migration, /30000000-0000-0000-0000-000000000008/);
  assert.match(unlockMigration, /day_eight_progress\.status = 'completed'/);
  assert.match(unlockMigration, /lesson_progress_unique_user_journey_lesson/);
});
