import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  foundationJourneyLessonIds,
  milestoneDefinitions,
} from "../features/achievements/content/milestone-definitions.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [service, actions, migration, page, notice, journey, profile, routes, bottomNav] =
  await Promise.all([
    read("features/achievements/services/milestones.server.ts"),
    read("features/achievements/actions/milestone.actions.ts"),
    read("supabase/migrations/20260802000001_user_milestones.sql"),
    read("features/achievements/components/milestones-page.tsx"),
    read("features/achievements/components/milestone-notification-host.tsx"),
    read("app/(app)/journey/page.tsx"),
    read("features/profile/components/profile-content.tsx"),
    read("lib/routes.ts"),
    read("components/layout/bottom-navigation.tsx"),
  ]);

test("catalog has unique stable IDs and slugs in valid categories", () => {
  assert.equal(milestoneDefinitions.length, 14);
  assert.equal(new Set(milestoneDefinitions.map(({ id }) => id)).size, milestoneDefinitions.length);
  assert.equal(new Set(milestoneDefinitions.map(({ slug }) => slug)).size, milestoneDefinitions.length);
  assert.equal(new Set(milestoneDefinitions.map(({ icon }) => icon)).size, milestoneDefinitions.length);
  const categories = new Set(["learning", "understanding", "appointment", "support", "resources", "toolkit"]);
  assert.ok(milestoneDefinitions.every(({ category }) => categories.has(category)));
  assert.ok(milestoneDefinitions.every(({ hidden }) => hidden === false));
});

test("criteria avoid prohibited health outcomes and competitive mechanics", () => {
  const criteria = milestoneDefinitions.map(({ criteriaLabel }) => criteriaLabel).join("\n");
  assert.doesNotMatch(criteria, /A1C|glucose value|weight loss|body-mass|take medicine|use insulin|symptom-free|remission/i);
  const all = JSON.stringify(milestoneDefinitions);
  assert.doesNotMatch(all, /\b(?:points|XP|level|leaderboard|ranking|rarity|streak|gold|silver|bronze)\b/i);
});

test("lesson milestones use 14 distinct stable Foundation assignments", () => {
  assert.equal(foundationJourneyLessonIds.length, 14);
  assert.equal(new Set(foundationJourneyLessonIds).size, 14);
  assert.match(service, /new Set\(response\.data\.map/);
  assert.match(service, /distinct\.size >= 10/);
  assert.match(service, /foundationJourneyLessonIds\.every/);
  assert.match(service, /await recognizeMilestoneEvent\(\{ event: "lesson_completed" \}\)/);
});

test("unlocking is controlled and idempotent", () => {
  assert.match(migration, /primary key \(user_id, milestone_id\)/);
  assert.match(migration, /user_milestones_controlled_id/);
  assert.match(service, /onConflict: "user_id,milestone_id"/);
  assert.match(service, /ignoreDuplicates: true/);
  assert.doesNotMatch(actions, /value\.milestoneId|input\.milestoneId/);
});

test("RLS permits users to retrieve and create only their own milestones", () => {
  assert.match(migration, /enable row level security/);
  assert.match(migration, /users read own milestones/);
  assert.match(migration, /users create own milestones/);
  assert.ok((migration.match(/user_id = auth\.uid\(\)/g) ?? []).length >= 2);
});

test("feature events contain counts and fixed IDs, not private content", () => {
  assert.match(actions, /appointment_summary_completed/);
  assert.match(actions, /completedSectionCount/);
  assert.match(actions, /myth_round_completed/);
  assert.match(actions, /verified_support_resource_opened/);
  assert.doesNotMatch(actions, /priorityText|questionText|answerSelections|sourceUrls|destinationHistory|symptoms|medications/i);
  assert.deepEqual([...migration.matchAll(/^\s+(user_id|milestone_id|unlocked_at)\b/gm)].map((match) => match[1]).slice(0, 3), ["user_id", "milestone_id", "unlocked_at"]);
});

test("Personal Toolkit derives from four earned non-toolkit categories", () => {
  assert.match(service, /category !== "toolkit"/);
  assert.match(service, /categories\.size >= 4/);
  assert.match(service, /MILESTONE-PERSONAL-TOOLKIT/);
});

test("recent milestones are ordered newest first and linked from Journey", () => {
  assert.match(service, /order\("unlocked_at", \{ ascending: false \}\)/);
  assert.match(journey, /href="\/milestones"/);
  assert.match(journey, /title="View your milestones"/);
  assert.match(profile, /href="\/milestones"/);
});

test("page presents earned and available states with a health limitation", () => {
  assert.match(page, /Milestones recognize learning and preparation inside Health Decoded/);
  assert.match(page, /They do not measure your health, treatment success/);
  assert.match(page, /Still available/);
  assert.match(page, /`Earned \$\{dateLabel\(earned\.unlockedAt\)\}`/);
  assert.match(page, /Recognized when:/);
});

test("unlock notification is polite, dismissible, and nonblocking", () => {
  assert.match(notice, /aria-live="polite"/);
  assert.match(notice, /Dismiss milestone notification/);
  assert.match(notice, /View milestone/);
  assert.doesNotMatch(notice, /audio|confetti|dialog|aria-modal/);
});

test("Milestones is not added to permanent navigation", () => {
  assert.doesNotMatch(routes, /href: "\/milestones"/);
  assert.doesNotMatch(bottomNav, /milestones/);
});
