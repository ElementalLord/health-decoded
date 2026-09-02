import type { UniversalSearchDocument } from "@/features/universal-search/types/universal-search";

export const suggestedSearchDocuments = [
  {
    id: "NAV-JOURNEY",
    type: "navigation",
    title: "Journey",
    description: "Continue your Health Decoded learning path.",
    route: "/journey",
    status: "available",
  },
  {
    id: "NAV-PROGRESS",
    type: "navigation",
    title: "Learning Record",
    description: "Review completed lessons and milestones.",
    route: "/progress",
    status: "available",
  },
  {
    id: "TOOL-AI-TUTOR",
    type: "tool",
    title: "AI Tutor",
    description: "Ask general questions about diabetes education.",
    action: "open-ai-tutor",
    status: "available",
  },
  {
    id: "NAV-RESOURCES",
    type: "navigation",
    title: "Resources",
    description: "Browse reviewed diabetes education and support resources.",
    route: "/resources",
    status: "available",
  },
  {
    id: "TOOL-APPOINTMENT-PREP",
    type: "tool",
    title: "Appointment Preparation",
    description: "Organize questions and items for a future appointment.",
    route: "/appointment-prep",
    status: "available",
  },
  {
    id: "TOOL-GLOSSARY",
    type: "tool",
    title: "Medical Glossary",
    description: "Find plain-language definitions for diabetes terms.",
    route: "/glossary",
    status: "available",
  },
  {
    id: "TOOL-MYTH-CHECK",
    type: "tool",
    title: "Diabetes Myth Check",
    description: "Practice checking common diabetes claims.",
    route: "/myth-check",
    status: "available",
  },
  {
    id: "TOOL-MILESTONES",
    type: "tool",
    title: "Milestones",
    description: "View meaningful learning and preparation steps.",
    route: "/milestones",
    status: "available",
  },
] as const satisfies readonly UniversalSearchDocument[];

export const suggestedDestinations: readonly UniversalSearchDocument[] = suggestedSearchDocuments;
