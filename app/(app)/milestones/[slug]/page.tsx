import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { MilestoneDetail } from "@/features/achievements/components/milestone-detail";
import { MilestonesUnavailableState } from "@/features/achievements/components/milestones-unavailable-state";
import { milestoneDefinitions } from "@/features/achievements/content/milestone-definitions";
import { getMilestoneCollection } from "@/features/achievements/services/milestones.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { sectionIcons } from "@/lib/section-icons";

type MilestoneDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: MilestoneDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const definition = milestoneDefinitions.find((entry) => entry.slug === slug);
  return {
    title: definition
      ? definition.hidden
        ? "Hidden milestone"
        : `${definition.name} milestone`
      : "Milestone not found",
    icons: sectionIcons("progress"),
  };
}

export default async function MilestoneDetailRoute({ params }: MilestoneDetailRouteProps) {
  const { slug } = await params;
  const definition = milestoneDefinitions.find((entry) => entry.slug === slug);
  if (!definition) notFound();

  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/login");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const collection = await getMilestoneCollection();
  if (!collection.ok) return <MilestonesUnavailableState />;
  const item = collection.data.find((entry) => entry.definition.id === definition.id);
  if (!item) notFound();
  return <MilestoneDetail item={item} />;
}
