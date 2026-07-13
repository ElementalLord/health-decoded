import { Heart } from "lucide-react";
import Link from "next/link";

import { DesktopLayout } from "@/components/layout/desktop-layout";
import { applicationRoutes, type ApplicationRoute } from "@/lib/routes";

function AppHeader({ routes = applicationRoutes }: { routes?: readonly ApplicationRoute[] }) {
  return (
    <header className="safe-area-top sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-[1100px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-base font-semibold tracking-tight transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          <span
            aria-hidden="true"
            className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <Heart className="size-4" strokeWidth={2.25} />
          </span>
          <span>Health Decoded</span>
        </Link>

        <DesktopLayout>
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-1">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    href={route.href}
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </DesktopLayout>
      </div>
    </header>
  );
}

export { AppHeader };
