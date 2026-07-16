import { CompletionIllustration } from "@/components/illustrations/editorial-illustrations";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { JourneyHomeComplete } from "@/features/journeys/types/journey-home";

export function JourneyCompleteState({ journey }: { journey: JourneyHomeComplete }) {
  return (
    <section className="mx-auto max-w-2xl space-y-7 border-y border-border py-10 text-center sm:py-14">
      <CompletionIllustration className="mx-auto max-w-sm" />
      <div className="space-y-3">
        <p className="editorial-eyebrow">All ninety days</p>
        <h2 className="font-serif-display text-4xl font-normal leading-tight text-balance sm:text-5xl">
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
    </section>
  );
}
