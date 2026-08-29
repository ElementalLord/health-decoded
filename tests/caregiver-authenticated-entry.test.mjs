import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [journeySource, actionRowSource, headerSource, bottomNavigationSource] = await Promise.all([
  readFile(new URL("../app/(app)/journey/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/shared/action-row.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/layout/app-header.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/layout/bottom-navigation.tsx", import.meta.url), "utf8"),
]);

test("the compact Journey support area does not duplicate the caregiver experience", () => {
  assert.doesNotMatch(journeySource, /href="\/caregiver"/);
  assert.doesNotMatch(journeySource, /title="Support Someone You Care About"/);
});

test("shared action rows stay semantic and caregiver remains outside global navigation", () => {
  assert.match(actionRowSource, /import Link from "next\/link"/);
  assert.match(actionRowSource, /<Link[\s\S]*href=\{href\}/);
  assert.match(actionRowSource, /focus-visible:ring/);
  assert.doesNotMatch(headerSource, /Support Someone You Care About|\/caregiver/);
  assert.doesNotMatch(bottomNavigationSource, /Support Someone You Care About|\/caregiver/);
});
