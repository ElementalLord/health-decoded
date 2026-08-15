import { redirect } from "next/navigation";

import { MilestonesPage } from "@/features/achievements/components/milestones-page";
import { MilestonesUnavailableState } from "@/features/achievements/components/milestones-unavailable-state";
import { getEarnedMilestones } from "@/features/achievements/services/milestones.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = { title: "Milestones", icons: sectionIcons("progress") };

export default async function MilestonesRoute() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/login");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");
  const earned = await getEarnedMilestones();
  if (!earned.ok) return <MilestonesUnavailableState />;
  return <MilestonesPage earned={earned.data} />;
}
