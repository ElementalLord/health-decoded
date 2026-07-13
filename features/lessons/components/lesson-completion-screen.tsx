"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { buttonVariants } from "@/components/ui/button";
import type { LessonCompletionResult } from "@/features/lessons/types/lesson-completion";

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
      <div className="space-y-6 border-y border-border py-8 sm:py-10">
        <CheckCircle2 aria-hidden="true" className="size-10 text-primary" />
        <div className="space-y-2">
          <p aria-live="polite" className="text-sm font-medium text-primary">
            Your progress was saved
          </p>
          <h1
            className="text-[length:var(--text-page-title)] font-medium tracking-tight"
            id="lesson-complete-heading"
            ref={headingRef}
            tabIndex={-1}
          >
            Lesson complete
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            You finished today&apos;s step.
          </p>
        </div>

        <section
          aria-labelledby="lesson-takeaway"
          className="space-y-2 border-y border-border py-5"
        >
          <h2 className="text-sm font-medium" id="lesson-takeaway">
            Today&apos;s takeaway
          </h2>
          <p className="leading-7 text-foreground">{keyTakeaway}</p>
          <p className="text-sm text-muted-foreground">From {lessonTitle}</p>
        </section>

        <div className="space-y-1">
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
            <p className="text-sm text-muted-foreground">+{completion.xpAwarded} Confidence XP</p>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          {completion.nextRoute ? (
            <Link className={buttonVariants()} href={completion.nextRoute}>
              Continue to next lesson
            </Link>
          ) : null}
          <Link
            className={buttonVariants({
              fullWidth: completion.nextRoute ? false : true,
              variant: completion.nextRoute ? "secondary" : "primary",
            })}
            href="/journey"
          >
            Return to Today&apos;s Journey
          </Link>
          <Link className={buttonVariants({ fullWidth: false, variant: "text" })} href="/stories">
            Read a story
          </Link>
        </div>
      </div>
    </section>
  );
}
