import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [experience, styles] = await Promise.all([
  readFile(
    new URL("features/caregiver/components/modules/module-2/module-2-experience.tsx", root),
    "utf8",
  ),
  readFile(new URL("features/caregiver/styles/caregiver-module-1-story.module.css", root), "utf8"),
]);

test("Module 2 uses the accessible story-reader contract", () => {
  assert.match(experience, /<main/);
  assert.match(experience, /role="progressbar"/);
  assert.match(experience, /aria-valuenow=\{current \+ 1\}/);
  assert.match(experience, /headingRef\.current\?\.focus/);
  assert.match(experience, /aria-label="Module navigation"/);
  assert.match(experience, /role="tablist"/);
  assert.match(experience, /role="radiogroup"/);
  assert.match(experience, /role="checkbox"/);
  assert.match(experience, /role="status"/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(max-width: 38rem\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("dense practices are presented one item at a time", () => {
  assert.match(experience, /Situation \{index \+ 1\} of \{interaction\.behaviors\.length\}/);
  assert.match(experience, /Question \{index \+ 1\} of \{questions\.length\}/);
  assert.match(experience, /Part \{index \+ 1\} of \{interaction\.groups\.length\}/);
  assert.match(experience, /disabled=\{nextDisabled\}/);
  assert.doesNotMatch(experience, /<select|onMouseEnter|onMouseOver|draggable=/);
});

test("review activities expose one predictable review and next control", () => {
  assert.match(experience, /function StepNavigator/);
  assert.match(experience, /aria-current=\{current === index \? "step"/);
  assert.match(experience, /onSelect=\{setActionIndex\}/);
  assert.match(experience, /styles\.activityAction/);
  assert.match(experience, /"Next action"/);
  assert.match(experience, /"Next situation"/);
  assert.match(experience, /"Next question"/);
  assert.match(experience, /Object\.values\(nextReviewed\)\.filter\(Boolean\)\.length/);
  assert.doesNotMatch(experience, /disabled=\{!currentReviewed/);
  assert.doesNotMatch(experience, /disabled=\{!reviewed\[behavior\.id\]/);
});

test("the four boundary checks stay aligned as a four-item set", () => {
  assert.match(experience, /styles\.fourSignalButtons/);
  assert.match(styles, /\.fourSignalButtons\s*\{[^}]*repeat\(4,/s);
  assert.match(styles, /\.activityAction\s*\{[^}]*margin-top: 1\.5rem/s);
});

test("Module 2 uses the warm interaction palette instead of green active states", () => {
  assert.match(experience, /styles\.moduleTwo/);
  assert.match(styles, /\.moduleTwo \.modeButtons button\[aria-selected="true"\]/);
  assert.match(styles, /\.moduleTwo \.primaryAction/);
  assert.match(styles, /background: #9c5d47/);
});

test("Module 2 motion is restrained, touch-safe, and removable", () => {
  assert.doesNotMatch(styles, /infinite|gradient\(|transition:\s*all/);
  assert.doesNotMatch(experience, /window\.setTimeout|setTransitioning|sceneLeaving/);
  assert.match(experience, /scrollIntoView\(\{ behavior: "auto"/);
  assert.match(styles, /min-height: 44px/);
  assert.match(styles, /transform: scale\(0\.97\)/);
  assert.match(styles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(styles, /transition-duration: 0\.01ms/);
});
