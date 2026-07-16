import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { JourneyProgressSummary as ProgressData } from "@/features/journeys/types/journey-home";
import { cn } from "@/lib/utils";

export function JourneyProgressSummary({
  journeyTitle,
  progress,
}: {
  journeyTitle: string;
  progress: ProgressData;
}) {
  const weekStart = Math.floor((progress.currentDay - 1) / 5) * 5 + 1;
  const weekEnd = Math.min(weekStart + 4, progress.totalDays);
  const weekDays = Array.from({ length: weekEnd - weekStart + 1 }, (_, index) => weekStart + index);
  const completedThisWeek = weekDays.filter((day) => day <= progress.completedLessons).length;

  return (
    <section
      aria-labelledby="journey-progress-title"
      className="motion-reveal space-y-7 border-y border-border py-10"
    >
      <div className="flex items-end justify-between gap-5">
        <div className="space-y-2">
          <h2 className="editorial-eyebrow" id="journey-progress-title">
            This week
          </h2>
          <p className="text-sm text-muted-foreground">{journeyTitle}</p>
        </div>
        <p className="shrink-0 text-sm text-muted-foreground">
          {completedThisWeek} of {weekDays.length} complete
        </p>
      </div>
      <ol
        className="motion-cascade grid gap-3"
        style={{ gridTemplateColumns: `repeat(${weekDays.length}, minmax(0, 1fr))` }}
      >
        {weekDays.map((day) => {
          const isComplete = day <= progress.completedLessons;
          const isCurrent = day === progress.currentDay;
          return (
            <li className="space-y-3 text-center" key={day}>
              <span
                aria-label={`Day ${day}: ${isComplete ? "complete" : isCurrent ? "today" : "upcoming"}`}
                className={cn(
                  "block h-2 rounded-full bg-border",
                  isComplete && "bg-success/80",
                  isCurrent && !isComplete && "bg-accent-warm",
                )}
              />
              <span
                className={cn(
                  "text-xs text-muted-foreground",
                  isCurrent && "font-semibold text-foreground",
                )}
              >
                Day {day}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Day {progress.currentDay} of {progress.totalDays} · {progress.completedLessons} lessons
          complete overall
        </p>
        <Link
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-primary underline decoration-accent-warm/40 decoration-2 underline-offset-4 hover:decoration-accent-warm focus-visible:ring-2 focus-visible:ring-ring"
          href="/progress"
        >
          See the full journey
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
