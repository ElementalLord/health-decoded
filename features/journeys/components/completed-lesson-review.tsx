import { ArrowRight, Check, ChevronDown, LibraryBig } from "lucide-react";
import Link from "next/link";

import type { JourneyReviewStage } from "@/features/journeys/types/journey-home";

export function CompletedLessonReview({ stages }: { stages: JourneyReviewStage[] }) {
  const completedLessonCount = stages.reduce((total, stage) => total + stage.lessons.length, 0);
  if (completedLessonCount === 0) return null;

  return (
    <section aria-labelledby="completed-review-title" className="motion-reveal">
      <details className="group/library overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]">
        <summary className="flex min-h-24 cursor-pointer list-none items-center gap-4 p-5 transition-colors duration-[var(--duration-fast)] hover:bg-muted/35 sm:p-6 [&::-webkit-details-marker]:hidden">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-info text-info-foreground">
            <LibraryBig aria-hidden="true" className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="editorial-eyebrow block">Your lesson library</span>
            <span
              className="mt-1 block font-serif-display text-2xl font-semibold leading-tight sm:text-3xl"
              id="completed-review-title"
            >
              {completedLessonCount} completed {completedLessonCount === 1 ? "lesson" : "lessons"}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Open the library whenever you want to revisit an idea.
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-normal)] group-open/library:rotate-180"
          />
        </summary>

        <div className="space-y-3 border-t border-border bg-background/35 p-3 sm:p-5">
          {stages.map((stage) => (
            <details
              className="group/stage overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
              key={stage.stageNumber}
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 transition-colors duration-[var(--duration-fast)] hover:bg-muted/35 sm:px-5 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-serif-display text-sm font-semibold">
                  {stage.stageNumber}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif-display text-lg font-semibold">
                    {stage.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {stage.dayRange} · {stage.lessons.length}{" "}
                    {stage.lessons.length === 1 ? "lesson" : "lessons"} complete
                  </span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-normal)] group-open/stage:rotate-180"
                />
              </summary>

              <div className="border-t border-border px-4 sm:px-5">
                {stage.lessons.length ? (
                  <ol className="divide-y divide-border">
                    {stage.lessons.map((lesson) => (
                      <li key={lesson.dayNumber}>
                        <Link
                          className="group flex min-h-16 items-center gap-3 py-3 transition-colors duration-[var(--duration-fast)] hover:text-primary"
                          href={`/lessons/${lesson.dayNumber}`}
                        >
                          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
                            <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium">
                              Day {lesson.dayNumber}: {lesson.title}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                              {lesson.subtitle ?? "Review this completed lesson."} ·{" "}
                              {lesson.estimatedMinutes} min
                            </span>
                          </span>
                          <ArrowRight
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
                          />
                        </Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="py-4 text-sm leading-6 text-muted-foreground">
                    Completed lessons from this stage will appear here.
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </details>
    </section>
  );
}
