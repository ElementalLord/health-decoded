import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { JourneyProgressSummary } from "@/features/journeys/types/journey-home";

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
      <p className="text-sm text-muted-foreground">{progressLabel}</p>
    </Card>
  );
}
