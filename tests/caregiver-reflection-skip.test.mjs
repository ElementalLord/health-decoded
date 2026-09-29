import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const modules = new URL("../features/caregiver/components/modules/", import.meta.url);

const module3Experience = await readFile(
  new URL("module-3/module-3-experience.tsx", modules),
  "utf8",
);

const module4Experience = await readFile(
  new URL("module-4/module-4-experience.tsx", modules),
  "utf8",
);

const module5Experience = await readFile(
  new URL("module-5/module-5-experience.tsx", modules),
  "utf8",
);

test("Module 3 removes Skip for Now after selection in its story reflection", () => {
  assert.match(module3Experience, /reflectionSkipped/);
  assert.match(module3Experience, /!reflectionSkipped \? \(/);
  assert.match(module3Experience, /skipReflection/);
  assert.doesNotMatch(module3Experience, /aria-pressed=\{reflectionSkipped\}/);
  assert.match(module3Experience, /Reflection skipped for this session/);
  assert.match(module3Experience, /You can return and write later/);
});

test("Module 4 removes Skip for Now after selection in its story reflection", () => {
  assert.match(module4Experience, /reflectionSkipped/);
  assert.match(module4Experience, /!reflectionSkipped \? /);
  assert.match(module4Experience, /skipReflection/);
  assert.doesNotMatch(module4Experience, /aria-pressed=\{reflectionSkipped\}/);
  assert.match(module4Experience, /Reflection skipped for this session/);
  assert.match(module4Experience, /You can return and write later/);
});

test("Module 5 removes Skip for Now after selection in its story reflection", () => {
  assert.match(module5Experience, /reflectionSkipped/);
  assert.match(module5Experience, /!reflectionSkipped \? /);
  assert.match(module5Experience, /skipReflection/);
  assert.doesNotMatch(module5Experience, /aria-pressed=\{reflectionSkipped\}/);
  assert.match(module5Experience, /Reflection skipped for this session/);
  assert.match(module5Experience, /You can return and write later/);
});
