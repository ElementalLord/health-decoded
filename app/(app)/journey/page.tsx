import { redirect } from "next/navigation";

import { ConfidenceCheck } from "@/features/journeys/components/confidence-check";
import { JourneyCompleteState } from "@/features/journeys/components/journey-complete-state";
import { JourneyGreeting } from "@/features/journeys/components/journey-greeting";
import { JourneyProgressSummaryCard } from "@/features/journeys/components/journey-progress-summary";
import { JourneyUnavailableState } from "@/features/journeys/components/journey-unavailable-state";
import { TodaysLessonCard } from "@/features/journeys/components/todays-lesson-card";
import { getJourneyHomeData } from "@/features/journeys/services/journey-home.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function JourneyPage() {
  const profile = await getCurrentProfile();

  if (!profile.ok) {
    return (
      <section className="py-8 sm:py-12">
        <h1 className="sr-only">Today&apos;s Journey</h1>
        <JourneyUnavailableState />
      </section>
    );
  }

  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const journey = await getJourneyHomeData();

  if (!journey.ok) {
    return (
      <section className="py-8 sm:py-12">
        <h1 className="sr-only">Today&apos;s Journey</h1>
        <JourneyUnavailableState />
      </section>
    );
  }

  return (
    <section className="space-y-8 py-6 sm:space-y-10 sm:py-10">
      <JourneyGreeting displayName={profile.data.display_name} />

      {journey.data.kind === "complete" ? (
        <JourneyCompleteState journey={journey.data} />
      ) : (
        <>
          <TodaysLessonCard lesson={journey.data.currentLesson} />

          <section aria-labelledby="why-this-matters" className="max-w-3xl space-y-2">
            <h2
              className="text-[length:var(--text-section-title)] font-semibold tracking-tight"
              id="why-this-matters"
            >
              Why this matters today
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              {journey.data.currentLesson.whyItMatters}
            </p>
          </section>

          <JourneyProgressSummaryCard
            journeyTitle={journey.data.journeyTitle}
            progress={journey.data.progress}
          />

          {journey.data.currentLesson.lessonProgressId ? (
            <ConfidenceCheck
              initialValue={journey.data.confidenceLevel}
              lessonProgressId={journey.data.currentLesson.lessonProgressId}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
