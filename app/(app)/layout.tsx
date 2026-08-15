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
import { unexpectedError } from "@/lib/errors/application-error";
import { createServerLogger } from "@/lib/logging/server";
import { settleResult } from "@/lib/reliability/dependency-boundary";
import { protectedApplicationRoutes } from "@/lib/routes";

const logger = createServerLogger();

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const currentPath = requestHeaders.get(CURRENT_PATH_HEADER) ?? "/journey";
  const isOnboarding = currentPath.split("?")[0] === "/onboarding";
  const user = await settleResult(
    () => getAuthenticatedUser(),
    unexpectedError(),
    () => logger.error("authenticated_shell.auth_rejected"),
  );
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
  // Profile and settings are independent reads, so both queries are issued before
  // either is awaited. `getProfileSettings` internally reuses the request-cached
  // `getCurrentProfile`, so this overlaps the two round trips without duplicating
  // the profile query.
  const profilePromise = settleResult(
    () => getCurrentProfile(),
    unexpectedError(),
    () => logger.error("authenticated_shell.profile_rejected"),
  );
  const settingsPromise = settleResult(
    () => getProfileSettings(),
    unexpectedError(),
    () => logger.error("authenticated_shell.preferences_rejected"),
  );
  // `settleResult` rethrows unexpected errors, so mark the settings promise as
  // handled for the branches below that return before awaiting it. Awaiting it
  // later still surfaces the rejection to the error boundary as before.
  void settingsPromise.catch(() => {});

  const profile = await profilePromise;
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

  const settings = await settingsPromise;

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
