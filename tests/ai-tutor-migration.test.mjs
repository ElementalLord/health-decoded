import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [
  config,
  shell,
  drawer,
  dialog,
  trigger,
  journey,
  searchSources,
  suggestedSearch,
  searchExperience,
  searchCommand,
  chat,
  apiRoute,
] = await Promise.all([
  read("next.config.ts"),
  read("components/layout/app-shell.tsx"),
  read("features/ai/components/ai-tutor-drawer.tsx"),
  read("features/ai/components/ai-tutor-dialog.ts"),
  read("features/ai/components/ai-tutor-trigger.tsx"),
  read("app/(app)/journey/page.tsx"),
  read("features/universal-search/content/search-sources.ts"),
  read("features/universal-search/content/suggested-search-documents.ts"),
  read("features/universal-search/components/search-experience.tsx"),
  read("features/universal-search/components/search-command.tsx"),
  read("features/ai/components/ai-chat.tsx"),
  read("app/api/ai/chat/route.ts"),
]);

test("the legacy page is gone and its URL permanently hands off to the global tutor", async () => {
  await assert.rejects(access(new URL("../app/(app)/ai/page.tsx", import.meta.url)));
  assert.match(config, /source: "\/ai", destination: "\/journey\?ask=1", permanent: true/);
  assert.match(drawer, /searchParams\.get\("ask"\) !== "1"/);
  assert.match(drawer, /nextSearchParams\.delete\("ask"\)/);
  assert.match(drawer, /router\.replace\(/);
  assert.match(drawer, /scroll: false/);
});

test("one persistent AiChat host serves every detached trigger", () => {
  assert.equal((shell.match(/<AiTutorDrawer/g) ?? []).length, 1);
  assert.equal((drawer.match(/<AiChat/g) ?? []).length, 1);
  assert.match(drawer, /<Dialog\.Root[\s\S]*handle=\{aiTutorDialog\}/);
  assert.match(dialog, /function openAiTutor\(\)/);
  assert.match(trigger, /function AiTutorTrigger/);
  assert.match(trigger, /handle=\{aiTutorDialog\}/);
});

test("Journey keeps server rendering and opens the shared tutor in place", () => {
  assert.doesNotMatch(journey, /^"use client"/);
  assert.match(journey, /<AiTutorActionRow[\s\S]*title="Ask your AI guide"/);
  assert.doesNotMatch(journey, /href="\/ai"/);
});

test("search models AI Tutor as a tool action for results and suggestions", () => {
  for (const source of [searchSources, suggestedSearch]) {
    assert.match(source, /id: "TOOL-AI-TUTOR"/);
    assert.match(source, /type: "tool"/);
    assert.match(source, /action: "open-ai-tutor"/);
    assert.doesNotMatch(source, /NAV-AI|route: "\/ai"/);
  }
});

test("search click, no-results, and keyboard Enter share the action path", () => {
  assert.match(searchExperience, /result\.action === "open-ai-tutor"/);
  assert.match(searchExperience, /onClick=\{activateAiTutor\}/);
  assert.match(searchExperience, /event\.key === "Enter"/);
  assert.match(searchExperience, /openResult\(displayed\[selectedIndex\]\)/);
  assert.doesNotMatch(searchExperience, /href="\/ai"/);
});

test("command search closes before opening the Tutor, avoiding stacked modal traps", () => {
  assert.match(
    searchCommand,
    /function openAiTutorFromSearch\(\) \{\s*setOpen\(false\);\s*window\.requestAnimationFrame\(\(\) => openAiTutor\(\)\);/,
  );
  assert.match(searchCommand, /onOpenAiTutor=\{openAiTutorFromSearch\}/);
});

test("auth recovery returns to the current location and preserves reopen intent", () => {
  assert.match(chat, /new URLSearchParams\(searchParams\.toString\(\)\)/);
  assert.match(chat, /nextSearchParams\.set\("ask", "1"\)/);
  assert.match(chat, /encodeURIComponent\(returnPath\)/);
  assert.doesNotMatch(chat, /next=\/ai/);
});

test("the AI API remains the chat transport", () => {
  assert.match(chat, /fetch\("\/api\/ai\/chat"/);
  assert.match(apiRoute, /createAiChatStream/);
  assert.match(apiRoute, /export async function POST/);
});
