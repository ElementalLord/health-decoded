import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";

const source = stripTypeScriptTypes(
  await readFile(
    new URL("../features/ai/services/ai-rate-limit.server.ts", import.meta.url),
    "utf8",
  ),
)
  .replace(/^import\b[\s\S]*?;\n/gm, "")
  .replace(/^export /gm, "");

function limiter() {
  return new Function(
    "globalThis",
    "getAiSecurityConfig",
    `${source}\nreturn consumeAiRequestSlot;`,
  )({}, () => ({
    requestsPerMinute: 20,
    requestsPerHour: 120,
    requestsPerDay: 1000,
    networkRequestsPerMinute: 30,
    rapidRequestIntervalMs: 750,
    duplicateRequestLimit: 3,
    duplicateWindowMs: 120_000,
    abuseBlockMs: 30_000,
  }));
}
const input = {
  userId: "synthetic-user",
  networkKey: "synthetic-network",
  fingerprint: "question",
};

test("repeated rapid retries do not lock out the next normal question", () => {
  const consume = limiter();
  const now = 1_000_000;
  assert.equal(consume(input, now).allowed, true);
  for (let i = 1; i <= 20; i++) assert.equal(consume(input, now + i).reason, "rapid");
  assert.equal(consume({ ...input, fingerprint: "next question" }, now + 1_000).allowed, true);
});

test("duplicate retry limits expire without adding an abuse block", () => {
  const consume = limiter();
  const now = 1_000_000;
  for (let i = 0; i < 3; i++) assert.equal(consume(input, now + i * 1_000).allowed, true);
  for (let i = 0; i < 20; i++) assert.equal(consume(input, now + 3_000 + i).reason, "duplicate");
  assert.equal(consume({ ...input, fingerprint: "new question" }, now + 4_000).allowed, true);
  assert.equal(consume(input, now + 123_000).allowed, true);
});

test("minute limits recover when the minute ends even after repeated retries", () => {
  const consume = limiter();
  const now = 1_000_000;
  for (let i = 0; i < 20; i++) {
    assert.equal(
      consume({ ...input, fingerprint: `question ${i}` }, now + i * 1_000).allowed,
      true,
    );
  }
  for (let i = 0; i < 20; i++) {
    assert.equal(consume({ ...input, fingerprint: "next" }, now + 20_000 + i).reason, "minute");
  }
  assert.equal(consume({ ...input, fingerprint: "next" }, now + 61_000).allowed, true);
});

test("sensitive abuse requests still apply a block", () => {
  const consume = limiter();
  const now = 1_000_000;
  consume({ ...input, sensitive: true }, now);
  assert.equal(consume({ ...input, fingerprint: "next" }, now + 1_000).reason, "blocked");
  assert.equal(consume({ ...input, fingerprint: "next" }, now + 31_000).allowed, true);
});
