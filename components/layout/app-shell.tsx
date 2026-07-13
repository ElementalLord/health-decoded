import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { PageContainer } from "@/components/layout/page-container";
import { type ApplicationRoute } from "@/lib/routes";

function AppShell({ children, routes }: { children: ReactNode; routes?: readonly ApplicationRoute[] }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-modal transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>
      {routes ? <AppHeader routes={routes} /> : <AppHeader />}
      <PageContainer className="shell-mobile-offset flex-1" id="main-content" tabIndex={-1}>
        {children}
      </PageContainer>
      {routes ? <BottomNavigation routes={routes} /> : <BottomNavigation />}
    </div>
  );
}

export { AppShell };
