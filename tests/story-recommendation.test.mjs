import assert from "node:assert/strict";
import test from "node:test";

import {
  getRecommendedStorySlug,
  prioritizeStorySlugs,
} from "../features/stories/lib/story-recommendation.ts";

const storySlugs = ["marcus", "asha", "nora", "devon"];

test("an in-progress story is recommended before unopened stories", () => {
  const progress = {
    marcus: { status: "completed" },
    asha: { status: "not-started" },
    nora: { status: "in-progress" },
    devon: { status: "not-started" },
  };

  assert.equal(getRecommendedStorySlug(storySlugs, progress), "nora");
  assert.deepEqual(prioritizeStorySlugs(storySlugs, progress), ["nora", "asha", "devon", "marcus"]);
});

test("the most recently opened in-progress story is recommended", () => {
  const progress = {
    marcus: { status: "in-progress", lastOpenedAt: 100 },
    asha: { status: "in-progress", lastOpenedAt: 400 },
    nora: { status: "not-started", lastOpenedAt: 500 },
    devon: { status: "completed", lastOpenedAt: 600 },
  };

  assert.equal(getRecommendedStorySlug(storySlugs, progress), "asha");
  assert.deepEqual(prioritizeStorySlugs(storySlugs, progress), ["asha", "marcus", "nora", "devon"]);
});

test("every story can move into the featured position without disappearing from the ordering", () => {
  for (const [index, expectedSlug] of storySlugs.entries()) {
    const progress = Object.fromEntries(
      storySlugs.map((slug) => [
        slug,
        { status: "in-progress", lastOpenedAt: slug === expectedSlug ? 100 + index : 1 },
      ]),
    );
    const ordered = prioritizeStorySlugs(storySlugs, progress);

    assert.equal(getRecommendedStorySlug(storySlugs, progress), expectedSlug);
    assert.equal(ordered[0], expectedSlug);
    assert.deepEqual([...ordered].sort(), [...storySlugs].sort());
  }
});

test("an unopened story is recommended when none are in progress", () => {
  const progress = {
    marcus: { status: "completed" },
    asha: { status: "not-started" },
    nora: { status: "completed" },
    devon: { status: "not-started" },
  };

  assert.equal(getRecommendedStorySlug(storySlugs, progress), "asha");
});

test("completed stories are never recommended", () => {
  const progress = Object.fromEntries(storySlugs.map((slug) => [slug, { status: "completed" }]));

  assert.equal(getRecommendedStorySlug(storySlugs, progress), undefined);
});
