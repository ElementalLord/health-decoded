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

test("Day 14 uses the fuller eleven-chapter rhythm of the early lessons", () => {
  assert.match(player, /if \(lesson\.dayNumber === 14\) return <DayFourteenExperience/);
  assert.match(experience, /const stageCount = 11/);
  assert.match(
    experience,
    /text-\[length:var\(--text-page-title\)\] font-normal leading-\[0\.96\]/,
  );
  assert.match(experience, /border-b border-border pb-5/);
  assert.match(experience, /flex-1 py-8 sm:py-12/);
  assert.match(experience, /border-t border-border pt-5/);
  assert.match(experience, /You know more than you did fourteen days ago/);
  assert.match(experience, /Your foundation is built/);
  assert.match(experience, /Day 15 begins with understanding behind you/);
});

test("Day 14 uses three human SVG scenes with native continuous motion", () => {
  assert.match(experience, /function OrdinaryLifeMotion/);
  assert.match(experience, /function ReturnAfterRainMotion/);
  assert.match(experience, /function FullLifePicnicMotion/);
  assert.equal((experience.match(/<MotionFigure/g) ?? []).length, 3);
  assert.match(experience, /data-motion-loop="continuous"/);
  assert.ok((experience.match(/repeatCount="indefinite"/g) ?? []).length >= 20);
  assert.ok((experience.match(/<animateTransform/g) ?? []).length >= 10);
  assert.match(experience, /<animateMotion/);
  assert.match(experience, /Breakfast, friendship, and a care conversation/);
  assert.match(experience, /a changed moment does not have to become an abandoned plan/);
  assert.match(experience, /The purpose of the plan is a fuller ordinary life/);
  assert.doesNotMatch(experience, /type="range"|slider|lighthouse|lantern|random graph/i);
});

test("Day 14 keeps the passing cloud physically attached to its rain", () => {
  assert.match(
    experience,
    /className=\{styles\.weatherSystem\}[\s\S]*className=\{styles\.rainCloud\}[\s\S]*className=\{styles\.rainDrops\}[\s\S]*values="-180 0;150 0;510 0"/,
  );
  assert.match(experience, /values="0 -5;0 70"/);
  assert.doesNotMatch(experience, /values="0 -10;70 86"/);
});

test("Day 14 replaces static recap blocks with emotional user-controlled scenes", () => {
  assert.match(experience, /function ThenNowStory/);
  assert.match(experience, /useState<"then" \| "now">/);
  assert.match(experience, /At the beginning/);
  assert.match(experience, /Fourteen days later/);
  assert.match(experience, /The questions did not disappear\. You became less alone inside them/);
  assert.match(experience, /function ToolPracticeStudio/);
  assert.match(experience, /useState<EverydayToolId>\("food"\)/);
  assert.match(experience, /Choose a tool to explore/);
  assert.match(experience, /One tool, inside one real moment/);
  assert.doesNotMatch(experience, /beforeAfter|toolLines/);
});

test("Day 14 includes a connected interactive organ lab with distinct physiology", () => {
  assert.match(experience, /function BodySystemLab/);
  assert.match(experience, /useState<BodySystemId>\("digestion"\)/);
  assert.match(experience, /Stomach \+ intestine/);
  assert.match(experience, /Pancreas/);
  assert.match(experience, /Liver/);
  assert.match(experience, /Muscle/);
  assert.match(experience, /styles\.stomachShape/);
  assert.match(experience, /styles\.pancreasShape/);
  assert.match(experience, /styles\.liverShape/);
  assert.match(experience, /styles\.muscleShape/);
  assert.match(experience, /path="M360 92 L360 176 C390 193 395 225 367 252/);
  assert.match(experience, /path="M384 258 C438 244 486 205 550 160"/);
  assert.match(experience, /path="M542 143 C485 161 435 172 375 184"/);
  assert.match(experience, /Working muscle pulls fuel from the bloodstream/);
});

test("Day 14 converts every formerly static recap into an optional exploration", () => {
  assert.match(experience, /useState<OrdinaryMomentId>\("breakfast"\)/);
  assert.match(experience, /Choose an ordinary moment/);
  assert.match(experience, /function NumberContextExplorer/);
  assert.match(experience, /useState<NumberMomentId>\("fasting"\)/);
  assert.match(experience, /Choose a reading context/);
  assert.match(experience, /function ProtectionExplorer/);
  assert.match(experience, /useState<ProtectionAreaId>\("eyes"\)/);
  assert.match(experience, /Choose an area to protect/);
  assert.match(experience, /function ReturnScenarioExplorer/);
  assert.match(experience, /useState<ReturnScenarioId>\("restaurant"\)/);
  assert.match(experience, /Choose a changed moment/);
  assert.match(experience, /function SupportPractice/);
  assert.match(experience, /useState<SupportOptionId>\("listen"\)/);
  assert.match(experience, /Choose what support means today/);
  assert.doesNotMatch(
    experience,
    /styles\.(?:numberedEssay|contextSequence|protectionSpread|safetyNotes|returnStories|conversationEssay|conversationLines)/,
  );
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
  assert.match(experience, /Choosing is optional/);
  assert.match(experience, /arrivalFeelings/);
  assert.match(experience, /nextSteps/);
  assert.match(experience, /promise/);
  assert.doesNotMatch(experience, /carryTruths|confidenceViews/);
  assert.doesNotMatch(
    experience,
    /toolkitItems|checklistSkills|draggable=|handleToolDrop|canContinue|stageRequirement|To continue:/,
  );
  assert.doesNotMatch(experience, /\bCheck\s*,|choiceMark|checkButton/);
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
  assert.match(styles, /\.editorialChoice[\s\S]*border-top: 1px solid/);
  assert.match(styles, /\.organChoices,[\s\S]*display: flex/);
  assert.match(styles, /\.motionFigure[\s\S]*border-block: 1px solid/);
  assert.match(styles, /--lesson-ink: #50665f/);
  assert.doesNotMatch(styles, /box-shadow:/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px)/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:1\.5rem|2rem|3rem)/);
  assert.doesNotMatch(styles, /border-left|border-inline-start|border-right/);
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
