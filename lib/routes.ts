export type ApplicationRoute = {
  href: string;
  label: string;
  icon: "home" | "user";
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
    icon: "home",
  },
  { href: "/progress", label: "Progress", icon: "home" },
  { href: "/stories", label: "Stories", icon: "home" },
  { href: "/resources", label: "Resources", icon: "home" },
  { href: "/profile", label: "Profile", icon: "user" },
] as const satisfies readonly ApplicationRoute[];
