import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import type { JourneyReviewStage } from "@/features/journeys/types/journey-home";

export function CompletedLessonReview({ stages }: { stages: JourneyReviewStage[] }) {
  const completedLessonCount = stages.reduce((total, stage) => total + stage.lessons.length, 0);
  if (completedLessonCount === 0) return null;

  return (
    <section aria-labelledby="completed-review-title" className="motion-reveal space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="editorial-eyebrow">Your lesson library</p>
        <h2
          className="font-serif-display text-4xl font-normal leading-tight sm:text-5xl"
          id="completed-review-title"
        >
          Return to what you have learned.
        </h2>
        <p className="text-pretty leading-7 text-muted-foreground">
          Completed lessons stay here, organized by stage, so you can review them whenever an idea
          needs another look.
        </p>
      </div>

      <div className="space-y-10">
        {stages.map((stage) => (
          <section
            aria-labelledby={`review-stage-${stage.stageNumber}`}
            className="grid gap-5 border-t border-border pt-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
            key={stage.stageNumber}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-warm">
                Stage {stage.stageNumber}
              </p>
              <h3
                className="mt-2 font-serif-display text-2xl font-semibold"
                id={`review-stage-${stage.stageNumber}`}
              >
                {stage.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{stage.dayRange}</p>
            </div>

            {stage.lessons.length ? (
              <ol className="motion-reveal-list divide-y divide-border border-y border-border">
                {stage.lessons.map((lesson) => (
                  <li key={lesson.dayNumber}>
                    <Link
                      className="group grid min-h-20 gap-2 py-4 transition-colors duration-[var(--duration-fast)] hover:text-primary sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                      href={`/lessons/${lesson.dayNumber}`}
                    >
                      <span className="inline-flex size-8 items-center justify-center rounded-full bg-success/12 text-success">
                        <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
                      </span>
                      <span>
                        <span className="block font-serif-display text-xl font-semibold">
                          Day {lesson.dayNumber}: {lesson.title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                          {lesson.subtitle ?? "Review this completed lesson."} ·{" "}
                          {lesson.estimatedMinutes} min
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold">
                        Review
                        <ArrowRight
                          aria-hidden="true"
                          className="size-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="border-y border-border py-5 text-sm leading-6 text-muted-foreground">
                Completed lessons from this stage will appear here.
              </p>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
