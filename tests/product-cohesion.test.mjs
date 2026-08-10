import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { conceptRegistry } from "../features/cohesion/content/concept-registry.ts";
import {
  getConceptsForSource,
  getNextLearningAction,
} from "../features/cohesion/lib/get-next-learning-action.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the authored registry connects the core A1C, insulin resistance, and label concepts", () => {
  const a1c = conceptRegistry.find(({ id }) => id === "a1c");
  const insulinResistance = conceptRegistry.find(({ id }) => id === "insulin-resistance");
  const servingSize = conceptRegistry.find(({ id }) => id === "serving-size");

  assert.ok(a1c?.lessonIds?.length);
  assert.ok(a1c?.glossaryIds?.length);
  assert.ok(a1c?.explainItBackIds?.length);
  assert.ok(insulinResistance?.lessonIds?.length);
  assert.ok(insulinResistance?.mythCheckIds?.length);
  assert.ok(servingSize?.decodeTheLabelIds?.length);
});

test("the resolver returns at most one authored continuation and null when uncertain", () => {
  const action = getNextLearningAction({ sourceType: "glossary", sourceId: "GLOSSARY-A1C" });
  assert.equal(action?.conceptId, "a1c");
  assert.equal(action?.feature, "explain-it-back");
  assert.equal(
    getNextLearningAction({ sourceType: "glossary", sourceId: "GLOSSARY-NOT-A-REAL-TERM" }),
    null,
  );
  assert.deepEqual(
    getConceptsForSource("glossary", "GLOSSARY-A1C").map(({ id }) => id),
    ["a1c", "a1c-vs-glucose"],
  );
});

test("the resolver prevents same-feature, completed, recent, and stale destinations", () => {
  assert.equal(
    getNextLearningAction({
      sourceType: "explain-it-back",
      sourceId: "a1c-vs-glucose",
    }),
    null,
  );
  assert.equal(
    getNextLearningAction({
      sourceType: "glossary",
      sourceId: "GLOSSARY-A1C",
      completedDestinationIds: new Set([
        "explain-it-back:a1c",
        "explain-it-back:a1c-vs-glucose",
        "lesson:20000000-0000-0000-0000-000000000003",
      ]),
    }),
    null,
  );
  assert.equal(
    getNextLearningAction({
      sourceType: "glossary",
      sourceId: "GLOSSARY-A1C",
      recentDestination: { feature: "explain-it-back", id: "a1c" },
      completedDestinationIds: new Set([
        "explain-it-back:a1c-vs-glucose",
        "lesson:20000000-0000-0000-0000-000000000003",
      ]),
    }),
    null,
  );
  assert.equal(
    getNextLearningAction({
      sourceType: "glossary",
      sourceId: "GLOSSARY-A1C",
      registry: [
        {
          id: "a1c",
          title: "A1C",
          glossaryIds: ["GLOSSARY-A1C"],
          destinations: [
            {
              feature: "resource",
              id: "stale",
              relationship: "review",
              title: "Stale destination",
              href: "https://example.com/stale",
            },
          ],
        },
      ],
    }),
    null,
  );
});

test("cohesion stays contextual, private-data-free, and outside protected content", async () => {
  const [registry, resolver, contextual, decode, explain, glossary, ai, journey] =
    await Promise.all([
      read("features/cohesion/content/concept-registry.ts"),
      read("features/cohesion/lib/get-next-learning-action.ts"),
      read("features/cohesion/components/contextual-next-step.tsx"),
      read("features/decode-the-label/components/decode-the-label-experience.tsx"),
      read("features/explain-it-back/components/explain-it-back-experience.tsx"),
      read("features/glossary/components/medical-glossary-page.tsx"),
      read("features/ai/components/ai-chat.tsx"),
      read("features/next-step/components/next-step-panel.tsx"),
    ]);

  assert.doesNotMatch(
    `${registry}\n${resolver}`,
    /symptom|personal result|private health|medication dose/i,
  );
  assert.doesNotMatch(contextual, /recordQualifyingLearningActivity|supabase|localStorage/);
  assert.match(decode, /ContextualNextStep/);
  assert.match(explain, /Back to Journey/);
  assert.match(glossary, /ContextualNextStep/);
  assert.doesNotMatch(ai, /Related content|You could ask next/);
  assert.doesNotMatch(journey, /alternatives|Other options|Not right now/);
});
