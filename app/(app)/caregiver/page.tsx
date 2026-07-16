import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { SteadyingHandIllustration } from "@/components/illustrations/editorial-illustrations";
import { CaregiverArticleList } from "@/features/caregiver/components/caregiver-article-list";
import { CaregiverEmptyState } from "@/features/caregiver/components/caregiver-empty-state";
import { CaregiverUnavailableState } from "@/features/caregiver/components/caregiver-unavailable-state";
import { listPublishedCaregiverContent } from "@/features/caregiver/services/caregiver.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function CaregiverPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const articles = await listPublishedCaregiverContent();

  if (!articles.ok) return <CaregiverUnavailableState />;

  return (
    <section className="mx-auto max-w-5xl space-y-12 py-6 sm:py-10">
      <div className="grid gap-8 border-b border-border pb-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <PageHeader
          description="Practical, compassionate guidance for people supporting someone with Type 2 diabetes."
          eyebrow="Caregiver companion"
          title="A steady hand, without taking over"
        />
        <SteadyingHandIllustration className="mx-auto max-w-sm" />
      </div>
      {articles.data.length ? (
        <CaregiverArticleList articles={articles.data} />
      ) : (
        <CaregiverEmptyState />
      )}
    </section>
  );
}
