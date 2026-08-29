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
