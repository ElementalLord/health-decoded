import { redirect } from "next/navigation";

import { ActionRow } from "@/components/shared/action-row";
import { ConfidenceCheck } from "@/features/journeys/components/confidence-check";
import { JourneyCompleteState } from "@/features/journeys/components/journey-complete-state";
import { JourneyGreeting } from "@/features/journeys/components/journey-greeting";
import { JourneyProgressSummary } from "@/features/journeys/components/journey-progress-summary";
import { JourneyUnavailableState } from "@/features/journeys/components/journey-unavailable-state";
import { LessonCompletionArrival } from "@/features/journeys/components/lesson-completion-arrival";
import { TodaysLessonCard } from "@/features/journeys/components/todays-lesson-card";
import { getJourneyHomeData } from "@/features/journeys/services/journey-home.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export const metadata = { title: "Your journey" };

export default async function JourneyPage({
  searchParams,
}: {
  searchParams: Promise<{ completed?: string; welcome?: string }>;
}) {
  const { completed, welcome } = await searchParams;
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

  const completedDay = Number(completed);
  const showCompletionArrival =
    Number.isInteger(completedDay) &&
    completedDay >= 1 &&
    completedDay <= journey.data.progress.totalDays &&
    completedDay <= journey.data.progress.completedLessons;

  return (
    <section className="space-y-12 py-3 sm:space-y-16 sm:py-6">
      <JourneyGreeting
        completedLessons={journey.data.progress.completedLessons}
        currentLessonStatus={
          journey.data.kind === "ready" ? journey.data.currentLesson.status : undefined
        }
        displayName={profile.data.display_name}
        firstVisit={welcome === "1"}
        journeyComplete={journey.data.kind === "complete"}
        totalLessons={journey.data.progress.totalDays}
      />

      {showCompletionArrival ? (
        <LessonCompletionArrival
          completedLessons={journey.data.progress.completedLessons}
          dayNumber={completedDay}
          journeyComplete={journey.data.kind === "complete"}
        />
      ) : null}

      {journey.data.kind === "complete" ? (
        <>
          <JourneyCompleteState journey={journey.data} />
          <div className="motion-reveal border-y border-border">
            <ActionRow
              description="Revisit completed lessons, confidence check-ins, and milestones together."
              href="/progress"
              title="Open your learning record"
            />
          </div>
        </>
      ) : (
        <>
          <TodaysLessonCard lesson={journey.data.currentLesson} />

          <section
            aria-labelledby="why-this-matters"
            className="motion-reveal grid gap-5 border-l-2 border-accent-warm py-3 pl-6 sm:grid-cols-[0.55fr_1.45fr] sm:pl-9"
          >
            <h2 className="editorial-eyebrow" id="why-this-matters">
              Why this matters today
            </h2>
            <p className="max-w-3xl text-pretty font-serif-display text-2xl font-normal leading-9 text-foreground sm:text-3xl">
              {journey.data.currentLesson.whyItMatters}
            </p>
          </section>

          <JourneyProgressSummary
            journeyTitle={journey.data.journeyTitle}
            progress={journey.data.progress}
          />

          {journey.data.currentLesson.lessonProgressId ? (
            <ConfidenceCheck
              initialValue={journey.data.confidenceLevel}
              lessonProgressId={journey.data.currentLesson.lessonProgressId}
            />
          ) : null}

          <section
            aria-labelledby="journey-support"
            className="motion-reveal space-y-5 border-t border-border pt-9"
          >
            <div className="space-y-3">
              <h2 className="editorial-eyebrow" id="journey-support">
                Need more support?
              </h2>
              <p className="max-w-2xl text-pretty leading-7 text-muted-foreground">
                Choose the kind of support that feels useful right now.
              </p>
            </div>
            <div className="motion-cascade divide-y divide-border border-y border-border">
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
              <ActionRow
                description="Get calm, plain-language educational answers to your questions."
                href="/ai"
                title="Ask your AI guide"
              />
            </div>
          </section>
        </>
      )}
    </section>
  );
}
