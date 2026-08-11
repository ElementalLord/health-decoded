import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { SessionUnavailableState } from "@/components/layout/session-unavailable-state";
import { MilestoneNotificationHost } from "@/features/achievements/components/milestone-notification-host";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getProfileSettings } from "@/features/profile/services/profile-settings.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { CURRENT_PATH_HEADER, getSafeRedirectPath } from "@/lib/auth/redirects";
import { protectedApplicationRoutes } from "@/lib/routes";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const currentPath = requestHeaders.get(CURRENT_PATH_HEADER) ?? "/journey";
  const isOnboarding = currentPath.split("?")[0] === "/onboarding";
  const user = await getAuthenticatedUser();
  if (!user.ok) {
    const next = getSafeRedirectPath(currentPath);
    if (user.error.code === "authorization") {
      redirect(`/login?next=${encodeURIComponent(next)}`);
    }
    return (
      <AppShell routes={isOnboarding ? undefined : protectedApplicationRoutes}>
        <SessionUnavailableState retryHref={next} />
      </AppShell>
    );
  }
  const profile = await getCurrentProfile();
  if (!profile.ok) {
    const next = getSafeRedirectPath(currentPath);
    if (profile.error.code === "authorization") {
      redirect(`/login?next=${encodeURIComponent(next)}`);
    }
    return (
      <AppShell routes={isOnboarding ? undefined : protectedApplicationRoutes}>
        <SessionUnavailableState kind="account" retryHref={next} />
      </AppShell>
    );
  }
  if (!profile.data.onboarding_completed_at && !isOnboarding) redirect("/onboarding");

  const settings = await getProfileSettings();

  const routes = isOnboarding ? undefined : protectedApplicationRoutes;
  return settings.ok ? (
    <AppShell preferences={settings.data} routes={routes}>
      {children}
      {!isOnboarding ? <MilestoneNotificationHost /> : null}
    </AppShell>
  ) : (
    <AppShell routes={routes}>
      {children}
      {!isOnboarding ? <MilestoneNotificationHost /> : null}
    </AppShell>
  );
}
