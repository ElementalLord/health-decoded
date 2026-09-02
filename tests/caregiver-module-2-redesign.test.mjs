import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentDirectory = new URL(
  "../features/caregiver/components/modules/module-2/",
  import.meta.url,
);
const experience = await readFile(new URL("module-2-experience.tsx", componentDirectory), "utf8");
const narrative = await readFile(new URL("module-2-narrative.tsx", componentDirectory), "utf8");
const orientation = await readFile(new URL("module-2-orientation.tsx", componentDirectory), "utf8");
const styles = await readFile(
  new URL("../features/caregiver/styles/caregiver-module-2.module.css", import.meta.url),
  "utf8",
);

test("the redesign presents twelve focused parts while keeping prior work mounted", () => {
  assert.equal(experience.match(/data-stage=/g)?.length, 12);
  assert.match(experience, /hidden=\{stageIndex !== 0\}/);
  assert.match(experience, /Previous responses have been kept/);
  assert.match(experience, /window\.scrollTo\(\{ top: 0, behavior: "auto" \}\)/);
  assert.match(experience, /getElementById\(stage\.headingId\)\?\.focus/);
});

test("all source sections, five practices, check, reflection, takeaway, and completion remain in the journey", () => {
  for (const component of [
    "Module2Scenario",
    "Module2IntentionImpactNarrative",
    "IntentionImpactMap",
    "Module2DistinctionNarrative",
    "SupportBoundaryContinuum",
    "Module2PermissionNarrative",
    "PermissionLanguageBuilder",
    "Module2AppointmentsNarrative",
    "RefusalBranchingConversation",
    "Module2RepairNarrative",
    "RepairSequence",
    "Module2BoundariesNarrative",
    "Module2FurtherReading",
    "Module2Scripts",
    "Module2KnowledgeCheck",
    "Module2Reflection",
    "Module2Takeaway",
    "Module2Completion",
  ]) {
    assert.match(
      experience,
      new RegExp(`<${component}`),
      `${component} must remain in the journey`,
    );
  }
});

test("the full story, definitions, frameworks, deeper reading, and nine scripts are source-driven", () => {
  assert.match(narrative, /section\.paragraphs\.slice\(8, 10\)/);
  assert.match(narrative, /section\.definitions\.map/);
  assert.match(narrative, /section\.questions\.map/);
  assert.match(narrative, /section\.examples\.map/);
  assert.match(narrative, /section\.steps\.map/);
  assert.match(narrative, /reading\.subsections\.map/);
  assert.match(narrative, /scripts\.slice\(0, 4\)/);
  assert.match(narrative, /scripts\.slice\(4\)/);
  assert.match(narrative, /See all nine phrases/);
});

test("Module 2 shares the Module 1 shell language but keeps a boundary-specific visual identity", () => {
  assert.match(experience, /ProgressBar/);
  assert.match(experience, /<Button/);
  assert.match(orientation, /shared-space-kitchen\.png/);
  assert.match(narrative, /phone-boundary-kitchen\.png/);
  assert.match(orientation, /width=\{1536\}[\s\S]*height=\{1024\}/);
  assert.match(narrative, /width=\{1536\}[\s\S]*height=\{1024\}/);
  assert.match(styles, /aspect-ratio: 3 \/ 2/);
  assert.match(styles, /\.roleThreshold/);
  assert.match(styles, /\.boundaryLesson/);
  assert.match(styles, /--m2-space-section/);
  assert.doesNotMatch(styles, /border-inline-start/);
  assert.doesNotMatch(styles, /gradient|infinite/);
});

test("reading stages use a quiet sequential hierarchy instead of comparison scaffolding", () => {
  const structurePass = styles.slice(styles.lastIndexOf("/* Minimal structure pass"));
  const expressivePass = styles.slice(styles.lastIndexOf("/* Expressive correction"));

  assert.match(narrative, /className=\{styles\.boundaryLesson\}/);
  assert.doesNotMatch(narrative, /boundaryComparison|storyNumber|data-boundary-crossed/);
  assert.doesNotMatch(styles, /\.boundaryComparison|\.continuumTrack|\.connectedTakeaway/);
  assert.match(styles, /\.module \[tabindex="-1"\]:focus[\s\S]{0,80}outline: none/);
  assert.match(styles, /\.permissionSpectrum[\s\S]{0,160}grid-template-columns: minmax/);
  assert.match(styles, /\.choiceGrid,[\s\S]{0,180}grid-template-columns: minmax/);
  assert.match(structurePass, /--m2-structure:/);
  assert.match(structurePass, /\.threePartModel,[\s\S]*border: 1px solid var\(--m2-structure\)/);
  assert.match(structurePass, /--m2-space-section: clamp\(3\.25rem, 6vw, 5\.25rem\)/);
  assert.doesNotMatch(structurePass, /border-inline-start/);
  assert.match(expressivePass, /\.threePartModel\s*\{[\s\S]*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(expressivePass, /\.permissionQuestions\s*\{[\s\S]*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(expressivePass, /\.boundaryExample:last-child/);
  assert.match(expressivePass, /\.quietDetails\s*\{[\s\S]*border: 0/);
  assert.match(expressivePass, /\[tabindex="-1"\]:focus[\s\S]*box-shadow: none/);
});
