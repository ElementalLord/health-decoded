"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DesktopLayout } from "@/components/layout/desktop-layout";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";
import { SearchCommand } from "@/features/universal-search/components/search-command";
import { applicationRoutes, type ApplicationRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";

import styles from "./app-header.module.css";

function isActiveRoute(pathname: string, route: ApplicationRoute) {
  return route.href === "/" ? pathname === route.href : pathname.startsWith(route.href);
}

function getInitials(displayName?: string) {
  const parts = displayName?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "HD";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts.at(-1)![0]}`.toUpperCase();
}

function AppHeader({
  preferences,
  routes = applicationRoutes,
}: {
  preferences?: ProfileSettings | undefined;
  routes?: readonly ApplicationRoute[];
}) {
  const brandDestination = routes[0]?.href ?? "/";
  const pathname = usePathname();
  const showProfileAvatar = routes.some((route) => route.href === "/profile");

  return (
    <header
      className={cn(
        "safe-area-top sticky top-0 z-40 border-b border-border backdrop-blur-md",
        styles.appHeader,
      )}
    >
      <div className="app-header-inner mx-auto flex min-h-[4.5rem] w-full max-w-[1440px] items-center justify-between gap-3 px-[clamp(1rem,4vw,3.5rem)]">
        <Link
          className="app-brand inline-flex min-h-11 min-w-0 items-center gap-2 rounded-[8px] text-base font-semibold tracking-tight transition-colors hover:text-accent-warm focus-visible:ring-2 focus-visible:ring-ring"
          href={brandDestination}
        >
          <span className="truncate font-serif-display text-[length:var(--text-card-title)] font-semibold">
            Health Decoded
          </span>
          <span className="hidden text-[0.65rem] font-bold uppercase tracking-[0.25em] text-muted-foreground sm:inline">
            EDU
          </span>
        </Link>

        <div className="flex min-w-0 shrink-0 items-center gap-3 xl:gap-6">
          <div className="flex items-center gap-2">
            <SearchCommand />
          </div>
          <DesktopLayout>
            <nav aria-label="Primary navigation">
              <ul className="flex items-center gap-[clamp(1rem,1.65vw,1.5rem)]">
                {routes.map((route) => {
                  const active = isActiveRoute(pathname, route);

                  return (
                    <li key={route.href}>
                      <Link
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative inline-flex min-h-11 items-center px-0 text-sm font-medium transition-[color,transform] duration-[var(--duration-fast)] ease-[var(--ease-standard)] after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:bg-accent-warm after:transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]",
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
          {showProfileAvatar ? (
            <span
              aria-label={`${preferences?.displayName || "Your"} profile photo`}
              className={styles.profileAvatar}
              role="img"
            >
              {getInitials(preferences?.displayName)}
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export { AppHeader };
