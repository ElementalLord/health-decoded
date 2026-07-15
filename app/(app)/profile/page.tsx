import { redirect } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { ProfileContent } from "@/features/profile/components/profile-content";
import { getProfileSettings } from "@/features/profile/services/profile-settings.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) return <EmptyState title="Profile unavailable" description="We could not load your profile right now." headingLevel="h1" />;
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const settings = await getProfileSettings();
  if (!settings.ok) return <EmptyState title="Profile unavailable" description="We could not load your profile right now." headingLevel="h1" />;

  return <ProfileContent data={settings.data} />;
}
