import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const player = readFileSync("features/lessons/components/lesson-player.tsx", "utf8");
const experience = readFileSync("features/lessons/components/day-seven-experience.tsx", "utf8");
const action = readFileSync("features/lessons/actions/day-seven.actions.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260718000002_day_seven_medicines_are_tools.sql",
  "utf8",
);
const unlockMigration = readFileSync(
  "supabase/migrations/20260718000003_reopen_journey_for_day_seven.sql",
  "utf8",
);

test("Day 7 uses its custom lesson experience", () => {
  assert.match(player, /if \(lesson\.dayNumber === 7\) return <DaySevenExperience/);
  assert.match(experience, /const stageCount = 12/);
});

test("Day 7 includes three purposeful endlessly looping visual explanations", () => {
  assert.match(experience, /function SupportLensAnimation/);
  assert.match(experience, /function BodyToolsAnimation/);
  assert.match(experience, /function InsulinBridgeAnimation/);
  assert.ok(
    (experience.match(/repeatCount="indefinite"/g) ?? []).length >= 12,
    "expected multiple moving parts across the three looping visual explanations",
  );
  assert.doesNotMatch(experience, /type="range"/);
});

test("Day 7 uses distinct motion metaphors and labels every body pathway", () => {
  assert.match(experience, /LIVER LOADING DOCK/);
  assert.match(experience, /DIGESTION HOURGLASS/);
  assert.match(experience, /KIDNEY FILTER/);
  assert.match(experience, /CELL RADIO/);
  assert.match(experience, /An insulin lighthouse signals a cell harbor/);
  assert.doesNotMatch(experience, /className=\{styles\.insulinSignal\}/);
});

test("Day 7 keeps moving parts inside their intended tracks", () => {
  assert.match(experience, /id="day-seven-hourglass-interior"/);
  assert.match(experience, /clipPath="url\(#day-seven-hourglass-interior\)"/);
  assert.match(experience, /path="M188 375H316L297 415V458"/);
  assert.match(experience, /className=\{styles\.harborOpening\}/);
  assert.match(experience, /values="0;0;-90;-90;-180;-180;0"/);
  assert.doesNotMatch(experience, /className=\{styles\.harborDock\}/);
});

test("Day 7 opens the cell harbor before glucose boats enter", () => {
  assert.match(experience, /dur="12s"/);
  assert.match(experience, /keyTimes="0;0\.22;0\.3;0\.78;0\.86;0\.94;1"/);
  assert.match(experience, /keyPoints: "0;0;0;1;1;1"/);
  assert.doesNotMatch(experience, /begin=\{`\$\{item \* 2\.1\}s`\}/);
});

test("Day 7 keeps medication safety clinician-led", () => {
  assert.match(action, /getAuthenticatedUser/);
  assert.match(action, /Do not stop, skip, double, or otherwise change a prescribed medicine/);
  assert.match(experience, /do not compare brands, doses, or personal suitability/);
  assert.match(experience, /not saved to your profile/);
});

test("Day 7 is published and unlocks only after completed Day 6", () => {
  assert.match(migration, /medicines-are-tools-not-judgments/);
  assert.match(migration, /30000000-0000-0000-0000-000000000007/);
  assert.match(unlockMigration, /day_six_progress\.status = 'completed'/);
  assert.match(unlockMigration, /lesson_progress_unique_user_journey_lesson/);
});
