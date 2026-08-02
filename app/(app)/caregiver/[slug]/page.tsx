import { notFound, redirect } from "next/navigation";

import { getPublishedCaregiverArticle } from "@/features/caregiver/services/caregiver.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const metadata = { title: "Caregiver guide" };

export default async function CaregiverArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slugPattern.test(slug)) notFound();

  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const article = await getPublishedCaregiverArticle(slug);
  if (!article.ok && article.error.code === "not_found") notFound();
  if (!article.ok) notFound();

  redirect("/caregiver");
}
