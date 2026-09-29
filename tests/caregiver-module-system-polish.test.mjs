import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const experiencePaths = Array.from(
  { length: 5 },
  (_, index) =>
    `features/caregiver/components/modules/module-${index + 1}/module-${index + 1}-experience.tsx`,
);
const contentPaths = Array.from(
  { length: 5 },
  (_, index) => `features/caregiver/content/caregiver-module-${index + 1}.ts`,
);
const experiences = await Promise.all(
  experiencePaths.map((path) => readFile(new URL(path, root), "utf8")),
);
const visibleCopy = (
  await Promise.all(
    [
      ...experiencePaths,
      ...contentPaths,
      "features/caregiver/content/caregiver-landing.ts",
      "app/(app)/caregiver/modules/[module-slug]/loading.tsx",
      "app/(app)/caregiver/modules/[module-slug]/error.tsx",
    ].map((path) => readFile(new URL(path, root), "utf8")),
  )
).join("\n");
const styles = await readFile(
  new URL("features/caregiver/styles/caregiver-module-1-story.module.css", root),
  "utf8",
);
const globalStyles = await readFile(new URL("app/globals.css", root), "utf8");
const loading = await readFile(
  new URL("app/(app)/caregiver/modules/[module-slug]/loading.tsx", root),
  "utf8",
);
const error = await readFile(
  new URL("app/(app)/caregiver/modules/[module-slug]/error.tsx", root),
  "utf8",
);

test("all caregiver modules navigate without an artificial delay or input lock", () => {
  for (const source of experiences) {
    assert.doesNotMatch(source, /setTransitioning|sceneLeaving/);
    assert.doesNotMatch(source, /window\.setTimeout/);
    assert.match(source, /setCurrent\(next\)/);
    assert.match(source, /scrollIntoView\(\{ behavior: "auto"/);
    assert.match(source, /aria-valuetext=\{`Part \$\{current \+ 1\} of \$\{SCENE_COUNT\}`\}/);
    assert.match(source, /function shouldReduceMotion/);
  }
});

test("required practices explain a locked continuation instead of looking broken", () => {
  for (const source of experiences.slice(0, 2)) {
    assert.match(source, /className=\{styles\.gateNote\}/);
    assert.match(source, /aria-describedby=\{nextDisabled/);
    assert.match(source, /LockKeyhole/);
  }
  assert.match(experiences[0], /Complete all six statements above to continue/);
  assert.match(experiences[1], /Build and review all four parts of the offer to continue/);
});

test("review and restart transitions restore both context and keyboard focus", () => {
  for (const source of experiences) {
    assert.match(
      source,
      /function restart\(\)[\s\S]*scrollIntoView[\s\S]*headingRef\.current\?\.focus/,
    );
    assert.match(
      source,
      /function reviewPractice\(\)[\s\S]*scrollIntoView[\s\S]*headingRef\.current\?\.focus/,
    );
  }
});

test("incomplete end screens are honest and keep the required practice visually primary", () => {
  for (const source of experiences.slice(2)) {
    assert.match(source, /completed \? "Finished" : "One step remains"/);
    assert.match(source, /completed \? styles\.primaryAction : styles\.secondaryAction/);
  }
  assert.match(styles, /\.incompleteNote button\s*\{[^}]*background: #955842/s);
});

test("the shared reader contains narrow-screen overflow safeguards", () => {
  assert.match(styles, /\.stepNavigator[\s\S]*flex-wrap: wrap/);
  assert.match(styles, /\.sorterTop,[\s\S]*flex-wrap: wrap/);
  assert.match(
    styles,
    /@media \(max-width: 38rem\)[\s\S]*grid-template-columns: auto minmax\(0, 1fr\)/,
  );
  assert.match(styles, /touch-action: manipulation/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(
    styles,
    /@media \(max-width: 79\.99rem\)[\s\S]*padding-inline: clamp\(1\.25rem, 4vw, 2rem\)/,
  );
  assert.match(
    styles,
    /@media \(min-width: 38\.01rem\) and \(max-width: 79\.99rem\) and \(max-height: 48rem\)/,
  );
  assert.match(styles, /\.sceneVisual > \* \{[\s\S]*max-width: 100%[\s\S]*min-width: 0/);
  assert.match(styles, /@media \(max-width: 28rem\)[\s\S]*grid-template-columns: 1fr/);
  assert.match(
    globalStyles,
    /@media \(max-width: 79\.99rem\)[\s\S]*body:has\(\[data-caregiver-module\]\) \.ai-companion-trigger[\s\S]*display: none/,
  );
});

test("hover and press feedback never disguises disabled or selected controls", () => {
  assert.match(styles, /\.next:hover:not\(:disabled\)/);
  assert.match(styles, /button:hover:not\(\.choiceSelected\)/);
  assert.match(styles, /button:not\(:disabled\), a\):active/);
  assert.doesNotMatch(
    styles,
    /\.stepNavigator button\[aria-current="step"\]\s*\{[^}]*border-width/s,
  );
});

test("the route loading state is neutral, stable, and motion-aware", () => {
  assert.match(loading, /data-route-loading/);
  assert.match(loading, /aria-busy="true"/);
  assert.match(loading, /Opening caregiver module/);
  assert.doesNotMatch(loading, /caregiverModule[1-5]/);
  assert.match(styles, /caregiver-loading-pulse/);
  assert.match(styles, /prefers-reduced-motion[\s\S]*animation: none/);
});

test("the module error state is actionable without making a false state claim", () => {
  assert.match(error, /Open module again/);
  assert.match(error, /Nothing from this screen was submitted/);
  assert.match(error, /Back to caregiver modules/);
  assert.doesNotMatch(error, /Your place is still available/);
});

test("caregiver module UI and authored copy contain no en or em dashes", () => {
  assert.doesNotMatch(visibleCopy, /[\u2013\u2014]/);
});
