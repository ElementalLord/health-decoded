import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { MilestoneNotificationHost } from "@/features/achievements/components/milestone-notification-host";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getProfileSettings } from "@/features/profile/services/profile-settings.server";
import { CURRENT_PATH_HEADER, getSafeRedirectPath } from "@/lib/auth/redirects";
import { protectedApplicationRoutes } from "@/lib/routes";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const currentPath = requestHeaders.get(CURRENT_PATH_HEADER) ?? "/journey";
  const isOnboarding = currentPath.split("?")[0] === "/onboarding";
  const user = await getAuthenticatedUser();
  if (!user.ok) {
    const next = getSafeRedirectPath(currentPath);
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  const settings = await getProfileSettings();
  if (settings.ok && !settings.data.onboardingComplete && !isOnboarding) redirect("/onboarding");

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
