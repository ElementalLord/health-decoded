import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ResourcesList } from "@/features/resources/components/resources";
import { listReviewedResources } from "@/features/resources/services/resources.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function ResourcesPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");
  const resources = listReviewedResources();
  return (
    <section className="mx-auto max-w-4xl space-y-8 py-6 sm:py-10">
      <PageHeader
        title="Learning resources"
        description="Trusted external information to explore at your own pace."
      />
      <ResourcesList resources={resources} />
    </section>
  );
}
