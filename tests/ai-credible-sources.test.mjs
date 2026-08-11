import assert from "node:assert/strict";
import test from "node:test";

import { credibleSourcesForQuestion } from "../features/ai/data/credible-sources.ts";

test("general diabetes questions receive authoritative sources without Health Decoded content", () => {
  const sources = credibleSourcesForQuestion("How does the pancreas affect blood sugar?");

  assert.equal(sources.length >= 2, true);
  assert.equal(
    sources.every((source) => source.href.startsWith("https://")),
    true,
  );
  assert.equal(
    sources.every((source) => ["CDC", "NIDDK"].includes(source.organization)),
    true,
  );
});

test("topic-specific questions receive matching authoritative references", () => {
  assert.match(credibleSourcesForQuestion("What does A1C measure?")[0]?.title ?? "", /A1C/);
  assert.match(credibleSourcesForQuestion("What does metformin do?")[0]?.title ?? "", /Medicines/);
  assert.match(credibleSourcesForQuestion("Why does exercise help?")[0]?.title ?? "", /Active/);
});
