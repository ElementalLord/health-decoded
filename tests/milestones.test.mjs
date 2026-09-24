import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  foundationJourneyLessonIds,
  milestoneDefinitions,
  milestonePathwayById,
} from "../features/achievements/content/milestone-definitions.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const readAsset = (path) => readFile(new URL(`../${path}`, import.meta.url));
const [
  service,
  actions,
  migration,
  deliveryMigration,
  reliabilityMigration,
  caregiverProgressMigration,
  practiceMilestonesMigration,
  collectionMilestonesMigration,
  client,
  page,
  badge,
  artwork,
  grid,
  detail,
  detailRoute,
  collectionStyles,
  notificationStyles,
  milestoneProgress,
  notice,
  journey,
  profile,
  routes,
  bottomNav,
  caregiverProvider,
  mythCheck,
  appointmentPrep,
  resources,
  explainItBack,
  decodeTheLabel,
  interactiveStory,
] = await Promise.all([
  read("features/achievements/services/milestones.server.ts"),
  read("features/achievements/actions/milestone.actions.ts"),
  read("supabase/migrations/20260802000001_user_milestones.sql"),
  read("supabase/migrations/20260920000001_expand_and_deliver_milestones.sql"),
  read("supabase/migrations/20260920000002_make_lesson_milestones_self_healing.sql"),
  read("supabase/migrations/20260920000003_track_caregiver_milestone_progress.sql"),
  read("supabase/migrations/20260920000004_add_practice_milestones.sql"),
  read("supabase/migrations/20260921000001_complete_milestone_honeycomb.sql"),
  read("features/achievements/lib/recognize-milestone.client.ts"),
  read("features/achievements/components/milestones-page.tsx"),
  read("features/achievements/components/milestone-badge.tsx"),
  read("features/achievements/components/milestone-artwork.tsx"),
  read("features/achievements/components/milestone-grid.tsx"),
  read("features/achievements/components/milestone-detail.tsx"),
  read("app/(app)/milestones/[slug]/page.tsx"),
  read("features/achievements/styles/milestone-collection.module.css"),
  read("features/achievements/styles/milestones.module.css"),
  read("features/achievements/components/milestone-progress.tsx"),
  read("features/achievements/components/milestone-notification-host.tsx"),
  read("app/(app)/journey/page.tsx"),
  read("features/profile/components/profile-content.tsx"),
  read("lib/routes.ts"),
  read("components/layout/bottom-navigation.tsx"),
  read("features/caregiver/state/caregiver-session-provider.tsx"),
  read("features/mythbusters/components/diabetes-myth-check.tsx"),
  read("features/appointment-prep/components/appointment-prep-page.tsx"),
  read("features/resources/components/resources.tsx"),
  read("features/explain-it-back/components/explain-it-back-experience.tsx"),
  read("features/decode-the-label/components/decode-the-label-experience.tsx"),
  read("features/stories/components/interactive-story-player.tsx"),
]);

test("catalog has unique stable IDs and slugs in valid categories", () => {
  assert.equal(milestoneDefinitions.length, 28);
  assert.equal(new Set(milestoneDefinitions.map(({ id }) => id)).size, milestoneDefinitions.length);
  assert.equal(
    new Set(milestoneDefinitions.map(({ slug }) => slug)).size,
    milestoneDefinitions.length,
  );
  assert.equal(
    new Set(milestoneDefinitions.map(({ icon }) => icon)).size,
    milestoneDefinitions.length,
  );
  const categories = new Set([
    "learning",
    "understanding",
    "appointment",
    "support",
    "resources",
    "toolkit",
  ]);
  assert.ok(milestoneDefinitions.every(({ category }) => categories.has(category)));
  assert.ok(milestoneDefinitions.every(({ hidden }) => hidden === false));
});

test("every milestone has a concrete destination and a tracked progress contract", () => {
  assert.equal(milestonePathwayById.size, milestoneDefinitions.length);
  for (const definition of milestoneDefinitions) {
    const pathway = milestonePathwayById.get(definition.id);
    assert.ok(pathway, definition.id);
    assert.match(
      pathway.href,
      /^\/(?:journey|myth-check|appointment-prep|caregiver|resources|milestones|explain-it-back|decode-the-label|stories)/,
    );
    assert.ok(pathway.actionLabel.length > 5, definition.id);
    assert.ok(Number.isInteger(pathway.target) && pathway.target > 0, definition.id);
    assert.ok(pathway.unit.length > 3, definition.id);
  }
  assert.match(detail, /className=\{styles\.detailAction\}/);
  assert.match(detail, /pathway\?\.actionLabel/);
  assert.match(service, /milestoneDefinitions\.flatMap/);
});

