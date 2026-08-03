import {
  universalSearchResultTypes,
  type UniversalSearchDocument,
} from "@/features/universal-search/types/universal-search";

const allowedRoute = /^\/(?:ai|appointment-prep|caregiver(?:\/modules\/[a-z0-9-]+)?|glossary|journey|lessons\/[1-9][0-9]*|milestones|myth-check|profile|progress|resources|settings|stories(?:\/[a-z0-9-]+)?)$/;

export function validateSearchDocuments(documents: readonly UniversalSearchDocument[]) {
  const ids = new Set<string>();
  return documents.every((document) => {
    if (ids.has(document.id)) return false;
    ids.add(document.id);
    return (
      universalSearchResultTypes.includes(document.type) &&
      Boolean(document.title.trim()) &&
      Boolean(document.description.trim()) &&
      allowedRoute.test(document.route) &&
      ["available", "hidden", "draft", "archived"].includes(document.status)
    );
  });
}
