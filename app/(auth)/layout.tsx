import Link from "next/link";
import type { ReactNode } from "react";

import { CompanionIllustration } from "@/components/illustrations/editorial-illustrations";
import { RouteMotion } from "@/components/motion/route-motion";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f4ed] lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
      <aside className="relative hidden overflow-hidden border-r border-border lg:block">
        <div className="flex h-full flex-col justify-between p-12 xl:p-16">
          <Link className="inline-flex items-baseline gap-2" href="/">
            <span className="font-serif-display text-2xl font-semibold">Health Decoded</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              EDU
            </span>
          </Link>

          <div className="mx-auto max-w-xl">
            <CompanionIllustration className="mx-auto max-w-md" />
            <p className="editorial-eyebrow mt-4 text-center">The guardian&apos;s embrace</p>
            <h2 className="mt-8 text-center font-serif-display text-4xl font-normal leading-tight text-balance xl:text-5xl">
              The first 90 days, decoded.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-center text-pretty leading-8 text-muted-foreground">
              A private learning companion for life after a Type 2 diabetes diagnosis. One calm
              lesson at a time, at your own pace.
            </p>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Educational support, not medical advice.
          </p>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 sm:py-16">
        <RouteMotion className="w-full max-w-md">{children}</RouteMotion>
      </main>
    </div>
  );
}
