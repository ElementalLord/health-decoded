import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const components = new URL("features/caregiver/components/modules/module-1/", root);

const [orientation, narrative, timing, builder, check, styles] = await Promise.all([
  readFile(new URL("module-1-orientation.tsx", components), "utf8"),
  readFile(new URL("module-1-narrative.tsx", components), "utf8"),
  readFile(new URL("timing-sequence.tsx", components), "utf8"),
  readFile(new URL("listen-help-space-builder.tsx", components), "utf8"),
  readFile(new URL("module-1-knowledge-check.tsx", components), "utf8"),
  readFile(new URL("features/caregiver/styles/caregiver-module-1.module.css", root), "utf8"),
]);

async function pngDimensions(path) {
  const png = await readFile(new URL(path, root));
  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  };
}

test("Module 1 uses native 3:2 generated artwork without crop-based sizing", async () => {
  assert.match(orientation, /quiet-evening-observation\.png/);
  assert.match(narrative, /unanswered-call-across-city\.png/);
  assert.match(orientation, /width=\{1536\}[\s\S]*height=\{1024\}/);
  assert.match(narrative, /width=\{1536\}[\s\S]*height=\{1024\}/);
  assert.deepEqual(await pngDimensions("public/caregiver/module-1/quiet-evening-observation.png"), {
    width: 1536,
    height: 1024,
  });
  assert.deepEqual(
    await pngDimensions("public/caregiver/module-1/unanswered-call-across-city.png"),
    {
      width: 1536,
      height: 1024,
    },
  );
  assert.match(styles, /\.sceneImage\s*\{[\s\S]*aspect-ratio: 3 \/ 2;[\s\S]*object-fit: contain;/);
});

test("Module 1 removes decorative connector diagrams from live screens", () => {
  assert.doesNotMatch(narrative, /storyNumber|distanceScene|unansweredPhone|relationshipLine/);
  assert.doesNotMatch(timing, /phoneScene|timingRelationshipLine/);
  assert.doesNotMatch(check, /connectedTakeaway/);
  assert.match(builder, /Part \{builderStep\} of 3/);
});

test("Module 1 uses a quiet reading hierarchy while retaining bordered controls", () => {
  const structurePass = styles.slice(styles.lastIndexOf("/* Minimal structure pass"));
  const expressivePass = styles.slice(styles.lastIndexOf("/* Expressive correction"));

  assert.match(styles, /--m1-observation:/);
  assert.match(styles, /\.storySequence\s*\{[\s\S]*max-width: 43rem;/);
  assert.match(styles, /\.knownUnknown\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(styles, /\.threeIdeas\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(structurePass, /--m1-structure:/);
  assert.match(structurePass, /\.storySequence,[\s\S]*border: 1px solid var\(--m1-structure\)/);
  assert.match(structurePass, /\.builderFeedback,[\s\S]*border: 1px solid var\(--m1-structure\)/);
  assert.doesNotMatch(structurePass, /border-inline-start/);
  assert.match(styles, /\.answerChoices label\s*\{[\s\S]*border:/);
  assert.match(expressivePass, /\.readinessPairs\s*\{[\s\S]*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(expressivePass, /\.possibilityReveal li\s*\{[\s\S]*border-radius: 999px/);
  assert.match(expressivePass, /\.quietDetails,[\s\S]*border: 0/);
  assert.match(expressivePass, /\[tabindex="-1"\]:focus[\s\S]*box-shadow: none/);
});
