import { buttonVariants } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { JourneyProgressSummary } from "@/features/journeys/types/journey-home";
import Link from "next/link";

export function JourneyProgressSummary({
  journeyTitle,
  progress,
}: {
  journeyTitle: string;
  progress: JourneyProgressSummary;
}) {
  const progressLabel = `${progress.completedLessons} of ${progress.totalDays} lessons complete`;

  return (
    <section
      aria-labelledby="journey-progress-title"
      className="space-y-5 border-y border-border py-6"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            className="text-[length:var(--text-section-title)] font-medium tracking-tight"
            id="journey-progress-title"
          >
            Your journey
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{journeyTitle}</p>
        </div>
        <p className="text-sm font-medium text-foreground">Day {progress.currentDay}</p>
      </div>
      <ProgressBar label={progressLabel} value={progress.percentage} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{progressLabel}</p>
        <Link className={buttonVariants({ fullWidth: false, variant: "text" })} href="/progress">
          View your progress
        </Link>
      </div>
    </section>
  );
}
