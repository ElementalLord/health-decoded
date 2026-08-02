import assert from "node:assert/strict";
import test from "node:test";
import { caregiverModule3 } from "../features/caregiver/content/caregiver-module-3.ts";

test("Module 3 preserves identity, source trace, and every stable ID", () => {
  assert.equal(caregiverModule3.id, "CG-M3");
  assert.equal(caregiverModule3.slug, "everyday-support-that-actually-helps");
  assert.equal(caregiverModule3.source.heading, "MODULE 3: EVERYDAY SUPPORT THAT ACTUALLY HELPS");
  assert.deepEqual(
    Object.values(caregiverModule3.sections).map(({ id }) => id),
    Array.from({ length: 7 }, (_, index) => `CG-M3-S${String(index + 1).padStart(2, "0")}`),
  );
  assert.deepEqual(
    Object.values(caregiverModule3.interactions).map(({ id }) => id),
    ["CG-M3-I01", "CG-M3-I02", "CG-M3-I03", "CG-M3-I04"],
  );
  assert.deepEqual(
    caregiverModule3.questions.map(({ id }) => id),
    ["CG-M3-Q01", "CG-M3-Q02", "CG-M3-Q03"],
  );
  assert.equal(caregiverModule3.reflection.id, "CG-M3-R01");
});

test("Module 3 keeps exact practical, nonmedical boundaries", () => {
  assert.match(caregiverModule3.sections.meals.paragraphs[0], /qualified care team decide/);
  assert.match(
    caregiverModule3.sections.specific.paragraphs[1],
    /not a treatment for a reading or symptom/,
  );
  assert.equal(caregiverModule3.scripts.length, 8);
  assert.equal(caregiverModule3.questions.length, 3);
  assert.equal(caregiverModule3.runtimeGeneration, false);
});
