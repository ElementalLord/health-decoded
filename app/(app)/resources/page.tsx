import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
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
    <section className="mx-auto max-w-5xl space-y-12 py-6 sm:py-10">
      <PageHeader
        description="Trusted external information to explore at your own pace."
        eyebrow="Learn more"
        title="A library for the questions that linger"
      />
      <ResourcesList resources={resources} />
    </section>
  );
}
