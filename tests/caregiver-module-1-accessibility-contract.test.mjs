import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [experience, styles] = await Promise.all([
  readFile(
    new URL("features/caregiver/components/modules/module-1/module-1-experience.tsx", root),
    "utf8",
  ),
  readFile(new URL("features/caregiver/styles/caregiver-module-1-story.module.css", root), "utf8"),
]);

test("Module 1 uses the accessible story-reader contract", () => {
  assert.match(experience, /<main/);
  assert.match(experience, /role="progressbar"/);
  assert.match(experience, /aria-valuenow=\{current \+ 1\}/);
  assert.match(experience, /headingRef\.current\?\.focus/);
  assert.match(experience, /aria-label="Module navigation"/);
  assert.match(experience, /role="tablist"/);
  assert.match(experience, /role="radiogroup"/);
  assert.match(experience, /aria-live="polite"/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(max-width: 38rem\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("Module 1 presents dense activities one item at a time", () => {
  assert.match(experience, /function FactOrGuess/);
  assert.match(experience, /Statement \{index \+ 1\} of \{statements\.length\}/);
  assert.match(experience, /function QuickCheck/);
  assert.match(experience, /Question \{index \+ 1\} of \{questions\.length\}/);
  assert.match(experience, /disabled=\{nextDisabled\}/);
});

test("Module 1 motion is restrained and removable", () => {
  assert.doesNotMatch(styles, /infinite|gradient\(/);
  assert.doesNotMatch(styles, /transition:\s*all/);
  assert.doesNotMatch(experience, /window\.setTimeout|setTransitioning|sceneLeaving/);
  assert.match(experience, /scrollIntoView\(\{ behavior: "auto"/);
  assert.match(styles, /transition-duration: 0\.01ms/);
  assert.match(styles, /@media \(hover: hover\) and \(pointer: fine\)/);
});
