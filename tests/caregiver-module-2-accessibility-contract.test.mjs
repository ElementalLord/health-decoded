import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentNames = [
  "intention-impact-map.tsx",
  "support-boundary-continuum.tsx",
  "permission-language-builder.tsx",
  "refusal-branching-conversation.tsx",
  "repair-sequence.tsx",
  "module-2-knowledge-check.tsx",
  "module-2-reflection.tsx",
];
const sources = Object.fromEntries(
  await Promise.all(
    componentNames.map(async (name) => [
      name,
      await readFile(
        new URL(`../features/caregiver/components/modules/module-2/${name}`, import.meta.url),
        "utf8",
      ),
    ]),
  ),
);
const combined = Object.values(sources).join("\n");
const feedback = await readFile(
  new URL("../features/caregiver/components/foundation/caregiver-feedback.tsx", import.meta.url),
  "utf8",
);
const focusTarget = await readFile(
  new URL(
    "../features/caregiver/components/foundation/caregiver-focus-target.tsx",
    import.meta.url,
  ),
  "utf8",
);
const styles = await readFile(
  new URL("../features/caregiver/styles/caregiver-module-2.module.css", import.meta.url),
  "utf8",
);

test("controls have semantic labels, grouping, and keyboard-compatible alternatives", () => {
  assert.match(combined, /<fieldset/);
  assert.match(combined, /<legend/);
  assert.match(combined, /<label/);
  assert.match(combined, /<select/);
  assert.match(combined, /type="radio"/);
  assert.match(sources["repair-sequence.tsx"], /<button[\s\S]*Move up/);
  assert.match(sources["repair-sequence.tsx"], /<button[\s\S]*Move down/);
  assert.doesNotMatch(combined, /onMouseEnter|onMouseOver|draggable=/);
});

test("feedback is announced and focus is deliberately managed after updates", () => {
  assert.match(feedback, /aria-live=\{isAssertive \? "assertive" : "polite"\}/);
  assert.match(feedback, /aria-atomic="true"/);
  assert.match(feedback, /CaregiverFocusTarget/);
  assert.match(focusTarget, /localRef\.current\?\.focus\(\)/);
  assert.match(combined, /requestAnimationFrame|focusWhen/);
  assert.match(sources["module-2-reflection.tsx"], /aria-live="polite"/);
});

test("Module 2 fills an answer after three responses needing review", () => {
  const knowledgeCheck = sources["module-2-knowledge-check.tsx"];
  assert.match(knowledgeCheck, /attempt >= 3/);
  assert.match(knowledgeCheck, /nextAnswers\[question\.id\] = question\.preferredIndex/);
  assert.match(knowledgeCheck, /filled in after three attempts/);
});

test("Module 2 styles cover focus, long text, 320px, reduced motion, and overflow safety", () => {
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /@media \(max-width: 20rem\)/);
  assert.match(styles, /@media \(max-width: 48rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /min-width: 0/);
  assert.doesNotMatch(styles, /:hover[\s\S]{0,120}(content:|display:|visibility:)/);
});

test("the prototype exposes no score, badge, or certification and pauses looping motion", () => {
  assert.doesNotMatch(combined, /score|badge|certificat/i);
  assert.match(styles, /module-offer-pause[\s\S]*infinite/);
  assert.match(styles, /module-permission-loop[\s\S]*infinite/);
  assert.match(styles, /prefers-reduced-motion: reduce[\s\S]*animation-iteration-count:\s*1/);
});
