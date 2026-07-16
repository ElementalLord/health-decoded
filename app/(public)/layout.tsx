import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f8f4ed] text-[#382c26]">
      <a
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-[8px] bg-[#382c26] px-4 py-3 font-semibold text-[#fffaf3] transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 border-b border-[#e5ddd2] bg-[#f8f4ed]">
        <div className="mx-auto flex min-h-[4.75rem] max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10 lg:px-14">
          <Link className="group inline-flex min-h-11 items-baseline gap-2" href="/">
            <span className="font-serif-display text-xl font-semibold tracking-tight sm:text-2xl">
              Health Decoded
            </span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.27em] text-[#8b7a70]">
              EDU
            </span>
          </Link>

          <nav aria-label="Public navigation" className="hidden items-center gap-7 lg:flex">
            <a
              className="border-b-2 border-[#c97860] pb-1 text-sm font-medium text-[#382c26]"
              href="#home"
            >
              Home
            </a>
            <Link className="text-sm text-[#7b6a60] hover:text-[#382c26]" href="/journey">
              Journey
            </Link>
            <Link className="text-sm text-[#7b6a60] hover:text-[#382c26]" href="/ai">
              Ask
            </Link>
            <Link className="text-sm text-[#7b6a60] hover:text-[#382c26]" href="/stories">
              Stories
            </Link>
            <Link className="text-sm text-[#7b6a60] hover:text-[#382c26]" href="/resources">
              Resources
            </Link>
            <Link className="text-sm text-[#7b6a60] hover:text-[#382c26]" href="/profile">
              Profile
            </Link>
            <Link
              className={cn(buttonVariants({ fullWidth: false }), "min-h-10 px-4 py-2")}
              href="/signup"
            >
              Begin <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </nav>
          <Link
            className="inline-flex min-h-11 items-center border-b-2 border-[#c97860] px-1 text-sm font-medium lg:hidden"
            href="/login"
          >
            Sign in
          </Link>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
