import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  caregiverCoreApplicationByModule,
  caregiverModuleIds,
  caregiverModuleInteractionIds,
  caregiverModuleQuestionIds,
  caregiverModuleReflectionIds,
  caregiverModuleSectionIds,
} from "../features/caregiver/content/caregiver-ids.ts";
import {
  caregiverFoundationManifest,
  getCaregiverSourceTrace,
} from "../features/caregiver/content/caregiver-source-map.ts";
import {
  caregiverContentContractSchema,
  caregiverDeterministicTextSchema,
} from "../features/caregiver/schemas/caregiver-content-contract.schema.ts";
import { caregiverArticleSchema } from "../features/caregiver/schemas/caregiver-content.schema.ts";

const titles = [
  "What They May Be Feeling",
  "Support Without Taking Over",
  "Everyday Support That Actually Helps",
  "When Something Feels Wrong",
  "The Caregiver Matters Too",
];

const slugs = [
  "what-they-may-be-feeling",
  "support-without-taking-over",
  "everyday-support-that-actually-helps",
  "when-something-feels-wrong",
  "the-caregiver-matters-too",
];

function sourcedText(value, contentId) {
  return {
    value,
    source: {
      ...getCaregiverSourceTrace(contentId),
      contentId,
    },
    runtimeGenerated: false,
  };
}

const foundationContract = {
  publicSectionName: caregiverFoundationManifest.publicSectionName,
  centralPromise: caregiverFoundationManifest.centralPromise,
  renderingMode: caregiverFoundationManifest.renderingMode,
  runtimeGeneration: caregiverFoundationManifest.runtimeGeneration,
  authoritativeDocuments: caregiverFoundationManifest.authoritativeDocuments,
  modules: caregiverModuleIds.map((id, index) => ({
    id,
    slug: slugs[index],
    title: sourcedText(titles[index], id),
    sectionIds: caregiverModuleSectionIds.filter((sectionId) => sectionId.startsWith(`${id}-`)),
    interactionIds: caregiverModuleInteractionIds.filter((interactionId) =>
      interactionId.startsWith(`${id}-`),
    ),
    coreApplicationId: caregiverCoreApplicationByModule[id],
    questionIds: caregiverModuleQuestionIds.filter((questionId) => questionId.startsWith(`${id}-`)),
    reflectionId: caregiverModuleReflectionIds[index],
    renderingMode: "deterministic",
    runtimeGeneration: false,
  })),
};

test("the deterministic foundation contract accepts the approved architecture", () => {
  const result = caregiverContentContractSchema.safeParse(foundationContract);
  assert.equal(result.success, true, result.success ? "" : JSON.stringify(result.error.issues));
});

test("the content contract rejects runtime generation, HTML, and cross-module IDs", () => {
  assert.equal(
    caregiverContentContractSchema.safeParse({
      ...foundationContract,
      runtimeGeneration: true,
    }).success,
    false,
  );

  assert.equal(
    caregiverDeterministicTextSchema.safeParse({
      ...sourcedText("<strong>Rewritten at runtime</strong>", "CG-M1"),
    }).success,
    false,
  );

  const crossModule = structuredClone(foundationContract);
  crossModule.modules[0].coreApplicationId = "CG-M2-I03";
  assert.equal(caregiverContentContractSchema.safeParse(crossModule).success, false);
});

test("the legacy caregiver article schema remains compatible", () => {
  const article = {
    id: "6ecb69a9-8f92-4c1a-a380-9221ad34a626",
    slug: "support-basics",
    title: "Support basics",
    conversation_prompt: null,
    support_tip: null,
    what_not_to_say: null,
    content_blocks: [{ type: "text", body: "Existing legacy content remains readable." }],
  };

  assert.equal(caregiverArticleSchema.safeParse(article).success, true);
});

test("foundation primitives expose semantic, focus, announcement, and motion-safe contracts", () => {
  const shell = readFileSync(
    "features/caregiver/components/foundation/caregiver-shell.tsx",
    "utf8",
  );
  const feedback = readFileSync(
    "features/caregiver/components/foundation/caregiver-feedback.tsx",
    "utf8",
  );
  const safety = readFileSync(
    "features/caregiver/components/foundation/caregiver-safety-interruption.tsx",
    "utf8",
  );
  const styles = readFileSync("features/caregiver/styles/caregiver-foundation.module.css", "utf8");

  assert.match(shell, /<section[\s\S]*aria-labelledby/);
  assert.match(shell, /<nav[\s\S]*aria-label="Support Someone"/);
  assert.match(shell, /Skip to caregiver content/);
  assert.match(feedback, /aria-live=\{isAssertive \? "assertive" : "polite"\}/);
  assert.match(feedback, /aria-atomic="true"/);
  assert.match(safety, /headingRef\.current\?\.focus\(\)/);
  assert.match(safety, /role="alert"/);
  assert.match(safety, /Region:/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /@media \(max-width: 20rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /overflow-wrap: anywhere/);
});
