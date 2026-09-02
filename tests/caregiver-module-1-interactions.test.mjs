import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { caregiverModule1 } from "../features/caregiver/content/caregiver-module-1.ts";

const directory = new URL("../features/caregiver/components/modules/module-1/", import.meta.url);
const read = (name) => readFile(new URL(name, directory), "utf8");

test("I01 separates three observations from three interpretations with visible native choices", async () => {
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
  assert.match(source, /statementIndex/);
  assert.match(source, /type="radio"/);
  assert.doesNotMatch(source, /<select/);
  assert.match(source, /<textarea/);
  assert.match(source, /markInteractionSubmitted\(interaction\.id\)/);
  assert.match(source, /excluded from analytics and AI Tutor transfer/);
  assert.match(source, /const value = event\.currentTarget\.value/);
});

test("I02 and I03 preserve all moments and the full two-part response builder", async () => {
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
  assert.match(timing, /aria-live="polite"/);
  assert.match(timing, /data-optional-practice="true"/);
  assert.match(timing, /momentIndex/);
  assert.match(timing, /interaction\.moments\.length/);
  assert.match(timing, /This creates new pressure/);
  assert.match(builder, /interaction\.openings\.map/);
  assert.match(builder, /interaction\.followups\.map/);
  assert.match(builder, /assembledResponse/);
  assert.match(builder, /interaction\.feedback\.advice/);
  assert.match(builder, /interaction\.feedback\.why/);
  assert.match(builder, /aria-live="polite"/);
});

test("I01 gives immediate explanatory feedback without punitive scoring", async () => {
  const source = await read("observation-interpretation-workbench.tsx");
  assert.match(source, /isAccurate/);
  assert.match(source, /Keep it as a possibility/);
  assert.match(source, /Notice first\. Interpret carefully/);
  assert.doesNotMatch(source, /score|points|grade/i);
});
