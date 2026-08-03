import { type2DiabetesResources } from "@/content/resources/type-2-diabetes-resources";
import { caregiverModuleRegistry } from "@/features/caregiver/content/caregiver-module-registry";
import { medicalGlossary } from "@/features/glossary/content/medical-glossary";
import { ashaRiceOnTheTableStory } from "@/features/stories/content/asha-rice-on-the-table";
import { devonNumberScreenStory } from "@/features/stories/content/devon-number-screen";
import { marcusParkingLotStory } from "@/features/stories/content/marcus-parking-lot";
import { noraPrescriptionBagStory } from "@/features/stories/content/nora-prescription-bag";
import type { UniversalSearchDocument } from "@/features/universal-search/types/universal-search";

export const navigationSearchDocuments = [
  {
    id: "NAV-JOURNEY",
    type: "navigation",
    title: "Journey",
    description: "Continue your Health Decoded learning path.",
    route: "/journey",
    aliases: ["learning journey", "dashboard", "home"],
    keywords: ["lessons", "progress", "today"],
    priority: 1,
    status: "available",
  },
  {
    id: "NAV-PROGRESS",
    type: "navigation",
    title: "Learning Record",
    description: "Review completed lessons and confidence check-ins.",
    route: "/progress",
    aliases: ["progress", "learning history"],
    keywords: ["completed lessons", "confidence"],
    priority: 2,
    status: "available",
  },
  {
    id: "NAV-STORIES",
    type: "navigation",
    title: "Stories",
    description: "Explore illustrative experiences about life with Type 2 diabetes.",
    route: "/stories",
    aliases: ["patient stories", "life stories"],
    keywords: ["experiences", "illustrative"],
    priority: 3,
    status: "available",
  },
  {
    id: "NAV-RESOURCES",
    type: "navigation",
    title: "Resources",
    description: "Browse reviewed diabetes education and support resources.",
    route: "/resources",
    aliases: ["support program", "trusted support", "education resources"],
    keywords: ["verified", "guides", "support"],
    priority: 3,
    status: "available",
  },
  {
    id: "NAV-AI",
    type: "navigation",
    title: "AI Tutor",
    description: "Ask general questions about diabetes education.",
    route: "/ai",
    aliases: ["ask ai", "health decoded ai", "ai guide"],
    keywords: ["questions", "tutor", "chat"],
    priority: 2,
    status: "available",
  },
  {
    id: "NAV-CAREGIVER",
    type: "navigation",
    title: "Caregiver",
    description: "Learn ways to support someone without taking over.",
    route: "/caregiver",
    aliases: ["supporter", "family help", "helping without taking over"],
    keywords: ["family support", "care partner"],
    priority: 3,
    status: "available",
  },
  {
    id: "NAV-PROFILE",
    type: "navigation",
    title: "Profile",
    description: "View your Health Decoded profile and account links.",
    route: "/profile",
    aliases: ["account", "my profile"],
    priority: 2,
    status: "available",
  },
  {
    id: "NAV-SETTINGS",
    type: "navigation",
    title: "Settings",
    description: "Manage reading, motion, language, and timezone preferences.",
    route: "/settings",
    aliases: ["preferences", "accessibility settings"],
    priority: 2,
    status: "available",
  },
] as const satisfies readonly UniversalSearchDocument[];

