import { caregiverModule2 } from "./caregiver-module-2";

export const caregiverModuleRegistry = Object.freeze({
  [caregiverModule2.slug]: {
    id: caregiverModule2.id,
    slug: caregiverModule2.slug,
    route: `/caregiver/modules/${caregiverModule2.slug}`,
    content: caregiverModule2,
  },
} as const);

export type ImplementedCaregiverModuleSlug = keyof typeof caregiverModuleRegistry;

export function getImplementedCaregiverModule(slug: string) {
  if (slug !== caregiverModule2.slug) return null;
  return caregiverModuleRegistry[slug];
}
