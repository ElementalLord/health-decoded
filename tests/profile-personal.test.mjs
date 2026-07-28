import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/(app)/profile/page.tsx", "utf8");
const component = readFileSync("features/profile/components/profile-content.tsx", "utf8");
const settings = readFileSync("features/profile/components/settings-content.tsx", "utf8");
const styles = readFileSync("features/profile/components/profile-content.module.css", "utf8");
const reflectionsService = readFileSync(
  "features/profile/services/profile-reflections.server.ts",
  "utf8",
);
const completionAction = readFileSync(
  "features/lessons/actions/lesson-completion.actions.ts",
  "utf8",
);
const completionSchema = readFileSync(
  "features/lessons/schemas/lesson-completion.schema.ts",
  "utf8",
);

test("profile stays distinct from Journey and Progress", () => {
  assert.doesNotMatch(page, /getProgressData/);
  assert.doesNotMatch(component, /Confidence XP|lessons done|current phase|90-day path/i);
  assert.match(component, /The lessons live in your journey/);
  assert.match(component, /Reading comfort and motion choices\s+remain in Settings/);
});

test("profile reflections are real, private records rather than invented content", () => {
  assert.match(page, /getProfileReflections/);
  assert.match(reflectionsService, /getAuthenticatedUser/);
  assert.match(reflectionsService, /\.eq\("user_id", user\.data\.id\)/);
  assert.match(reflectionsService, /\.from\("reflection_entries"\)/);
  assert.match(reflectionsService, /\{ count: "exact" \}/);
  assert.match(reflectionsService, /\.from\("lessons"\)\.select\("id, title"\)/);
  assert.match(page, /reflectionsUnavailable=\{!reflections\.ok\}/);
  assert.match(
    component,
    /Refresh the page in a moment instead of assuming\s+the archive is empty/,
  );
  assert.match(component, /Nothing is missing here/);
  assert.doesNotMatch(component, /fake|placeholder reflection|sample reflection/i);
});

test("completed lesson reflections are written to the private profile archive", () => {
  assert.match(
    completionSchema,
    /reflection: z\.string\(\)\.trim\(\)\.min\(1\)\.max\(300\)\.optional/,
  );
  assert.match(completionAction, /\.from\("reflection_entries"\)/);
  assert.match(completionAction, /\.insert\(\{/);
  assert.match(completionAction, /\.update\(\{ reflection: parsed\.data\.reflection \}\)/);
  assert.match(completionAction, /revalidatePath\("\/profile"\)/);

  for (const file of [
    "first-five-minutes-experience.tsx",
    "day-two-experience.tsx",
    "day-three-experience.tsx",
    "day-four-experience.tsx",
    "day-five-experience.tsx",
    "day-six-experience.tsx",
    "day-seven-experience.tsx",
    "day-eight-experience.tsx",
    "day-nine-experience.tsx",
    "day-ten-experience.tsx",
    "day-eleven-experience.tsx",
    "day-twelve-experience.tsx",
    "day-thirteen-experience.tsx",
    "day-fourteen-experience.tsx",
  ]) {
    const lesson = readFileSync(`features/lessons/components/${file}`, "utf8");
    assert.match(lesson, /completeLessonAction\(\{[\s\S]{0,180}reflection:/);
  }
});

test("the profile orbit keeps personal tools moving around the user", () => {
  for (const element of [
    "orbitAvatar",
    "orbitPathOne",
    "orbitPathTwo",
    "orbitPathThree",
    "orbitPathFour",
    "orbitPathFive",
  ]) {
    assert.match(component, new RegExp(`styles\\.${element}`));
  }

  for (const icon of ["NotebookPen", "Settings", "Pill", "BookOpenText", "Stethoscope"]) {
    assert.match(component, new RegExp(`<${icon}`));
  }

  assert.match(styles, /@keyframes profile-orbit/);
  assert.match(styles, /@keyframes profile-counter-orbit/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:9999px|999px)/);
});

test("the profile celebrates once daily and confirms successful saves visually", () => {
  assert.match(component, /health-decoded:profile-confetti-date/);
  assert.match(component, /window\.localStorage\.getItem/);
  assert.match(component, /window\.localStorage\.setItem/);
  assert.match(component, /localDateKey\(new Date\(\)\)/);
  assert.match(component, /Array\.from\(\{ length: 18 \}/);
  assert.match(component, /<CheckCircle2 aria-hidden="true"/);
  assert.match(settings, /<CheckCircle2 aria-hidden="true"/);
  assert.match(styles, /@keyframes profile-confetti/);
});

test("the profile has one name form and omits the redundant identity strip", () => {
  assert.equal(component.split('name="displayName"').length - 1, 1);
  assert.doesNotMatch(component, /This profile says|Your space began|Visible to/);
  assert.doesNotMatch(component, /styles\.identityStrip/);
  assert.doesNotMatch(component, />Edit your name</);
});

test("the redesigned profile remains responsive and keyboard friendly", () => {
  assert.match(styles, /@media \(max-width: 56rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(component, /<summary>/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /aria-label="Profile actions"/);
});
