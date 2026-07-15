import { redirect } from "next/navigation";

import { ActionRow } from "@/components/shared/action-row";
import { DevelopmentNotice } from "@/components/shared/development-notice";
import { SectionHeader } from "@/components/shared/section-header";
import { ConfidenceCheck } from "@/features/journeys/components/confidence-check";
import { JourneyCompleteState } from "@/features/journeys/components/journey-complete-state";
import { JourneyGreeting } from "@/features/journeys/components/journey-greeting";
import { JourneyProgressSummary } from "@/features/journeys/components/journey-progress-summary";
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
    <section className="space-y-8 py-5 sm:space-y-10 sm:py-8">
      <JourneyGreeting displayName={profile.data.display_name} />

      {journey.data.kind === "complete" ? (
        <JourneyCompleteState journey={journey.data} />
      ) : (
        <>
          {journey.data.currentLesson.isDevelopmentContent ? <DevelopmentNotice /> : null}

          <TodaysLessonCard lesson={journey.data.currentLesson} />

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,680px)_minmax(280px,320px)] lg:justify-between">
            {journey.data.currentLesson.isDevelopmentContent ? (
              <section aria-labelledby="lesson-context" className="space-y-3 py-1">
                <SectionHeader
                  description="You can use it to check navigation, reading flow, activities, and progress while reviewed lesson content is prepared."
                  title="About this preview"
                />
              </section>
            ) : (
              <section aria-labelledby="why-this-matters" className="space-y-3 py-1">
                <SectionHeader
                  description={journey.data.currentLesson.whyItMatters}
                  title="Why this matters today"
                />
              </section>
            )}

            <JourneyProgressSummary
              journeyTitle={journey.data.journeyTitle}
              progress={journey.data.progress}
            />
          </div>

          {journey.data.currentLesson.lessonProgressId ? (
            <ConfidenceCheck
              initialValue={journey.data.confidenceLevel}
              lessonProgressId={journey.data.currentLesson.lessonProgressId}
            />
          ) : null}

          <section aria-labelledby="journey-support" className="space-y-4">
            <SectionHeader
              description="Read practical support information and lived-experience stories."
              title="Need more support?"
            />
            <div className="overflow-hidden rounded-[14px] border border-border bg-card divide-y divide-border">
              <ActionRow
                description="Practical ways for family and friends to offer support."
                href="/caregiver"
                title="Caregiver guidance"
              />
              <ActionRow
                description="Fictional composite stories about living with Type 2 diabetes."
                href="/stories"
                title="Read patient stories"
              />
            </div>
          </section>
        </>
      )}
    </section>
  );
}
