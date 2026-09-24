import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

async function findLoadingFiles(directory) {
  const entries = await readdir(new URL(`../${directory}/`, import.meta.url), {
    withFileTypes: true,
  });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) return findLoadingFiles(path);
      return entry.name === "loading.tsx" ? [path] : [];
    }),
  );

  return files.flat();
}

const [layout, gate, loadingState, styles] = await Promise.all([
  read("app/layout.tsx"),
  read("components/motion/app-readiness-gate.tsx"),
  read("components/shared/page-loading-state.tsx"),
  read("app/globals.css"),
]);

test("the root layout keeps every route behind one readiness gate", () => {
  assert.match(layout, /<AppReadinessGate>\{children\}<\/AppReadinessGate>/);
  assert.match(gate, /data-ready="false"/);
  assert.match(gate, /data-ready-content inert/);
  assert.match(gate, /Preparing Health Decoded/);
});

test("the readiness gate waits for fonts, every mounted image, CSS imagery, and layout stability", () => {
  assert.match(gate, /document\.fonts\.ready/);
  assert.match(gate, /querySelectorAll\("img"\)/);
  assert.doesNotMatch(gate, /querySelectorAll\("img"\)\)\.filter\(isNearViewport\)/);
  assert.match(gate, /image\.decode/);
  assert.match(gate, /const preloader = new Image\(\)/);
  assert.match(gate, /preloader\.fetchPriority = isNearViewport\(image\)/);
  assert.match(gate, /preloader\.srcset = image\.srcset/);
  assert.match(gate, /getComputedStyle\(element, pseudoElement\)\.backgroundImage/);
  assert.match(gate, /backgroundImageUrls\(element, "::before"\)/);
  assert.match(gate, /backgroundImageUrls\(element, "::after"\)/);
  assert.match(gate, /MutationObserver/);
  assert.match(gate, /ResizeObserver/);
  assert.match(gate, /VISUAL_QUIET_PERIOD_MS/);
  assert.doesNotMatch(gate, /MAX_READY_WAIT/);
});

test("the readiness gate never mutates server-rendered image attributes before hydration", () => {
  assert.doesNotMatch(gate, /image\.loading\s*=/);
  assert.doesNotMatch(gate, /image\.fetchPriority\s*=/);
  assert.doesNotMatch(gate, /image\.src(?:set)?\s*=/);
});

test("initial entrance animations finish behind the loading surface", () => {
  assert.match(gate, /getAnimations\(\{ subtree: true \}\)/);
  assert.match(gate, /iterations === Infinity/);
  assert.match(gate, /animation\.finish\(\)/);
  assert.match(gate, /finishInitialAnimations\(content\)/);
});

test("streamed route fallbacks stay behind the stable loading surface", () => {
  assert.match(loadingState, /data-route-loading/);
  assert.match(gate, /querySelector\("\[data-route-loading\]"\)/);
  assert.match(gate, /fallbackRevision === visualRevision/);
  assert.match(gate, /node\.cloneNode\(true\)/);
  assert.match(gate, /snapshot\.replaceChildren\(\.\.\.clonedChildren\)/);
  assert.doesNotMatch(gate, /dangerouslySetInnerHTML|\.innerHTML\s*=/);
  assert.match(gate, /data-ready-snapshot/);
  assert.match(gate, /clearRouteLoadingSnapshot\(root\)/);
  assert.match(
    styles,
    /\.app-readiness-route-snapshot:not\(\[hidden\]\) \+ \.app-readiness-status/,
  );
});

test("every route loading boundary participates in the global readiness handoff", async () => {
  const loadingFiles = await findLoadingFiles("app");
  assert.ok(loadingFiles.length > 0);

  for (const file of loadingFiles) {
    const source = await read(file);
    assert.match(
      source,
      /PageLoadingState|data-route-loading/,
      `${file} must identify itself as an unfinished route`,
    );
  }
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
  assert.match(gate, /toggleAttribute\("inert", !ready\)/);
  assert.match(gate, /setReadyState\(root, true\)/);
});

test("the readiness handoff is atomic and does not re-anchor viewport-fixed controls", () => {
  assert.match(
    styles,
    /\.app-readiness-gate\[data-ready="true"\] \[data-ready-content\][^{]*\{[^}]*opacity: 1/,
  );
  assert.doesNotMatch(
    styles,
    /\.app-readiness-gate\[data-ready="true"\] \[data-ready-content\][^{]*\{[^}]*\b(?:animation|transform):/,
  );
});
