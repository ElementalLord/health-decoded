import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const modules = new URL("../features/caregiver/components/modules/", import.meta.url);

for (const moduleNumber of [1, 2, 3, 4, 5]) {
  const reflection = await readFile(
    new URL(`module-${moduleNumber}/module-${moduleNumber}-reflection.tsx`, modules),
    "utf8",
  );

  test(`Module ${moduleNumber} removes the unboxed Skip for Now action after selection`, () => {
    assert.match(reflection, /reflectionSkipped/);
    assert.match(reflection, /!reflectionSkipped \? \(/);
    assert.match(reflection, /className=\{styles\.skipAction\}/);
    assert.match(reflection, /skipReflection/);
    assert.doesNotMatch(reflection, /aria-pressed=\{reflectionSkipped\}/);
    assert.match(reflection, /Reflection skipped for this session/);
  });
}

for (const moduleNumber of [1, 2]) {
  const [reflection, completion] = await Promise.all([
    readFile(new URL(`module-${moduleNumber}/module-${moduleNumber}-reflection.tsx`, modules), "utf8"),
    readFile(new URL(`module-${moduleNumber}/module-${moduleNumber}-completion.tsx`, modules), "utf8"),
  ]);

  test(`Module ${moduleNumber} Skip for Now confirms the choice and advances focus`, () => {
    assert.match(reflection, /function skipForNow\(\)/);
    assert.match(reflection, /skipReflection\(\)/);
    assert.match(
      reflection,
      new RegExp(`getElementById\\("module-${moduleNumber}-completion-heading"\\)\\?\\.focus`),
    );
    assert.match(reflection, /variant="text"/);
    assert.match(reflection, /You can return and write later/);
    assert.match(
      completion,
      new RegExp(`id="module-${moduleNumber}-completion-heading" tabIndex=\\{-1\\}`),
    );
  });
}
