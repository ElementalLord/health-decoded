import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import {
  crackerLabel,
  decodeLabelQuestions,
  fruitYogurtLabel,
  plainYogurtLabel,
} from "../features/decode-the-label/content/decode-the-label-content.ts";

const [routeSource, experienceSource, labelSource, stylesSource, resourcesSource] =
  await Promise.all([
    readFile(new URL("../app/(app)/decode-the-label/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../features/decode-the-label/components/decode-the-label-experience.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL("../features/decode-the-label/components/nutrition-facts.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../features/decode-the-label/styles/decode-the-label.module.css", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../features/resources/components/resources.tsx", import.meta.url), "utf8"),
  ]);

test("the exercise contains twelve stable, answerable questions", () => {
  assert.equal(decodeLabelQuestions.length, 12);
  assert.equal(new Set(decodeLabelQuestions.map((question) => question.id)).size, 12);
  for (const question of decodeLabelQuestions) {
    assert.ok(question.choices.some((choice) => choice.id === question.correctChoiceId));
    assert.ok(question.correctFeedback.length > 30);
    assert.ok(question.incorrectFeedback.length > 30);
  }
});

test("fictional labels preserve the reviewed teaching values", () => {
  assert.equal(crackerLabel.servingSize, "16 crackers (30g)");
  assert.equal(crackerLabel.totalCarbohydrate, "22g");
  assert.equal(crackerLabel.dietaryFiber, "4g");
  assert.equal(crackerLabel.addedSugars, "2g");
  assert.equal(plainYogurtLabel.totalCarbohydrate, "7g");
  assert.equal(plainYogurtLabel.protein, "16g");
  assert.equal(fruitYogurtLabel.totalCarbohydrate, "19g");
  assert.equal(fruitYogurtLabel.addedSugars, "12g");
});

test("the activity stays educational and avoids food moralizing", () => {
  const content = JSON.stringify(decodeLabelQuestions);
  assert.match(
    content,
    /context instead of judgment|does not divide foods|better starting point/iu,
  );
  assert.doesNotMatch(content, /forbidden food|cheat meal|guilt|clean eating/iu);
  assert.match(experienceSource, /for learning, not for judging yourself or your food choices/);
  assert.doesNotMatch(experienceSource, /localStorage|sessionStorage|fetch\(|supabase|analytics/);
});

test("the page is accessible, responsive, and uses a fictional code-rendered label", async () => {
  assert.match(routeSource, /DecodeTheLabelExperience/);
  assert.match(experienceSource, /aria-live="polite"/);
  assert.match(experienceSource, /aria-pressed/);
  assert.match(experienceSource, /ProgressBar/);
  assert.match(labelSource, /Fictional label for educational practice/);
  assert.match(stylesSource, /@media \(max-width: 40rem\)/);
  assert.match(stylesSource, /prefers-reduced-motion: reduce/);
  await access(new URL("../public/decode-the-label/pantry-label-editorial.png", import.meta.url));
});

test("Resources places Decode the Label beside Myth Check", () => {
  assert.match(resourcesSource, /href="\/myth-check"/);
  assert.match(resourcesSource, /href="\/decode-the-label"/);
  assert.match(resourcesSource, /<strong>Decode the Label<\/strong>/);
});
