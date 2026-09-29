import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [experience, styles] = await Promise.all([
  readFile(
    new URL("features/caregiver/components/modules/module-2/module-2-experience.tsx", root),
    "utf8",
  ),
  readFile(new URL("features/caregiver/styles/caregiver-module-1-story.module.css", root), "utf8"),
]);

test("the rebuild uses sixteen short story-like scenes", () => {
  assert.match(experience, /const SCENE_COUNT = 16/);
  for (const id of [
    "kitchen",
    "phone",
    "intention-impact",
    "signals",
    "continuum",
    "permission-questions",
    "permission-builder",
    "appointment-role",
    "sharing",
    "refusal",
    "repair",
    "supporter-boundary",
    "reliable-support",
    "quick-check",
    "phrases",
    "takeaway",
  ]) {
    assert.match(experience, new RegExp(`id: "${id}"`));
  }
});

test("every major idea is taught through a compact interaction or diagram", () => {
  for (const component of [
    "ScenarioSequence",
    "IntentionImpactMap",
    "BoundarySignals",
    "SupportContinuum",
    "PermissionQuestions",
    "PermissionBuilder",
    "AppointmentRoles",
    "SharingScope",
    "RefusalPath",
    "RepairBuilder",
    "BoundaryCompare",
    "ReliableSupportDiagram",
    "QuickCheck",
    "PhraseBrowser",
    "TakeawayDiagram",
  ]) {
    assert.match(experience, new RegExp(`function ${component}`));
  }
});

test("all source depth remains available without passive reading blocks", () => {
  assert.match(experience, /sections\.scenario\.paragraphs\.slice/);
  assert.match(experience, /interactions\.intentionImpact/);
  assert.match(experience, /interactions\.continuum/);
  assert.match(experience, /interactions\.permissionBuilder/);
  assert.match(experience, /interactions\.refusal/);
  assert.match(experience, /interactions\.repair/);
  assert.match(experience, /caregiverModule2\.questions/);
  assert.match(experience, /caregiverModule2\.scripts/);
  assert.doesNotMatch(experience, /passiveReading|Module2Reflection|quietDetails/);
});

test("Module 2 directly adopts the Module 1 and Stories reader grammar", () => {
  assert.match(experience, /caregiver-module-1-story\.module\.css/);
  assert.match(styles, /max-width: 52rem/);
  assert.match(styles, /font-family: var\(--font-serif\)/);
  assert.match(styles, /grid-auto-flow: column/);
  assert.doesNotMatch(experience, /next\/image|<Image|\.png|\.jpg|\.webp/);
  assert.doesNotMatch(experience, /—/);
});
