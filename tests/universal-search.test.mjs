import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { adaptLessonSearchDocuments } from "../features/universal-search/adapters/lesson-search-adapter.ts";
import { suggestedDestinations } from "../features/universal-search/content/suggested-search-documents.ts";
import { searchHealthDecoded } from "../features/universal-search/lib/search-health-decoded.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const lessonRows = [
  {
    day_number: 3,
    status: "published",
    lessons: {
      id: "lesson-a1c",
      title: "Understanding Your Numbers",
      subtitle: "What your A1C and blood glucose numbers mean",
      primary_topic: "A1C, blood glucose, and diagnostic tests",
      learning_objective: "Explain what blood glucose and A1C measure.",
      status: "published",
    },
  },
  {
    day_number: 99,
    status: "draft",
    lessons: {
      id: "hidden-lesson",
      title: "Internal Draft Lesson",
      subtitle: null,
      primary_topic: "Internal",
      learning_objective: "Not available.",
      status: "draft",
    },
  },
];
const lessons = adaptLessonSearchDocuments(lessonRows);
const sourceFixtures = [
  { id: "NAV-PROFILE", type: "navigation", title: "Profile", description: "Open profile.", route: "/profile", aliases: ["account"], status: "available" },
  { id: "NAV-CAREGIVER", type: "navigation", title: "Caregiver", description: "Support someone.", route: "/caregiver", aliases: ["family help"], status: "available" },
  { id: "NAV-JOURNEY", type: "navigation", title: "Journey", description: "Continue learning.", route: "/journey", aliases: ["learning journey"], status: "available" },
  { id: "TOOL-MILESTONES", type: "tool", title: "Milestones", description: "View milestones.", route: "/milestones", aliases: ["badge"], status: "available" },
  { id: "TOOL-LEARNING-STREAK", type: "tool", title: "Learning Streak", description: "View streak freezes.", route: "/journey", aliases: ["streak", "streak freeze"], status: "available" },
  { id: "TOOL-APPOINTMENT-PREP", type: "tool", title: "Appointment Preparation", description: "Prepare questions.", route: "/appointment-prep", aliases: ["appointment"], status: "available" },
  { id: "TOOL-MYTH-CHECK", type: "tool", title: "Diabetes Myth Check", description: "Check claims.", route: "/myth-check", aliases: ["myths"], status: "available" },
  { id: "GLOSSARY-A1C", type: "glossary", title: "A1C", description: "An estimate of average glucose exposure.", route: "/glossary", status: "available" },
  { id: "GLOSSARY-CONTINUOUS-GLUCOSE-MONITOR", type: "glossary", title: "Continuous glucose monitor", description: "A glucose monitoring device.", route: "/glossary", aliases: ["CGM"], status: "available" },
  { id: "ARCHIVED-RESOURCE", type: "resource", title: "Archived guide", description: "Unavailable.", route: "/resources", status: "archived" },
];
const documents = [...sourceFixtures, ...lessons];

test("search documents have unique stable IDs, valid types, and valid routes", () => {
  assert.equal(new Set(documents.map(({ id }) => id)).size, documents.length);
  assert.ok(documents.every(({ route }) => route.startsWith("/")));
  assert.ok(documents.every(({ type }) => ["navigation", "lesson", "glossary", "story", "resource", "caregiver", "tool"].includes(type)));
});

test("hidden, draft, archived, and unimplemented content is excluded", () => {
  assert.equal(lessons.some(({ id }) => id.includes("hidden-lesson")), false);
  assert.ok(documents.filter(({ status }) => status !== "available").every((document) =>
    !searchHealthDecoded(documents, document.title).some(({ id }) => id === document.id),
  ));
});

test("navigation titles and controlled aliases rank predictably", () => {
  assert.equal(searchHealthDecoded(documents, "profile")[0]?.id, "NAV-PROFILE");
  assert.equal(searchHealthDecoded(documents, "family help")[0]?.id, "NAV-CAREGIVER");
  assert.equal(searchHealthDecoded(documents, "learning journey")[0]?.id, "NAV-JOURNEY");
});

test("exact glossary terms rank above related lessons", () => {
  const results = searchHealthDecoded(documents, "A1C");
  assert.equal(results[0]?.type, "glossary");
  assert.ok(results.some(({ type }) => type === "lesson"));
});

