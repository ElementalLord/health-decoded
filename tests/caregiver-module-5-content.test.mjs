import assert from "node:assert/strict";
import test from "node:test";
import { caregiverModule5 } from "../features/caregiver/content/caregiver-module-5.ts";

test("Module 5 preserves source trace and all stable IDs", () => {
  assert.equal(caregiverModule5.id, "CG-M5");
  assert.equal(caregiverModule5.slug, "the-caregiver-matters-too");
  assert.deepEqual(
    Object.values(caregiverModule5.sections).map(({ id }) => id),
    Array.from({ length: 7 }, (_, index) => `CG-M5-S${String(index + 1).padStart(2, "0")}`),
  );
  assert.deepEqual(
    Object.values(caregiverModule5.interactions).map(({ id }) => id),
    ["CG-M5-I01", "CG-M5-I02", "CG-M5-I03", "CG-M5-I04", "CG-M5-I05"],
  );
  assert.deepEqual(
    caregiverModule5.questions.map(({ id }) => id),
    ["CG-M5-Q01", "CG-M5-Q02", "CG-M5-Q03"],
  );
  assert.equal(caregiverModule5.reflection.id, "CG-M5-R01");
});
test("Module 5 remains descriptive and nonclinical", () => {
  assert.match(caregiverModule5.sections.strain.paragraphs[0], /do not diagnose burnout/);
  assert.match(caregiverModule5.interactions.load.feedback.burnout, /does not diagnose burnout/);
  assert.equal(caregiverModule5.runtimeGeneration, false);
});
