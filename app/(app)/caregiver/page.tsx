import { redirect } from "next/navigation";

import { CaregiverLanding } from "@/features/caregiver/components/landing/caregiver-landing";
import { unavailableCaregiverRegionFixture } from "@/features/caregiver/regional/caregiver-region-fixtures";
import { resolveCaregiverRegionalPresentation } from "@/features/caregiver/regional/caregiver-region-provider";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function CaregiverPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const region = resolveCaregiverRegionalPresentation(unavailableCaregiverRegionFixture);

  return <CaregiverLanding region={region} />;
}
