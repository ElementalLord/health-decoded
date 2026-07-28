import { redirect } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { ProfileContent } from "@/features/profile/components/profile-content";
import { getProfileReflections } from "@/features/profile/services/profile-reflections.server";
import { getProfileSettings } from "@/features/profile/services/profile-settings.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

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

  const [settings, reflections] = await Promise.all([
    getProfileSettings(),
    getProfileReflections(),
  ]);
  if (!settings.ok)
    return (
      <EmptyState
        title="Profile unavailable"
        description="We could not load your profile right now."
        headingLevel="h1"
      />
    );

  return (
    <ProfileContent
      data={settings.data}
      memberSince={profile.data.created_at}
      reflections={reflections.ok ? reflections.data : { entries: [], total: 0 }}
      reflectionsUnavailable={!reflections.ok}
    />
  );
}
