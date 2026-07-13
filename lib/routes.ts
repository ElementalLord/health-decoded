export type ApplicationRoute = {
  href: string;
  label: string;
  icon: "home";
};

export const applicationRoutes = [
  {
    href: "/",
    label: "Home",
    icon: "home",
  },
] as const satisfies readonly ApplicationRoute[];
