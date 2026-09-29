import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../features/caregiver/", import.meta.url);
const [experience, styles] = await Promise.all([
  readFile(new URL("components/modules/module-3/module-3-experience.tsx", directory), "utf8"),
  readFile(new URL("styles/caregiver-module-1-story.module.css", directory), "utf8"),
]);

test("Module 3 uses a focused story reader with direct, accessible progress", () => {
  assert.match(experience, /<main/);
  assert.match(experience, /<h1[\s\S]*tabIndex=\{-1\}/);
  assert.match(experience, /role="progressbar"/);
  assert.match(experience, /function StepNavigator/);
  assert.match(experience, /aria-current=\{current === index \? "step"/);
  assert.match(experience, /role="radiogroup"/);
  assert.match(experience, /role="status"/);
  assert.doesNotMatch(experience, /<select|draggable|onDrop=/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /min-height: 44px/);
});

test("Module 3 preserves a learner choice when feedback suggests another answer", () => {
  assert.match(experience, /Your choice has been kept/);
  assert.doesNotMatch(experience, /setAnswers\([\s\S]{0,120}preferredIndex/);
  assert.doesNotMatch(experience, /setChoices\([\s\S]{0,120}preferredPlanChoice/);
  assert.doesNotMatch(experience, /filled in after three attempts/i);
});

test("Module 3 uses restrained motion and a warm scoped interaction palette", () => {
  assert.doesNotMatch(styles, /infinite/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.moduleThree \.next/);
  assert.match(styles, /\.moduleThree \.stepNavigator button\[aria-current="step"\]/);
  assert.match(styles, /#9c5d47/);
});