test("criteria avoid prohibited health outcomes and competitive mechanics", () => {
  const criteria = milestoneDefinitions.map(({ criteriaLabel }) => criteriaLabel).join("\n");
  assert.doesNotMatch(
    criteria,
    /A1C|glucose value|weight loss|body-mass|take medicine|use insulin|symptom-free|remission/i,
  );
  const all = JSON.stringify(milestoneDefinitions);
  assert.doesNotMatch(
    all,
    /\b(?:points|XP|level|leaderboard|ranking|rarity|streak|gold|silver|bronze)\b/i,
  );
});

test("lesson milestones reconcile durable lesson and reflection progress", () => {
  assert.equal(foundationJourneyLessonIds.length, 14);
  assert.equal(new Set(foundationJourneyLessonIds).size, 14);
  assert.match(service, /rpc\("reconcile_current_user_lesson_milestones"\)/);
  assert.match(service, /milestones\.background_reconciliation_failed/);
  assert.doesNotMatch(service, /if \(!reconciled\.ok\) return err\(reconciled\.error\)/);
  assert.match(reliabilityMigration, /completion_number in \(1, 3, 7, 10\)/);
  assert.match(reliabilityMigration, /MILESTONE-BUILDING-RHYTHM/);
  assert.match(reliabilityMigration, /MILESTONE-FOUNDATION-COMPLETE/);
  assert.match(reliabilityMigration, /MILESTONE-THOUGHTFUL-REFLECTION/);
  assert.match(reliabilityMigration, /status = 'completed'/);
  assert.match(reliabilityMigration, /on conflict on constraint user_milestones_pkey do nothing/);
});

test("lesson milestones self-heal on writes and backfill historical completions", () => {
  assert.match(reliabilityMigration, /lesson_progress_reconcile_milestones/);
  assert.match(reliabilityMigration, /reflection_entries_reconcile_milestones/);
  assert.match(reliabilityMigration, /after insert or update of status, completed_at/);
  assert.match(reliabilityMigration, /after insert or update of lesson_progress_id/);
  assert.match(reliabilityMigration, /Repair every account/);
  assert.match(reliabilityMigration, /reconcile_lesson_milestones_for_user\(v_user\.user_id\)/);
});

