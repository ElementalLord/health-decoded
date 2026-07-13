import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { getProfileSettings } from "@/features/profile/services/profile-settings.server";
import { protectedApplicationRoutes } from "@/lib/routes";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser();
  if (!user.ok) redirect("/login?next=/journey");
  const settings = await getProfileSettings();
  return settings.ok ? (
    <AppShell preferences={settings.data} routes={protectedApplicationRoutes}>
      {children}
    </AppShell>
  ) : (
    <AppShell routes={protectedApplicationRoutes}>{children}</AppShell>
  );
}
