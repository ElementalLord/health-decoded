import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { caregiverModule1 } from "../features/caregiver/content/caregiver-module-1.ts";

const source = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-1/module-1-experience.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("the core fact-or-guess practice keeps all six source statements", () => {
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
  assert.match(source, /function FactOrGuess/);
  assert.match(source, /statements\[index\]/);
  assert.match(source, /role="radiogroup"/);
  assert.match(
    source,
    /markInteractionSubmitted\(caregiverModule1\.interactions\.observation\.id\)/,
  );
  assert.match(source, /current === 3 && !coreComplete/);
});

test("timing, reply building, and checking remain interactive", () => {
  assert.deepEqual(
    caregiverModule1.interactions.timing.moments.map(({ preferred }) => preferred),
    ["B", "B", "A"],
  );
  assert.match(source, /function TimingDecision/);
  assert.match(source, /moments\.map/);
  assert.match(source, /function ReplyBuilder/);
  assert.match(source, /interaction\.openings\.map/);
  assert.match(source, /interaction\.followups\.map/);
  assert.match(source, /function QuickCheck/);
  assert.match(source, /setKeyIdeaUnderstood/);
});

test("interactive feedback is explanatory and non-punitive", () => {
  assert.match(source, /This can be verified from the exchange/);
  assert.match(source, /This assigns a reason the exchange does not confirm/);
  assert.match(source, /This leaves room/);
  assert.match(source, /This adds pressure/);
  assert.doesNotMatch(source, /score|points|grade/i);
});
