import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function OnboardingPage() {
  const profile = await getCurrentProfile();
  if (profile.ok && profile.data.onboarding_completed_at) redirect("/account");
  return <section className="py-8 sm:py-12"><OnboardingFlow /></section>;
}
