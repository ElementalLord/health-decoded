import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getProfileSettings } from "@/features/profile/services/profile-settings.server";
import { CURRENT_PATH_HEADER, getSafeRedirectPath } from "@/lib/auth/redirects";
import { protectedApplicationRoutes } from "@/lib/routes";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser();
  if (!user.ok) {
    const requestHeaders = await headers();
    const next = getSafeRedirectPath(requestHeaders.get(CURRENT_PATH_HEADER) ?? undefined);
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  const settings = await getProfileSettings();
  return settings.ok ? (
    <AppShell preferences={settings.data} routes={protectedApplicationRoutes}>
      {children}
    </AppShell>
  ) : (
    <AppShell routes={protectedApplicationRoutes}>{children}</AppShell>
  );
}
