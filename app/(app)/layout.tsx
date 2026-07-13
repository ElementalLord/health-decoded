import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { protectedApplicationRoutes } from "@/lib/routes";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser();
  if (!user.ok) redirect("/login?next=/journey");
  return <AppShell routes={protectedApplicationRoutes}>{children}</AppShell>;
}
