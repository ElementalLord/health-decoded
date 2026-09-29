import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const experience = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-4/module-4-experience.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("Module 4 presents urgent direction without an interrupting alert", () => {
  assert.doesNotMatch(experience, /UrgentSafetyInterruption|setUrgent|urgent-help/);
  assert.match(experience, /function UrgentDirection/);
  assert.match(experience, /Emergency help interrupts education/);
  assert.match(experience, /Do not delay urgent or emergency help/);
});

test("Module 4 keeps readings and treatment outside the application's authority", () => {
  assert.match(experience, /does not interpret personal readings/);
  assert.match(experience, /Do not create treatment from this module/);
  assert.match(experience, /cannot diagnose symptoms,\s+interpret a personal reading/);
});
