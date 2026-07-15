import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { JourneyHomeComplete } from "@/features/journeys/types/journey-home";

export function JourneyCompleteState({ journey }: { journey: JourneyHomeComplete }) {
  return (
    <Card className="mx-auto max-w-2xl space-y-6 p-8 text-center sm:p-10">
      <span
        aria-hidden="true"
        className="inline-flex size-14 items-center justify-center rounded-full bg-success/12 text-success"
      >
        <CheckCircle2 className="size-7" strokeWidth={2} />
      </span>
      <div className="space-y-3">
        <h2 className="font-serif-display text-[length:var(--text-section-title)] font-semibold text-balance">
          Your journey is complete
        </h2>
        <p className="mx-auto max-w-md text-pretty leading-7 text-muted-foreground">
          You can return whenever you would like to review what you have learned.
        </p>
      </div>
      <ProgressBar
        className="mx-auto max-w-sm"
        label={`${journey.progress.totalDays} of ${journey.progress.totalDays} lessons complete`}
        value={100}
      />
    </Card>
  );
}
