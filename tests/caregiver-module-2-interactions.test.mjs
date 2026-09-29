import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { caregiverModule2 } from "../features/caregiver/content/caregiver-module-2.ts";

const source = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-2/module-2-experience.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("I01 keeps intention, impact, and the unknown perspective distinct", () => {
  const interaction = caregiverModule2.interactions.intentionImpact;
  assert.equal(interaction.actions.length, 3);
  assert.equal(interaction.intentions.length, 3);
  assert.equal(interaction.impacts.length, 4);
  assert.match(source, /function IntentionImpactMap/);
  assert.match(source, /interaction\.intentions\.map/);
  assert.match(source, /interaction\.impacts\.map/);
  assert.match(source, /Andre’s exact experience remains unknown/);
  assert.match(source, /interaction\.feedback\.fallback/);
});

test("I02 keeps all six classifications, feedback, and third-attempt assistance", () => {
  const interaction = caregiverModule2.interactions.continuum;
  assert.equal(interaction.behaviors.length, 6);
  assert.equal(interaction.categories.length, 4);
  assert.match(source, /function SupportContinuum/);
  assert.match(source, /interaction\.behaviors\[index\]/);
  assert.match(source, /behavior\.preferredCategory/);
  assert.match(source, /attempt >= 3/);
  assert.match(source, /Suggested classification:/);
  assert.match(source, /Your choice has been kept/);
  assert.doesNotMatch(
    source,
    /setPlacements\(\(current\) => \(\{ \.\.\.current, \[behavior\.id\]: behavior\.preferredCategory/,
  );
});

test("I03 builds four offer parts, reads the result, and remains the required practice", () => {
  const interaction = caregiverModule2.interactions.permissionBuilder;
  assert.deepEqual(
    interaction.groups.map(({ id }) => id),
    ["opening", "action", "decline", "followup"],
  );
  assert.match(source, /function PermissionBuilder/);
  assert.match(source, /assembledOffer/);
  assert.match(source, /parts\.opening \?\? "\[Opening\]"/);
  assert.match(source, /speechSynthesis/);
  assert.match(source, /data-core-application="true"/);
  assert.match(source, /setCoreComplete\(true\)/);
});

test("review assistance never rewrites a learner selection", () => {
  assert.match(source, /Suggested answer:/);
  assert.match(source, /Your choice has been kept/);
  assert.doesNotMatch(source, /const nextAnswers = assisted/);
  assert.doesNotMatch(source, /setAnswers\(nextAnswers\)/);
});

test("I04 accepts no before opening a separate later conversation", () => {
  assert.equal(caregiverModule2.interactions.refusal.firstChoices[0].id, "accept");
  assert.match(source, /function RefusalPath/);
  assert.match(source, /firstReviewed && first === "accept"/);
  assert.match(source, /interaction\.secondChoices\.map/);
  assert.match(source, /interaction\.secondChoiceFallback/);
});

test("I05 uses a compact ordered repair that rejects the defense", () => {
  assert.deepEqual(caregiverModule2.interactions.repair.preferredOrder, [
    "action",
    "impact",
    "apology",
    "change",
    "future",
  ]);
  assert.match(source, /function RepairBuilder/);
  assert.match(source, /id === "defense"/);
  assert.match(source, /id !== expected/);
  assert.match(source, /setSequence\(\[\]\)/);
});

test("all five source interactions remain active and locally tracked", () => {
  assert.equal(Object.values(caregiverModule2.interactions).length, 5);
  assert.ok((source.match(/data-interaction-id=\{interaction\.id\}/g) ?? []).length >= 5);
  assert.ok((source.match(/markInteractionSubmitted\(interaction\.id\)/g) ?? []).length >= 5);
  assert.doesNotMatch(source, /score|points|grade/i);
});
