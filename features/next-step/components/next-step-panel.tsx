import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { NextStepSelection } from "@/features/next-step/types/next-step";

export function NextStepPanel({ selection }: { selection: NextStepSelection }) {
  return (
    <section aria-labelledby="next-step-heading" className="border-y border-border py-6 sm:py-7">
      <p className="editorial-eyebrow">Up next</p>
      <h2
        className="mt-3 text-pretty font-serif-display text-2xl sm:text-3xl"
        id="next-step-heading"
      >
        {selection.primary.title}
      </h2>
      <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{selection.primary.reason}</p>
      {selection.primary.estimatedMinutes ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 aria-hidden="true" className="size-4" /> About{" "}
          {selection.primary.estimatedMinutes} minutes
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link className={buttonVariants({ fullWidth: false })} href={selection.primary.route}>
          {selection.primary.actionLabel} <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
