export const spacing = {
  0: "0",
  0.5: "0.25rem",
  1: "0.5rem",
  2: "1rem",
  3: "1.5rem",
  4: "2rem",
  6: "3rem",
  8: "4rem",
} as const;

export const typography = {
  caption: "0.8125rem",
  supporting: "0.875rem",
  body: "1rem",
  lessonHeading: "1.125rem",
  cardTitle: "1.25rem",
  sectionTitle: "1.5rem",
  featureTitle: "1.75rem",
  pageTitle: "2.25rem",
} as const;

export const colors = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  success: "var(--success)",
  warning: "var(--warning)",
  info: "var(--info)",
  accentWarm: "var(--accent-warm)",
  error: "var(--destructive)",
} as const;

export const elevation = {
  card: "var(--shadow-card)",
  modal: "var(--shadow-modal)",
} as const;

export const animation = {
  buttonPress: "180ms",
  cardAppearance: "280ms",
  navigation: "320ms",
  progress: "520ms",
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export const breakpoints = {
  mobile: "0rem",
  tablet: "40rem",
  desktop: "64rem",
} as const;
