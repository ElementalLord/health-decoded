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
  assert.match(experience, /The right support makes room for you/);
  assert.match(experience, /Care can be shared without giving yourself away/);
});

test("Day 13 uses four labeled loops whose motion teaches a relationship skill", () => {
  assert.match(experience, /function SharedLoadAnimation/);
  assert.match(experience, /function SupportConversationAnimation/);
  assert.match(experience, /function BoundaryConversationAnimation/);
  assert.match(experience, /function SupportMapAnimation/);
  assert.match(experience, /Help can lighten one part without taking over the whole/);
  assert.match(experience, /Ask\. Listen\. Offer\. Check\./);
  assert.match(experience, /Concern can change shape when the limit is clear/);
  assert.equal((experience.match(/data-motion-loop="continuous"/g) ?? []).length, 4);
  assert.match(styles, /animation: share-one-bag 10s ease-in-out infinite/);
  assert.match(styles, /animation: conversation-focus 8s ease-in-out infinite/);
  assert.match(styles, /animation: boundary-speaks 9s ease-in-out infinite/);
  assert.match(styles, /animation: support-ring-breathe 8s ease-in-out infinite/);
  assert.match(styles, /animation: support-signal-pulse 3\.4s ease-in-out infinite/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(experience, /<svg|animateMotion|lighthouse|lantern|weave|bridge/i);
});

test("Day 13 keeps explanatory motion clear at every motion preference", () => {
  assert.doesNotMatch(experience, /conversationLine/);
  assert.doesNotMatch(styles, /\.conversationLine/);
  assert.doesNotMatch(experience, /boundarySpace/);
  assert.doesNotMatch(styles, /\.boundarySpace/);
  assert.match(styles, /\.boundaryScene\s*\{[\s\S]*?display: grid;[\s\S]*?grid-template-columns:/);
  assert.match(
    styles,
    /\.boundaryComment,\s*\.boundaryReply,\s*\.boundaryRepair\s*\{[\s\S]*?position: relative;/,
  );
  assert.match(experience, /Support map key/);
  assert.match(experience, /every circle can contribute something different/);
  assert.doesNotMatch(experience, /<span>COMMUNITY<\/span>|<span>CARE TEAM<\/span>/);
  assert.doesNotMatch(styles, /\.mapRing > span/);
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

test("Day 13 keeps controls softly squared and text in the muted lesson palette", () => {
  assert.match(styles, /\.answerChoice[\s\S]*border-radius: 6px/);
  assert.match(styles, /\.requestStudio[\s\S]*border-radius: 6px/);
  assert.match(styles, /\.sortButton[\s\S]*border-radius: 5px/);
  assert.match(styles, /\.progressTrack[\s\S]*border-radius: 3px/);
  assert.match(styles, /--lesson-ink: #405750/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px)/);
  assert.doesNotMatch(experience, /rounded-full/);
});

test("Day 13 turns the curriculum activities into meaningful user input", () => {
  assert.match(experience, /supportClassifications/);
  assert.match(experience, /supportRequest/);
  assert.match(experience, /boundaryScenario/);
  assert.match(experience, /mapChoices/);
  assert.match(experience, /confidence/);
  assert.match(experience, /reflection/);
  assert.match(experience, /Define support without control/);
});

test("Day 13 directly teaches stigma, consent, privacy, and emotional support", () => {
  assert.match(experience, /Stigma writes social rules/);
  assert.match(experience, /Support offers a hand\. Control grabs the steering wheel/);
  assert.match(experience, /Disclosure belongs to you/);
  assert.match(experience, /diabetes distress persists/);
  assert.match(experience, /not saved as health information/);
  assert.match(experience, /Concern gives family permission to monitor food and numbers/);
  assert.match(experience, /A joke is harmless if the speaker did not mean it badly/);
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
