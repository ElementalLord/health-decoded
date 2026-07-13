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
  caption: "0.75rem",
  supporting: "0.875rem",
  body: "1rem",
  lessonHeading: "1.125rem",
  cardTitle: "1.25rem",
  sectionTitle: "1.5rem",
  pageTitle: "2rem",
} as const;

export const colors = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  success: "var(--success)",
  warning: "var(--warning)",
  info: "var(--info)",
  error: "var(--destructive)",
} as const;

export const elevation = {
  card: "var(--shadow-card)",
  cardHover: "var(--shadow-card-hover)",
  modal: "var(--shadow-modal)",
} as const;

export const animation = {
  buttonPress: "120ms",
  cardAppearance: "200ms",
  navigation: "200ms",
  progress: "400ms",
  easing: "cubic-bezier(0.2, 0, 0, 1)",
} as const;
