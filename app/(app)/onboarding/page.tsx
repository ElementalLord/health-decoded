import { redirect } from "next/navigation";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Welcome" };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode: requestedMode } = await searchParams;
  const profile = await getCurrentProfile();
  if (!profile.ok) {
    return (
      <EmptyState
        action={
          <Link className={buttonVariants({ fullWidth: false })} href="/onboarding">
            Try again
          </Link>
        }
        description="We could not load your account setup right now. Please refresh and try again."
        headingLevel="h1"
        title="Setup is temporarily unavailable"
      />
    );
  }
  const mode =
    profile.data.onboarding_completed_at && requestedMode === "preview" ? "preview" : "first-use";
  if (profile.data.onboarding_completed_at && mode !== "preview") redirect("/journey");

  return (
    <section>
      <OnboardingFlow mode={mode} />
    </section>
  );
}
