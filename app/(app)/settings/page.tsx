import { redirect } from "next/navigation";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { SettingsContent } from "@/features/profile/components/settings-content";
import { getProfileSettings } from "@/features/profile/services/profile-settings.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { buttonVariants } from "@/components/ui/button";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = { title: "Settings", icons: sectionIcons("account") };

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok)
    return (
      <EmptyState
        action={
          <Link className={buttonVariants({ fullWidth: false })} href="/settings">
            Try again
          </Link>
        }
        title="Settings unavailable"
        description="We could not load your settings right now."
        headingLevel="h1"
      />
    );
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const settings = await getProfileSettings();
  if (!settings.ok)
    return (
      <EmptyState
        action={
          <Link className={buttonVariants({ fullWidth: false })} href="/settings">
            Try again
          </Link>
        }
        title="Settings unavailable"
        description="We could not load your settings right now."
        headingLevel="h1"
      />
    );

  return <SettingsContent data={settings.data} />;
}
