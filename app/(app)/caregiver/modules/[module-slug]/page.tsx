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
import { getCaregiverMilestoneGates } from "@/features/achievements/services/caregiver-milestone-progress.server";

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

  const [profile, milestoneGates] = await Promise.all([
    getCurrentProfile(),
    getCaregiverMilestoneGates(moduleEntry.id),
  ]);
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const Experience = experienceByModule[moduleEntry.id];
  return (
    <CaregiverSessionProvider
      moduleId={moduleEntry.id}
      {...(milestoneGates.ok ? { initialMilestoneProgress: milestoneGates.data } : {})}
    >
      <Experience />
    </CaregiverSessionProvider>
  );
}
