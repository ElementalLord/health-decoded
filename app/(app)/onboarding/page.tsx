import { redirect } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function OnboardingPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) {
    return (
      <EmptyState
        description="We could not load your account setup right now. Please refresh and try again."
        headingLevel="h1"
        title="Setup is temporarily unavailable"
      />
    );
  }
  if (profile.data.onboarding_completed_at) redirect("/journey");

  return (
    <section className="py-8 sm:py-12">
      <OnboardingFlow />
    </section>
  );
}
