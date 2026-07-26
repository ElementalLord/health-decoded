import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const player = readFileSync("features/lessons/components/lesson-player.tsx", "utf8");
const experience = readFileSync("features/lessons/components/day-fourteen-experience.tsx", "utf8");
const styles = readFileSync(
  "features/lessons/components/day-fourteen-experience.module.css",
  "utf8",
);
const migration = readFileSync(
  "supabase/migrations/20260726000001_day_fourteen_foundation_milestone.sql",
  "utf8",
);
const unlockMigration = readFileSync(
  "supabase/migrations/20260726000002_reopen_journey_for_day_fourteen.sql",
  "utf8",
);
const completeState = readFileSync(
  "features/journeys/components/journey-complete-state.tsx",
  "utf8",
);
const completionArrival = readFileSync(
  "features/journeys/components/lesson-completion-arrival.tsx",
  "utf8",
);

test("Day 14 uses one calm seven-chapter milestone experience", () => {
  assert.match(player, /if \(lesson\.dayNumber === 14\) return <DayFourteenExperience/);
  assert.match(experience, /const stageCount = 7/);
  assert.match(experience, /You know more than you did fourteen days ago/);
  assert.match(experience, /Your foundation is built/);
  assert.match(experience, /Day 15 begins with understanding behind you/);
});

test("Day 14 uses three unmistakably human continuously looping teaching scenes", () => {
  assert.match(experience, /function OrdinaryDayAnimation/);
  assert.match(experience, /function ReturnAfterRainAnimation/);
  assert.match(experience, /function FullLifePicnicAnimation/);
  assert.equal((experience.match(/data-motion-loop="continuous"/g) ?? []).length, 3);
  assert.match(experience, /One useful tool\s+enters when the moment calls for it/);
  assert.match(experience, /a changed moment does not have to become an abandoned plan/);
  assert.match(experience, /The purpose of the plan is a fuller ordinary life/);
  assert.match(styles, /animation: ordinary-moment-wake 12s ease-in-out infinite/);
  assert.match(styles, /animation: friends-pause-and-return 12s ease-in-out infinite/);
  assert.match(styles, /animation: picnic-ball-arc 4s ease-in-out infinite/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /data-reduced-motion="true"/);
  assert.doesNotMatch(experience, /slider|range|lighthouse|lantern|random graph/i);
});

test("Day 14 grounds recognition and optimism in two unique human scenes", () => {
  assert.match(experience, /quiet-recognition\.jpg/);
  assert.match(experience, /life-keeps-growing\.jpg/);
  assert.match(experience, /Two sisters sit at a warm dining table/);
  assert.match(experience, /grandfather and his teenage granddaughter/);

  for (const filename of ["quiet-recognition.jpg", "life-keeps-growing.jpg"]) {
    assert.ok(statSync(`public/lessons/day-14/${filename}`).size > 100_000);
  }
});

test("Day 14 keeps reflection light, optional, and free from checkbox labor", () => {
  assert.match(experience, /Reflections on this lesson are optional/);
  assert.match(experience, /You can choose one, or simply keep reading/);
  assert.match(experience, /One sentence is enough/);
  assert.match(experience, /Choosing is optional/);
  assert.match(experience, /arrivalFeelings/);
  assert.match(experience, /carryTruths/);
  assert.match(experience, /confidenceViews/);
  assert.match(experience, /nextSteps/);
  assert.match(experience, /promise/);
  assert.doesNotMatch(
    experience,
    /toolkitItems|checklistSkills|draggable=|handleToolDrop|canContinue|stageRequirement|To continue:/,
  );
  assert.doesNotMatch(experience, /\bCheck\b|choiceMark|checkButton/);
  assert.doesNotMatch(experience, /correctAnswer|isCorrect|data-correct|styles\.incorrect/i);
});

test("Day 14 keeps the optional personal note private and revisitable on the same browser", () => {
  assert.match(experience, /day-fourteen-foundation/);
  assert.match(experience, /window\.localStorage\.setItem\(draftKey/);
  assert.match(experience, /saved only in this browser/i);
  assert.match(experience, /not sent to Health Decoded as health\s+information/);
  assert.match(experience, /Clear my private Day 14 note from this browser/);
  assert.doesNotMatch(experience, /insert\(|update\(|from\(/);
});

test("Day 14 uses an open editorial layout instead of a modern card dashboard", () => {
  assert.match(styles, /\.journalChoice[\s\S]*border-top: 1px solid/);
  assert.match(styles, /\.foundationPages[\s\S]*border-top: 1px solid/);
  assert.match(styles, /\.motionFigure[\s\S]*border-top: 1px solid/);
  assert.match(styles, /\.progressTrack[\s\S]*border-radius: 3px/);
  assert.match(styles, /--lesson-ink: #50665f/);
  assert.doesNotMatch(styles, /box-shadow:\s*0 18px 50px/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px)/);
  assert.doesNotMatch(experience, /rounded-full/);
});

test("Day 14 is a foundation milestone rather than a false ninety-day finale", () => {
  assert.match(experience, /Foundation complete · Days 1–14/);
  assert.match(experience, /The next 76 days/);
  assert.doesNotMatch(experience, /graduation|trophy|confetti/i);
  assert.match(completeState, /Foundation phase · Days 1–14/);
  assert.match(completeState, /The next 76 days/);
  assert.doesNotMatch(completeState, /All ninety days|journey is complete/i);
  assert.match(completionArrival, /fourteen-day foundation is complete/);
});

test("Day 14 is published and unlocks only after completed Day 13", () => {
  assert.match(migration, /your-foundation-is-built/);
  assert.match(migration, /20000000-0000-0000-0000-000000000014/);
  assert.match(migration, /30000000-0000-0000-0000-000000000014/);
  assert.match(migration, /30000000-0000-0000-0000-000000000013/);
  assert.match(unlockMigration, /day_thirteen_progress\.status = 'completed'/);
  assert.match(unlockMigration, /lesson_progress_unique_user_journey_lesson/);
});
