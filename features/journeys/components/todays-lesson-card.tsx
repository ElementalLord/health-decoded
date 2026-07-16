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
    <article className="motion-reveal border-b border-border pb-12 sm:pb-16">
      <div className="mx-auto max-w-6xl">
        <SunCupIllustration className="mx-auto max-h-[31rem] max-w-5xl" />
        <div className="mx-auto -mt-6 max-w-4xl px-1 sm:-mt-10">
          <p className="editorial-eyebrow">
            Day {String(lesson.dayNumber).padStart(2, "0")} ·{" "}
            {String(lesson.estimatedMinutes).padStart(2, "0")} min read
          </p>
          <h2 className="mt-6 break-words font-serif-display text-5xl font-normal leading-[0.98] text-balance sm:text-6xl lg:text-7xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              {subtitle}
            </p>
          ) : null}
          <Link
            className={cn(buttonVariants({ size: "lg" }), "mt-8 min-h-14 px-7")}
            href={`/lessons/${lesson.dayNumber}`}
          >
            {actionLabel}
            <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Take {isFirstExperience ? "this experience" : "today’s lesson"} at your own pace. Your
            place is saved as you go.
          </p>
        </div>
      </div>
    </article>
  );
}
