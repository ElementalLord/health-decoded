import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../features/caregiver/", import.meta.url);
const [experience, styles] = await Promise.all([
  readFile(new URL("components/modules/module-4/module-4-experience.tsx", directory), "utf8"),
  readFile(new URL("styles/caregiver-module-1-story.module.css", directory), "utf8"),
]);

test("Module 4 uses the accessible story-reader contract", () => {
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

test("Module 4 preserves choices instead of silently filling answers", () => {
  assert.match(experience, /Your choice has been kept/);
  assert.doesNotMatch(experience, /setAnswers\([\s\S]{0,120}preferredIndex/);
  assert.doesNotMatch(experience, /filled in after three attempts/i);
});

test("Module 4 uses restrained motion and a scoped warm palette", () => {
  assert.doesNotMatch(styles, /infinite/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.moduleFour \.next/);
  assert.match(styles, /\.moduleFour \.stepNavigator button\[aria-current="step"\]/);
  assert.match(styles, /#955842/);
});
