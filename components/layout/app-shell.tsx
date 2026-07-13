import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { PageContainer } from "@/components/layout/page-container";
import { type ApplicationRoute } from "@/lib/routes";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";
import { cn } from "@/lib/utils";

function AppShell({
  children,
  preferences,
  routes,
}: {
  children: ReactNode;
  preferences?: ProfileSettings;
  routes?: readonly ApplicationRoute[];
}) {
  return (
    <div
      className="flex min-h-dvh flex-col"
      data-reduced-motion={preferences?.reducedMotion}
      data-text-scale={preferences?.preferredTextScale}
    >
      <a
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-modal transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>
      {routes ? <AppHeader routes={routes} /> : <AppHeader />}
      <PageContainer
        className={cn("flex-1", routes && "shell-mobile-offset")}
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </PageContainer>
      {routes ? <BottomNavigation routes={routes} /> : null}
    </div>
  );
}

export { AppShell };
