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
const orientation = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-4/module-4-orientation.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("Module 4 presents the lesson without an interrupting emergency alert", () => {
  assert.doesNotMatch(experience, /UrgentSafetyInterruption|setUrgent|urgent-help/);
  assert.doesNotMatch(orientation, /immediate danger|urgent-help/iu);
  assert.match(experience, /Module4Scenario/);
});
