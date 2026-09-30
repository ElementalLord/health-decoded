import { redirect } from "next/navigation";

import { CaregiverLanding } from "@/features/caregiver/components/landing/caregiver-landing";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function CaregiverPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  return <CaregiverLanding />;
}
