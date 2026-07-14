"use client";

import { Heart } from "lucide-react";
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
    <header className="safe-area-top sticky top-0 z-40 border-b border-border/80 bg-card">
      <div className="mx-auto flex min-h-16 w-full max-w-[1152px] items-center justify-between gap-4 px-5 md:px-6 lg:px-8">
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-[10px] text-base font-semibold tracking-tight transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          href={brandDestination}
        >
          <span
            aria-hidden="true"
            className="inline-flex size-7 items-center justify-center text-primary"
          >
            <Heart className="size-5" fill="currentColor" strokeWidth={1.75} />
          </span>
          <span>Health Decoded</span>
        </Link>

        <DesktopLayout>
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-1">
              {routes.map((route) => {
                const active = isActiveRoute(pathname, route);

                return (
                  <li key={route.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
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
