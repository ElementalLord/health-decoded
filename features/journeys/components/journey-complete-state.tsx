import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { JourneyHomeComplete } from "@/features/journeys/types/journey-home";

export function JourneyCompleteState({ journey }: { journey: JourneyHomeComplete }) {
  return (
    <Card className="mx-auto max-w-2xl text-center">
      <CheckCircle2 aria-hidden="true" className="mx-auto size-10 text-success" />
      <h2 className="mt-5 text-[length:var(--text-section-title)] font-semibold">
        Your journey is complete
      </h2>
      <p className="mx-auto mt-2 max-w-lg leading-7 text-muted-foreground">
        You can return whenever you would like to review what you have learned.
      </p>
      <ProgressBar
        className="mt-6"
        label={`${journey.progress.totalDays} of ${journey.progress.totalDays} lessons complete`}
        value={100}
      />
    </Card>
  );
}
