import { CompletionIllustration } from "@/components/illustrations/editorial-illustrations";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { JourneyHomeComplete } from "@/features/journeys/types/journey-home";

export function JourneyCompleteState({ journey }: { journey: JourneyHomeComplete }) {
  return (
    <section className="mx-auto max-w-2xl space-y-3 text-center">
      <CompletionIllustration className="mx-auto max-w-60" />
      <div className="space-y-1">
        <p className="editorial-eyebrow">Foundation phase · Days 1–14</p>
        <h2 className="font-serif-display text-4xl font-normal leading-tight text-balance sm:text-5xl">
          Your foundation is built
        </h2>
      </div>
      <ProgressBar
        className="mx-auto max-w-sm"
        label={`${journey.progress.totalDays} of ${journey.progress.totalDays} foundation lessons complete`}
        value={100}
      />
    </section>
  );
}
