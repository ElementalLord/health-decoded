import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { caregiverModule1 } from "../features/caregiver/content/caregiver-module-1.ts";

const directory = new URL("../features/caregiver/components/modules/module-1/", import.meta.url);
const read = (name) => readFile(new URL(name, directory), "utf8");

test("I01 separates three observations from three interpretations and leaves text optional", async () => {
  const interaction = caregiverModule1.interactions.observation;
  assert.equal(
    interaction.statements.filter(({ preferredGroup }) => preferredGroup === "Observed").length,
    3,
  );
  assert.equal(
    interaction.statements.filter(
      ({ preferredGroup }) => preferredGroup === "Possible interpretation",
    ).length,
    3,
  );
  const source = await read("observation-interpretation-workbench.tsx");
  assert.match(source, /<select[\s\S]*<textarea/);
  assert.match(source, /required/);
  assert.match(source, /markInteractionSubmitted\(interaction\.id\)/);
  assert.match(source, /otherPossibility\.trim\(\)/);
  assert.match(source, /excluded from analytics and AI Tutor transfer/);
  assert.match(source, /const value = event\.currentTarget\.value/);
});

test("I02 and I03 preserve exact preferred logic, revision, and native controls", async () => {
  assert.deepEqual(
    caregiverModule1.interactions.timing.moments.map(({ preferred }) => preferred),
    ["B", "B", "A"],
  );
  assert.deepEqual(caregiverModule1.interactions.response.preferred, {
    opening: "listen",
    followup: "choice",
  });
  const [timing, builder] = await Promise.all([
    read("timing-sequence.tsx"),
    read("listen-help-space-builder.tsx"),
  ]);
  assert.match(timing, /type="radio"/);
  assert.match(timing, /Revise/);
  assert.match(timing, /data-optional-practice="true"/);
  assert.match(builder, /Assembled response/);
  assert.match(builder, /interaction\.feedback\.advice/);
  assert.match(builder, /interaction\.feedback\.why/);
});

test("I01 fills a dropdown placement after three responses needing review", async () => {
  const source = await read("observation-interpretation-workbench.tsx");
  assert.match(source, /attempt >= 3/);
  assert.match(source, /nextPlacements\[statement\.id\] = statement\.preferredGroup/);
});
