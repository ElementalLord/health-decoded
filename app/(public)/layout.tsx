import type { ReactNode } from "react";
import Link from "next/link";

import { PublicHeader } from "@/components/layout/public-header";
import { RouteMotion } from "@/components/motion/route-motion";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f8f4ed] text-[#382c26]">
      <a
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-[9px] bg-[#382c26] px-4 py-3 font-semibold text-[#fffaf3] transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>
      <PublicHeader />
      <main id="main-content" tabIndex={-1}>
        <RouteMotion>{children}</RouteMotion>
      </main>
      <footer className="mx-auto w-full max-w-[1440px] px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(2.5rem,6vw,4rem)] text-[#827168]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span>© 2026 Health Decoded. Clear, practical learning for life with Type 2.</span>
          <Link
            className="font-medium text-[#493a32] underline underline-offset-4 hover:text-[#b96c55]"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="font-medium text-[#493a32] underline underline-offset-4 hover:text-[#b96c55]"
            href="/terms"
          >
            Terms of Use
          </Link>
        </div>
      </footer>
    </div>
  );
}
