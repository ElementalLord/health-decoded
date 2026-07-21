import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const player = readFileSync("features/lessons/components/lesson-player.tsx", "utf8");
const experience = readFileSync("features/lessons/components/day-eleven-experience.tsx", "utf8");
const styles = readFileSync("features/lessons/components/day-eleven-experience.module.css", "utf8");
const action = readFileSync("features/lessons/actions/day-eleven.actions.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260721000006_day_eleven_preventing_complications_without_fear.sql",
  "utf8",
);
const unlockMigration = readFileSync(
  "supabase/migrations/20260721000007_reopen_journey_for_day_eleven.sql",
  "utf8",
);

test("Day 11 uses one custom ten-chapter experience", () => {
  assert.match(player, /if \(lesson\.dayNumber === 11\) return <DayElevenExperience/);
  assert.match(experience, /const stageCount = 10/);
  assert.match(experience, /Your future deserves a plan, not a fear story/);
  assert.match(experience, /Protection grows wherever care keeps showing up/);
});

test("Day 11 includes at least three distinct endlessly looping visual explanations", () => {
  assert.match(experience, /function FutureGardenAnimation/);
  assert.match(experience, /function ConnectedBodyAnimation/);
  assert.match(experience, /function QuietSignalScannerAnimation/);
  assert.match(experience, /function AbcOrbitAnimation/);
  assert.doesNotMatch(experience, /lighthouse|lantern/i);
  assert.ok(
    (experience.match(/repeatCount="indefinite"/g) ?? []).length >= 20,
    "expected multiple independently looping elements across the four visual explanations",
  );
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("Day 11 keeps its completion headline centered with the card beneath it", () => {
  assert.match(
    experience,
    /<LessonHeading centered>Protection grows wherever care keeps showing up\.<\/LessonHeading>/,
  );
});

test("Day 11 turns the blueprint activities into user-input interactions", () => {
  assert.match(experience, /The protection constellation/);
  assert.match(experience, /timelineMatches/);
  assert.match(experience, /Pack your care compass/);
  assert.match(experience, /careChoices\.size >= 4/);
  assert.match(experience, /Which preventive check surprised you most/);
  assert.match(experience, /One-sentence teach-back/);
});

test("Day 11 teaches each required protection concept without fear framing", () => {
  assert.match(experience, /Complications are risks, not\s+guarantees/);
  assert.match(experience, /screening can\s+help\s+you stay ahead/);
  assert.match(experience, /A1C/);
  assert.match(experience, /Blood pressure/);
  assert.match(experience, /Cholesterol/);
  assert.match(experience, /Diabetes eye screening/);
  assert.match(experience, /Kidney blood and urine tests/);
  assert.match(experience, /Foot check/);
});

test("Day 11 keeps screening schedules personalized and evaluation authenticated", () => {
  assert.match(action, /getAuthenticatedUser/);
  assert.match(experience, /clinician will personalize when each one is due/);
  assert.match(experience, /Screening schedules vary/);
  assert.match(experience, /not saved as health information/);
  assert.doesNotMatch(experience, /mg\/dL|mmol\/L/);
  assert.doesNotMatch(experience, /ideal number/i);
});

test("Day 11 is published and unlocks only after completed Day 10", () => {
  assert.match(migration, /preventing-complications-without-fear/);
  assert.match(migration, /20000000-0000-0000-0000-000000000011/);
  assert.match(migration, /30000000-0000-0000-0000-000000000011/);
  assert.match(migration, /30000000-0000-0000-0000-000000000010/);
  assert.match(unlockMigration, /day_ten_progress\.status = 'completed'/);
  assert.match(unlockMigration, /lesson_progress_unique_user_journey_lesson/);
});
