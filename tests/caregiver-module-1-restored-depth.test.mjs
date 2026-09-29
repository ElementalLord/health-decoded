import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-1/module-1-experience.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("the rebuild uses fourteen short story-like scenes", () => {
  assert.match(source, /const SCENE_COUNT = 14/);
  for (const id of [
    "not-tonight",
    "known-unknown",
    "thought-path",
    "fact-or-guess",
    "other-reasons",
    "timing",
    "readiness",
    "support-mode",
    "reply",
    "return-later",
    "steady-support",
    "quick-check",
    "phrases",
    "takeaway",
  ]) {
    assert.match(source, new RegExp(`id: "${id}"`));
  }
});

test("each major idea is taught through a compact interaction", () => {
  for (const component of [
    "MessageThread",
    "KnownUnknownDiagram",
    "ThoughtPath",
    "FactOrGuess",
    "ReasonMap",
    "TimingDecision",
    "ReadinessView",
    "SupportModePicker",
    "ReplyBuilder",
    "ReturnLaterPath",
    "SteadySupportChoice",
    "QuickCheck",
    "PhraseBrowser",
    "TakeawayDiagram",
  ]) {
    assert.match(source, new RegExp(`function ${component}`));
  }
});

test("the full caregiver teaching depth remains available without long reading blocks", () => {
  assert.match(source, /caregiverModule1\.interactions\.observation\.statements/);
  assert.match(source, /caregiverModule1\.interactions\.timing\.moments/);
  assert.match(source, /caregiverModule1\.interactions\.response/);
  assert.match(source, /caregiverModule1\.questions/);
  assert.match(source, /caregiverModule1\.scripts/);
  assert.match(source, /Notice\. Leave open\. Ask\./);
  assert.doesNotMatch(source, /passiveReading|Module1Reflection|quietDetails/);
});
