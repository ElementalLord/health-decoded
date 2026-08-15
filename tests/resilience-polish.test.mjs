import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import { formatDateSafely } from "../lib/dates/format-date.ts";
import { fallbackNextStepForJourney } from "../features/next-step/lib/recommend-next-step.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const sources = Object.fromEntries(
  await Promise.all(
    [
      ["layout", "app/(app)/layout.tsx"],
      ["appError", "app/(app)/error.tsx"],
      ["globalError", "app/error.tsx"],
      ["notFound", "app/not-found.tsx"],
      ["offline", "components/layout/offline-status.tsx"],
      ["journey", "app/(app)/journey/page.tsx"],
      ["journeyService", "features/journeys/services/journey-home.server.ts"],
      ["streak", "features/streaks/components/learning-streak-panel.tsx"],
      ["milestonesRoute", "app/(app)/milestones/page.tsx"],
      ["milestones", "features/achievements/components/milestones-page.tsx"],
      ["aiChat", "features/ai/components/ai-chat.tsx"],
      ["aiServer", "features/ai/services/ai-chat.server.ts"],
      ["aiContext", "features/ai/services/ai-context.server.ts"],
      ["aiSchema", "features/ai/schemas/ai-chat.schema.ts"],
      ["aiParser", "services/ai/response-parser.ts"],
      ["search", "features/universal-search/components/search-experience.tsx"],
      ["appointment", "features/appointment-prep/components/appointment-prep-page.tsx"],
      ["profile", "features/profile/components/profile-content.tsx"],
      ["profileAction", "features/profile/actions/profile-settings.actions.ts"],
      ["onboarding", "features/onboarding/components/onboarding-flow.tsx"],
      ["onboardingAction", "features/onboarding/actions/onboarding.actions.ts"],
      ["explain", "features/explain-it-back/components/explain-it-back-experience.tsx"],
      ["explainServer", "features/explain-it-back/services/explain-it-back.server.ts"],
      ["decode", "features/decode-the-label/components/decode-the-label-experience.tsx"],
      ["caregiverError", "app/(app)/caregiver/modules/[module-slug]/error.tsx"],
      ["resources", "features/resources/components/resources.tsx"],
      ["logging", "features/ai/services/ai-logging.server.ts"],
      ["lesson", "features/lessons/components/lesson-player.tsx"],
      ["caregiver", "features/caregiver/state/caregiver-session-provider.tsx"],
      ["story", "features/stories/components/interactive-story-player.tsx"],
    ].map(async ([key, path]) => [key, await read(path)]),
  ),
);

const lessonComponentDirectory = new URL("../features/lessons/components/", import.meta.url);
const lessonStorageSources = (
  await Promise.all(
    (await readdir(lessonComponentDirectory))
      .filter((name) => name.endsWith("experience.tsx"))
      .map((name) => readFile(new URL(name, lessonComponentDirectory), "utf8")),
  )
).join("\n");

