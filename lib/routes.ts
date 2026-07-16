export type ApplicationRoute = {
  href: string;
  label: string;
  icon: "ai" | "home" | "journey" | "profile" | "progress" | "resources" | "stories";
};

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
  { href: "/ai", label: "Ask", icon: "ai" },
  { href: "/progress", label: "Progress", icon: "progress" },
  { href: "/stories", label: "Stories", icon: "stories" },
  { href: "/resources", label: "Resources", icon: "resources" },
  { href: "/profile", label: "Profile", icon: "profile" },
] as const satisfies readonly ApplicationRoute[];
