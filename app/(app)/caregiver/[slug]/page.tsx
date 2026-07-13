import { notFound, redirect } from "next/navigation";

import { CaregiverArticle } from "@/features/caregiver/components/caregiver-article";
import { CaregiverUnavailableState } from "@/features/caregiver/components/caregiver-unavailable-state";
import { getPublishedCaregiverArticle } from "@/features/caregiver/services/caregiver.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default async function CaregiverArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugPattern.test(slug)) notFound();

  const profile = await getCurrentProfile();
  if (!profile.ok) return <CaregiverUnavailableState />;
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const article = await getPublishedCaregiverArticle(slug);
  if (!article.ok && article.error.code === "not_found") notFound();
  if (!article.ok) return <CaregiverUnavailableState />;

  return <CaregiverArticle article={article.data} />;
}
