import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [layout, gate, styles] = await Promise.all([
  read("app/layout.tsx"),
  read("components/motion/app-readiness-gate.tsx"),
  read("app/globals.css"),
]);

test("the root layout keeps every route behind one readiness gate", () => {
  assert.match(layout, /<AppReadinessGate>\{children\}<\/AppReadinessGate>/);
  assert.match(gate, /data-ready="false"/);
  assert.match(gate, /data-ready-content inert/);
  assert.match(gate, /Preparing Health Decoded/);
});

test("the readiness gate waits for fonts, image decoding, and visible CSS imagery", () => {
  assert.match(gate, /document\.fonts\.ready/);
  assert.match(gate, /querySelectorAll\("img"\)/);
  assert.match(gate, /image\.decode/);
  assert.match(gate, /image\.loading = "eager"/);
  assert.match(gate, /image\.fetchPriority = "high"/);
  assert.match(gate, /getComputedStyle\(element\)\.backgroundImage/);
  assert.match(gate, /MutationObserver/);
  assert.doesNotMatch(gate, /MAX_READY_WAIT|setTimeout/);
});

test("unfinished pages stay hidden and inert until the loading surface hands off", () => {
  assert.match(
    styles,
    /\.app-readiness-gate\[data-ready="false"\] \[data-ready-content\][\s\S]*?opacity: 0/,
  );
  assert.doesNotMatch(
    styles,
    /data-ready="false"\] \[data-ready-content\][^{]*\{[^}]*visibility: hidden/,
  );
  assert.match(styles, /\.app-readiness-status[\s\S]*?position: fixed[\s\S]*?z-index: 9999/);
  assert.match(
    styles,
    /data-ready="false"[\s\S]*?\.motion-page[\s\S]*?animation-duration: 1ms !important/,
  );
  assert.match(gate, /toggleAttribute\("inert", !ready\)/);
  assert.match(gate, /setReadyState\(root, true\)/);
});

test("the readiness wrapper does not re-anchor viewport-fixed controls", () => {
  assert.match(
    styles,
    /\.app-readiness-gate\[data-ready="true"\] \[data-ready-content\][^{]*\{[^}]*animation: fade-in/,
  );
  assert.doesNotMatch(
    styles,
    /\.app-readiness-gate\[data-ready="true"\] \[data-ready-content\][^{]*\{[^}]*animation: page-settle/,
  );
});
