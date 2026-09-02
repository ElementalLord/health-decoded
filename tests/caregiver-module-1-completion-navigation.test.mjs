import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const completionSource = await readFile(
  new URL(
    "../features/caregiver/components/modules/module-1/module-1-completion.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("Module 1 completion exits use native navigation to implemented destinations", () => {
  assert.match(
    completionSource,
    /href=\{caregiverModuleRegistry\["support-without-taking-over"\]\.route\}/,
  );
  assert.match(completionSource, /<a[\s\S]*?href="\/caregiver"/);
  assert.doesNotMatch(completionSource, /import Link from "next\/link"/);
});
