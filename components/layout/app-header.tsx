"use client";

import { Activity } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DesktopLayout } from "@/components/layout/desktop-layout";
import { applicationRoutes, type ApplicationRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";

function isActiveRoute(pathname: string, route: ApplicationRoute) {
  return route.href === "/" ? pathname === route.href : pathname.startsWith(route.href);
}

function AppHeader({ routes = applicationRoutes }: { routes?: readonly ApplicationRoute[] }) {
  const brandDestination = routes[0]?.href ?? "/";
  const pathname = usePathname();

  return (
    <header className="safe-area-top sticky top-0 z-40 border-b border-border/60 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 w-full max-w-[1152px] items-center justify-between gap-4 px-5 md:px-6 lg:px-8">
        <Link
          className="inline-flex min-h-11 items-center gap-2.5 rounded-[10px] text-base font-semibold tracking-tight transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          href={brandDestination}
        >
          <span
            aria-hidden="true"
            className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <Activity className="size-4" strokeWidth={2.5} />
          </span>
          <span className="font-serif-display text-[length:var(--text-card-title)]">
            Health Decoded
          </span>
        </Link>

        <DesktopLayout>
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-0.5">
              {routes.map((route) => {
                const active = isActiveRoute(pathname, route);

                return (
                  <li key={route.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-[10px] px-3.5 text-sm font-medium transition duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "bg-primary/8 text-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                      href={route.href}
                    >
                      {route.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </DesktopLayout>
      </div>
    </header>
  );
}

export { AppHeader };
