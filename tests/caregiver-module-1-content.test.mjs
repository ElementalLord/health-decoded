import assert from "node:assert/strict";
import test from "node:test";
import { caregiverModule1 } from "../features/caregiver/content/caregiver-module-1.ts";

test("Module 1 preserves identity, source trace, and every stable ID", () => {
  assert.equal(caregiverModule1.id, "CG-M1");
  assert.equal(caregiverModule1.slug, "what-they-may-be-feeling");
  assert.equal(caregiverModule1.source.heading, "MODULE 1: WHAT THEY MAY BE FEELING");
  assert.deepEqual(
    Object.values(caregiverModule1.sections).map(({ id }) => id),
    Array.from({ length: 7 }, (_, index) => `CG-M1-S${String(index + 1).padStart(2, "0")}`),
  );
  assert.deepEqual(
    Object.values(caregiverModule1.interactions).map(({ id }) => id),
    ["CG-M1-I01", "CG-M1-I02", "CG-M1-I03"],
  );
  assert.deepEqual(
    caregiverModule1.questions.map(({ id }) => id),
    ["CG-M1-Q01", "CG-M1-Q02", "CG-M1-Q03"],
  );
  assert.equal(caregiverModule1.reflection.id, "CG-M1-R01");
});

test("Module 1 keeps approved non-diagnostic copy and exact learner content", () => {
  assert.match(
    caregiverModule1.sections.opening.opening,
    /What you observe is real, but the meaning may still be unclear/,
  );
  assert.match(caregiverModule1.sections.scenario.unknown, /what she feels/);
  assert.equal(caregiverModule1.interactions.observation.statements.length, 6);
  assert.equal(caregiverModule1.scripts.length, 7);
  assert.equal(caregiverModule1.questions.length, 3);
  assert.match(caregiverModule1.reflection.privacy, /stays in this session/);
  assert.equal(caregiverModule1.runtimeGeneration, false);
});
