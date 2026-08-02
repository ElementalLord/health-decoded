import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { caregiverModule5 } from "../features/caregiver/content/caregiver-module-5.ts";

const directory = new URL("../features/caregiver/components/modules/module-5/", import.meta.url);
const read = (name) => readFile(new URL(name, directory), "utf8");
test("Module 5 keeps all five mechanics and accessible dropdowns", async () => {
  assert.equal(caregiverModule5.interactions.responsibility.items.length, 8);
  assert.equal(caregiverModule5.interactions.sustainability.choices.length, 6);
  assert.equal(caregiverModule5.interactions.boundaries.statements.length, 3);
  assert.equal(caregiverModule5.interactions.network.tasks.length, 3);
  const map = await read("responsibility-map.tsx");
  assert.match(map, /<select/);
  assert.match(map, /attempt >= 3/);
  assert.match(map, /event\.currentTarget\.value/);
});
test("network uses task-level selects and load review creates no score", async () => {
  const network = await read("support-network-map.tsx");
  const load = await read("nonclinical-load-review.tsx");
  assert.match(network, /<select/);
  assert.doesNotMatch(load, /data-score|hiddenScore|scoreValue/);
  assert.doesNotMatch(load, /reduce\(|severity|risk band/i);
});

test("answer activities provide the requested third-attempt assistance", async () => {
  const files = await Promise.all([
    read("responsibility-map.tsx"),
    read("sustainability-comparison.tsx"),
    read("boundary-rehearsal.tsx"),
    read("support-network-map.tsx"),
    read("nonclinical-load-review.tsx"),
    read("module-5-knowledge-check.tsx"),
  ]);
  for (const source of files) {
    assert.match(source, /attempt[^\n]*>= 3|nextAttempt >= 3/);
    assert.match(source, /filled in after three attempts/i);
  }
});
