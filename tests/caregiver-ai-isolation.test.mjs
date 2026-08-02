import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const aiContextSource = await readFile(
  new URL("../features/ai/services/ai-context.server.ts", import.meta.url),
  "utf8",
);

test("runtime AI context is isolated from caregiver content and state", () => {
  assert.doesNotMatch(aiContextSource, /caregiver_content/);
  assert.doesNotMatch(aiContextSource, /features\/caregiver|caregiver-module-registry/);
  assert.doesNotMatch(
    aiContextSource,
    /caregiver:|module answer|reflection|interaction selection|urgent-help/iu,
  );
});
