import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { caregiverModule2 } from "../features/caregiver/content/caregiver-module-2.ts";

const componentDirectory = new URL(
  "../features/caregiver/components/modules/module-2/",
  import.meta.url,
);
const readComponent = (name) => readFile(new URL(name, componentDirectory), "utf8");

test("I01 preserves every action, intention, impact, unknown perspective, and feedback path", async () => {
  const interaction = caregiverModule2.interactions.intentionImpact;
  assert.equal(interaction.id, "CG-M2-I01");
  assert.equal(interaction.actions.length, 3);
  assert.deepEqual(interaction.intentions, ["reduce risk", "keep a routine", "seek reassurance"]);
  assert.deepEqual(interaction.impacts, [
    "support",
    "pressure",
    "loss of privacy",
    "feeling discussed rather than included",
  ]);
  assert.deepEqual(Object.keys(interaction.feedback), [
    "preferred",
    "support",
    "unknown",
    "fallback",
  ]);
  const source = await readComponent("intention-impact-map.tsx");
  assert.match(source, /actionIndex/);
  assert.match(source, /interaction\.intentions\.map/);
  assert.match(source, /interaction\.impacts\.map/);
  assert.match(source, /type="radio"/);
  assert.match(source, /type="checkbox"/);
  assert.doesNotMatch(source, /<select/);
  assert.match(source, /interaction\.feedback\.fallback/);
});

test("I02 keeps six classifications, explanations, sequential presentation, revision, and assistance", async () => {
  const interaction = caregiverModule2.interactions.continuum;
  assert.equal(interaction.id, "CG-M2-I02");
  assert.equal(interaction.behaviors.length, 6);
  assert.equal(interaction.categories.length, 4);
  assert.ok(interaction.behaviors.some(({ id }) => id === "continued-alert"));
  assert.ok(interaction.behaviors.every(({ feedback }) => feedback.length > 0));
  const source = await readComponent("support-boundary-continuum.tsx");
  assert.match(source, /behaviorIndex/);
  assert.match(source, /behavior\.preferredCategory/);
  assert.match(source, /behavior\.feedback/);
  assert.match(source, /interaction\.revise/);
  assert.match(source, /type="radio"/);
  assert.doesNotMatch(source, /<select/);
  assert.match(source, /\[behavior\.id\]: behavior\.preferredCategory/);
  assert.match(source, /attempt >= 3/);
});

test("I03 builds all four offer parts, reads the assembled sentence, and remains the core gate", async () => {
  const interaction = caregiverModule2.interactions.permissionBuilder;
  assert.equal(interaction.id, "CG-M2-I03");
  assert.deepEqual(
    interaction.groups.map(({ id }) => id),
    ["opening", "action", "decline", "followup"],
  );
  assert.ok(interaction.groups.every((group) => group.options.length === 3));
  assert.match(interaction.feedback.preferred, /A ride does not purchase appointment access/);
  const source = await readComponent("permission-language-builder.tsx");
  assert.match(source, /data-core-application="true"/);
  assert.match(source, /groupIndex/);
  assert.match(source, /assembledOffer/);
  assert.match(source, /speechSynthesis/);
  assert.match(source, /markInteractionSubmitted\(interaction\.id\)/);
  assert.match(source, /const emptyParts/);
  assert.match(source, /type="radio"/);
  assert.match(source, /\[group\.id\]: option/);
  assert.match(source, /disabled=\{!offerIsComplete\}/);
  assert.match(source, /nextParts\[item\.id\] = item\.options\[0\]/);
  assert.match(source, /attempt >= 3/);
  assert.doesNotMatch(source, /<select/);
});

test("I04 accepts no before a later, separately initiated support conversation", async () => {
  const interaction = caregiverModule2.interactions.refusal;
  assert.equal(interaction.id, "CG-M2-I04");
  assert.equal(interaction.firstChoices.length, 4);
  assert.equal(interaction.firstChoices[0].id, "accept");
  assert.equal(interaction.secondChoices.length, 3);
  assert.match(interaction.consequence, /The branch ends without resolution/);
  const source = await readComponent("refusal-branching-conversation.tsx");
  assert.match(source, /firstChoice !== "accept"/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /key=\{firstSubmissionCount\}/);
  assert.equal(source.match(/markInteractionSubmitted\(interaction\.id\)/g)?.length, 1);
  assert.match(source, /!secondChoiceIsPreferred/);
  assert.match(source, /interaction\.secondChoiceFallback/);
});

test("I05 preserves ordered repair, defense removal, keyboard controls, focus, and revision", async () => {
  const interaction = caregiverModule2.interactions.repair;
  assert.equal(interaction.id, "CG-M2-I05");
  assert.deepEqual(interaction.preferredOrder, ["action", "impact", "apology", "change", "future"]);
  assert.ok(interaction.lines.some(({ id }) => id === "defense"));
  const source = await readComponent("repair-sequence.tsx");
  assert.match(source, /Move up/);
  assert.match(source, /Move down/);
  assert.match(source, /interaction\.remove/);
  assert.match(source, /toggleRemoved/);
  assert.match(source, /activeIds\[activeIndex \+ direction\]/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /const initialRepairOrder/);
  assert.match(source, /interaction\.feedback\.fallback/);
});

test("the five interactions retain distinct mechanics and session submission tracking", async () => {
  const [map, continuum, builder, branch, repair] = await Promise.all([
    readComponent("intention-impact-map.tsx"),
    readComponent("support-boundary-continuum.tsx"),
    readComponent("permission-language-builder.tsx"),
    readComponent("refusal-branching-conversation.tsx"),
    readComponent("repair-sequence.tsx"),
  ]);
  assert.match(map, /consequence map/);
  assert.match(continuum, /relational continuum/);
  assert.match(builder, /permission builder/);
  assert.match(branch, /firstChoices[\s\S]*secondChoices/);
  assert.match(repair, /move\(id, -1\)[\s\S]*move\(id, 1\)/);
  for (const source of [map, continuum, builder, branch, repair]) {
    assert.match(source, /markInteractionSubmitted\(interaction\.id\)/);
  }
});

test("fallback feedback remains response-triggered and specific feedback stays available", async () => {
  const [map, branch, repair] = await Promise.all([
    readComponent("intention-impact-map.tsx"),
    readComponent("refusal-branching-conversation.tsx"),
    readComponent("repair-sequence.tsx"),
  ]);
  assert.match(map, /interaction\.feedback\.preferred[\s\S]*interaction\.feedback\.fallback/);
  assert.match(repair, /interaction\.feedback\.defense[\s\S]*interaction\.feedback\.fallback/);
  assert.match(branch, /closed \? \([\s\S]*!secondChoiceIsPreferred/);
  assert.match(map, /actionReviewed \? \(/);
  assert.match(repair, /submitted \? \(/);
  assert.match(branch, /closed \? \(/);
});
