import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { caregiverModule2 } from "../features/caregiver/content/caregiver-module-2.ts";

const componentDirectory = new URL(
  "../features/caregiver/components/modules/module-2/",
  import.meta.url,
);
const readComponent = (name) => readFile(new URL(name, componentDirectory), "utf8");

test("I01 provides the full consequence map choices and feedback", async () => {
  const interaction = caregiverModule2.interactions.intentionImpact;
  assert.equal(interaction.id, "CG-M2-I01");
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
  assert.equal(
    interaction.feedback.fallback,
    "Review what the action asks of the other person, what choice remains available, and what is still unknown. You can revise your response before continuing.",
  );
  const source = await readComponent("intention-impact-map.tsx");
  assert.match(source, /<select[\s\S]*type="checkbox"/);
  assert.match(source, /type="checkbox"\s+required/);
  assert.match(source, /interaction\.feedback\.fallback/);
});

test("I02 includes classifications, withdrawal gray area, per-item explanations, and revision", async () => {
  const interaction = caregiverModule2.interactions.continuum;
  assert.equal(interaction.id, "CG-M2-I02");
  assert.equal(interaction.behaviors.length, 6);
  assert.ok(interaction.behaviors.some(({ id }) => id === "continued-alert"));
  assert.ok(interaction.behaviors.every(({ feedback }) => feedback.length > 0));
  const source = await readComponent("support-boundary-continuum.tsx");
  assert.match(source, /behavior\.preferredCategory/);
  assert.match(source, /behavior\.feedback/);
  assert.match(source, /interaction\.revise/);
  assert.match(source, /aria-describedby=\{submitted/);
  assert.match(source, /const value = event\.currentTarget\.value/);
  assert.match(source, /\[behavior\.id\]: value/);
  assert.doesNotMatch(source, /\[behavior\.id\]: event\.currentTarget\.value/);
  assert.doesNotMatch(source, /itemFeedback[^>]*role="status"/);
});

test("I03 builds a specific four-part offer and is marked as the sole core application", async () => {
  const interaction = caregiverModule2.interactions.permissionBuilder;
  assert.equal(interaction.id, "CG-M2-I03");
  assert.deepEqual(
    interaction.groups.map(({ id }) => id),
    ["opening", "action", "decline", "followup"],
  );
  assert.match(interaction.feedback.preferred, /A ride does not purchase appointment access/);
  const source = await readComponent("permission-language-builder.tsx");
  assert.match(source, /data-core-application="true"/);
  assert.match(source, /assembledOffer/);
  assert.match(source, /markInteractionSubmitted\(interaction\.id\)/);
  assert.match(source, /const emptyParts/);
  assert.match(source, /required\s+value=\{parts\[group\.id\]\}/);
  assert.match(source, /const value = event\.currentTarget\.value/);
  assert.match(source, /\[group\.id\]: value/);
  assert.match(source, /disabled=\{!offerIsComplete\}/);
  assert.doesNotMatch(source, /const preferredParts/);
});

test("I04 accepts no before a later, separately initiated support conversation", async () => {
  const interaction = caregiverModule2.interactions.refusal;
  assert.equal(interaction.id, "CG-M2-I04");
  assert.equal(interaction.firstChoices.length, 4);
  assert.equal(interaction.firstChoices[0].id, "accept");
  assert.equal(interaction.secondChoices.length, 3);
  assert.match(interaction.consequence, /The branch ends without resolution/);
  assert.equal(
    interaction.secondChoiceFallback,
    "Review what the action asks of the other person, what choice remains available, and what is still unknown. You can revise your response before continuing.",
  );
  const source = await readComponent("refusal-branching-conversation.tsx");
  assert.match(source, /firstChoice !== "accept"/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /key=\{firstSubmissionCount\}/);
  assert.equal(source.match(/markInteractionSubmitted\(interaction\.id\)/g)?.length, 1);
  assert.match(source, /!secondChoiceIsPreferred/);
  assert.match(source, /interaction\.secondChoiceFallback/);
});

test("I05 supports ordered repair, removal, keyboard buttons, and revision", async () => {
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
  assert.match(source, /const initialRepairOrder/);
  assert.match(source, /"change",\s+"impact",\s+"defense"/);
  assert.equal(
    interaction.feedback.fallback,
    "Review what the action asks of the other person, what choice remains available, and what is still unknown. You can revise your response before continuing.",
  );
  assert.match(source, /interaction\.feedback\.fallback/);
});

test("fallback feedback remains submission-only and specific feedback takes priority", async () => {
  const [map, branch, repair] = await Promise.all([
    readComponent("intention-impact-map.tsx"),
    readComponent("refusal-branching-conversation.tsx"),
    readComponent("repair-sequence.tsx"),
  ]);
  assert.match(
    map,
    /preferredImpacts[\s\S]*interaction\.feedback\.preferred[\s\S]*interaction\.feedback\.fallback/,
  );
  assert.match(
    repair,
    /defenseIncluded[\s\S]*interaction\.feedback\.defense[\s\S]*interaction\.feedback\.fallback/,
  );
  assert.match(branch, /closed \? \([\s\S]*!secondChoiceIsPreferred/);
  assert.match(map, /\{submitted \? \(/);
  assert.match(repair, /\{submitted \? \(/);
  assert.match(branch, /\{closed \? \(/);
});

test("the five interactions remain distinct mechanics", async () => {
  const sources = await Promise.all([
    readComponent("intention-impact-map.tsx"),
    readComponent("support-boundary-continuum.tsx"),
    readComponent("permission-language-builder.tsx"),
    readComponent("refusal-branching-conversation.tsx"),
    readComponent("repair-sequence.tsx"),
  ]);
  assert.match(sources[0], /consequence map/);
  assert.match(sources[1], /relational continuum/);
  assert.match(sources[2], /permission builder/);
  assert.match(sources[3], /branching conversation/);
  assert.match(sources[4], /repair sequence/);
});

test("dropdown practices fill defined preferred values after three responses needing review", async () => {
  const [map, continuum, builder] = await Promise.all([
    readComponent("intention-impact-map.tsx"),
    readComponent("support-boundary-continuum.tsx"),
    readComponent("permission-language-builder.tsx"),
  ]);
  assert.match(map, /impact: action\.preferredImpact/);
  assert.match(continuum, /nextPlacements\[behavior\.id\] = behavior\.preferredCategory/);
  assert.match(builder, /nextParts\[group\.id\] = group\.options\[0\]/);
  assert.match(map + continuum + builder, /attempt >= 3/);
});