test("optional account preferences do not gate every authenticated route", () => {
  assert.match(sources.layout, /getCurrentProfile\(\)/);
  assert.match(
    sources.layout,
    /const settingsPromise = settleResult\([\s\S]*getProfileSettings\(\)/,
  );
  assert.match(sources.layout, /const settings = await settingsPromise/);
  assert.match(sources.layout, /settings\.ok \? \(/);
  assert.match(sources.layout, /<AppShell routes=\{routes\}>/);

  // The independent profile and settings reads must stay concurrent. Ordering
  // alone is too weak a check: `const settingsPromise = ...` can sit textually
  // before the first await while an intervening await still serializes the two
  // round trips. So assert that both promises are created in one uninterrupted
  // synchronous run — no `await` may separate them.
  const profileStart = sources.layout.indexOf("const profilePromise =");
  const firstAwait = sources.layout.indexOf("const profile = await profilePromise");
  assert.ok(profileStart > 0 && firstAwait > profileStart);
  const betweenPromises = sources.layout.slice(profileStart, firstAwait).replace(/\/\/.*$/gm, "");
  assert.match(betweenPromises, /getProfileSettings\(\)/);
  assert.doesNotMatch(
    betweenPromises,
    /\bawait\b/,
    "an await between the profile and settings reads would serialize them again",
  );
});

test("the settings promise guard defers rejections instead of swallowing them", async () => {
  // The layout attaches `.catch(() => {})` to the settings promise so the
  // early-return branches do not trip an unhandled rejection. That guard must
  // not absorb the failure: awaiting the original promise still has to throw,
  // or an unexpected settings error would silently vanish instead of reaching
  // the error boundary.
  assert.match(sources.layout, /void settingsPromise\.catch\(\(\) => \{\}\)/);

  const failing = Promise.reject(new Error("invariant violated"));
  void failing.catch(() => {});
  await assert.rejects(failing, /invariant violated/);

  // And the guard genuinely prevents the unhandled rejection it exists for.
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(reason);
  process.on("unhandledRejection", onUnhandled);
  const abandoned = Promise.reject(new Error("abandoned settings read"));
  void abandoned.catch(() => {});
  await new Promise((resolve) => setImmediate(resolve));
  process.off("unhandledRejection", onUnhandled);
  assert.deepEqual(unhandled, []);
});

test("authentication outages do not masquerade as expired sessions", async () => {
  const [auth, session] = await Promise.all([
    read("features/auth/services/auth.server.ts"),
    read("lib/auth/supabase-session.ts"),
  ]);
  assert.match(auth, /isUnauthenticatedSessionCheck\(hasSessionCookie, error\)/);
  assert.match(session, /error\.status === 401 \|\| error\.status === 403/);
  assert.match(auth, /auth\.session_check_unavailable/);
  assert.match(auth, /unexpectedError\(\)/);
  assert.match(sources.layout, /SessionUnavailableState/);
});

test("Journey core remains available when confidence data fails", () => {
  assert.match(sources.journeyService, /journey_home\.confidence_unavailable/);
  assert.doesNotMatch(
    sources.journeyService,
    /journey_home\.confidence_unavailable"\);\s*return err/,
  );
});

test("Journey keeps its core UI when streak data fails", () => {
  assert.match(sources.journey, /learningStreak\.ok \? <LearningStreakPanel/);
  assert.doesNotMatch(sources.journey, /learningStreak\.ok \? .* : <JourneyUnavailableState/);
});

test("Journey recommendation failure uses the deterministic lesson fallback", () => {
  assert.match(sources.journey, /fallbackNextStepForJourney/);
  const result = fallbackNextStepForJourney({
    kind: "ready",
    journeyTitle: "Foundation",
    confidenceLevel: null,
    currentLesson: {
      lessonId: "lesson-2",
      journeyLessonId: "journey-2",
      lessonProgressId: null,
      dayNumber: 2,
      title: "How insulin works",
      subtitle: null,
      whyItMatters: "Understand insulin.",
      estimatedMinutes: 7,
      status: "in_progress",
    },
    progress: { completedLessons: 1, currentDay: 2, percentage: 7, totalDays: 14 },
  });
  assert.equal(result.primary.type, "continue-lesson");
  assert.equal(result.primary.route, "/lessons/2");

  const completeResult = fallbackNextStepForJourney({
    kind: "complete",
    journeyTitle: "Foundation",
    progress: { completedLessons: 14, currentDay: 14, percentage: 100, totalDays: 14 },
  });
  assert.equal(completeResult.primary.route, "/glossary");
});

test("first streak day and zero streak render as intentional beginnings", () => {
  assert.match(sources.streak, /Your learning streak starts today/);
  assert.match(sources.streak, /Your first learning day starts when you do/);
  assert.match(sources.streak, /Nothing is behind/);
});

test("Milestones load failure is not converted to zero earned", () => {
  assert.match(sources.milestonesRoute, /if \(!earned\.ok\) return <MilestonesUnavailableState/);
  assert.doesNotMatch(sources.milestonesRoute, /earned\.ok \? earned\.data : \[\]/);
});

test("zero milestones explains the legitimate first-use state", () => {
  assert.match(sources.milestones, /Your first milestones will appear as you learn/);
  assert.match(sources.milestones, /None of them measure your health/);
});

test("AI slow and timeout states preserve the submitted question", () => {
  assert.match(sources.aiChat, /Still working on this…/);
  assert.match(sources.aiChat, /window\.setTimeout\(\(\) => setIsTakingLonger\(true\), 5_000\)/);
  assert.match(sources.aiChat, /controller\.abort\(\)/);
  assert.match(sources.aiChat, /Your question is still here/);
  assert.match(
    sources.aiChat,
    /setMessages\(\(current\) => \[\.\.\.current, createMessage\("user", question\)/,
  );
});

test("AI provider failure preserves previous conversation and offers a real retry", () => {
  assert.match(sources.aiChat, /historyBeforeRegeneration/);
  assert.match(sources.aiChat, /ask\(lastQuestion, true\)/);
  assert.doesNotMatch(sources.aiChat, /setMessages\(\[\]\).*temporarily unavailable/s);
});

test("AI rate limiting remains distinct from a provider failure", () => {
  assert.match(sources.aiChat, /Health Decoded AI is receiving too many requests right now/);
  assert.match(sources.aiSchema, /AI_RATE_LIMITED/);
});

test("invalid provider links and citations can never reach the renderer", () => {
  assert.match(sources.aiParser, /https\?:\\\/\\\//);
  assert.match(sources.aiSchema, /href: z\.string\(\)\.startsWith\("\/"\)/);
  assert.doesNotMatch(sources.aiChat, /dangerouslySetInnerHTML/);
});

test("unknown AI source IDs are not accepted from provider output", () => {
  assert.match(sources.aiServer, /relatedContent: context\.data\.metadata\.relatedContent/);
  assert.match(sources.aiContext, /const relatedContent: AiRelatedContent\[\]/);
  assert.doesNotMatch(sources.aiParser, /relatedContent|suggestedQuestions/);
});

test("general education uses authoritative sources without an internal-content refusal", () => {
  assert.match(sources.aiContext, /credibleSourcesForQuestion/);
  assert.match(sources.aiServer, /credibleSources: context\.data\.metadata\.credibleSources/);
  assert.doesNotMatch(
    sources.aiServer,
    /I couldn’t find enough reviewed Health Decoded information/,
  );
});

test("Search keeps empty, no-result, and infrastructure failures distinct", () => {
  assert.match(sources.search, /!loading && !hasQuery && !compact/);
  assert.match(sources.search, /No matches for/);
  assert.match(sources.search, /We couldn’t search right now/);
  assert.match(sources.search, /setRetryKey\(\(value\) => value \+ 1\)/);
});

test("Search has bounded slow, timeout, malformed-response, and long-query behavior", () => {
  assert.match(sources.search, /Still searching Health Decoded/);
  assert.match(sources.search, /10_000/);
  assert.match(sources.search, /Invalid search response/);
  assert.match(sources.search, /MAX_SEARCH_CHARACTERS = 100/);
  assert.match(sources.search, /This search is too long/);
});

test("Appointment content is mounted-session state and clipboard failure stays truthful", () => {
  assert.match(
    sources.appointment,
    /useReducer\(appointmentPrepReducer, initialAppointmentPrepState\)/,
  );
  assert.doesNotMatch(sources.appointment, /fetch\(|localStorage|sessionStorage/);
  assert.match(sources.appointment, /The summary is available below for manual selection/);
  assert.doesNotMatch(sources.appointment, /catch[\s\S]{0,120}appointmentPrepNotices\.copied/);
});

test("Profile save failure preserves the uncontrolled typed value", () => {
  assert.match(sources.profile, /defaultValue=\{data\.displayName\}/);
  assert.match(sources.profileAction, /Your changes are still here/);
  assert.doesNotMatch(sources.profile, /value=\{data\.displayName\}/);
});

test("Profile session expiry is actionable and does not claim a save", () => {
  assert.match(sources.profileAction, /status: "auth"/);
  assert.match(sources.profileAction, /Your session ended/);
  assert.match(sources.profile, /href="\/login\?next=\/profile"/);
});

test("Onboarding completion failure preserves the selected intent and preview never persists", () => {
  assert.match(sources.onboarding, /value=\{intent \?\? ""\}/);
  assert.match(sources.onboardingAction, /We couldn't finish setting this up right now/);
  assert.match(sources.onboarding, /mode === "preview"/);
  assert.match(sources.onboarding, /router\.push\(result\.destination\)/);
});

test("Onboarding session expiry keeps the starting choice and offers sign in", () => {
  assert.match(sources.onboardingAction, /status: "auth"/);
  assert.match(sources.onboardingAction, /Your starting choice is still here/);
  assert.match(sources.onboarding, /href="\/login\?next=\/onboarding"/);
});

test("Explain It Back timeout and malformed output preserve the response without keyword grading", () => {
  assert.match(sources.explain, /value=\{explanation\}/);
  assert.match(sources.explain, /25_000/);
  assert.match(sources.explain, /Your answer is still here/);
  assert.match(sources.explainServer, /parseAndEnforceClassification/);
  assert.doesNotMatch(sources.explainServer, /keyword|\.includes\(|\.match\(/i);
});

test("Explain It Back empty input stays local and does not submit", () => {
  assert.match(
    sources.explain,
    /if \(!challenge \|\| !useful \|\| submitting \|\| submissionInFlight\.current\) return/,
  );
  assert.match(sources.explain, /disabled=\{!useful \|\| submitting\}/);
});

test("Decode the Label image failure has an accessible content fallback", () => {
  assert.match(sources.decode, /onError=\{\(\) => setIntroImageFailed\(true\)\}/);
  assert.match(sources.decode, /nutrition facts remain available as text/);
  assert.match(sources.decode, /role="img"/);
});

test("offline status is global, restrained, and removes itself on reconnection", () => {
  assert.match(sources.offline, /window\.navigator\.onLine/);
  assert.match(sources.offline, /addEventListener\("online"/);
  assert.match(sources.offline, /Some parts of Health Decoded may not update/);
  assert.doesNotMatch(sources.offline, /Everything is synced/);
});

test("malformed dates never render Invalid Date", () => {
  assert.equal(formatDateSafely("not-a-date"), null);
  assert.equal(formatDateSafely(null), null);
  assert.notEqual(formatDateSafely("2026-08-10T12:00:00Z"), null);
});

test("404 and error boundaries offer useful recovery without raw exceptions", () => {
  assert.match(sources.notFound, /Go to Journey/);
  assert.match(sources.notFound, /Search Health Decoded/);
  assert.match(sources.appError, /Try again/);
  assert.match(sources.appError, /Go to Journey/);
  assert.doesNotMatch(
    `${sources.appError}\n${sources.globalError}\n${sources.caregiverError}`,
    /error\.message/,
  );
});

test("sensitive text is excluded from AI error telemetry", () => {
  assert.match(sources.logging, /request_size_bucket/);
  assert.match(sources.logging, /correlation_id/);
  assert.doesNotMatch(
    sources.logging,
    /message|conversation|prompt|content|reflection|password|token/i,
  );
});

test("resource browser-storage failure preserves in-memory state without false persistence", () => {
  assert.match(sources.resources, /persistenceAvailable/);
  assert.match(sources.resources, /will last only until this page closes/);
  assert.match(sources.resources, /return false/);
});

test("lesson and story browser-storage failure cannot interrupt the active experience", async () => {
  const safeStorage = await read("lib/storage/safe-local-storage.ts");
  assert.match(safeStorage, /export function safeSetLocalStorage/);
  assert.match(safeStorage, /catch \{/);
  assert.doesNotMatch(lessonStorageSources, /window\.localStorage/);
  assert.match(lessonStorageSources, /safeSetLocalStorage/);
  assert.match(
    sources.story,
    /Available for this visit only because browser storage is unavailable/,
  );
});

test("double submissions and empty mutations remain guarded", () => {
  assert.match(
    sources.aiChat,
    /if \(isStreaming \|\| requestInFlightRef\.current \|\| !question\.trim\(\)\) return/,
  );
  assert.match(
    sources.explain,
    /if \(!challenge \|\| !useful \|\| submitting \|\| submissionInFlight\.current\) return/,
  );
  assert.match(sources.profile, /disabled=\{pending\}/);
  assert.match(sources.onboarding, /disabled=\{pending\}/);
});

test("long content and mobile-keyboard constraints have structural safeguards", async () => {
  const [globals, profileStyles, searchStyles] = await Promise.all([
    read("app/globals.css"),
    read("features/profile/components/profile-content.module.css"),
    read("features/universal-search/styles/universal-search.module.css"),
  ]);
  assert.match(globals, /overflow-wrap: anywhere/);
  assert.match(globals, /max-height: 32rem/);
  assert.match(globals, /mobile-bottom-navigation/);
  assert.match(profileStyles, /overflow-wrap: anywhere/);
  assert.match(searchStyles, /width: calc\(100% - 1\.5rem\)/);
});

test("protected Lesson, Caregiver, and Story happy-path components remain scoped", () => {
  assert.match(sources.lesson, /LessonPlayer/);
  assert.match(sources.caregiver, /CaregiverSessionContext\.Provider/);
  assert.match(sources.story, /InteractiveStoryPlayer/);
  assert.doesNotMatch(sources.caregiverError, /error\.message/);
});

test("resource destination safety behavior remains allowlisted and unchanged", async () => {
  const schema = await read("features/stories/schemas/resource.schema.ts");
  assert.match(schema, /url\.protocol === "https:"/);
  assert.match(schema, /approvedHosts\.has\(url\.hostname\)/);
  assert.match(sources.resources, /rel="noopener noreferrer"/);
  assert.match(sources.resources, /target="_blank"/);
});
