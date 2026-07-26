import { CompletionIllustration } from "@/components/illustrations/editorial-illustrations";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { JourneyHomeComplete } from "@/features/journeys/types/journey-home";

export function JourneyCompleteState({ journey }: { journey: JourneyHomeComplete }) {
  return (
    <section className="mx-auto max-w-2xl space-y-7 border-y border-border py-10 text-center sm:py-14">
      <CompletionIllustration className="mx-auto max-w-sm" />
      <div className="space-y-3">
        <p className="editorial-eyebrow">Foundation phase · Days 1–14</p>
        <h2 className="font-serif-display text-4xl font-normal leading-tight text-balance sm:text-5xl">
          Your foundation is built
        </h2>
        <p className="mx-auto max-w-md text-pretty leading-7 text-muted-foreground">
          This milestone is not the end of Health Decoded. The next 76 days will turn what you
          understand into confidence through practice, repetition, and real life.
        </p>
      </div>
      <ProgressBar
        className="mx-auto max-w-sm"
        label={`${journey.progress.totalDays} of ${journey.progress.totalDays} foundation lessons complete`}
        value={100}
      />
    </section>
  );
}
