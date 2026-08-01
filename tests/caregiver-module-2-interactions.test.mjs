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
  assert.deepEqual(Object.keys(interaction.feedback), ["preferred", "support", "unknown"]);
  assert.match(await readComponent("intention-impact-map.tsx"), /<select[\s\S]*type="checkbox"/);
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
