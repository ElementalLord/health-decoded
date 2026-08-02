import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { caregiverModule4 } from "../features/caregiver/content/caregiver-module-4.ts";

const directory = new URL("../features/caregiver/components/modules/module-4/", import.meta.url);
const read = (name) => readFile(new URL(name, directory), "utf8");

test("Module 4 keeps five distinct, revisable activities", async () => {
  assert.equal(caregiverModule4.interactions.context.choices.length, 7);
  assert.equal(caregiverModule4.interactions.sources.needs.length, 5);
  assert.equal(caregiverModule4.interactions.handoff.items.length, 6);
  assert.equal(caregiverModule4.interactions.improvisation.actions.length, 6);
  const sourceMatching = await read("guidance-source-matching.tsx");
  assert.match(sourceMatching, /<select/);
  assert.match(sourceMatching, /data-core-application="true"/);
  assert.match(sourceMatching, /attempt >= 3/);
  assert.match(sourceMatching, /event\.currentTarget\.value/);
});

test("handoff supports keyboard reordering and unsafe review uses native checks", async () => {
  const handoff = await read("professional-handoff-sequence.tsx");
  const unsafe = await read("unsafe-improvisation-review.tsx");
  assert.match(handoff, /Move up/);
  assert.match(handoff, /Move down/);
  assert.match(handoff, /Exclude/);
  assert.match(unsafe, /type="checkbox"/);
});

test("answer activities provide the requested third-attempt assistance", async () => {
  const files = await Promise.all([
    read("context-organizer.tsx"),
    read("guidance-source-matching.tsx"),
    read("professional-handoff-sequence.tsx"),
    read("unsafe-improvisation-review.tsx"),
    read("module-4-knowledge-check.tsx"),
  ]);
  for (const source of files) {
    assert.match(source, /attempt[^\n]*>= 3|nextAttempt >= 3/);
    assert.match(source, /filled in after three attempts/i);
  }
});
