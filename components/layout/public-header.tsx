"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import headerStyles from "@/components/layout/app-header.module.css";
import { cn } from "@/lib/utils";

const headerlessRoutes = new Set(["/privacy", "/terms"]);

export function PublicHeader() {
  const pathname = usePathname();

  if (headerlessRoutes.has(pathname)) return null;

  return (
    <>
      <header
        className={cn(
          "safe-area-top fixed inset-x-0 top-0 z-40 border-b border-[#e5ddd2]",
          headerStyles.appHeader,
        )}
      >
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
              href="/login"
            >
              Begin <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </nav>
        </div>
      </header>
      <div
        aria-hidden="true"
        className="h-[calc(4.5rem+env(safe-area-inset-top))] sm:h-[calc(4.75rem+env(safe-area-inset-top))]"
      />
    </>
  );
}
