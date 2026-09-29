import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [experience, styles, story] = await Promise.all([
  readFile(
    new URL("features/caregiver/components/modules/module-1/module-1-experience.tsx", root),
    "utf8",
  ),
  readFile(new URL("features/caregiver/styles/caregiver-module-1-story.module.css", root), "utf8"),
  readFile(new URL("features/stories/components/asha-story-experience.module.css", root), "utf8"),
]);

test("Module 1 now uses diagrams instead of large raster artwork", () => {
  assert.doesNotMatch(experience, /next\/image|<Image|\.png|\.jpg|\.webp/);
  for (const component of [
    "MessageThread",
    "KnownUnknownDiagram",
    "ThoughtPath",
    "ReasonMap",
    "ReadinessView",
    "TakeawayDiagram",
  ]) {
    assert.match(experience, new RegExp(`function ${component}`));
  }
});

test("Module 1 adopts the Stories reader grammar", () => {
  for (const selector of [
    ".page",
    ".readerHeader",
    ".readerIdentity",
    ".progress",
    ".scene",
    ".sceneHeading",
    ".storyCopy",
    ".sceneVisual",
    ".navigation",
    ".completion",
  ]) {
    assert.match(styles, new RegExp(selector.replace(".", "\\.")));
    assert.match(story, new RegExp(selector.replace(".", "\\.")));
  }
  assert.match(styles, /max-width: 52rem/);
  assert.match(styles, /font-family: var\(--font-serif\)/);
  assert.match(styles, /grid-auto-flow: column/);
});

test("the rebuilt visual system remains restrained and touch-safe", () => {
  assert.match(styles, /min-height: 44px/);
  assert.match(styles, /transform: scale\(0\.97\)/);
  assert.match(styles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.doesNotMatch(styles, /box-shadow:[\s\S]*box-shadow:[\s\S]*box-shadow:/);
});
