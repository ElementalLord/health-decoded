"use client";

import {
  BookOpen,
  House,
  Library,
  ListChecks,
  Map,
  MessageCircleQuestion,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileLayout } from "@/components/layout/mobile-layout";
import { applicationRoutes, type ApplicationRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";

const icons = {
  ai: MessageCircleQuestion,
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
        className="safe-area-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card px-1 pt-1.5"
      >
        <ul
          className={cn(
            "mx-auto grid max-w-md items-center",
            routes.length === 6 ? "grid-cols-6" : "grid-cols-5",
          )}
        >
          {routes.map((route) => {
            const Icon = icons[route.icon];
            const active = isActiveRoute(pathname, route);

            return (
              <li className="min-w-0" key={route.href}>
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative mx-auto flex min-h-14 w-full min-w-0 flex-col items-center justify-center gap-1 rounded-[8px] px-0.5 text-[length:var(--text-caption)] font-medium leading-none transition duration-[var(--duration-fast)] ease-[var(--ease-standard)] before:absolute before:top-0 before:h-0.5 before:w-8 before:rounded-full before:bg-accent-warm before:transition-opacity focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "text-primary before:opacity-100"
                      : "text-muted-foreground before:opacity-0 hover:text-foreground",
                  )}
                  href={route.href}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn("size-5 transition-transform", active && "scale-110")}
                    strokeWidth={active ? 2.25 : 1.75}
                  />
                  <span className="block w-full truncate px-0.5 text-center">{route.label}</span>
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
