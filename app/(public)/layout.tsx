import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import headerStyles from "@/components/layout/app-header.module.css";
import { RouteMotion } from "@/components/motion/route-motion";
import { cn } from "@/lib/utils";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f8f4ed] text-[#382c26]">
      <a
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-[9px] bg-[#382c26] px-4 py-3 font-semibold text-[#fffaf3] transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>
      <header className={cn("sticky top-0 z-40 border-b border-[#e5ddd2]", headerStyles.appHeader)}>
        <div className="mx-auto flex min-h-[4.5rem] max-w-[1440px] items-center justify-between gap-3 px-[clamp(1rem,4vw,3.5rem)] sm:min-h-[4.75rem] sm:gap-4">
          <Link
            className="group inline-flex min-h-11 items-baseline gap-2 transition-colors duration-[var(--duration-fast)] hover:text-[#b96c55]"
            href="/"
          >
            <span className="font-serif-display text-xl font-semibold tracking-tight sm:text-2xl">
              Health Decoded
            </span>
            <span className="hidden text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#8b7a70] sm:inline">
              EDU
            </span>
          </Link>

          <nav aria-label="Get started">
            <Link
              className={cn(
                buttonVariants({ fullWidth: false }),
                "min-h-11 px-3 py-2.5 sm:min-w-28 sm:px-5",
              )}
              href="/signup"
            >
              Begin <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <RouteMotion>{children}</RouteMotion>
      </main>
      <footer className="mx-auto w-full max-w-[1440px] px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(2.5rem,6vw,4rem)] text-[#827168]">
        <p className="text-xs font-bold uppercase tracking-[0.22em]">
          Educational support, not medical advice
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span>© 2026 Health Decoded. A compassionate companion for the first 90 days.</span>
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
