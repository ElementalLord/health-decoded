import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SunCupIllustration } from "@/components/illustrations/editorial-illustrations";
import { buttonVariants } from "@/components/ui/button";
import type { CurrentLessonSummary } from "@/features/journeys/types/journey-home";
import { cn } from "@/lib/utils";

const actionLabels = {
  not_started: "Start today's lesson",
  in_progress: "Continue today's lesson",
  completed: "Review completed lesson",
} as const;

export function TodaysLessonCard({ lesson }: { lesson: CurrentLessonSummary }) {
  const isFirstExperience = lesson.dayNumber === 1;
  const title = isFirstExperience ? "The First Five Minutes After Diagnosis" : lesson.title;
  const subtitle = isFirstExperience
    ? "A calm first step after hearing the diagnosis"
    : lesson.subtitle;
  const actionLabel = isFirstExperience
    ? lesson.status === "not_started"
      ? "Begin gently"
      : lesson.status === "in_progress"
        ? "Continue today’s experience"
        : "Return to today’s experience"
    : actionLabels[lesson.status];

  return (
    <article className="motion-reveal border-y border-border py-8 sm:py-10 lg:py-12">
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)] lg:gap-12">
        <div className="min-w-0 max-w-2xl">
          <p className="editorial-eyebrow">
            Day {String(lesson.dayNumber).padStart(2, "0")} ·{" "}
            {String(lesson.estimatedMinutes).padStart(2, "0")} min read
          </p>
          <h2 className="mt-4 break-words font-serif-display text-4xl font-normal leading-[1.02] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-5 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Link
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-h-14 px-7 transition-transform duration-150 active:scale-[0.97]",
              )}
              href={`/lessons/${lesson.dayNumber}`}
            >
              {actionLabel}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Take {isFirstExperience ? "this experience" : "today’s lesson"} at your own pace. Your
              place is saved.
            </p>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-[1.75rem] bg-[#f5eee6]">
          <SunCupIllustration className="block h-auto w-full [aspect-ratio:24/13]" />
        </div>
      </div>
    </article>
  );
}
