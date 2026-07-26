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

test("Day 14 uses one custom twelve-chapter milestone experience", () => {
  assert.match(player, /if \(lesson\.dayNumber === 14\) return <DayFourteenExperience/);
  assert.match(experience, /const stageCount = 12/);
  assert.match(experience, /This is not the finish line/);
  assert.match(experience, /Your foundation is built/);
  assert.match(experience, /Day 15 begins with understanding behind you/);
});

test("Day 14 uses three purposeful continuously looping teaching scenes", () => {
  assert.match(experience, /function FoundationHomeAnimation/);
  assert.match(experience, /function PracticeLoopAnimation/);
  assert.match(experience, /function NextStepCalendarAnimation/);
  assert.equal((experience.match(/data-motion-loop="continuous"/g) ?? []).length, 3);
  assert.match(experience, /no room carries the whole house/);
  assert.match(experience, /Repetition is not starting over/);
  assert.match(experience, /Thursday stays open, and Friday still receives a mark/);
  assert.match(styles, /animation: room-purpose-focus 9s ease-in-out infinite/);
  assert.match(styles, /animation: practice-station-focus 9s ease-in-out infinite/);
  assert.match(styles, /animation: calendar-walk-week 8s ease-in-out infinite/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /data-reduced-motion="true"/);
  assert.doesNotMatch(experience, /lighthouse|lantern|bridge|random graph/i);
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

test("Day 14 turns synthesis into meaningful learner input without grading", () => {
  assert.match(experience, /toolkitItems/);
  assert.match(experience, /draggable=\{!selected\}/);
  assert.match(experience, /handleToolDrop/);
  assert.match(experience, /openedFoundations/);
  assert.match(experience, /confidenceScenarios/);
  assert.match(experience, /checklistSkills/);
  assert.match(experience, /planAreas/);
  assert.match(experience, /promise/);
  assert.match(experience, /Nothing here is graded/);
  assert.doesNotMatch(experience, /correctAnswer|isCorrect|data-correct|styles\.incorrect/i);
});

test("Day 14 keeps the personal plan private and revisitable on the same browser", () => {
  assert.match(experience, /day-fourteen-foundation/);
  assert.match(experience, /window\.localStorage\.setItem\(draftKey/);
  assert.match(experience, /saved only in this browser/);
  assert.match(experience, /not sent to Health Decoded as health information/);
  assert.match(experience, /Clear my private Day 14 draft from this browser/);
  assert.doesNotMatch(experience, /insert\(|update\(|from\(/);
});

test("Day 14 keeps controls softly squared and text in the muted confidence palette", () => {
  assert.match(styles, /\.answerChoice[\s\S]*border-radius: 6px/);
  assert.match(styles, /\.toolCard[\s\S]*border-radius: 6px/);
  assert.match(styles, /\.progressTrack[\s\S]*border-radius: 3px/);
  assert.match(styles, /--lesson-ink: #405750/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px)/);
  assert.doesNotMatch(experience, /rounded-full/);
});

test("Day 14 is a foundation milestone rather than a false ninety-day finale", () => {
  assert.match(experience, /Foundation complete · Days 1–14/);
  assert.match(experience, /76 days of practice ahead/);
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
