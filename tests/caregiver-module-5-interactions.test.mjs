import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { caregiverModule5 } from "../features/caregiver/content/caregiver-module-5.ts";

const experience = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-5/module-5-experience.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("Module 5 keeps all five learning mechanics in one story experience", () => {
  assert.equal(caregiverModule5.interactions.responsibility.items.length, 8);
  assert.equal(caregiverModule5.interactions.sustainability.choices.length, 6);
  assert.equal(caregiverModule5.interactions.boundaries.statements.length, 3);
  assert.equal(caregiverModule5.interactions.network.tasks.length, 3);
  assert.equal(caregiverModule5.interactions.load.patterns.length, 6);
  for (const id of ["responsibility", "sustainability", "boundaries", "network", "load"])
    assert.match(experience, new RegExp(`interactions\\.${id}`));
});

test("Module 5 breaks dense work into clickable one-item sequences", () => {
  assert.match(experience, /const SCENE_COUNT = 18/);
  assert.match(experience, /function StepNavigator/);
  assert.match(experience, /Item \{index \+ 1\}/);
  assert.match(experience, /Difference \{index \+ 1\}/);
  assert.match(experience, /Revision \{index \+ 1\}/);
  assert.match(experience, /Task \{index \+ 1\}/);
  assert.match(experience, /Pattern \$\{index \+ 1\}/);
});

test("review keeps the learner's answer and offers assistance after three attempts", () => {
  assert.match(experience, /attempts\[item\.id\][\s\S]*>= 3/);
  assert.match(experience, /attempts\[choice\.id\][\s\S]*>= 3/);
  assert.match(experience, /attempts\[statement\.id\][\s\S]*>= 3/);
  assert.match(experience, /Your choice has been kept/);
  assert.match(experience, /Your choices have been kept/);
  assert.doesNotMatch(experience, /setAnswers\([^\n]*preferred/);
});

test("outer scene navigation never depends on an activity answer", () => {
  assert.match(experience, /onClick=\{\(\) => goTo\(current \+ 1\)\}/);
  assert.match(experience, /Continue, then return if needed/);
  assert.doesNotMatch(experience, /className=\{styles\.next\}[^>]*disabled=/);
});
