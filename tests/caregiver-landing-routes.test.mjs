import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const approvedRoutes = [
  "../app/(app)/caregiver/layout.tsx",
  "../app/(app)/caregiver/page.tsx",
  "../app/(app)/caregiver/loading.tsx",
  "../app/(app)/caregiver/error.tsx",
  "../app/(public)/caregiver/urgent-help/page.tsx",
  "../app/(public)/caregiver/urgent-help/loading.tsx",
  "../app/(public)/caregiver/urgent-help/error.tsx",
];

const routeSources = await Promise.all(
  approvedRoutes.map(async (path) => {
    const url = new URL(path, import.meta.url);
    await access(url);
    return readFile(url, "utf8");
  }),
);
const combinedRoutes = routeSources.join("\n");
const guidedPathSource = await readFile(
  new URL("../features/caregiver/components/landing/caregiver-guided-path.tsx", import.meta.url),
  "utf8",
);
const toolsSource = await readFile(
  new URL(
    "../features/caregiver/components/landing/caregiver-tools-introduction.tsx",
    import.meta.url,
  ),
  "utf8",
);
const landingStyles = await readFile(
  new URL("../features/caregiver/styles/caregiver-landing.module.css", import.meta.url),
  "utf8",
);

test("the landing activates all five modules and preserves the urgent route", () => {
  assert.doesNotMatch(combinedRoutes, /\/caregiver\/modules\//);
  assert.doesNotMatch(combinedRoutes, /\/caregiver\/tools\//);
  assert.match(guidedPathSource, /next\/link|<Link|href=/);
  assert.match(guidedPathSource, /getImplementedCaregiverModuleById/);
  assert.doesNotMatch(toolsSource, /next\/link|<Link|href=|<button/);
  assert.match(combinedRoutes, /\/caregiver\/urgent-help|CaregiverUrgentHelpPage/);
});

test("all modules are linked while unfinished tools remain noninteractive labeled content", () => {
  assert.match(guidedPathSource, /<ol/);
  assert.match(guidedPathSource, /data-caregiver-destination/);
  assert.match(toolsSource, /<article/);
  assert.match(toolsSource, /data-caregiver-destination/);
});

test("landing styles cover small layouts, long text, focus, and reduced motion", () => {
  assert.match(landingStyles, /@media \(max-width: 20rem\)/);
  assert.match(landingStyles, /@media \(max-width: 40rem\)/);
  assert.match(landingStyles, /overflow-wrap: anywhere/);
  assert.match(landingStyles, /focus-visible/);
  assert.match(landingStyles, /prefers-reduced-motion: reduce/);
  assert.match(landingStyles, /data-reduced-motion="true"/);
  assert.match(landingStyles, /caregiver-cup-sway[\s\S]*infinite/);
  assert.match(landingStyles, /caregiver-note-swing[\s\S]*infinite/);
  assert.match(landingStyles, /animation-iteration-count:\s*1\s*!important/);
});
