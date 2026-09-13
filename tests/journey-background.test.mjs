import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [page, styles] = await Promise.all([
  read("app/(app)/journey/page.tsx"),
  read("features/journeys/components/journey-page.module.css"),
]);

test("journey uses one continuous generated background without blocking content", async () => {
  const artwork = new URL(
    "../public/journey/journey-whimsical-background-layout-safe-v6.webp",
    import.meta.url,
  );

  await access(artwork);
  const artworkSize = (await stat(artwork)).size;
  assert.ok(artworkSize > 100_000 && artworkSize < 250_000);
  assert.match(styles, /journey-whimsical-background-layout-safe-v6\.webp/);
  assert.match(styles, /background-repeat:\s*no-repeat/);
  assert.match(styles, /background-position:\s*center top/);
  assert.match(styles, /pointer-events:\s*none/);
  assert.match(styles, /background-size:\s*100% auto/);
  assert.doesNotMatch(styles, /background-size:\s*100% 100%/);
});

test("journey artwork is full-bleed while page content remains centered and readable", () => {
  assert.match(page, /className=\{styles\.journeyPage\}/);
  assert.match(page, /styles\.journeyContent/);
  assert.match(styles, /\.journeyPage\s*\{[\s\S]*width:\s*100vw/);
  assert.match(styles, /\.journeyContent\s*\{[\s\S]*max-width:/);
  assert.match(styles, /filter:\s*saturate\(0\.62\) contrast\(0\.9\) brightness\(1\.08\)/);
  assert.match(styles, /opacity:\s*0\.56/);
  assert.match(styles, /@media \(max-width: 48rem\)[\s\S]*--journey-gutter:/);
  assert.doesNotMatch(styles, /\.journeyContent::before/);
});
