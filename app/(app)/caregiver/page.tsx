import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { CaregiverArticleList } from "@/features/caregiver/components/caregiver-article-list";
import { CaregiverEmptyState } from "@/features/caregiver/components/caregiver-empty-state";
import { CaregiverUnavailableState } from "@/features/caregiver/components/caregiver-unavailable-state";
import { listPublishedCaregiverContent } from "@/features/caregiver/services/caregiver.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function CaregiverPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) return <CaregiverUnavailableState />;
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const articles = await listPublishedCaregiverContent();
  if (!articles.ok) return <CaregiverUnavailableState />;

  return (
    <section className="mx-auto max-w-4xl space-y-8 py-6 sm:py-10">
      <PageHeader
        description="You don’t need to have all the answers. Small acts of support often matter the most."
        eyebrow="Caregiver companion"
        title="Supporting someone with Type 2 diabetes"
      />
      {articles.data.length ? (
        <CaregiverArticleList articles={articles.data} />
      ) : (
        <CaregiverEmptyState />
      )}
    </section>
  );
}
