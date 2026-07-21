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
    <section className="mx-auto max-w-6xl space-y-8 py-6 sm:space-y-10 sm:py-10">
      <PageHeader
        description="Clear answers for the moments between appointments. Every guide is reviewed, practical, and published by the CDC or NIH."
        eyebrow="18 trusted guides"
        title="Keep learning, one question at a time"
      />
      <ResourcesList resources={resources} />
    </section>
  );
}
