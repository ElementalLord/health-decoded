import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../features/caregiver/", import.meta.url);
const [experience, orientation, planning, matching, knowledgeCheck, styles] = await Promise.all([
  readFile(new URL("components/modules/module-3/module-3-experience.tsx", directory), "utf8"),
  readFile(new URL("components/modules/module-3/module-3-orientation.tsx", directory), "utf8"),
  readFile(new URL("components/modules/module-3/shared-planning-workspace.tsx", directory), "utf8"),
  readFile(new URL("components/modules/module-3/request-matching.tsx", directory), "utf8"),
  readFile(new URL("components/modules/module-3/module-3-knowledge-check.tsx", directory), "utf8"),
  readFile(new URL("styles/caregiver-module-3.module.css", directory), "utf8"),
]);

test("Module 3 exposes landmarks, route focus, labels, native controls, and announcements", () => {
  assert.match(experience, /<main/);
  assert.match(orientation, /<h1[\s\S]*tabIndex=\{-1\}/);
  assert.match(planning, /<select/);
  assert.match(matching, /<select/);
  assert.match(matching, /CaregiverFeedback/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /@media \(max-width: 28rem\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("Module 3 fills an answer after three responses needing review", () => {
  assert.match(knowledgeCheck, /attempt >= 3/);
  assert.match(knowledgeCheck, /nextAnswers\[question\.id\] = question\.preferredIndex/);
  assert.match(knowledgeCheck, /filled in after three attempts/);
});

test("Module 3 looping household visuals stop under reduced motion", () => {
  assert.match(styles, /m3-bag[\s\S]*infinite/);
  assert.match(styles, /m3-day[\s\S]*infinite/);
  assert.match(styles, /animation-iteration-count: 1 !important/);
});
