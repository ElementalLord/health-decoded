import { redirect } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { ProfileContent } from "@/features/profile/components/profile-content";
import { getProfileSettings } from "@/features/profile/services/profile-settings.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { getProgressData } from "@/features/progress/services/progress.server";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile.ok)
    return (
      <EmptyState
        title="Profile unavailable"
        description="We could not load your profile right now."
        headingLevel="h1"
      />
    );
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const [settings, progress] = await Promise.all([getProfileSettings(), getProgressData()]);
  if (!settings.ok)
    return (
      <EmptyState
        title="Profile unavailable"
        description="We could not load your profile right now."
        headingLevel="h1"
      />
    );

  const currentDay = progress.ok
    ? (progress.data.milestones.find((milestone) => milestone.state === "current")?.dayNumber ??
      progress.data.totalLessons)
    : null;

  return (
    <ProfileContent
      data={settings.data}
      journeyStats={
        progress.ok && currentDay !== null
          ? {
              completedLessons: progress.data.completedLessons,
              currentDay,
              totalConfidenceXp: progress.data.totalConfidenceXp,
            }
          : null
      }
    />
  );
}
