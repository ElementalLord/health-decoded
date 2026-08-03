import type { UniversalSearchDocument } from "@/features/universal-search/types/universal-search";

export const suggestedSearchDocuments = [
  ["NAV-JOURNEY", "navigation", "Journey", "Continue your Health Decoded learning path.", "/journey"],
  ["NAV-PROGRESS", "navigation", "Learning Record", "Review completed lessons and confidence check-ins.", "/progress"],
  ["NAV-AI", "navigation", "AI Tutor", "Ask general questions about diabetes education.", "/ai"],
  ["NAV-RESOURCES", "navigation", "Resources", "Browse reviewed diabetes education and support resources.", "/resources"],
  ["TOOL-APPOINTMENT-PREP", "tool", "Appointment Preparation", "Organize questions and items for a future appointment.", "/appointment-prep"],
  ["TOOL-GLOSSARY", "tool", "Medical Glossary", "Find plain-language definitions for diabetes terms.", "/glossary"],
  ["TOOL-MYTH-CHECK", "tool", "Diabetes Myth Check", "Practice checking common diabetes claims.", "/myth-check"],
  ["TOOL-MILESTONES", "tool", "Milestones", "View meaningful learning and preparation steps.", "/milestones"],
] as const satisfies readonly (readonly [string, UniversalSearchDocument["type"], string, string, string])[];

export const suggestedDestinations: readonly UniversalSearchDocument[] = suggestedSearchDocuments.map(
  ([id, type, title, description, route]) => ({
    id,
    type,
    title,
    description,
    route,
    status: "available",
  }),
);
