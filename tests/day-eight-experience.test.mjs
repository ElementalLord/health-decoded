import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const player = readFileSync("features/lessons/components/lesson-player.tsx", "utf8");
const experience = readFileSync("features/lessons/components/day-eight-experience.tsx", "utf8");
const styles = readFileSync("features/lessons/components/day-eight-experience.module.css", "utf8");
const action = readFileSync("features/lessons/actions/day-eight.actions.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260718000004_day_eight_understanding_blood_sugar_data.sql",
  "utf8",
);
const unlockMigration = readFileSync(
  "supabase/migrations/20260718000005_reopen_journey_for_day_eight.sql",
  "utf8",
);

test("Day 8 uses one custom nine-chapter experience", () => {
  assert.match(player, /if \(lesson\.dayNumber === 8\) return <DayEightExperience/);
  assert.match(experience, /const stageCount = 9/);
  assert.match(experience, /A reading is information—not a verdict/);
});

test("Day 8 includes distinct purposeful looping visual explanations", () => {
  assert.match(experience, /function DashboardAnimation/);
  assert.match(experience, /function ToolStudioAnimation/);
  assert.match(experience, /function ContextConstellationAnimation/);
  assert.match(experience, /function ReframeContextAnimation/);
  assert.match(experience, /function CareConversationAnimation/);
  assert.match(experience, /function PatternLoomAnimation/);
  assert.ok(
    (experience.match(/repeatCount="indefinite"/g) ?? []).length >= 16,
    "expected multiple independently moving parts across all four visual explanations",
  );
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(experience, /type="range"/);
});

test("Day 8 visual metaphors keep their sequence and labels legible", () => {
  assert.match(experience, /FROM NUMBER TO USEFUL CONVERSATION/);
  assert.match(experience, /NOTICE · ADD CONTEXT · ASK WHAT THE PATTERN CAN TEACH/);
  assert.match(experience, /FROM SURPRISE TO A USEFUL QUESTION/);
  assert.match(experience, /ONE READING \+ CONTEXT = A BETTER QUESTION/);
  assert.match(experience, /Here is the use:/);
  assert.doesNotMatch(styles, /\.reframePerson/);
  assert.doesNotMatch(experience, /className=\{styles\.dashboardCar\}/);
  assert.doesNotMatch(styles, /\.conversationPortrait/);
});

test("Day 8 teaches context and patterns without prescribing targets", () => {
  assert.match(experience, /One reading belongs to one moment/);
  assert.match(experience, /A pattern is not perfection/);
  assert.match(experience, /not everyone needs home monitoring or a\s+CGM/i);
  assert.doesNotMatch(experience, /target range|ideal number|check every day/i);
  assert.doesNotMatch(experience, /mg\/dL|mmol\/L/);
});

test("Day 8 keeps evaluation authenticated and treatment changes clinician-led", () => {
  assert.match(action, /getAuthenticatedUser/);
  assert.match(action, /not enough reason to change a treatment plan on your own/);
  assert.match(
    experience,
    /General education cannot tell you to change a\s+personal treatment plan/,
  );
  assert.match(experience, /not saved as health information/);
});

test("Day 8 is published and unlocks only after completed Day 7", () => {
  assert.match(migration, /understanding-your-blood-sugar-data/);
  assert.match(migration, /30000000-0000-0000-0000-000000000008/);
  assert.match(unlockMigration, /day_seven_progress\.status = 'completed'/);
  assert.match(unlockMigration, /lesson_progress_unique_user_journey_lesson/);
});
