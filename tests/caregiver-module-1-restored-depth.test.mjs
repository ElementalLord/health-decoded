import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directory = new URL("../features/caregiver/components/modules/module-1/", import.meta.url);
const [experience, narrative, observation, timing, builder, check] = await Promise.all([
  readFile(new URL("module-1-experience.tsx", directory), "utf8"),
  readFile(new URL("module-1-narrative.tsx", directory), "utf8"),
  readFile(new URL("observation-interpretation-workbench.tsx", directory), "utf8"),
  readFile(new URL("timing-sequence.tsx", directory), "utf8"),
  readFile(new URL("listen-help-space-builder.tsx", directory), "utf8"),
  readFile(new URL("module-1-knowledge-check.tsx", directory), "utf8"),
]);

test("the redesigned journey restores eleven focused learning stages", () => {
  for (const stage of [
    "opening",
    "scenario",
    "meaning",
    "notice",
    "possibilities",
    "timing",
    "readiness",
    "support",
    "returning",
    "check",
    "takeaway",
  ]) {
    assert.match(experience, new RegExp(`data-stage="${stage}"`));
  }
});

test("the full Mira and Jules sequence and explicit known-unknown distinction are present", () => {
  assert.match(narrative, /lives in another city/);
  assert.match(narrative, /new\s+diabetes medication/);
  assert.match(narrative, /texted every evening/);
  assert.match(narrative, /Three hours later/);
  assert.match(narrative, /scared and avoiding it/);
  assert.match(narrative, /angry\s+with\s+him/);
  assert.match(narrative, /Draft deleted/);
  assert.match(narrative, /He calls anyway/);
  assert.match(narrative, /Mira does not answer/);
  assert.match(narrative, /She said she was busy/);
  assert.match(narrative, /Whether the silence had anything to do with diabetes/);
});

test("multiple explanations, ordinary life, pressure, and changing readiness are restored", () => {
  for (const idea of [
    "information overload",
    "embarrassment",
    "fatigue",
    "grief",
    "wanting a normal evening",
    "work stress",
    "family stress",
    "financial concerns",
  ]) {
    assert.match(narrative, new RegExp(idea));
  }
  assert.match(narrative, /Gentle can still become pressure/);
  assert.match(narrative, /Readiness is not a test of trust/);
  assert.match(narrative, /Not provide regular updates/);
  assert.match(narrative, /Want privacy tomorrow/);
  assert.match(narrative, /readiness\.language\[languageIndex\]/);
});

test("all practice depth and reference depth remain available", () => {
  assert.match(observation, /interaction\.statements\[statementIndex\]/);
  assert.match(observation, /Try another possible explanation/);
  assert.match(timing, /interaction\.moments\[momentIndex\]/);
  assert.match(timing, /All three moments reviewed/);
  assert.match(builder, /interaction\.openings\.map/);
  assert.match(builder, /interaction\.followups\.map/);
  assert.match(narrative, /A pause does not need a dramatic reopening/);
  assert.match(narrative, /misunderstanding\.misunderstanding/);
  assert.match(narrative, /No update is needed/);
  assert.match(check, /caregiverModule1\.questions\[questionIndex\]/);
  assert.match(check, /See all seven phrases/);
  assert.match(check, /passiveReading\.subsections\.map/);
  assert.match(check, /Module1Reflection/);
});
