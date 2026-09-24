import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [globals, rootLayout, pageContainer, appHeader, appHeaderStyles, publicLayout, publicHeader] =
  await Promise.all([
    read("app/globals.css"),
    read("app/layout.tsx"),
    read("components/layout/page-container.tsx"),
    read("components/layout/app-header.tsx"),
    read("components/layout/app-header.module.css"),
    read("app/(public)/layout.tsx"),
    read("components/layout/public-header.tsx"),
  ]);

const fullBleedBackgrounds = Object.fromEntries(
  await Promise.all(
    [
      ["journey", "features/journeys/components/journey-page.module.css"],
      ["resources", "features/resources/components/resources.module.css"],
      ["progress", "features/progress/components/progress-page.module.css"],
      ["glossary", "features/glossary/styles/medical-glossary.module.css"],
      ["profile", "features/profile/components/profile-content.module.css"],
      ["stories", "features/stories/components/story-landing.module.css"],
      ["caregiver", "features/caregiver/styles/caregiver-landing.module.css"],
    ].map(async ([name, path]) => [name, await read(path)]),
  ),
);

test("the document is locked to its real scroll boundaries on every device", () => {
  assert.match(globals, /body\s*\{[\s\S]*overscroll-behavior:\s*none/);
  assert.match(globals, /html\s*\{[\s\S]*overscroll-behavior:\s*none/);
  assert.match(globals, /html\s*\{[\s\S]*background-color:\s*var\(--background\)/);
});

test("signed-in and public headers stay viewport-fixed with layout space reserved", () => {
  assert.match(appHeader, /fixed inset-x-0 top-0/);
  assert.match(appHeader, /appHeaderSpacer/);
  assert.match(appHeaderStyles, /calc\(4\.5rem \+ env\(safe-area-inset-top\)\)/);

  assert.match(publicHeader, /safe-area-top fixed inset-x-0 top-0/);
  assert.match(publicHeader, /h-\[calc\(4\.5rem\+env\(safe-area-inset-top\)\)\]/);
});

test("no custom scroll transform or input listener remains", () => {
  assert.doesNotMatch(rootLayout, /ScrollBoundaryFeedback/);
  assert.doesNotMatch(pageContainer, /data-scroll-boundary-surface/);
  assert.doesNotMatch(publicLayout, /data-scroll-boundary-surface/);
  assert.doesNotMatch(globals, /data-boundary-bouncing|scroll-boundary-offset/);
});

test("full-bleed route backgrounds cover the shell's complete top and bottom insets", () => {
  assert.match(globals, /--shell-top-inset:/);
  assert.match(globals, /--shell-bottom-inset:/);
  for (const [name, source] of Object.entries(fullBleedBackgrounds)) {
    assert.match(source, /--shell-top-inset/, `${name} leaves shell top padding uncovered`);
    assert.match(source, /--shell-bottom-inset/, `${name} leaves shell padding uncovered`);
  }
});
