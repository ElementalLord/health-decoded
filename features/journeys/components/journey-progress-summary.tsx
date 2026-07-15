import { ProgressBar } from "@/components/ui/progress-bar";
import type { JourneyProgressSummary as ProgressData } from "@/features/journeys/types/journey-home";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function JourneyProgressSummary({
  journeyTitle,
  progress,
}: {
  journeyTitle: string;
  progress: ProgressData;
}) {
  const progressLabel = `${progress.completedLessons} of ${progress.totalDays} lessons complete`;

  return (
    <section
      aria-labelledby="journey-progress-title"
      className="space-y-4 rounded-[14px] border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6"
    >
      <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:gap-4">
        <div>
          <h2
            className="break-words font-serif-display text-[length:var(--text-card-title)] font-semibold tracking-tight"
            id="journey-progress-title"
          >
            Your {progress.totalDays}-day journey
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{journeyTitle}</p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-foreground">
          Day {progress.currentDay} of {progress.totalDays}
        </p>
      </div>
      <ProgressBar label={progressLabel} value={progress.percentage} />
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{progressLabel}</p>
        <Link
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[10px] text-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          href="/progress"
        >
          View progress
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
