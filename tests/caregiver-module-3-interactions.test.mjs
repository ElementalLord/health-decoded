import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { caregiverModule3 } from "../features/caregiver/content/caregiver-module-3.ts";

const directory = new URL("../features/caregiver/components/modules/module-3/", import.meta.url);
const read = (name) => readFile(new URL(name, directory), "utf8");

test("I01 preserves four planning zones, six tasks, unused food-control choices, and revision", async () => {
  const interaction = caregiverModule3.interactions.planning;
  assert.equal(interaction.zones.length, 4);
  assert.equal(interaction.items.length, 6);
  assert.deepEqual(interaction.items.find(({ id }) => id === "portion").preferredZones, []);
  assert.deepEqual(interaction.items.find(({ id }) => id === "separate").preferredZones, []);
  const source = await read("shared-planning-workspace.tsx");
  assert.match(source, /<select/);
  assert.match(source, /Leave off the plan/);
  assert.match(source, /const value = event\.currentTarget\.value/);
  assert.match(source, /data-optional-practice="true"/);
  assert.match(source, /data-feedback-status/);
  assert.match(interaction.feedbackGap, /does not provide feedback/);
});

test("I02 is the required four-request matcher with safe controlled dropdowns", async () => {
  const interaction = caregiverModule3.interactions.matching;
  assert.equal(interaction.pairs.length, 4);
  assert.ok(interaction.pairs.every(({ request, offer }) => request && offer));
  const source = await read("request-matching.tsx");
  assert.match(source, /data-core-application="true"/);
  assert.match(source, /required/);
  assert.match(source, /disabled=\{!complete\}/);
  assert.match(source, /const value = event\.currentTarget\.value/);
  assert.match(source, /markInteractionSubmitted\(interaction\.id\)/);
});

test("I03 provides drag-and-drop with a dropdown fallback, while I04 uses native radio controls", async () => {
  assert.equal(caregiverModule3.interactions.menu.offers.length, 6);
  assert.ok(
    caregiverModule3.interactions.menu.offers.every(
      ({ preference, preferredCategory }) => preference && preferredCategory,
    ),
  );
  assert.equal(caregiverModule3.interactions.routines.pairs.length, 3);
  assert.ok(
    caregiverModule3.interactions.routines.pairs.every(
      ({ a, b, preferredOption }) => a && b && preferredOption,
    ),
  );
  const [menu, routines] = await Promise.all([
    read("support-menu.tsx"),
    read("routine-comparison.tsx"),
  ]);
  assert.match(menu, /draggable/);
  assert.match(menu, /onDragStart/);
  assert.match(menu, /onDrop/);
  assert.match(menu, /<select/);
  assert.match(menu, /markInteractionSubmitted\(interaction\.id\)/);
  assert.match(routines, /type="radio"/);
  assert.match(routines, /const value = event\.currentTarget\.value/);
  assert.doesNotMatch(routines, /setAnswers\([\s\S]{0,160}event\.currentTarget\.value/);
  assert.match(routines, /disabled=\{!complete\}/);
  assert.match(routines, /markInteractionSubmitted\(interaction\.id\)/);
});

test("I01 and I02 fill dropdown answers after three responses needing review", async () => {
  const [planning, matching] = await Promise.all([
    read("shared-planning-workspace.tsx"),
    read("request-matching.tsx"),
  ]);
  assert.match(planning, /nextPlacements\[item\.id\] = \(item\.preferredZones\[0\] \?\? ""\)/);
  assert.match(matching, /nextMatches\[pair\.id\] = pair\.id/);
  assert.match(planning + matching, /attempt >= 3/);
});