test("lesson title and vocabulary search navigate to the exact lesson", () => {
  assert.equal(searchHealthDecoded(documents, "Understanding Your Numbers")[0]?.route, "/lessons/3");
  assert.ok(searchHealthDecoded(documents, "diagnostic tests").some(({ route }) => route === "/lessons/3"));
});

test("abbreviations and tool aliases find approved destinations", () => {
  assert.equal(searchHealthDecoded(documents, "CGM")[0]?.type, "glossary");
  for (const [query, id] of [
    ["badge", "TOOL-MILESTONES"],
    ["streak", "TOOL-LEARNING-STREAK"],
    ["appointment", "TOOL-APPOINTMENT-PREP"],
    ["myths", "TOOL-MYTH-CHECK"],
  ]) {
    assert.equal(searchHealthDecoded(documents, query)[0]?.id, id);
  }
});

test("empty search uses controlled suggested destinations", () => {
  assert.equal(searchHealthDecoded(documents, "   ").length, 0);
  assert.equal(suggestedDestinations.length, 8);
  assert.deepEqual(suggestedDestinations.map(({ id }) => id), [
    "NAV-JOURNEY",
    "NAV-PROGRESS",
    "NAV-AI",
    "NAV-RESOURCES",
    "TOOL-APPOINTMENT-PREP",
    "TOOL-GLOSSARY",
    "TOOL-MYTH-CHECK",
    "TOOL-MILESTONES",
  ]);
});

test("search UI clears, shows no-results, and opens AI without transmitting a query", async () => {
  const experience = await read("features/universal-search/components/search-experience.tsx");
  assert.match(experience, /aria-label="Clear search"/);
  assert.match(experience, /setQuery\(""\)/);
  assert.match(experience, /We couldn’t find that in Health Decoded/);
  assert.match(experience, /href="\/ai"/);
  assert.doesNotMatch(experience, /\/ai\?|searchParams|URLSearchParams/);
});

test("queries remain in memory and are sent only in a no-store POST body", async () => {
  const [experience, api] = await Promise.all([
    read("features/universal-search/components/search-experience.tsx"),
    read("app/api/search/route.ts"),
  ]);
  assert.match(experience, /method: "POST"/);
  assert.match(experience, /body: JSON\.stringify\(\{ query \}\)/);
  assert.doesNotMatch(experience, /localStorage|sessionStorage|indexedDB|document\.cookie/);
  assert.doesNotMatch(api, /logger|console\.|searchParams/);
  assert.match(api, /Cache-Control.*no-store/);
});

test("private user content is not part of the controlled index", () => {
  const serialized = JSON.stringify(documents).toLowerCase();
  for (const forbidden of [
    "appointment question text",
    "caregiver reflection",
    "ai conversation",
    "glucose reading history",
    "freeze usage history",
    "profile contents",
  ]) assert.equal(serialized.includes(forbidden), false);
});

test("command supports shortcut, Escape, Enter, focus restoration, and trapping", async () => {
  const [command, experience] = await Promise.all([
    read("features/universal-search/components/search-command.tsx"),
    read("features/universal-search/components/search-experience.tsx"),
  ]);
  assert.match(command, /event\.metaKey \|\| event\.ctrlKey/);
  assert.match(command, /event\.key === "Escape"/);
  assert.match(command, /previouslyFocused\?\.focus/);
  assert.match(command, /event\.key === "Tab"/);
  assert.match(experience, /event\.key === "Enter"/);
  assert.match(experience, /event\.key === "ArrowDown"/);
});

test("Search is visible in the header but absent from permanent navigation", async () => {
  const [header, routes, bottomNavigation] = await Promise.all([
    read("components/layout/app-header.tsx"),
    read("lib/routes.ts"),
    read("components/layout/bottom-navigation.tsx"),
  ]);
  assert.match(header, /SearchCommand/);
  assert.doesNotMatch(routes, /href: "\/search"/);
  assert.doesNotMatch(bottomNavigation, /SearchCommand|href="\/search"/);
});

test("controlled sources cover every requested result type", async () => {
  const source = await read("features/universal-search/content/search-sources.ts");
  for (const type of ["navigation", "glossary", "story", "resource", "caregiver", "tool"])
    assert.match(source, new RegExp(`type: ["']${type}["']`));
  assert.equal(lessons[0]?.type, "lesson");
  assert.match(source, /navigationSearchDocuments/);
  assert.match(source, /toolSearchDocuments/);
});