export const toolSearchDocuments = [
  {
    id: "TOOL-APPOINTMENT-PREP",
    type: "tool",
    title: "Appointment Preparation",
    description: "Organize questions, changes, clarifications, and items to bring.",
    route: "/appointment-prep",
    aliases: ["appointment", "doctor visit", "prepare for appointment", "questions for doctor"],
    keywords: ["documents to bring", "appointment questions", "future appointment"],
    priority: 1,
    status: "available",
  },
  {
    id: "TOOL-GLOSSARY",
    type: "tool",
    title: "Medical Glossary",
    description: "Find plain-language definitions for diabetes and healthcare terms.",
    route: "/glossary",
    aliases: ["glossary", "definition", "medical word", "terminology"],
    keywords: ["abbreviation", "meaning"],
    priority: 2,
    status: "available",
  },
  {
    id: "TOOL-MYTH-CHECK",
    type: "tool",
    title: "Diabetes Myth Check",
    description: "Practice separating common diabetes myths from evidence-backed information.",
    route: "/myth-check",
    aliases: ["myths", "myth check", "true or false", "myths about sugar"],
    keywords: ["facts", "claims", "evidence"],
    priority: 1,
    status: "available",
  },
  {
    id: "TOOL-MILESTONES",
    type: "tool",
    title: "Milestones",
    description: "View meaningful learning and preparation steps you have completed.",
    route: "/milestones",
    aliases: ["milestone", "achievement", "badge"],
    keywords: ["completed", "recognized"],
    priority: 1,
    status: "available",
  },
  {
    id: "TOOL-NEXT-STEP",
    type: "tool",
    title: "Your Next Step",
    description: "See a recommended next action based on your learning progress.",
    route: "/journey",
    aliases: ["next step", "recommendation", "what should i do next"],
    keywords: ["recommended action", "continue lesson"],
    priority: 1,
    status: "available",
  },
  {
    id: "TOOL-LEARNING-STREAK",
    type: "tool",
    title: "Learning Streak",
    description: "View your learning continuity and available streak freezes on Journey.",
    route: "/journey",
    aliases: ["streak", "streak freeze", "freezes"],
    keywords: ["learning days", "continuity"],
    priority: 1,
    status: "available",
  },
] as const satisfies readonly UniversalSearchDocument[];

export const glossarySearchDocuments: readonly UniversalSearchDocument[] = medicalGlossary.map(
  (entry) => ({
    id: entry.id,
    type: "glossary",
    title: entry.term,
    description: entry.definition,
    route: "/glossary",
    aliases: [
      ...(entry.abbreviation ? [entry.abbreviation] : []),
      ...(entry.aliases ?? []),
      ...(entry.misspellings ?? []),
    ],
    keywords: [entry.topic],
    sectionLabel: entry.topic,
    priority: 1,
    status: "available",
  }),
);

const stories = [
  marcusParkingLotStory,
  ashaRiceOnTheTableStory,
  noraPrescriptionBagStory,
  devonNumberScreenStory,
] as const;

export const storySearchDocuments: readonly UniversalSearchDocument[] = stories.map((story) => ({
  id: `STORY-${story.id.toUpperCase()}`,
  type: "story",
  title: story.title,
  description: story.introduction,
  route: `/stories/${story.slug}`,
  keywords: [story.topic, ...story.themes],
  sectionLabel: story.topic,
  priority: 3,
  status: "available",
}));

export const resourceSearchDocuments: readonly UniversalSearchDocument[] = type2DiabetesResources.map(
  (resource) => ({
    id: `RESOURCE-${resource.id.toUpperCase()}`,
    type: "resource",
    title: resource.title,
    description: resource.description,
    route: "/resources",
    aliases: [resource.organization],
    keywords: [resource.category, resource.format, resource.editorial_label],
    sectionLabel: resource.category,
    priority: 4,
    status: resource.status === "reviewed" ? "available" : "archived",
  }),
);

export const caregiverSearchDocuments: readonly UniversalSearchDocument[] = Object.values(
  caregiverModuleRegistry,
).map(({ content, id, route }) => ({
  id,
  type: "caregiver",
  title: content.sections.opening.title,
  description: content.metadata.purpose,
  route,
  aliases: ["caregiver", "family support", "what should i say"],
  keywords: Object.values(content.sections).flatMap((section) =>
    "title" in section && typeof section.title === "string" ? [section.title] : [],
  ),
  sectionLabel: "Caregiver module",
  priority: 3,
  status: "available",
}));

export const staticSearchDocuments = [
  ...navigationSearchDocuments,
  ...toolSearchDocuments,
  ...glossarySearchDocuments,
  ...storySearchDocuments,
  ...resourceSearchDocuments,
  ...caregiverSearchDocuments,
] as const;

export const suggestedSearchDocuments = [
  navigationSearchDocuments[0],
  navigationSearchDocuments[1],
  navigationSearchDocuments[4],
  navigationSearchDocuments[3],
  toolSearchDocuments[0],
  toolSearchDocuments[1],
  toolSearchDocuments[2],
  toolSearchDocuments[3],
] as const;
