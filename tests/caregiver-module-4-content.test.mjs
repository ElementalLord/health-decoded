import assert from "node:assert/strict";
import test from "node:test";
import { caregiverModule4 } from "../features/caregiver/content/caregiver-module-4.ts";

test("Module 4 preserves source trace and all stable IDs", () => {
  assert.equal(caregiverModule4.id, "CG-M4");
  assert.equal(caregiverModule4.slug, "when-something-feels-wrong");
  assert.equal(caregiverModule4.source.heading, "MODULE 4: WHEN SOMETHING FEELS WRONG");
  assert.deepEqual(
    Object.values(caregiverModule4.sections).map(({ id }) => id),
    Array.from({ length: 8 }, (_, index) => `CG-M4-S${String(index + 1).padStart(2, "0")}`),
  );
  assert.deepEqual(
    Object.values(caregiverModule4.interactions).map(({ id }) => id),
    ["CG-M4-I01", "CG-M4-I02", "CG-M4-I03", "CG-M4-I04", "CG-M4-I05"],
  );
  assert.deepEqual(
    caregiverModule4.questions.map(({ id }) => id),
    ["CG-M4-Q01", "CG-M4-Q02", "CG-M4-Q03"],
  );
  assert.equal(caregiverModule4.reflection.id, "CG-M4-R01");
  assert.equal(caregiverModule4.runtimeGeneration, false);
});

test("Module 4 keeps exact medical and delay boundaries", () => {
  assert.match(caregiverModule4.safety.productLimit, /cannot diagnose symptoms/);
  assert.match(caregiverModule4.safety.reading, /Do not enter a glucose reading here/);
  assert.match(caregiverModule4.safety.medication, /Do not change, skip, add, repeat, or adjust/);
  assert.match(caregiverModule4.safety.doNotDelay, /Do not delay urgent or emergency help/);
  assert.match(caregiverModule4.metadata.reviewStatus, /not-reviewed/);
});
