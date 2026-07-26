import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const player = readFileSync("features/lessons/components/lesson-player.tsx", "utf8");
const experience = readFileSync("features/lessons/components/day-twelve-experience.tsx", "utf8");
const styles = readFileSync("features/lessons/components/day-twelve-experience.module.css", "utf8");
const action = readFileSync("features/lessons/actions/day-twelve.actions.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260721000008_day_twelve_problem_solving_for_real_life.sql",
  "utf8",
);
const unlockMigration = readFileSync(
  "supabase/migrations/20260721000009_reopen_journey_for_day_twelve.sql",
  "utf8",
);

test("Day 12 uses one custom ten-chapter experience", () => {
  assert.match(player, /if \(lesson\.dayNumber === 12\) return <DayTwelveExperience/);
  assert.match(experience, /const stageCount = 10/);
  assert.match(experience, /A changed plan can still carry you forward/);
  assert.match(experience, /Flexible care can bend without breaking/);
});

test("Day 12 uses four purposeful loops tied to real decisions and physiology", () => {
  assert.match(experience, /function ChangedDayAnimation/);
  assert.match(experience, /function SickDayBodyAnimation/);
  assert.match(experience, /function CareCallAnimation/);
  assert.match(experience, /function PlanBAnimation/);
  assert.match(experience, /The next choice still counts/);
  assert.match(experience, /LIVER/);
  assert.match(experience, /STOMACH/);
  assert.match(experience, /HYDRATION/);
  assert.match(experience, /A friend helps make a care-team call during illness/);
  assert.match(experience, /Rain falls directly beneath a cloud/);
  assert.equal((experience.match(/data-motion-loop="continuous"/g) ?? []).length, 4);
  assert.ok(
    (experience.match(/repeatCount="indefinite"/g) ?? []).length >= 20,
    "expected multiple independently looping gestures across the four scenes",
  );
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(experience, /lighthouse|lantern|weave|bridge/i);
});

test("Day 12 grounds the lesson in warm human scenes instead of abstract diagrams", () => {
  assert.match(experience, /community-in-real-life\.jpg/);
  assert.match(experience, /sick-day-support\.jpg/);
  assert.match(experience, /plan-b-together\.jpg/);
  assert.match(experience, /play catch and share a hug/);
  assert.match(experience, /offering water beside a phone and written care plan/);
  assert.match(experience, /laughing and dancing together indoors/);
  assert.match(experience, /two friends put music on,\s+dance, and share a hug/);
  assert.doesNotMatch(experience, /AdaptiveDayTimeline|causeFlow|flowConnector|planSequence/);
  assert.doesNotMatch(styles, /\.timelineSteps|\.causeFlow|\.flowConnector|\.planSequence/);
  for (const filename of [
    "community-in-real-life.jpg",
    "sick-day-support.jpg",
    "plan-b-together.jpg",
  ]) {
    assert.ok(statSync(`public/lessons/day-12/${filename}`).size > 100_000);
  }
});

test("Day 12 adopts Day 11's editorial hierarchy with softly squared controls", () => {
  assert.match(experience, /ProgressBar/);
  assert.match(experience, /max-w-\[1020px\]/);
  assert.match(experience, /text-\[length:var\(--text-page-title\)\]/);
  assert.match(styles, /\.answerChoice[\s\S]*border-radius: 9px/);
  assert.match(styles, /\.motionFigure[\s\S]*border-radius: 12px/);
  assert.match(styles, /color: #405750/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px)/);
  assert.doesNotMatch(experience, /rounded-full/);
});

test("Day 12 turns the curriculum activities into low-pressure user input", () => {
  assert.match(experience, /Pause/);
  assert.match(experience, /Understand/);
  assert.match(experience, /Choose/);
  assert.match(experience, /Adjust/);
  assert.match(experience, /lifeSituation/);
  assert.match(experience, /lifeTool/);
  assert.match(experience, /sickPriority/);
  assert.match(experience, /callFocus/);
  assert.match(experience, /Your Plan B/);
  assert.match(experience, /scriptSituation/);
  assert.match(experience, /Run the solver/);
  assert.match(experience, /The interactions are invitations, not gates/);
  assert.doesNotMatch(experience, /function canContinue|stageRequirement/);
  assert.doesNotMatch(experience, /openedSolverSteps|lifeToolChoices|sickPriorities/);
});

test("Day 12 teaches illness and missed-dose safety without inventing one universal rule", () => {
  assert.match(experience, /stress hormones can raise/i);
  assert.match(experience, /cannot keep liquids down/i);
  assert.match(experience, /trouble breathing/i);
  assert.match(experience, /new confusion/i);
  assert.match(experience, /Do not double a dose unless/i);
  assert.match(experience, /vary by regimen and\s+health history/);
  assert.match(experience, /Personal instructions matter more than a universal rule/);
  assert.doesNotMatch(experience, /mg\/dL|mmol\/L/);
  assert.doesNotMatch(experience, /SADMANS|euglycemic/i);
});

test("Day 12 server evaluation is authenticated and written input is not saved as health data", () => {
  assert.match(action, /getAuthenticatedUser/);
  assert.match(action, /z\.discriminatedUnion/);
  assert.match(experience, /are not saved as health\s+information/);
  assert.doesNotMatch(action, /insert\(|update\(|from\(/);
});

test("Day 12 is published and unlocks only after completed Day 11", () => {
  assert.match(migration, /problem-solving-for-real-life/);
  assert.match(migration, /20000000-0000-0000-0000-000000000012/);
  assert.match(migration, /30000000-0000-0000-0000-000000000012/);
  assert.match(migration, /30000000-0000-0000-0000-000000000011/);
  assert.match(unlockMigration, /day_eleven_progress\.status = 'completed'/);
  assert.match(unlockMigration, /lesson_progress_unique_user_journey_lesson/);
});
