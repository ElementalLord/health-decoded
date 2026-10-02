import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Interactive Demo",
  description:
    "Explore the Health Decoded working prototype and its approach to Type 2 diabetes education.",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}
