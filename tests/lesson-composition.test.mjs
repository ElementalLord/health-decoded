import assert from "node:assert/strict";
import test from "node:test";

import { buildLessonComposition } from "../features/lessons/mappers/lesson-composition.mapper.ts";
import { lessonContentBlocksSchema } from "../features/lessons/schemas/lesson-content.schema.ts";

const activity = {
  configuration: {
    feedback: { correct: "Correct.", retry: "Try again." },
    leftItems: [
      { id: "one", label: "One" },
      { id: "two", label: "Two" },
    ],
    prompt: "Match each item.",
    rightItems: [
      { id: "first", label: "First" },
      { id: "second", label: "Second" },
    ],
  },
  id: "40000000-0000-4000-8000-000000000002",
  instructions: "Choose the matching description.",
  isComplete: false,
  title: "A short practice",
  type: "match_pair",
};

test("keeps existing lesson blocks backward compatible", () => {
  const parsed = lessonContentBlocksSchema.safeParse([
    { type: "text", heading: "A familiar block", body: "Existing lesson content still works." },
    { type: "callout", title: "Remember", body: "Existing callouts still work." },
    { type: "summary", points: ["One", "Two"] },
    {
      type: "image",
      src: "/images/lesson-example.png",
      alt: "An educational example",
      width: 1200,
      height: 800,
    },
  ]);

  assert.equal(parsed.success, true);
});

test("accepts a varied editorial composition", () => {
  const parsed = lessonContentBlocksSchema.safeParse([
    { type: "story", title: "A morning at home", body: "A short opening story." },
    { type: "statistic", value: "08", label: "minutes to explore" },
    {
      type: "diagram",
      title: "How the idea moves",
      nodes: [{ label: "Start" }, { label: "Signal" }, { label: "Response" }],
    },
    { type: "activity", activity_id: activity.id },
    { type: "reflection", prompt: "What feels clearer now?" },
    { type: "takeaway", body: "One useful idea is enough for today." },
  ]);

  assert.equal(parsed.success, true);
});

test("places referenced activities in sequence and appends unplaced activities", () => {
  const secondActivity = { ...activity, id: "40000000-0000-4000-8000-000000000003" };
  const blocks = [
    { type: "text", body: "Read first." },
    { type: "activity", activity_id: activity.id },
    { type: "takeaway", body: "Finish with this." },
  ];
  const parsed = lessonContentBlocksSchema.parse(blocks);
  const composition = buildLessonComposition(parsed, [activity, secondActivity]);

  assert.ok(composition);
  assert.deepEqual(
    composition.map((item) => item.kind),
    ["content", "activity", "content", "activity"],
  );
  assert.equal(composition[1]?.kind === "activity" && composition[1].activity.id, activity.id);
  assert.equal(
    composition[3]?.kind === "activity" && composition[3].activity.id,
    secondActivity.id,
  );
});

test("rejects missing and repeated activity placements", () => {
  const missingActivityBlocks = lessonContentBlocksSchema.parse([
    { type: "activity", activity_id: "40000000-0000-4000-8000-000000000004" },
  ]);
  assert.equal(buildLessonComposition(missingActivityBlocks, [activity]), null);

  const repeated = lessonContentBlocksSchema.safeParse([
    { type: "activity", activity_id: activity.id },
    { type: "activity", activity_id: activity.id },
  ]);
  assert.equal(repeated.success, false);
});