test("unlocking is controlled and idempotent", () => {
  assert.match(migration, /primary key \(user_id, milestone_id\)/);
  assert.match(migration, /user_milestones_controlled_id/);
  assert.match(deliveryMigration, /MILESTONE-SUSTAINABLE-SUPPORT/);
  assert.match(service, /onConflict: "user_id,milestone_id"/);
  assert.match(service, /ignoreDuplicates: true/);
  assert.doesNotMatch(actions, /value\.milestoneId|input\.milestoneId/);
  const controlledIds = [...collectionMilestonesMigration.matchAll(/'(MILESTONE-[A-Z-]+)'/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(
    [...new Set(controlledIds)].sort(),
    milestoneDefinitions.map(({ id }) => id).sort(),
  );
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
  assert.doesNotMatch(
    actions,
    /priorityText|questionText|answerSelections|sourceUrls|destinationHistory|symptoms|medications/i,
  );
  assert.deepEqual(
    [...migration.matchAll(/^\s+(user_id|milestone_id|unlocked_at)\b/gm)]
      .map((match) => match[1])
      .slice(0, 3),
    ["user_id", "milestone_id", "unlocked_at"],
  );
});

test("every non-lesson milestone has a live tracking signal at its required interaction", () => {
  for (const event of ["myth_round_completed", "myth_replay_completed", "myth_sources_reviewed"]) {
    assert.match(mythCheck, new RegExp(event));
  }
  for (const event of [
    "appointment_priorities_completed",
    "appointment_questions_completed",
    "appointment_summary_completed",
    "appointment_summary_exported",
  ]) {
    assert.match(appointmentPrep, new RegExp(event));
  }
  assert.match(caregiverProvider, /caregiver_module_progressed/);
  assert.match(resources, /verified_support_resource_opened/);
  assert.match(resources, /resourceId: resource\.id/);
  assert.match(explainItBack, /explain_it_back_completed/);
  assert.match(explainItBack, /challengeId: challenge\.id/);
  assert.match(explainItBack, /spaced_review_completed/);
  assert.match(decodeTheLabel, /decode_label_completed/);
  assert.match(interactiveStory, /interactive_story_completed/);
  assert.match(interactiveStory, /storyId: story\.slug/);
  assert.match(service, /MILESTONE-PERSONAL-TOOLKIT/);
  assert.match(client, /if \(!result\.retryable\)/);
  assert.match(practiceMilestonesMigration, /record_explain_it_back_learning/);
  assert.match(practiceMilestonesMigration, /spaced_review_reconcile_milestone/);
  assert.match(practiceMilestonesMigration, /last_reviewed_at is not null/);
  assert.match(
    practiceMilestonesMigration,
    /on conflict on constraint user_milestones_pkey do nothing/,
  );
  assert.match(collectionMilestonesMigration, /user_milestone_activity_progress/);
  assert.match(collectionMilestonesMigration, /record_milestone_activity/);
  assert.match(collectionMilestonesMigration, /pg_advisory_xact_lock/);
  assert.match(collectionMilestonesMigration, /reconcile_current_user_activity_milestones/);
  assert.match(collectionMilestonesMigration, /MILESTONE-CONCEPTS-MADE-CLEAR/);
  assert.match(collectionMilestonesMigration, /MILESTONE-MANY-PERSPECTIVES/);
  assert.match(collectionMilestonesMigration, /MILESTONE-CIRCLE-OF-SUPPORT/);
  assert.match(collectionMilestonesMigration, /MILESTONE-RESOURCE-NAVIGATOR/);
  assert.match(
    collectionMilestonesMigration,
    /on conflict on constraint user_milestone_activity_progress_pkey do nothing/,
  );
  assert.match(service, /activity_type, item_id/);
  assert.match(service, /rpc\("reconcile_current_user_activity_milestones"\)/);
  assert.match(service, /milestones\.activity_reconciliation_failed/);
});

test("Personal Toolkit derives from four earned non-toolkit categories", () => {
  assert.match(service, /category !== "toolkit"/);
  assert.match(service, /categories\.size >= 4/);
  assert.match(service, /MILESTONE-PERSONAL-TOOLKIT/);
});

test("all five caregiver modules have explicit milestone pathways", () => {
  for (const moduleId of ["CG-M1", "CG-M2", "CG-M3", "CG-M4", "CG-M5"]) {
    assert.match(actions, new RegExp(moduleId));
    assert.match(service, new RegExp(`"${moduleId}"`));
    assert.match(caregiverProgressMigration, new RegExp(`'${moduleId}'`));
  }
  assert.match(caregiverProvider, /caregiver_module_progressed/);
  assert.match(caregiverProvider, /centralIdeaReached: progress\.centralIdeaReached/);
  assert.match(caregiverProvider, /coreApplicationCompleted: progress\.coreApplicationCompleted/);
  assert.match(caregiverProvider, /takeawayViewed: progress\.takeawayViewed/);
  assert.match(
    caregiverProgressMigration,
    /on conflict on constraint user_caregiver_module_progress_pkey do update/,
  );
  assert.match(caregiverProgressMigration, /record_caregiver_milestone_progress/);
  assert.match(caregiverProgressMigration, /insert into public\.user_milestones/);
  assert.match(service, /user_caregiver_module_progress/);
});

test("recent milestones are ordered newest first and remain available from Profile", () => {
  assert.match(service, /order\("unlocked_at", \{ ascending: false \}\)/);
  assert.doesNotMatch(journey, /href="\/milestones"/);
  assert.match(profile, /router\.push\("\/milestones"\)/);
  assert.match(profile, /aria-label="View your milestones"/);
});

test("page makes the milestone collection the visual focus", () => {
  assert.match(page, /Your Milestones/);
  assert.match(page, /Small wins add up/);
  assert.match(page, /MilestoneGrid/);
  assert.match(page, /milestones earned/);
  assert.match(page, /Milestones recognize learning and preparation inside Health Decoded/);
  assert.match(page, /They do not measure\s+your health, treatment success/);
  assert.doesNotMatch(page, /definition\.description/);
});

test("milestone collection uses a responsive decorative background without blocking interaction", async () => {
  const background = await readAsset("public/milestones/milestones-collection-background-v1.png");
  assert.equal(background.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(background.readUInt32BE(16), 1536);
  assert.equal(background.readUInt32BE(20), 1024);
  assert.ok(background.length > 100_000);
  assert.match(collectionStyles, /app-page-container\):has\(\.collectionPage\)::before/);
  assert.match(collectionStyles, /url\("\/milestones\/milestones-collection-background-v1\.png"\)/);
  assert.match(collectionStyles, /background-repeat: no-repeat/);
  assert.match(collectionStyles, /background-size: cover/);
  assert.match(collectionStyles, /pointer-events: none/);
  assert.match(collectionStyles, /prefers-reduced-transparency: reduce/);
  assert.match(collectionStyles, /prefers-contrast: more/);
});

test("responsive honeycomb badges are interactive without reflow", () => {
  assert.match(grid, /MilestoneBadge/);
  assert.match(collectionStyles, /grid-template-columns: repeat\(12/);
  assert.match(collectionStyles, /nth-child\(11n \+ 7\)/);
  assert.match(collectionStyles, /grid-template-columns: repeat\(8/);
  assert.match(collectionStyles, /grid-template-columns: repeat\(6/);
  assert.doesNotMatch(badge, /framer-motion|whileHover|whileTap|delay:/);
  assert.match(collectionStyles, /\.badgeLink:active/);
  assert.match(collectionStyles, /transition: transform 140ms/);
  assert.match(collectionStyles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(collectionStyles, /prefers-reduced-motion: reduce/);
  assert.match(badge, /href=\{`\/milestones\/\$\{item\.definition\.slug\}`\}/);
  assert.match(badge, /Not earned yet/);
  assert.match(artwork, /LockKeyhole/);
});

test("milestone details support earned, locked, progress, secret, and missing states", () => {
  assert.match(detail, /All Milestones/);
  assert.match(detail, /Why you earned it/);
  assert.match(detail, /How to unlock/);
  assert.match(detail, /Not earned yet/);
  assert.match(detail, /A hidden achievement/);
  assert.match(detail, /MilestoneProgress/);
  assert.match(detailRoute, /if \(!definition\) notFound\(\)/);
  assert.match(detailRoute, /getMilestoneCollection/);
  assert.match(service, /MILESTONE-BUILDING-RHYTHM/);
  assert.match(service, /MILESTONE-THOUGHTFUL-REFLECTION/);
  assert.match(service, /MILESTONE-PERSONAL-TOOLKIT/);
  assert.match(milestoneProgress, /Math\.min\(Math\.max\(progress\.current, 0\), target\)/);
});

test("every milestone has a square PNG medallion used by the page", async () => {
  const assets = await Promise.all(
    milestoneDefinitions.map(({ icon }) => readAsset(`public/milestones/${icon}.png`)),
  );
  for (const asset of assets) {
    assert.equal(asset.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(asset.readUInt32BE(16), 320);
    assert.equal(asset.readUInt32BE(20), 320);
    assert.ok(asset.length > 10_000);
  }
  assert.match(artwork, /src=\{`\/milestones\/\$\{item\.definition\.icon\}\.png`\}/);
});

test("unlock notification is immediate, polished, dismissible, and nonblocking", () => {
  assert.match(notice, /aria-live="polite"/);
  assert.match(notice, /Milestone unlocked:/);
  assert.match(notice, /Dismiss milestone notification/);
  assert.match(notice, /Milestone unlocked/);
  assert.match(notice, /MilestoneArtwork item=\{artworkItem\} variant="celebration"/);
  assert.match(notice, /href=\{`\/milestones\/\$\{milestone\.slug\}`\}/);
  assert.match(notice, /View Milestone/);
  assert.match(notice, /event\.key === "Escape"/);
  assert.match(notice, /AUTO_DISMISS_MS = 6500/);
  assert.match(notice, /notificationParticles/);
  assert.match(notificationStyles, /position: fixed/);
  assert.match(notificationStyles, /notification-badge-enter/);
  assert.match(notificationStyles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(notice, /audio|confetti|dialog|aria-modal/);
});

test("milestone delivery survives navigation and transient action failures", () => {
  assert.match(deliveryMigration, /announced_at/);
  assert.match(deliveryMigration, /acknowledge_milestone_announcements/);
  assert.match(service, /getPendingMilestoneAnnouncements/);
  assert.match(client, /PENDING_EVENTS_KEY_PREFIX/);
  assert.match(client, /configureMilestoneQueue/);
  assert.match(client, /safeSetLocalStorage/);
  assert.match(client, /new CustomEvent<MilestoneSyncDetail>/);
  assert.match(client, /requestMilestoneSync\(result\.milestoneIds\)/);
  assert.match(notice, /enqueueMilestones\(detail\.milestoneIds\)/);
  assert.doesNotMatch(actions, /revalidatePath/);
  assert.match(notice, /window\.addEventListener\("online"/);
  assert.match(notice, /usePathname/);
  assert.match(notice, /SYNC_INTERVAL_MS/);
});

test("Milestones is not added to permanent navigation", () => {
  assert.doesNotMatch(routes, /href: "\/milestones"/);
  assert.doesNotMatch(bottomNav, /milestones/);
});
