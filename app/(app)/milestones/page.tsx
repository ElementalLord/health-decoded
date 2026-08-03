import { redirect } from "next/navigation";

import { MilestonesPage } from "@/features/achievements/components/milestones-page";
import { getEarnedMilestones } from "@/features/achievements/services/milestones.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export const metadata = { title: "Milestones" };

export default async function MilestonesRoute() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/login");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");
  const earned = await getEarnedMilestones();
  return <MilestonesPage earned={earned.ok ? earned.data : []} />;
}
