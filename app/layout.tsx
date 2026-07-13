import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Health Decoded",
  description: "Educational support for the first 90 days after a Type 2 diabetes diagnosis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
