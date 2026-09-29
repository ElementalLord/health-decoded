import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { caregiverModule4 } from "../features/caregiver/content/caregiver-module-4.ts";

const source = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-4/module-4-experience.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("Module 4 is an eighteen-screen story flow with no outer navigation trap", () => {
  assert.match(source, /const SCENE_COUNT = 18/);
  assert.match(source, /const scenes: readonly Scene\[\]/);
  assert.match(source, /function goTo\(next: number\)/);
  assert.doesNotMatch(source, /nextDisabled/);
  assert.match(source, /Continue, then return if needed/);
  assert.match(source, /Review source matching/);
});

test("all five authored interactions remain represented", () => {
  assert.deepEqual(
    Object.values(caregiverModule4.interactions).map(({ id }) => id),
    ["CG-M4-I01", "CG-M4-I02", "CG-M4-I03", "CG-M4-I04", "CG-M4-I05"],
  );
  assert.match(source, /function ContextOrganizer/);
  assert.match(source, /function SourceMatching/);
  assert.match(source, /function UrgentDirection/);
  assert.match(source, /function HandoffPractice/);
  assert.match(source, /function ImprovisationPractice/);
});

test("dense practices appear one item at a time with direct step navigation", () => {
  assert.equal(caregiverModule4.interactions.context.choices.length, 7);
  assert.equal(caregiverModule4.interactions.sources.needs.length, 5);
  assert.equal(caregiverModule4.interactions.handoff.items.length, 6);
  assert.equal(caregiverModule4.interactions.improvisation.actions.length, 6);
  for (const label of ["Statement", "Need", "Call line", "Action", "Question"]) {
    assert.match(source, new RegExp(`label="${label}"`));
  }
  assert.doesNotMatch(source, /Move up|Move down|draggable/);
});

test("source matching remains the required core application", () => {
  assert.match(source, /function SourceMatching/);
  assert.match(source, /data-core-application="true"/);
  assert.match(source, /data-required="true"/);
  assert.match(source, /markInteractionSubmitted\(interaction\.id\)/);
});

test("review assistance suggests an answer without changing the selection", () => {
  assert.match(source, /Suggested choice:/);
  assert.match(source, /Suggested source:/);
  assert.match(source, /Suggested answer:/);
  assert.ok((source.match(/Your choice has been kept/g) ?? []).length >= 5);
  assert.doesNotMatch(source, /\[need\.id\]: need\.preferred/);
  assert.doesNotMatch(source, /\[question\.id\]: question\.preferredIndex/);
});
