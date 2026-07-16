"use client";

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
    <header className="safe-area-top sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex min-h-[4.5rem] w-full max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8 lg:px-10">
        <Link
          className="inline-flex min-h-11 items-baseline gap-2 rounded-[8px] text-base font-semibold tracking-tight transition-colors hover:text-accent-warm focus-visible:ring-2 focus-visible:ring-ring"
          href={brandDestination}
        >
          <span className="font-serif-display text-[length:var(--text-card-title)] font-semibold">
            Health Decoded
          </span>
          <span className="hidden text-[0.65rem] font-bold uppercase tracking-[0.24em] text-muted-foreground sm:inline">
            EDU
          </span>
        </Link>

        <DesktopLayout>
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-6">
              {routes.map((route) => {
                const active = isActiveRoute(pathname, route);

                return (
                  <li key={route.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-11 items-center px-0 text-sm font-medium transition duration-[var(--duration-fast)] ease-[var(--ease-standard)] after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:bg-accent-warm after:transition-transform focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "text-foreground after:scale-x-100"
                          : "text-muted-foreground after:scale-x-0 hover:text-foreground hover:after:scale-x-100",
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
