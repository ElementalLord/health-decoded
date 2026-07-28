import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const player = readFileSync("features/lessons/components/lesson-player.tsx", "utf8");
const experience = readFileSync("features/lessons/components/day-thirteen-experience.tsx", "utf8");
const styles = readFileSync(
  "features/lessons/components/day-thirteen-experience.module.css",
  "utf8",
);
const action = readFileSync("features/lessons/actions/day-thirteen.actions.ts", "utf8");
const migration = readFileSync(
  "supabase/migrations/20260721000010_day_thirteen_support_stigma_people.sql",
  "utf8",
);
const unlockMigration = readFileSync(
  "supabase/migrations/20260721000011_reopen_journey_for_day_thirteen.sql",
  "utf8",
);

test("Day 13 uses one custom eleven-chapter experience", () => {
  assert.match(player, /if \(lesson\.dayNumber === 13\) return <DayThirteenExperience/);
  assert.match(experience, /const stageCount = 11/);
  assert.match(experience, /The right support makes more room for you/);
  assert.match(experience, /Care can be shared without giving yourself away/);
});

test("Day 13 uses four purposeful human loops whose motion teaches a relationship skill", () => {
  assert.match(experience, /function SharedLoadAnimation/);
  assert.match(experience, /function ConsentConversationAnimation/);
  assert.match(experience, /function BoundaryConversationAnimation/);
  assert.match(experience, /function SupportTableAnimation/);
  assert.match(experience, /permission comes first/);
  assert.match(experience, /Ask\. Listen\. Offer\. Check\./);
  assert.match(experience, /A clear limit makes room for a better way to care/);
  assert.match(experience, /No one\s+seat has to carry every kind of need/);
  assert.match(experience, /mode === "listen"/);
  assert.match(experience, /mode === "company"/);
  assert.match(experience, /mode === "practical"/);
  assert.match(experience, /mode === "space"/);
  assert.match(experience, /activeSeat === "chosen"/);
  assert.match(experience, /activeSeat === "care"/);
  assert.match(experience, /activeSeat === "community"/);
  assert.equal((experience.match(/data-motion-loop="continuous"/g) ?? []).length, 4);
  assert.ok(
    (experience.match(/repeatCount="indefinite"/g) ?? []).length >= 12,
    "expected independently looping gestures across the four human scenes",
  );
  assert.ok((experience.match(/<LessonMotionPerson/g) ?? []).length >= 12);
  assert.doesNotMatch(experience, /<text(?:\s|>)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(experience, /lighthouse|lantern|weave|bridge/i);
});

test("Day 13 gives every animated scene an explanation and removes abstract diagrams", () => {
  assert.equal((experience.match(/aria-labelledby=/g) ?? []).length, 4);
  assert.match(experience, /One chosen task becomes shared/);
  assert.match(experience, /A permission-first conversation at a kitchen table/);
  assert.match(experience, /A family meal changes after a clear boundary/);
  assert.match(experience, /A support table with different invited people/);
  assert.match(experience, /boundaryTranscript/);
  assert.match(experience, /motionTranscript/);
  assert.doesNotMatch(experience, /SupportMapAnimation|mapRing|sortingBoard|mythGrid/);
  assert.doesNotMatch(styles, /\.mapRing|\.sortingBoard|\.mythGrid/);
});

test("Day 13 grounds support in two warm, emotionally clear human scenes", () => {
  assert.match(experience, /listening-without-fixing\.jpg/);
  assert.match(experience, /community-belonging\.jpg/);
  assert.match(experience, /close friend listens beside her/);
  assert.match(experience, /two women hugging, friends sharing tea/);

  for (const filename of ["listening-without-fixing.jpg", "community-belonging.jpg"]) {
    assert.ok(statSync(`public/lessons/day-13/${filename}`).size > 100_000);
  }
});

test("Day 13 adopts Day 11's editorial hierarchy with softly squared controls", () => {
  assert.match(experience, /ProgressBar/);
  assert.match(experience, /max-w-\[1020px\]/);
  assert.match(experience, /text-\[length:var\(--text-page-title\)\]/);
  assert.match(styles, /\.answerChoice[\s\S]*border-radius: 9px/);
  assert.match(styles, /\.motionFigure[\s\S]*border-radius: 12px/);
  assert.match(styles, /color: #405750/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px)/);
  assert.doesNotMatch(experience, /rounded-full/);
});

test("Day 13 validates its three skill gates without gating personal choices", () => {
  assert.match(experience, /stigmaMoment/);
  assert.match(experience, /supportMode/);
  assert.match(experience, /supportRequest/);
  assert.match(experience, /boundaryScenario/);
  assert.match(experience, /supportSeat/);
  assert.match(experience, /repairStep/);
  assert.match(experience, /reflection/);
  assert.match(experience, /Define support without control/);
  assert.match(experience, /const dayThirteenStageGates/);
  assert.match(experience, /1: "Share at least one bag/);
  assert.match(experience, /5: "Build a full boundary/);
  assert.match(experience, /7: "Call for backup/);
  assert.match(experience, /<SharedLoadAnimation onReady=\{markSharedLoadReady\}/);
  assert.match(experience, /<ComposeBoundary onReady=\{markBoundaryReady\}/);
  assert.match(experience, /<SupportArrives onReady=\{markSupportReady\}/);
  assert.match(experience, /setTimeout\(\(\) => \{[\s\S]*setLanded\(true\)/);
  assert.match(experience, /canNavigateToLessonStage/);
  assert.match(experience, /disabled=\{isPending \|\| stageLocked\}/);
  assert.match(experience, /Personal\s+choices and reflection remain optional/);
  assert.doesNotMatch(experience, /supportClassifications|mapChoices|openedMyths/);
});

test("Day 13 directly teaches stigma, consent, privacy, and emotional support", () => {
  assert.match(experience, /Stigma writes social rules/);
  assert.match(experience, /Support offers a hand\. Control grabs the steering wheel/);
  assert.match(experience, /Disclosure belongs to you/);
  assert.match(experience, /diabetes distress persists/);
  assert.match(experience, /not saved as health information/);
  assert.match(experience, /Concern still needs consent/);
  assert.match(experience, /Intent and impact are different/);
  assert.match(experience, /repair without pretending nothing happened/);
});

test("Day 13 evaluation is authenticated and does not store private written input", () => {
  assert.match(action, /getAuthenticatedUser/);
  assert.match(action, /z\.discriminatedUnion/);
  assert.doesNotMatch(action, /insert\(|update\(|from\(/);
});

test("Day 13 is published and unlocks only after completed Day 12", () => {
  assert.match(migration, /support-stigma-and-the-people-around-you/);
  assert.match(migration, /20000000-0000-0000-0000-000000000013/);
  assert.match(migration, /30000000-0000-0000-0000-000000000013/);
  assert.match(migration, /30000000-0000-0000-0000-000000000012/);
  assert.match(unlockMigration, /day_twelve_progress\.status = 'completed'/);
  assert.match(unlockMigration, /lesson_progress_unique_user_journey_lesson/);
});
