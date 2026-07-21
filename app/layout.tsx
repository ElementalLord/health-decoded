import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: {
    default: "Health Decoded",
    template: "%s · Health Decoded",
  },
  description: "Educational support for the first 90 days after a Type 2 diabetes diagnosis.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f2ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${inter.variable} ${fraunces.variable}`} lang="en">
      <body>{children}</body>
    </html>
  );
}
