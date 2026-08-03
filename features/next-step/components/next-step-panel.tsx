"use client";

import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { dismissNextStepAction } from "@/features/next-step/actions/next-step.actions";
import type { NextStepSelection } from "@/features/next-step/types/next-step";

export function NextStepPanel({ selection }: { selection: NextStepSelection }) {
  const [current, setCurrent] = useState(selection);
  const [isPending, startTransition] = useTransition();

  function dismiss() {
    startTransition(async () => {
      const result = await dismissNextStepAction(current.primary.id);
      if (!result.ok || !current.alternatives.length) return;
      const nextPrimary = current.alternatives[0];
      if (!nextPrimary) return;
      setCurrent({
        primary: nextPrimary,
        alternatives: [...current.alternatives.slice(1), current.primary].slice(0, 2),
      });
    });
  }

  return (
    <section aria-labelledby="next-step-heading" className="border-y border-border py-6 sm:py-7">
      <p className="editorial-eyebrow">Up next</p>
      <h2
        className="mt-3 text-pretty font-serif-display text-2xl sm:text-3xl"
        id="next-step-heading"
      >
        {current.primary.title}
      </h2>
      <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{current.primary.reason}</p>
      {current.primary.estimatedMinutes ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 aria-hidden="true" className="size-4" /> About {current.primary.estimatedMinutes}{" "}
          minutes
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link className={buttonVariants({ fullWidth: false })} href={current.primary.route}>
          {current.primary.actionLabel} <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Button disabled={isPending} fullWidth={false} onClick={dismiss} variant="text">
          Not right now
        </Button>
      </div>
      {current.alternatives.length ? (
        <div className="mt-6 border-t border-border pt-4">
          <h3 className="text-sm font-medium">Other options</h3>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            {current.alternatives.map((alternative) => (
              <li key={alternative.id}>
                <Link
                  className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                  href={alternative.route}
                >
                  {alternative.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
