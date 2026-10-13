import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [page, styles] = await Promise.all([
  read("app/(app)/journey/page.tsx"),
  read("features/journeys/components/journey-page.module.css"),
]);

test("journey uses lightweight generated margin sketches without blocking content", async () => {
  const artwork = new URL(
    "../public/journey/journey-cream-paper-background-v5.webp",
    import.meta.url,
  );
  assert.ok((await stat(artwork)).size < 250_000);
  assert.match(styles, /journey-cream-paper-background-v5\.webp/);
  assert.doesNotMatch(styles, /animation:|filter:/);
  assert.match(styles, /background-size:\s*100% 100%/);
  assert.match(styles, /background-repeat:\s*no-repeat/);
  assert.match(styles, /background-position:\s*center top/);
  assert.match(styles, /pointer-events:\s*none/);
  assert.match(styles, /transparent var\(--journey-art-gutter\)/);
  assert.match(styles, /transparent calc\(100% - var\(--journey-art-gutter\)\)/);
});

test("journey background is full-bleed while page content remains centered and readable", () => {
  assert.match(page, /className=\{styles\.journeyPage\}/);
  assert.match(page, /styles\.journeyContent/);
  assert.match(styles, /\.journeyPage\s*\{[\s\S]*width:\s*100vw/);
  assert.match(styles, /\.journeyContent\s*\{[\s\S]*max-width:/);
  assert.match(styles, /background-color:\s*#f9f0e3/);
  assert.match(styles, /@media \(max-width: 48rem\)[\s\S]*opacity:\s*0\.25/);
  assert.match(styles, /@media \(max-width: 48rem\)[\s\S]*--journey-gutter:/);
  assert.doesNotMatch(styles, /\.journeyContent::before/);
});
