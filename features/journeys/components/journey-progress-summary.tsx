import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { JourneyProgressSummary } from "@/features/journeys/types/journey-home";
import Link from "next/link";

export function JourneyProgressSummaryCard({
  journeyTitle,
  progress,
}: {
  journeyTitle: string;
  progress: JourneyProgressSummary;
}) {
  const progressLabel = `${progress.completedLessons} of ${progress.totalDays} lessons complete`;

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[length:var(--text-section-title)] font-semibold tracking-tight">
            Your journey
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{journeyTitle}</p>
        </div>
        <p className="text-sm font-medium text-foreground">Day {progress.currentDay}</p>
      </div>
      <ProgressBar label={progressLabel} value={progress.percentage} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{progressLabel}</p>
        <div className="flex flex-wrap items-center gap-1">
          <Link
            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-primary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            href="/progress"
          >
            View your progress
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-primary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            href="/caregiver"
          >
            Caregiver guidance
          </Link>
        </div>
      </div>
    </Card>
  );
}
