import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [page, styles, journeyStyles] = await Promise.all([
  read("app/(app)/progress/page.tsx"),
  read("features/progress/components/progress-page.module.css"),
  read("features/progress/components/journey-progress-experience.module.css"),
]);

test("progress uses the generated artwork as a decorative responsive background", async () => {
  await access(new URL("../public/progress/progress-background-v1.png", import.meta.url));
  assert.match(styles, /url\("\/progress\/progress-background-v1\.png"\)/);
  assert.match(styles, /background-position:\s*center top/);
  assert.match(styles, /background-repeat:\s*repeat-y/);
  assert.match(styles, /--progress-art-height:\s*56\.28vw/);
  assert.match(styles, /background-size:\s*100% var\(--progress-art-height\)/);
  assert.match(styles, /mask-repeat:\s*repeat-y/);
  assert.match(styles, /mask-size:\s*100% var\(--progress-art-height\)/);
  assert.doesNotMatch(page, /progressBackdrop|next\/image/);
});

test("progress artwork fills the viewport without distortion or blocked interaction", () => {
  assert.match(styles, /\.progressPage\s*\{[\s\S]*width:\s*100vw/);
  assert.match(styles, /\.progressPage::before\s*\{[\s\S]*inset:\s*0/);
  assert.match(styles, /\.progressPage::before\s*\{[\s\S]*pointer-events:\s*none/);
  assert.match(styles, /\.progressContent\s*\{[\s\S]*max-width:\s*64rem/);
  assert.match(styles, /\.progressContent::before\s*\{[\s\S]*var\(--background\) 92%/);
  assert.doesNotMatch(styles, /background-size:\s*100% 100%/);
});

test("learning phase toggles replace the full-row focus overlay with a compact indicator", () => {
  assert.match(
    journeyStyles,
    /\.phaseButton:focus-visible\s*\{[^}]*box-shadow:\s*none;[^}]*outline:\s*none;/,
  );
  assert.match(journeyStyles, /\.phaseButton:focus-visible \.phaseTitle\s*\{[^}]*text-decoration:/);
  assert.match(journeyStyles, /\.phaseButton:focus-visible \.chevron\s*\{[^}]*outline:\s*2px/);
});
