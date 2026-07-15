"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { buttonVariants } from "@/components/ui/button";
import type { LessonCompletionResult } from "@/features/lessons/types/lesson-completion";
import { cn } from "@/lib/utils";

export function LessonCompletionScreen({
  completion,
  keyTakeaway,
  lessonTitle,
}: {
  completion: LessonCompletionResult;
  keyTakeaway: string;
  lessonTitle: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section aria-labelledby="lesson-complete-heading" className="mx-auto max-w-xl py-6 sm:py-10">
      <div className="space-y-7 border-y border-border py-8 sm:py-12">
        <span
          aria-hidden="true"
          className="inline-flex size-16 items-center justify-center rounded-full bg-success/12 text-success"
        >
          <CheckCircle2 className="size-8" strokeWidth={2} />
        </span>
        <div className="space-y-3">
          <p aria-live="polite" className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
            Your progress was saved
          </p>
          <h1
            className="font-serif-display text-[length:var(--text-page-title)] font-semibold tracking-tight text-balance"
            id="lesson-complete-heading"
            ref={headingRef}
            tabIndex={-1}
          >
            Lesson complete
          </h1>
          <p className="text-pretty leading-7 text-muted-foreground">
            You finished today&apos;s step.
          </p>
        </div>

        <section
          aria-labelledby="lesson-takeaway"
          className="space-y-2.5 rounded-[14px] border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground" id="lesson-takeaway">
            Today&apos;s takeaway
          </h2>
          <p className="text-pretty leading-7 text-foreground">{keyTakeaway}</p>
          <p className="text-sm text-muted-foreground">From {lessonTitle}</p>
        </section>

        <div className="space-y-1.5">
          {completion.journeyCompleted ? (
            <p className="leading-7 text-muted-foreground">
              You completed this journey. You can return whenever you would like to review what you
              learned.
            </p>
          ) : completion.nextDay ? (
            <p className="leading-7 text-muted-foreground">
              Your next step is ready whenever you are: Day {completion.nextDay}.
            </p>
          ) : (
            <p className="leading-7 text-muted-foreground">
              Your next step will be ready whenever you are.
            </p>
          )}
          {completion.xpAwarded > 0 ? (
            <p className="text-sm font-medium text-primary">
              +{completion.xpAwarded} Confidence XP
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          {completion.nextRoute ? (
            <Link
              className={cn(buttonVariants(), "min-h-12 px-6")}
              href={completion.nextRoute}
            >
              Continue to next lesson
            </Link>
          ) : null}
          <Link
            className={cn(
              buttonVariants({
                fullWidth: completion.nextRoute ? false : true,
                variant: completion.nextRoute ? "secondary" : "primary",
              }),
              "min-h-12 px-6",
            )}
            href="/journey"
          >
            Return to Today&apos;s Journey
          </Link>
          <Link
            className={cn(buttonVariants({ fullWidth: false, variant: "text" }), "min-h-11")}
            href="/stories"
          >
            Read a story
          </Link>
        </div>
      </div>
    </section>
  );
}
