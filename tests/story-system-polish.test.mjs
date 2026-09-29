import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const storyNames = ["asha", "devon", "marcus", "nora"];
const experiencePaths = storyNames.map(
  (name) => `features/stories/components/${name}-story-experience.tsx`,
);
const stylePaths = storyNames.map(
  (name) => `features/stories/components/${name}-story-experience.module.css`,
);
const experiences = await Promise.all(
  experiencePaths.map((path) => readFile(new URL(path, root), "utf8")),
);
const styles = await Promise.all(stylePaths.map((path) => readFile(new URL(path, root), "utf8")));
const landing = await readFile(
  new URL("features/stories/components/story-landing.tsx", root),
  "utf8",
);
const landingStyles = await readFile(
  new URL("features/stories/components/story-landing.module.css", root),
  "utf8",
);
const routeLoading = await readFile(new URL("app/(app)/stories/loading.tsx", root), "utf8");
const visibleStorySources = (
  await Promise.all(
    [
      ...experiencePaths,
      ...stylePaths,
      "features/stories/components/interactive-story-player.tsx",
      "features/stories/components/story-landing.tsx",
      "features/stories/content/asha-rice-on-the-table.ts",
      "features/stories/content/devon-number-screen.ts",
      "features/stories/content/marcus-parking-lot.ts",
      "features/stories/content/nora-prescription-bag.ts",
      "app/(app)/stories/loading.tsx",
    ].map((path) => readFile(new URL(path, root), "utf8")),
  )
).join("\n");

test("all four dedicated story readers advance without delay or an input lock", () => {
  for (const source of experiences) {
    assert.doesNotMatch(source, /window\.setTimeout|setTransitioning|sceneLeaving/);
    assert.match(source, /setCurrent\(next\)/);
    assert.match(source, /scrollIntoView\(\{ behavior: "auto", block: "start" \}\)/);
  }
});

test("Read again starts at Part 1 while Continue resumes saved progress", () => {
  assert.match(
    landing,
    /progress\.status === "in-progress"[\s\S]*`\/stories\/\$\{story\.slug\}`[\s\S]*`\/stories\/\$\{story\.slug\}\?begin=1`/,
  );
  for (const source of experiences) {
    assert.match(source, /if \(shouldBegin\) \{[\s\S]*setCurrent\(0\)[\s\S]*setFurthest\(0\)/);
    assert.match(source, /else if \(saved\.storyCompleted\) \{[\s\S]*setComplete\(true\)/);
  }
});

test("story progress exposes a readable value and hides decorative markers", () => {
  for (const source of experiences) {
    assert.match(source, /aria-valuetext=\{`Part \$\{current \+ 1\} of \$\{SCENE_COUNT\}`\}/);
    assert.match(source, /aria-hidden="true"[\s\S]*styles\.progressActive/);
  }
});

test("finish and restart restore both reading position and keyboard focus", () => {
  for (const source of experiences) {
    assert.match(
      source,
      /const finish = \(\) => \{[\s\S]*scrollIntoView[\s\S]*headingRef\.current\?\.focus/,
    );
    assert.match(
      source,
      /const restart = \(\) => \{[\s\S]*scrollIntoView[\s\S]*headingRef\.current\?\.focus/,
    );
    assert.match(source, /<h1 ref=\{headingRef\} tabIndex=\{-1\}>\s*Finished\s*<\/h1>/);
  }
});

test("reader styles preserve state feedback and narrow-screen navigation", () => {
  for (const source of styles) {
    assert.match(source, /button:not\(:disabled\), a\):active/);
    assert.match(source, /\.next:not\(:disabled\):hover/);
    assert.match(source, /:not\(\[aria-(?:pressed|selected|checked)="true"\]\):hover/);
    assert.match(source, /@media \(max-width: 28rem\)[\s\S]*grid-template-columns: 1fr/);
    assert.match(
      source,
      /@media \(min-width: 38\.01rem\) and \(max-width: 79\.99rem\) and \(max-height: 48rem\)/,
    );
    assert.match(source, /\.sceneVisual > \* \{[\s\S]*max-width: 100%[\s\S]*min-width: 0/);
    assert.match(source, /\.sceneHeading h1:focus-visible/);
    assert.doesNotMatch(source, /\.disclosure[\s\S]{0,180}!important/);
  }
});

test("loading feedback is concise and respects reduced motion", () => {
  for (let index = 0; index < experiences.length; index += 1) {
    assert.match(experiences[index], />Loading story</);
    assert.match(experiences[index], /className=\{styles\.loadingMark\}/);
    assert.match(styles[index], /storyLoadingPulse 520ms/);
    assert.match(styles[index], /prefers-reduced-motion[\s\S]*animation: none/);
  }
  assert.match(routeLoading, /label="Loading stories"/);
});

test("story landing typography and action focus remain readable", () => {
  assert.doesNotMatch(landing, /replace\(" to ", "[\u2013\u2014]"\)/);
  assert.match(landingStyles, /\.storyAction:focus-visible/);
  assert.match(landingStyles, /\.intro h1[\s\S]*letter-spacing: -0\.045em/);
});

test("story UI and authored copy contain no en dash, em dash, or ellipsis characters", () => {
  assert.doesNotMatch(visibleStorySources, /[\u2013\u2014\u2026]/);
});
