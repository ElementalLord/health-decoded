import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { caregiverLandingRoutes } from "../features/caregiver/content/caregiver-landing.ts";

const needRouterSource = await readFile(
  new URL("../features/caregiver/components/landing/caregiver-need-router.tsx", import.meta.url),
  "utf8",
);
const guidedPathSource = await readFile(
  new URL("../features/caregiver/components/landing/caregiver-guided-path.tsx", import.meta.url),
  "utf8",
);
const landingStyles = await readFile(
  new URL("../features/caregiver/styles/caregiver-landing.module.css", import.meta.url),
  "utf8",
);
const feedbackSource = await readFile(
  new URL("../features/caregiver/components/foundation/caregiver-feedback.tsx", import.meta.url),
  "utf8",
);

test("CG-LANDING-I01 uses one native revisable radio group and explicit actions", () => {
  assert.match(needRouterSource, /data-interaction-id="CG-LANDING-I01"/);
  assert.match(needRouterSource, /<fieldset/);
  assert.match(needRouterSource, /<legend>/);
  assert.equal([...needRouterSource.matchAll(/name="caregiver-starting-point"/g)].length, 1);
  assert.match(needRouterSource, /type="radio"/);
  assert.match(needRouterSource, /submitSelection/);
  assert.match(needRouterSource, /clearSelection/);
  assert.match(needRouterSource, /firstChoiceRef\.current\?\.focus\(\)/);
  assert.equal(caregiverLandingRoutes.length, 5);
});

test("CG-LANDING-I01 feedback is interpretive and routes directly to each lesson", () => {
  assert.ok(caregiverLandingRoutes.every((route) => route.feedback.length > 30));
  assert.doesNotMatch(needRouterSource, /urgent-help|immediate danger/iu);
  assert.match(needRouterSource, /getImplementedCaregiverModuleById/);
  assert.doesNotMatch(needRouterSource, /href="\/caregiver\/modules\//);
  assert.doesNotMatch(needRouterSource, /correct|incorrect|score|moduleCompleted/);
});

test("the guided path keeps the module sequence without repeating the starting chooser", () => {
  assert.match(guidedPathSource, /className=\{styles\.moduleSequence\}/);
  assert.doesNotMatch(guidedPathSource, /data-interaction-id="CG-LANDING-I02"/);
  assert.doesNotMatch(guidedPathSource, /name="caregiver-beginning-strategy"/);
  assert.doesNotMatch(guidedPathSource, /submitSelection|changeChoice|beginChooser/);
  assert.doesNotMatch(guidedPathSource, /href="\/caregiver\/tools\//);
});

test("orbiting lesson links slow on targeting and freeze only for the active press", () => {
  assert.match(landingStyles, /moduleSequence:has\(\.moduleCardLink:active\)/);
  assert.match(landingStyles, /animation-play-state:\s*paused/);
  assert.match(landingStyles, /\.moduleCardLink\s*\{[^}]*pointer-events:\s*auto/s);
  assert.match(landingStyles, /\.moduleSequence\s*>\s*li\s*\{[^}]*pointer-events:\s*auto/s);
  assert.match(guidedPathSource, /const HOVER_RATE = 0;/);
  assert.match(guidedPathSource, /easeOrbitToward|playbackRate/);
  assert.match(
    guidedPathSource,
    /className=\{styles\.moduleCardLink\}[\s\S]*onPointerEnter=\{\(\) => easeOrbitToward\(HOVER_RATE\)\}/,
  );
});

test("feedback is announced politely and receives focus only after deliberate submission", () => {
  assert.match(feedbackSource, /role=\{isAssertive \? "alert" : "status"\}/);
  assert.match(feedbackSource, /aria-live=\{isAssertive \? "assertive" : "polite"\}/);
  assert.match(needRouterSource, /focusWhen/);
  assert.doesNotMatch(needRouterSource, /onChange=\{submitSelection\}/);
});
