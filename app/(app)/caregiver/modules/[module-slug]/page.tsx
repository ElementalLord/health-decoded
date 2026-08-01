import { notFound, redirect } from "next/navigation";

import { Module2Experience } from "@/features/caregiver/components/modules/module-2/module-2-experience";
import { getImplementedCaregiverModule } from "@/features/caregiver/content/caregiver-module-registry";
import { CaregiverSessionProvider } from "@/features/caregiver/state/caregiver-session-provider";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export const metadata = {
  title: "Support Without Taking Over",
  description:
    "Practice permission, privacy, accepting no, and repair while offering specific support.",
};

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

  return (
    <CaregiverSessionProvider>
      <Module2Experience />
    </CaregiverSessionProvider>
  );
}
