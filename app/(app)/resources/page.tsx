import { redirect } from "next/navigation";

import { ResourcesList } from "@/features/resources/components/resources";
import { listReviewedResources } from "@/features/resources/services/resources.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export const metadata = { title: "Resources" };

export default async function ResourcesPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const resources = listReviewedResources();

  return (
    <section className="mx-auto max-w-6xl py-6 sm:py-10">
      <ResourcesList resources={resources} />
    </section>
  );
}
