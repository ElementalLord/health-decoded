import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [page, layout, flow, actions, service, schema, migration, journey, styles] =
  await Promise.all([
    read("app/(app)/onboarding/page.tsx"),
    read("app/(app)/layout.tsx"),
    read("features/onboarding/components/onboarding-flow.tsx"),
    read("features/onboarding/actions/onboarding.actions.ts"),
    read("features/onboarding/services/onboarding.server.ts"),
    read("features/onboarding/schemas/onboarding.schema.ts"),
    read("supabase/migrations/20260810000002_first_use_onboarding.sql"),
    read("app/(app)/journey/page.tsx"),
    read("features/onboarding/components/onboarding-flow.module.css"),
  ]);

test("account state gates first use globally and completed users bypass it", () => {
  assert.match(layout, /!profile\.data\.onboarding_completed_at && !isOnboarding/);
  assert.match(layout, /return settings\.ok \?/);
  assert.match(layout, /<AppShell routes=\{routes\}>/);
  assert.match(layout, /redirect\("\/onboarding"\)/);
  assert.match(page, /profile\.data\.onboarding_completed_at/);
  assert.match(page, /redirect\("\/journey"\)/);
});

test("the flow contains exactly four concise screens and one intention question", () => {
  assert.match(
    flow,
    /const stepNames = \["Welcome", "What you can do", "Starting point", "Your next step"\]/,
  );
  assert.match(flow, /What would be most useful right now\?/);
  assert.equal((flow.match(/<fieldset/g) ?? []).length, 1);
  assert.doesNotMatch(flow, /A1C|glucose|medications|weight|diagnosis date|treatment/iu);
});

test("all controlled intentions map to the expected initial destinations", () => {
  const expected = [
    ["recently-diagnosed", "/lessons/1"],
    ["learn-basics", "/journey"],
    ["support-someone", "/caregiver"],
    ["prepare-appointment", "/appointment-prep"],
  ];
  for (const [intent, destination] of expected) {
    assert.match(flow, new RegExp(`"${intent}"`));
    assert.match(actions, new RegExp(`"${intent}": "${destination.replace("/", "\\/")}"`));
  }
  assert.match(schema, /z\.enum\(onboardingIntents\)/);
});

test("completion is atomic, idempotent, and cannot overwrite a completed preference", () => {
  assert.match(service, /database\.rpc\("complete_onboarding"/);
  assert.match(migration, /when onboarding_completed_at is null then p_onboarding_intent/);
  assert.match(migration, /else onboarding_intent/);
  assert.match(migration, /coalesce\(onboarding_completed_at, pg_catalog\.now\(\)\)/);
  assert.match(migration, /grant execute .* authenticated/);
  assert.doesNotMatch(migration, /streak|milestone|lesson_progress|user_milestone/iu);
});

test("skip completes with no intent and routes to Journey", () => {
  assert.match(flow, /name="completionTarget" type="submit" value="journey"/);
  assert.match(flow, /Skip introduction/);
  assert.match(actions, /: "\/journey\?welcome=1"/);
});

test("preview is available from Journey and is non-persistent", () => {
  assert.match(journey, /href="\/onboarding\?mode=preview"/);
  assert.match(journey, /Preview onboarding/);
  assert.match(page, /requestedMode === "preview"/);
  assert.match(flow, /mode === "preview"/);
  assert.match(flow, /router\.push\(result\.destination\)/);
  assert.match(flow, /Return to Journey/);
});

test("selection, focus, motion, zoom, and narrow-screen accessibility are explicit", () => {
  assert.match(flow, /type="radio"/);
  assert.match(flow, /headingRef\.current\?\.focus/);
  assert.match(flow, /Selected/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(max-width: 30rem\)/);
  assert.doesNotMatch(styles, /overflow-x/);
});

test("onboarding remains orientation, not learning progress", () => {
  const combined = `${flow}\n${actions}\n${service}`;
  assert.doesNotMatch(combined, /streak|milestone|xp_awarded|complete_current_lesson/iu);
});
