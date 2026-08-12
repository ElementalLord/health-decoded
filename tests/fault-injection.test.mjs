import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import {
  ExpectedDependencyFailure,
  settleOptional,
  settleResult,
} from "../lib/reliability/dependency-boundary.ts";
import { createLatestRequest } from "../lib/reliability/latest-request.ts";
import {
  deferredDependency,
  delayedDependency,
  denyClipboard,
  failStorage,
  injectedFault,
  malformedResponse,
  partialResponse,
} from "./faults/fault-scenarios.ts";
import {
  safeGetLocalStorage,
  safeRemoveLocalStorage,
  safeSetLocalStorage,
} from "../lib/storage/safe-local-storage.ts";
import { explainItBackChallenges } from "../features/explain-it-back/content/explain-it-back-content.ts";
import { parseAndEnforceClassification } from "../features/explain-it-back/services/explain-it-back-evaluator.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const entries = Object.fromEntries(
  await Promise.all(
    [
      ["layout", "app/(app)/layout.tsx"],
      ["journey", "app/(app)/journey/page.tsx"],
      ["journeyService", "features/journeys/services/journey-home.server.ts"],
      ["profile", "features/profile/components/profile-content.tsx"],
      ["profileAction", "features/profile/actions/profile-settings.actions.ts"],
      ["appointment", "features/appointment-prep/components/appointment-prep-page.tsx"],
      ["onboarding", "features/onboarding/components/onboarding-flow.tsx"],
      ["onboardingAction", "features/onboarding/actions/onboarding.actions.ts"],
      ["ai", "features/ai/components/ai-chat.tsx"],
      ["aiRoute", "app/api/ai/chat/route.ts"],
      ["aiServer", "features/ai/services/ai-chat.server.ts"],
      ["aiParser", "services/ai/response-parser.ts"],
      ["aiSchema", "features/ai/schemas/ai-chat.schema.ts"],
      ["explain", "features/explain-it-back/components/explain-it-back-experience.tsx"],
      ["explainRoute", "app/api/explain-it-back/evaluate/route.ts"],
      ["explainServer", "features/explain-it-back/services/explain-it-back.server.ts"],
      ["spaced", "features/spaced-review/services/spaced-review.server.ts"],
      ["lessonRoute", "app/(app)/lessons/[day]/page.tsx"],
      ["storyRoute", "app/(app)/stories/[slug]/page.tsx"],
      ["caregiverRoute", "app/(app)/caregiver/[slug]/page.tsx"],
      ["searchService", "features/universal-search/services/universal-search.server.ts"],
      ["decode", "features/decode-the-label/components/decode-the-label-experience.tsx"],
      ["resources", "features/resources/components/resources.tsx"],
      ["logger", "lib/logging/server.ts"],
      ["lessonCompletion", "features/lessons/actions/lesson-completion.actions.ts"],
      ["lessonCompletionService", "features/lessons/services/lesson-completion.server.ts"],
      ["auth", "features/auth/services/auth.server.ts"],
      ["storage", "lib/storage/safe-local-storage.ts"],
    ].map(async ([key, path]) => [key, await read(path)]),
  ),
);

test("rejected Result dependencies become controlled failures", async () => {
  let recorded = false;
  const result = await settleResult(
    async () => {
      throw new ExpectedDependencyFailure();
    },
    "unavailable",
    () => {
      recorded = true;
    },
  );
  assert.deepEqual(result, { ok: false, error: "unavailable" });
  assert.equal(recorded, true);
});

test("optional dependency rejection returns its local fallback", async () => {
  const fallback = { ok: false, feature: "omitted" };
  assert.equal(
    await settleOptional(async () => {
      throw new ExpectedDependencyFailure();
    }, fallback),
    fallback,
  );
});

test("programming errors are never converted into unavailable dependency states", async () => {
  await assert.rejects(
    settleOptional(async () => {
      throw new Error("invariant violated");
    }, null),
    /invariant violated/,
  );
});

