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

test("Module 1 exposes staged landmarks, focus, native choices, and announcements", () => {
  assert.match(experience, /<main/);
  assert.match(experience, /ProgressBar/);
  assert.match(experience, /hidden=\{stageIndex !==/);
  assert.match(experience, /document\.getElementById\(stage\.headingId\)\?\.focus/);
  assert.match(orientation, /<h1[\s\S]*tabIndex=\{-1\}/);
  assert.match(interaction, /<form/);
  assert.match(interaction, /<fieldset/);
  assert.match(interaction, /type="radio"/);
  assert.doesNotMatch(interaction, /<select/);
  assert.match(interaction, /aria-live="polite"/);
  assert.match(knowledgeCheck, /aria-live="polite"/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /@media \(max-width: 28rem\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("Module 1 presents one practice item at a time with non-punitive feedback", () => {
  assert.match(interaction, /statementIndex/);
  assert.match(interaction, /This is practice, not a test/);
  assert.match(knowledgeCheck, /questionIndex/);
  assert.match(knowledgeCheck, /Take one at a time/);
  assert.match(knowledgeCheck, /Select a response to see why it fits/);
});

test("Module 1 motion is event-driven, restrained, and removable", () => {
  assert.doesNotMatch(styles, /infinite/);
  assert.doesNotMatch(styles, /gradient\(/);
  assert.match(styles, /stage-arrive/);
  assert.match(styles, /animation: none/);
  assert.match(styles, /transition: none/);
});
