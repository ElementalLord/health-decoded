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

test("CG-LANDING-I01 feedback is interpretive and M4 preserves only the urgent link", () => {
  assert.ok(caregiverLandingRoutes.every((route) => route.feedback.length > 30));
  assert.match(needRouterSource, /submittedRoute\.id === "CG-M4"/);
  assert.match(needRouterSource, /href="\/caregiver\/urgent-help"/);
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

test("feedback is announced politely and receives focus only after deliberate submission", () => {
  assert.match(feedbackSource, /role=\{isAssertive \? "alert" : "status"\}/);
  assert.match(feedbackSource, /aria-live=\{isAssertive \? "assertive" : "polite"\}/);
  assert.match(needRouterSource, /focusWhen/);
  assert.doesNotMatch(needRouterSource, /onChange=\{submitSelection\}/);
});
