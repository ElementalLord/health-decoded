import { caregiverModule1 } from "./caregiver-module-1";
import { caregiverModule2 } from "./caregiver-module-2";
import { caregiverModule3 } from "./caregiver-module-3";
import { caregiverModule4 } from "./caregiver-module-4";
import { caregiverModule5 } from "./caregiver-module-5";

export const caregiverModuleRegistry = Object.freeze({
  [caregiverModule1.slug]: {
    id: caregiverModule1.id,
    slug: caregiverModule1.slug,
    route: `/caregiver/modules/${caregiverModule1.slug}`,
    content: caregiverModule1,
  },
  [caregiverModule2.slug]: {
    id: caregiverModule2.id,
    slug: caregiverModule2.slug,
    route: `/caregiver/modules/${caregiverModule2.slug}`,
    content: caregiverModule2,
  },
  [caregiverModule3.slug]: {
    id: caregiverModule3.id,
    slug: caregiverModule3.slug,
    route: `/caregiver/modules/${caregiverModule3.slug}`,
    content: caregiverModule3,
  },
  [caregiverModule4.slug]: {
    id: caregiverModule4.id,
    slug: caregiverModule4.slug,
    route: `/caregiver/modules/${caregiverModule4.slug}`,
    content: caregiverModule4,
  },
  [caregiverModule5.slug]: {
    id: caregiverModule5.id,
    slug: caregiverModule5.slug,
    route: `/caregiver/modules/${caregiverModule5.slug}`,
    content: caregiverModule5,
  },
} as const);

export type ImplementedCaregiverModuleSlug = keyof typeof caregiverModuleRegistry;

export function getImplementedCaregiverModule(slug: string) {
  if (!(slug in caregiverModuleRegistry)) return null;
  return caregiverModuleRegistry[slug as ImplementedCaregiverModuleSlug];
}

export function getImplementedCaregiverModuleById(
  id: "CG-M1" | "CG-M2" | "CG-M3" | "CG-M4" | "CG-M5",
) {
  return Object.values(caregiverModuleRegistry).find((entry) => entry.id === id) ?? null;
}
