import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [gate, routeMotion, styles] = await Promise.all([
  read("components/motion/app-readiness-gate.tsx"),
  read("components/motion/route-motion.tsx"),
  read("app/globals.css"),
]);

test("back and forward navigation cannot replay the page opacity entrance", () => {
  assert.doesNotMatch(routeMotion, /usePathname|motion-page|key=\{pathname\}/);
});

test("history restoration always reveals a completed cached page", () => {
  assert.match(gate, /window\.addEventListener\("pageshow", restoreCompletedPage\)/);
  assert.match(gate, /if \(!event\.persisted\) return/);
  assert.match(gate, /setReadyState\(root, true\)/);
});

test("scroll reveal utilities stay fully visible during restored scrolling", () => {
  const scrollMotion = styles.slice(
    styles.indexOf("@supports (animation-timeline: view())"),
    styles.indexOf("/* Compact and mid-size computers"),
  );
  const scrollRules = scrollMotion.slice(scrollMotion.indexOf("{") + 1);

  assert.doesNotMatch(scrollRules, /animation-timeline\s*:|opacity:\s*(?:0|0\.)/);
  assert.match(scrollRules, /animation: none/);
  assert.match(scrollRules, /opacity: 1/);
  assert.match(scrollRules, /transform: none/);
});