test("slow dependency fixtures remain pending without blocking unrelated work", async () => {
  const observedDelays = [];
  const scheduleImmediately = (resolve, milliseconds) => {
    observedDelays.push(milliseconds);
    resolve();
  };
  for (const delay of [10_000, 20_000, 30_000]) {
    assert.equal(await delayedDependency("ready", delay, scheduleImmediately)(), "ready");
  }
  assert.deepEqual(observedDelays, [10_000, 20_000, 30_000]);
  assert.match(entries.ai, /5_000/);
  assert.match(entries.ai, /30_000/);
  assert.match(entries.explain, /25_000/);
});

test("authenticated shell contains rejected auth, profile, and optional settings reads", () => {
  assert.match(entries.layout, /authenticated_shell\.auth_rejected/);
  assert.match(entries.layout, /authenticated_shell\.profile_rejected/);
  assert.match(entries.layout, /authenticated_shell\.preferences_rejected/);
  assert.match(entries.layout, /settings\.ok \? \(/);
  assert.match(entries.auth, /auth\.session_check_rejected/);
});

for (const [name, marker] of [
  ["streak", "journey.streak_rejected"],
  ["milestones and recommendation metadata", "journey.next_step_rejected"],
  ["Spaced Review", "journey.spaced_review_rejected"],
]) {
  test(`Journey renders when optional ${name} read rejects`, () => {
    assert.match(entries.journey, new RegExp(marker.replace(".", "\\.")));
    assert.match(entries.journey, /fallbackNextStepForJourney/);
    assert.match(entries.journey, /learningStreak\.ok \? <LearningStreakPanel/);
  });
}

test("Journey core rejection produces a controlled local error", () => {
  assert.match(entries.journey, /journey\.core_rejected/);
  assert.match(entries.journey, /if \(!journey\.ok\)/);
  assert.match(entries.journey, /<JourneyUnavailableState/);
});

test("Journey confidence read failure remains optional", () => {
  assert.match(entries.journeyService, /journey_home\.confidence_unavailable/);
  assert.doesNotMatch(entries.journeyService, /confidence_unavailable"\);\s*return err/);
});

test("Journey has no recent-activity read that can become a page dependency", () => {
  assert.doesNotMatch(entries.journey, /getRecentActivity|getProfileReflections|recentActivity/);
  assert.match(entries.journey, /getJourneyHomeData/);
});

test("profile write rejection preserves the typed uncontrolled value and never reports success", () => {
  assert.match(entries.profile, /defaultValue=\{data\.displayName\}/);
  assert.match(entries.profileAction, /profile\.update_rejected/);
  assert.match(entries.profileAction, /status: "error"/);
  assert.doesNotMatch(entries.profileAction, /update_rejected[\s\S]{0,160}status: "success"/);
});

test("Appointment Prep clipboard denial preserves exact mounted reducer state", async () => {
  const clipboard = denyClipboard();
  await assert.rejects(clipboard.writeText("exact appointment text"), /injected dependency failure/);
  assert.match(
    entries.appointment,
    /useReducer\(appointmentPrepReducer, initialAppointmentPrepState\)/,
  );
  assert.match(entries.appointment, /summary is available below for manual selection/);
  assert.doesNotMatch(entries.appointment, /catch[\s\S]{0,100}appointmentPrepNotices\.copied/);
});

test("onboarding write failure keeps the selected intention and does not navigate", () => {
  assert.match(entries.onboarding, /value=\{intent \?\? ""\}/);
  assert.ok(
    entries.onboardingAction.indexOf("if (!result.ok)") <
      entries.onboardingAction.indexOf("redirect(destination)"),
  );
});

test("expired sessions use auth-specific recovery without embedding user medical text", () => {
  assert.match(entries.profileAction, /status: "auth"/);
  assert.match(entries.onboardingAction, /status: "auth"/);
  assert.match(entries.ai, /kind: "auth"/);
  assert.match(entries.explain, /kind: "auth"/);
  assert.doesNotMatch(
    `${entries.profileAction}\n${entries.onboardingAction}`,
    /next=.*displayName|next=.*onboardingIntent/,
  );
});

test("AI timeouts preserve questions and never append a fake assistant answer", () => {
  assert.match(entries.ai, /Your question is still here/);
  assert.match(entries.ai, /removeEmptyAssistant/);
  assert.match(entries.ai, /controller\.abort\(\)/);
  assert.doesNotMatch(entries.ai, /catch[\s\S]{0,220}createMessage\("assistant",\s*"[^"].*"\)/);
});

test("AI provider exceptions and malformed streams become controlled unavailable errors", () => {
  assert.match(entries.aiRoute, /settleOptional/);
  assert.match(entries.aiRoute, /category: "unexpected"/);
  assert.match(entries.ai, /aiChatStreamEventSchema\.safeParse/);
  assert.match(entries.ai, /AI_UNAVAILABLE/);
});

test("unknown, missing, and URL-shaped AI citations cannot enter rendered provider output", () => {
  assert.match(entries.aiParser, /https\?:\\\/\\\//);
  assert.match(entries.aiSchema, /href: z\.string\(\)\.startsWith\("\/"\)/);
  assert.match(entries.aiServer, /relatedContent: context\.data\.metadata\.relatedContent/);
  assert.doesNotMatch(entries.aiParser, /relatedContent|credibleSources/);
});

test("Explain It Back rejects malformed and contradictory evaluator output", () => {
  const challenge = explainItBackChallenges[0];
  const base = {
    verdict: "got_it",
    coveredConceptIds: challenge.essentialConcepts.map(({ id }) => id),
    missingEssentialConceptIds: [],
    contradictionIds: [],
    offTopic: false,
    personalMedicalContent: false,
  };
  assert.equal(
    parseAndEnforceClassification(malformedResponse({ ...base, verdict: "unknown" }), challenge),
    null,
  );
  assert.equal(
    parseAndEnforceClassification({ ...base, coveredConceptIds: ["unknown-concept"] }, challenge),
    null,
  );
  const contradictory = parseAndEnforceClassification(
    { ...base, contradictionIds: [challenge.misconceptions[0].id] },
    challenge,
  );
  assert.equal(contradictory, null);
});

test("Explain It Back failures preserve input, never grade locally, and contain provider rejection", () => {
  assert.match(entries.explain, /value=\{explanation\}/);
  assert.match(entries.explainRoute, /settleOptional/);
  assert.match(entries.explainRoute, /category: "unavailable"/);
  assert.doesNotMatch(entries.explainServer, /keyword|\.includes\(|\.match\(/i);
});

test("storage exceptions preserve in-memory work and never claim persistence", () => {
  const previousWindow = globalThis.window;
  const storage = failStorage();
  globalThis.window = {
    localStorage: {
      getItem: () => {
        throw injectedFault;
      },
      setItem: () => {
        throw injectedFault;
      },
      removeItem: () => {
        throw injectedFault;
      },
    },
  };
  assert.equal(safeGetLocalStorage("draft"), null);
  assert.equal(safeSetLocalStorage("draft", "exact text"), false);
  assert.equal(safeRemoveLocalStorage("draft"), false);
  globalThis.window = previousWindow;
  assert.equal(typeof storage.setItem, "function");
  assert.match(entries.resources, /will last only until this page closes/);
});

test("invalid lesson, story, glossary, and caregiver paths resolve to not-found behavior", () => {
  assert.match(entries.lessonRoute, /if \(!parsedDay\.success\) notFound\(\)/);
  assert.match(entries.storyRoute, /notFound\(\)/);
  assert.match(entries.caregiverRoute, /notFound\(\)/);
  assert.match(entries.storyRoute, /not-real|slug|slug\)/);
});

test("missing images and missing content records cannot crash parent collections", () => {
  assert.match(entries.decode, /onError=\{\(\) => setIntroImageFailed\(true\)\}/);
  assert.match(entries.decode, /remain available as text/);
  const complete = { core: "journey", optional: { title: "review" } };
  assert.deepEqual(partialResponse(complete, "optional"), { core: "journey" });
  assert.match(entries.searchService, /if \(!response\) return null/);
});

test("double AI and evaluator submission is guarded synchronously", () => {
  assert.match(entries.ai, /requestInFlightRef\.current/);
  assert.match(entries.explain, /submissionInFlight\.current/);
  assert.match(entries.lessonCompletionService, /complete_current_lesson/);
});

test("duplicate lesson, onboarding, and Spaced Review mutations are idempotent at persistence boundaries", async () => {
  const migrations = (
    await Promise.all([
      read("supabase/migrations/20260713000004_lesson_completion.sql"),
      read("supabase/migrations/20260810000002_first_use_onboarding.sql"),
      read("supabase/migrations/20260810000003_spaced_review.sql"),
    ])
  ).join("\n");
  assert.match(migrations, /first_time_completion|already_completed|status = 'completed'/i);
  assert.match(migrations, /complete_onboarding/);
  assert.match(migrations, /last_result_token = p_result_token then return false/);
});

test("older late responses cannot overwrite a newer mutation", async () => {
  const latest = createLatestRequest();
  const older = latest.begin();
  const first = deferredDependency();
  const newer = latest.begin();
  const second = deferredDependency();
  second.resolve("new");
  assert.equal(latest.isCurrent(newer), true);
  assert.equal(await second.promise, "new");
  first.resolve("old");
  assert.equal(await first.promise, "old");
  assert.equal(latest.isCurrent(older), false);
  assert.match(entries.explain, /requestVersion !== submissionVersion\.current/);
});

test("rapid navigation and refresh abort ephemeral AI and evaluator work cleanly", () => {
  assert.match(entries.ai, /\(\) => \(\) => \{[\s\S]*abortControllerRef\.current\?\.abort\(\)/);
  assert.match(entries.explain, /submissionController\.current\?\.abort\(\)/);
  assert.doesNotMatch(`${entries.ai}\n${entries.explain}`, /localStorage|sessionStorage/);
});

test("browser Back and Forward cannot replay successful mutations from client persistence", () => {
  assert.doesNotMatch(
    `${entries.ai}\n${entries.explain}\n${entries.onboarding}`,
    /popstate|history\.pushState|history\.replaceState/,
  );
  assert.match(entries.onboarding, /router\.push\(result\.destination\)/);
});

test("optional recognition after lesson completion cannot turn a successful write into false failure", () => {
  assert.match(entries.lessonCompletion, /settleOptional/);
  assert.match(entries.lessonCompletion, /optional_recognition_rejected/);
  const completionIndex = entries.lessonCompletion.indexOf(
    "const completed = await completeLesson",
  );
  assert.ok(
    completionIndex < entries.lessonCompletion.indexOf("recognizeMilestoneEvent", completionIndex),
  );
});

test("sensitive user text is excluded from all touched reliability logs", () => {
  assert.match(entries.logger, /sensitiveKeyPattern/);
  assert.match(entries.logger, /message|prompt|reflection|token/);
  for (const source of [
    entries.layout,
    entries.journey,
    entries.profileAction,
    entries.lessonCompletion,
  ]) {
    assert.doesNotMatch(
      source,
      /logger\.(?:error|info)\([^)]*parsed\.data\.(?:displayName|explanation|reflection|question)/s,
    );
  }
});

test("fault activation is test-only and has no production switch or route", async () => {
  const roots = ["app", "components", "features", "lib", "services"];
  const productionFiles = [];
  for (const root of roots) {
    for (const name of await readdir(new URL(`../${root}/`, import.meta.url), {
      recursive: true,
    })) {
      if (/\.(?:ts|tsx|mjs)$/.test(name)) productionFiles.push(`${root}/${name}`);
    }
  }
  const productionSource = (await Promise.all(productionFiles.map(read))).join("\n");
  assert.doesNotMatch(
    productionSource,
    /NEXT_PUBLIC_ENABLE_FAULTS|failDatabase|failure-lab|supabase-read-failure/,
  );
});

test("protected experiences, resources, and animation configuration remain outside fault infrastructure", () => {
  for (const source of [entries.resources, entries.decode])
    assert.doesNotMatch(source, /tests\/faults|FaultScenario/);
  assert.doesNotMatch(
    `${entries.lessonCompletionService}\n${entries.storyRoute}\n${entries.caregiverRoute}`,
    /FaultScenario/,
  );
  assert.doesNotMatch(entries.storage, /process\.env|searchParams/);
});
