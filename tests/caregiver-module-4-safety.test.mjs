import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const urgent = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-4/urgent-safety-interruption.tsx",
    import.meta.url,
  ),
  "utf8",
);
test("urgent behavior replaces learning with no screening question or progress update", () => {
  assert.match(urgent, /if \(active\)/);
  assert.match(urgent, /CaregiverSafetyInterruption/);
  assert.doesNotMatch(
    urgent,
    /Is this happening now|markInteractionSubmitted|setKeyIdeaUnderstood/,
  );
  assert.match(urgent, /\/caregiver\/urgent-help/);
});
