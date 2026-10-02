export type ApplicationRoute = {
  href: string;
  label: string;
  icon:
    | "ai"
    | "caregiver"
    | "glossary"
    | "home"
    | "journey"
    | "profile"
    | "progress"
    | "resources"
    | "stories";
};

export function isApplicationRouteActive(pathname: string, route: ApplicationRoute) {
  if (route.href === "/") return pathname === route.href;
  return pathname === route.href || pathname.startsWith(`${route.href}/`);
}

const compactPrimaryRouteHrefs = ["/journey", "/progress", "/stories", "/resources"] as const;

export function groupApplicationRoutes(routes: readonly ApplicationRoute[]) {
  if (routes.length <= 5) return { primary: [...routes], secondary: [] };

  const preferredRoutes = compactPrimaryRouteHrefs.flatMap((href) => {
    const route = routes.find((candidate) => candidate.href === href);
    return route ? [route] : [];
  });
  const preferredHrefs = new Set(preferredRoutes.map((route) => route.href));
  const remainingRoutes = routes.filter((route) => !preferredHrefs.has(route.href));
  const primary = [...preferredRoutes, ...remainingRoutes].slice(0, 4);
  const primaryHrefs = new Set(primary.map((route) => route.href));

  return {
    primary,
    secondary: routes.filter((route) => !primaryHrefs.has(route.href)),
  };
}

export const applicationRoutes = [
  {
    href: "/",
    label: "Home",
    icon: "home",
  },
] as const satisfies readonly ApplicationRoute[];

export const protectedApplicationRoutes = [
  {
    href: "/journey",
    label: "Journey",
    icon: "journey",
  },
  { href: "/caregiver", label: "Caregiver", icon: "caregiver" },
  { href: "/progress", label: "Progress", icon: "progress" },
  { href: "/stories", label: "Stories", icon: "stories" },
  { href: "/resources", label: "Resources", icon: "resources" },
  { href: "/glossary", label: "Glossary", icon: "glossary" },
  { href: "/profile", label: "Profile", icon: "profile" },
] as const satisfies readonly ApplicationRoute[];
