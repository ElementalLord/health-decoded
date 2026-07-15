import { Sprout } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2.5 text-base font-semibold tracking-tight">
            <span
              aria-hidden="true"
              className="inline-flex size-9 items-center justify-center rounded-[8px] bg-primary-foreground/15"
            >
              <Sprout className="size-4" strokeWidth={2} />
            </span>
            <span className="font-serif-display text-xl">Health Decoded</span>
          </div>

          <div className="max-w-md space-y-6">
            <h2 className="font-serif-display text-3xl font-semibold leading-tight text-balance">
              The first 90 days, decoded.
            </h2>
            <p className="text-pretty leading-7 text-primary-foreground/80">
              A private learning companion for life after a Type 2 diabetes diagnosis. One calm
              lesson at a time, at your own pace.
            </p>
          </div>

          <p className="text-sm text-primary-foreground/60">
            Educational support, not medical advice.
          </p>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
