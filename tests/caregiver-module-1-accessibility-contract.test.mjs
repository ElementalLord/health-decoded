import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../features/caregiver/", import.meta.url);
const [experience, orientation, interaction, knowledgeCheck, styles] = await Promise.all([
  readFile(new URL("components/modules/module-1/module-1-experience.tsx", directory), "utf8"),
  readFile(new URL("components/modules/module-1/module-1-orientation.tsx", directory), "utf8"),
  readFile(
    new URL("components/modules/module-1/observation-interpretation-workbench.tsx", directory),
    "utf8",
  ),
  readFile(new URL("components/modules/module-1/module-1-knowledge-check.tsx", directory), "utf8"),
  readFile(new URL("styles/caregiver-module-1.module.css", directory), "utf8"),
]);

test("Module 1 exposes landmarks, route focus, keyboard groups, and announcements", () => {
  assert.match(experience, /<main/);
  assert.match(orientation, /<h1[\s\S]*tabIndex=\{-1\}/);
  assert.match(interaction, /<form/);
  assert.match(interaction, /<select/);
  assert.match(interaction, /CaregiverFeedback/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /@media \(max-width: 28rem\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("Module 1 fills an answer after three responses needing review", () => {
  assert.match(knowledgeCheck, /attempt >= 3/);
  assert.match(knowledgeCheck, /nextAnswers\[question\.id\] = question\.preferredIndex/);
  assert.match(knowledgeCheck, /filled in after three attempts/);
});

test("Module 1 looping visual breaks stop under reduced motion", () => {
  assert.match(styles, /m1-light[\s\S]*infinite/);
  assert.match(styles, /m1-return[\s\S]*infinite/);
  assert.match(styles, /animation-iteration-count: 1 !important/);
});
