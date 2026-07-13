"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileLayout } from "@/components/layout/mobile-layout";
import { applicationRoutes, type ApplicationRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";

const icons = { home: Home } as const;

function isActiveRoute(pathname: string, route: ApplicationRoute) {
  return route.href === "/" ? pathname === route.href : pathname.startsWith(route.href);
}

function BottomNavigation() {
  const pathname = usePathname();

  return (
    <MobileLayout>
      <nav
        aria-label="Mobile navigation"
        className="safe-area-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 px-3 pt-2 backdrop-blur-sm"
      >
        <ul className="mx-auto flex max-w-md items-center justify-around">
          {applicationRoutes.map((route) => {
            const Icon = icons[route.icon];
            const active = isActiveRoute(pathname, route);

            return (
              <li className="flex-1" key={route.href}>
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "mx-auto flex min-h-12 max-w-24 flex-col items-center justify-center gap-0.5 rounded-lg px-3 text-xs font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                  href={route.href}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span>{route.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </MobileLayout>
  );
}

export { BottomNavigation };
