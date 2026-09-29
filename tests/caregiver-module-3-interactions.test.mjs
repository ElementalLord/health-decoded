import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { caregiverModule3 } from "../features/caregiver/content/caregiver-module-3.ts";

const source = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-3/module-3-experience.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("Module 3 is a sixteen-screen story flow with no outer navigation trap", () => {
  assert.match(source, /const SCENE_COUNT = 16/);
  assert.match(source, /const scenes: readonly Scene\[\]/);
  assert.match(source, /function goTo\(next: number\)/);
  assert.doesNotMatch(source, /nextDisabled/);
  assert.match(source, /Continue, then return if needed/);
  assert.match(source, /Review request matching/);
});

test("I01 keeps all planning details and adds an explicit leave-off choice", () => {
  const interaction = caregiverModule3.interactions.planning;
  assert.equal(interaction.zones.length, 4);
  assert.equal(interaction.items.length, 6);
  assert.deepEqual(interaction.items.find(({ id }) => id === "portion").preferredZones, []);
  assert.deepEqual(interaction.items.find(({ id }) => id === "separate").preferredZones, []);
  assert.match(source, /function PlanningPractice/);
  assert.match(source, /"Leave off the plan"/);
  assert.match(source, /data-optional-practice="true"/);
  assert.match(source, /label="Planning detail"/);
});

test("I02 is the required four-request core practice with clickable steps", () => {
  const interaction = caregiverModule3.interactions.matching;
  assert.equal(interaction.pairs.length, 4);
  assert.ok(interaction.pairs.every(({ request, offer }) => request && offer));
  assert.match(source, /function RequestMatching/);
  assert.match(source, /data-core-application="true"/);
  assert.match(source, /data-required="true"/);
  assert.match(source, /label="Request"/);
  assert.match(source, /markInteractionSubmitted\(interaction\.id\)/);
});

test("I03 and I04 use one compact card at a time instead of crowded boards", () => {
  assert.equal(caregiverModule3.interactions.menu.offers.length, 6);
  assert.equal(caregiverModule3.interactions.routines.pairs.length, 3);
  assert.match(source, /function SupportMenu/);
  assert.match(source, /function RoutineComparison/);
  assert.match(source, /label="Offer"/);
  assert.match(source, /label="Routine"/);
  assert.match(source, /className=\{styles\.readinessPair\}/);
  assert.doesNotMatch(source, /draggable|onDragStart|onDrop=/);
});

test("review feedback never replaces the learner's selected answer", () => {
  assert.match(source, /Suggested placement:/);
  assert.match(source, /Suggested offer:/);
  assert.match(source, /Suggested category:/);
  assert.match(source, /Suggested detail:/);
  assert.match(source, /Suggested answer:/);
  assert.ok((source.match(/Your choice has been kept/g) ?? []).length >= 5);
  assert.doesNotMatch(source, /\[pair\.id\]: pair\.id/);
  assert.doesNotMatch(source, /\[question\.id\]: question\.preferredIndex/);
});
