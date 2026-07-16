"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { CompletionIllustration } from "@/components/illustrations/editorial-illustrations";
import { buttonVariants } from "@/components/ui/button";
import type { LessonCompletionResult } from "@/features/lessons/types/lesson-completion";
import { cn } from "@/lib/utils";

export function LessonCompletionScreen({
  completion,
  dayNumber,
  keyTakeaway,
  lessonTitle,
}: {
  completion: LessonCompletionResult;
  dayNumber: number;
  keyTakeaway: string;
  lessonTitle: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section aria-labelledby="lesson-complete-heading" className="mx-auto max-w-4xl py-6 sm:py-10">
      <div className="space-y-8 border-y border-border py-8 sm:py-12">
        <CompletionIllustration className="mx-auto max-w-sm" />
        <div className="space-y-3 text-center">
          <p aria-live="polite" className="editorial-eyebrow">
            Day {dayNumber} · Your progress was saved
          </p>
          <h1
            className="font-serif-display text-[length:var(--text-page-title)] font-normal leading-none text-balance"
            id="lesson-complete-heading"
            ref={headingRef}
            tabIndex={-1}
          >
            Complete.
          </h1>
          <p className="text-pretty leading-7 text-muted-foreground">
            You finished today&apos;s step.
          </p>
        </div>

        <section
          aria-labelledby="lesson-takeaway"
          className="space-y-5 border-l-[3px] border-accent-warm px-6 py-3 sm:px-9"
        >
          <h2 className="editorial-eyebrow" id="lesson-takeaway">
            Today&apos;s takeaway
          </h2>
          <p className="text-pretty font-serif-display text-3xl italic leading-tight text-foreground sm:text-4xl">
            {keyTakeaway}
          </p>
          <p className="text-sm text-muted-foreground">From {lessonTitle}</p>
        </section>

        <div className="space-y-2 bg-muted/55 px-6 py-7 sm:px-8">
          <p className="editorial-eyebrow text-success">One thing you learned</p>
          <p className="font-serif-display text-2xl leading-8">{keyTakeaway}</p>
        </div>

        <div className="space-y-1.5 border-t border-border pt-8">
          <p className="editorial-eyebrow">Tomorrow</p>
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
            <Link className={cn(buttonVariants(), "min-h-12 px-6")} href={completion.nextRoute}>
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
