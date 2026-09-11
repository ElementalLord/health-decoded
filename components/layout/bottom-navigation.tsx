"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  BookHeart,
  BookOpen,
  ChevronRight,
  HelpingHand,
  House,
  Library,
  ListChecks,
  Map,
  Menu,
  MessageCircleQuestion,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MobileLayout } from "@/components/layout/mobile-layout";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";
import { applicationRoutes, type ApplicationRoute } from "@/lib/routes";

import styles from "./bottom-navigation.module.css";

const icons = {
  ai: MessageCircleQuestion,
  caregiver: HelpingHand,
  glossary: BookOpen,
  home: House,
  journey: Map,
  profile: UserRound,
  progress: ListChecks,
  resources: Library,
  stories: BookHeart,
} as const;

function isActiveRoute(pathname: string, route: ApplicationRoute) {
  return route.href === "/" ? pathname === route.href : pathname.startsWith(route.href);
}

function navigationGroups(routes: readonly ApplicationRoute[]) {
  if (routes.length <= 5) return { primary: [...routes], secondary: [] };

  // Keep the high-frequency journey, progress, stories, and resources areas
  // one tap away. Every other destination remains visible in the More sheet.
  const preferredIndexes = [0, 2, 3, 4];
  const primary = preferredIndexes
    .map((index) => routes[index])
    .filter((route): route is ApplicationRoute => Boolean(route));
  const primaryHrefs = new Set(primary.map((route) => route.href));

  return {
    primary,
    secondary: routes.filter((route) => !primaryHrefs.has(route.href)),
  };
}

function BottomNavigation({
  preferences,
  routes = applicationRoutes,
}: {
  preferences?: ProfileSettings | undefined;
  routes?: readonly ApplicationRoute[];
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pathname = usePathname();
  const { primary, secondary } = navigationGroups(routes);
  const moreIsActive = secondary.some((route) => isActiveRoute(pathname, route));

  useEffect(() => setMoreOpen(false), [pathname]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 80rem)");
    const closeAtDesktopWidth = (event: MediaQueryListEvent) => {
      if (event.matches) setMoreOpen(false);
    };
    desktopQuery.addEventListener("change", closeAtDesktopWidth);
    return () => desktopQuery.removeEventListener("change", closeAtDesktopWidth);
  }, []);

  return (
    <MobileLayout>
      <Dialog.Root onOpenChange={setMoreOpen} open={moreOpen}>
        <nav
          aria-label="Primary navigation"
          className={`mobile-bottom-navigation safe-area-bottom ${styles.navigation}`}
        >
          <ul className={styles.tabList}>
            {primary.map((route) => {
              const Icon = icons[route.icon];
              const active = isActiveRoute(pathname, route);

              return (
                <li key={route.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={styles.tab}
                    data-active={active || undefined}
                    href={route.href}
                  >
                    <span className={styles.iconWell}>
                      <Icon aria-hidden="true" strokeWidth={active ? 2.25 : 1.8} />
                    </span>
                    <span>{route.label}</span>
                  </Link>
                </li>
              );
            })}

            {secondary.length ? (
              <li>
                <Dialog.Trigger
                  aria-label="Open more navigation options"
                  className={styles.tab}
                  data-active={moreIsActive || undefined}
                >
                  <span className={styles.iconWell}>
                    <Menu aria-hidden="true" strokeWidth={moreIsActive ? 2.25 : 1.8} />
                  </span>
                  <span>More</span>
                </Dialog.Trigger>
              </li>
            ) : null}
          </ul>
        </nav>

        {secondary.length ? (
          <Dialog.Portal
            data-reduced-motion={preferences?.reducedMotion}
            data-text-scale={preferences?.preferredTextScale}
          >
            <Dialog.Backdrop className={styles.backdrop} />
            <Dialog.Viewport className={styles.viewport}>
              <Dialog.Popup className={styles.sheet} initialFocus={titleRef}>
                <div aria-hidden="true" className={styles.grabber} />
                <header className={styles.sheetHeader}>
                  <div>
                    <p className="editorial-eyebrow">Health Decoded</p>
                    <Dialog.Title className={styles.sheetTitle} ref={titleRef} tabIndex={-1}>
                      More places to go
                    </Dialog.Title>
                    <Dialog.Description className={styles.sheetDescription}>
                      Every part of your learning space stays within reach.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close aria-label="Close navigation menu" className={styles.closeButton}>
                    <X aria-hidden="true" />
                  </Dialog.Close>
                </header>

                <ul className={styles.moreList}>
                  {secondary.map((route) => {
                    const Icon = icons[route.icon];
                    const active = isActiveRoute(pathname, route);

                    return (
                      <li key={route.href}>
                        <Link
                          aria-current={active ? "page" : undefined}
                          className={styles.moreLink}
                          data-active={active || undefined}
                          href={route.href}
                          onClick={() => setMoreOpen(false)}
                        >
                          <span className={styles.moreIcon}>
                            <Icon aria-hidden="true" strokeWidth={active ? 2.25 : 1.8} />
                          </span>
                          <span>{route.label}</span>
                          <ChevronRight aria-hidden="true" className={styles.chevron} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        ) : null}
      </Dialog.Root>
    </MobileLayout>
  );
}

export { BottomNavigation, navigationGroups };
