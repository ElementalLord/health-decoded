import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { Module2Experience } from "@/features/caregiver/components/modules/module-2/module-2-experience";
import { Module1Experience } from "@/features/caregiver/components/modules/module-1/module-1-experience";
import { Module3Experience } from "@/features/caregiver/components/modules/module-3/module-3-experience";
import { Module4Experience } from "@/features/caregiver/components/modules/module-4/module-4-experience";
import { Module5Experience } from "@/features/caregiver/components/modules/module-5/module-5-experience";
import { getImplementedCaregiverModule } from "@/features/caregiver/content/caregiver-module-registry";
import { CaregiverSessionProvider } from "@/features/caregiver/state/caregiver-session-provider";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

const experienceByModule = {
  "CG-M1": Module1Experience,
  "CG-M2": Module2Experience,
  "CG-M3": Module3Experience,
  "CG-M4": Module4Experience,
  "CG-M5": Module5Experience,
} as const;

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ "module-slug": string }>;
}): Promise<Metadata> {
  const { "module-slug": moduleSlug } = await params;
  const moduleEntry = getImplementedCaregiverModule(moduleSlug);

  if (!moduleEntry) return {};

  return {
    title: moduleEntry.content.sections.opening.title,
    description: moduleEntry.content.metadata.purpose,
  };
}

export default async function CaregiverModulePage({
  params,
}: {
  readonly params: Promise<{ "module-slug": string }>;
}) {
  const { "module-slug": moduleSlug } = await params;
  const moduleEntry = getImplementedCaregiverModule(moduleSlug);
  if (!moduleEntry) notFound();

  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const Experience = experienceByModule[moduleEntry.id];
  const sessionConfiguration =
    moduleEntry.id === "CG-M1"
      ? {
          centralSectionId: "CG-M1-S03",
          takeawaySectionId: "CG-M1-S07",
          reflectionId: "CG-M1-R01" as const,
        }
      : moduleEntry.id === "CG-M3"
        ? {
            centralSectionId: "CG-M3-S04",
            takeawaySectionId: "CG-M3-S07",
            reflectionId: "CG-M3-R01" as const,
          }
        : moduleEntry.id === "CG-M4"
          ? {
              centralSectionId: "CG-M4-S04",
              takeawaySectionId: "CG-M4-S08",
              reflectionId: "CG-M4-R01" as const,
            }
          : moduleEntry.id === "CG-M5"
            ? {
                centralSectionId: "CG-M5-S03",
                takeawaySectionId: "CG-M5-S07",
                reflectionId: "CG-M5-R01" as const,
              }
            : {
                centralSectionId: "CG-M2-S03",
                takeawaySectionId: "CG-M2-S08",
                reflectionId: "CG-M2-R01" as const,
              };

  return (
    <CaregiverSessionProvider moduleId={moduleEntry.id} {...sessionConfiguration}>
      <Experience />
    </CaregiverSessionProvider>
  );
}
