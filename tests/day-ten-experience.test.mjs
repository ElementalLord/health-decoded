import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const player = readFileSync("features/lessons/components/lesson-player.tsx", "utf8");
const experience = readFileSync("features/lessons/components/day-ten-experience.tsx", "utf8");
const styles = readFileSync("features/lessons/components/day-ten-experience.module.css", "utf8");
const action = readFileSync("features/lessons/actions/day-ten.actions.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260721000003_day_ten_routines_make_diabetes_easier.sql",
  "utf8",
);
const unlockMigration = readFileSync(
  "supabase/migrations/20260721000004_reopen_journey_for_day_ten.sql",
  "utf8",
);

test("Day 10 uses one custom nine-chapter experience", () => {
  assert.match(player, /if \(lesson\.dayNumber === 10\) return <DayTenExperience/);
  assert.match(experience, /const stageCount = 9/);
  assert.match(experience, /A clear routine is easier to repeat/);
});

test("Day 10 includes distinct comforting looping visual explanations", () => {
  assert.match(experience, /function DayRhythmAnimation/);
  assert.match(experience, /function DecisionLanternAnimation/);
  assert.match(experience, /function HabitLoopAnimation/);
  assert.match(experience, /function CompletionCueStaircaseAnimation/);
  assert.match(experience, /function GrowthOverWeeksAnimation/);
  assert.ok(
    (experience.match(/repeatCount="indefinite"/g) ?? []).length >= 16,
    "expected multiple independently moving parts across all five visual explanations",
  );
  assert.ok(
    (experience.match(/opacity="0"/g) ?? []).length >= 6,
    "delayed decorative elements must stay invisible until their loops begin",
  );
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(experience, /type="range"/);
});

test("Day 10 visual metaphors keep their sequence and labels legible", () => {
  assert.match(experience, /A DAY WITH GENTLE ANCHORS/);
  assert.match(experience, /FEWER DECISIONS · MORE CALM/);
  assert.match(experience, /THE LOOP THAT MAKES HABITS AUTOMATIC/);
  assert.match(experience, /GIVE THE ROUTINE A CLEAR ENDING/);
  assert.match(experience, /PROGRESS GROWS OVER WEEKS, NOT DAYS/);
  assert.match(experience, /A ROUTINE IS A DECISION YOU ONLY MAKE ONCE/);
  assert.match(experience, /BEGIN · DO · NOTICE THE FINISH/);
  assert.match(experience, /Here is the use:/);
});

test("Day 10 teaches habit stacking and environment design interactively", () => {
  assert.match(experience, /After I brush my teeth/);
  assert.match(experience, /habitAnchors/);
  assert.match(experience, /habitAdditions/);
  assert.match(experience, /Build at least two/);
  assert.match(experience, /Walking shoes near the door/);
  assert.match(experience, /tap one to unstack/);
});

test("Day 10 stays kind and non-prescriptive", () => {
  assert.match(experience, /as prescribed/);
  assert.match(experience, /if recommended/);
  assert.match(experience, /without turning it into a reward\s+test/);
  assert.doesNotMatch(experience, /mg\/dL|mmol\/L/);
  assert.doesNotMatch(experience, /target range|ideal number/i);
});

test("Day 10 keeps evaluation authenticated and routine closure nonjudgmental", () => {
  assert.match(action, /getAuthenticatedUser/);
  assert.match(action, /A simple finish cue makes the completed action visible/);
  assert.match(action, /Completion does not need a penalty/);
  assert.match(experience, /not saved as health information/);
});

test("Day 10 is published and unlocks only after completed Day 9", () => {
  assert.match(migration, /building-routines-that-make-diabetes-easier/);
  assert.match(migration, /30000000-0000-0000-0000-000000000010/);
  assert.match(migration, /30000000-0000-0000-0000-000000000009/);
  assert.match(unlockMigration, /day_nine_progress\.status = 'completed'/);
  assert.match(unlockMigration, /lesson_progress_unique_user_journey_lesson/);
});
