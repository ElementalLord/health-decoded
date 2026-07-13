"use client";

import { BookOpen, House, Library, ListChecks, Map, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileLayout } from "@/components/layout/mobile-layout";
import { applicationRoutes, type ApplicationRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";

const icons = {
  home: House,
  journey: Map,
  profile: UserRound,
  progress: ListChecks,
  resources: Library,
  stories: BookOpen,
} as const;

function isActiveRoute(pathname: string, route: ApplicationRoute) {
  return route.href === "/" ? pathname === route.href : pathname.startsWith(route.href);
}

function BottomNavigation({
  routes = applicationRoutes,
}: {
  routes?: readonly ApplicationRoute[];
}) {
  const pathname = usePathname();

  return (
    <MobileLayout>
      <nav
        aria-label="Mobile navigation"
        className="safe-area-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 px-1 pt-2 backdrop-blur-sm"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 items-center">
          {routes.map((route) => {
            const Icon = icons[route.icon];
            const active = isActiveRoute(pathname, route);

            return (
              <li className="min-w-0" key={route.href}>
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "mx-auto flex min-h-14 w-full min-w-0 flex-col items-center justify-center gap-1 rounded-md px-0.5 text-[length:var(--text-caption)] font-medium leading-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-secondary/60 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  href={route.href}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span className="max-w-full">{route.label}</span>
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
