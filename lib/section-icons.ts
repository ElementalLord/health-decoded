import type { Metadata } from "next";

/**
 * Browser-tab icons are set per section rather than per page, so a tab reads as
 * "somewhere in the library" or "somewhere in the caregiver space" at a glance.
 * Pages that set no section fall back to the brand mark in app/icon.svg.
 */
export type SectionIcon =
  "account" | "ai" | "caregiver" | "journey" | "library" | "progress" | "tools" | "urgent";

/**
 * Metadata `icons` for a section. Declaring `icons` on a page replaces the
 * inherited root icons entirely, so the Apple touch icon is repeated here to
 * keep home-screen installs on the brand mark.
 */
function sectionIcons(section: SectionIcon): Metadata["icons"] {
  return {
    icon: [{ url: `/icons/${section}.svg`, type: "image/svg+xml", sizes: "any" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  };
}

export { sectionIcons };
