import { redirect } from "next/navigation";
import Link from "next/link";

import { SunCupIllustration } from "@/components/illustrations/editorial-illustrations";
import { ActionRow } from "@/components/shared/action-row";
import { buttonVariants } from "@/components/ui/button";
import { AiTutorActionRow } from "@/features/ai/components/ai-tutor-trigger";
import { JourneyCompleteState } from "@/features/journeys/components/journey-complete-state";
import { JourneyGreeting } from "@/features/journeys/components/journey-greeting";
import { JourneyProgressSummary } from "@/features/journeys/components/journey-progress-summary";
import { JourneyUnavailableState } from "@/features/journeys/components/journey-unavailable-state";
import { LessonCompletionArrival } from "@/features/journeys/components/lesson-completion-arrival";
import { getJourneyHomeData } from "@/features/journeys/services/journey-home.server";
import { NextStepPanel } from "@/features/next-step/components/next-step-panel";
import { getNextStep } from "@/features/next-step/services/next-step.server";
import { fallbackNextStepForJourney } from "@/features/next-step/lib/recommend-next-step";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { LearningStreakPanel } from "@/features/streaks/components/learning-streak-panel";
import { getLearningStreak } from "@/features/streaks/services/learning-streak.server";
import { JourneySpacedReview } from "@/features/spaced-review/components/journey-spaced-review";
import { getSpacedReviewOpportunity } from "@/features/spaced-review/services/spaced-review.server";
import { unexpectedError } from "@/lib/errors/application-error";
import { createServerLogger } from "@/lib/logging/server";
import { settleResult } from "@/lib/reliability/dependency-boundary";
import { sectionIcons } from "@/lib/section-icons";

const logger = createServerLogger();

export const metadata = { title: "Your journey", icons: sectionIcons("journey") };

export default async function JourneyPage({
  searchParams,
}: {
  searchParams: Promise<{ completed?: string; welcome?: string }>;
}) {
  const { completed, welcome } = await searchParams;
  const profile = await settleResult(getCurrentProfile, unexpectedError(), () =>
    logger.error("journey.profile_rejected"),
  );

  if (!profile.ok) {
    return (
      <section className="py-8 sm:py-12">
        <h1 className="sr-only">Today&apos;s Journey</h1>
        <JourneyUnavailableState />
      </section>
    );
  }

  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const [journey, spacedReview, learningStreak] = await Promise.all([
    settleResult(getJourneyHomeData, unexpectedError(), () =>
      logger.error("journey.core_rejected"),
    ),
    settleResult(
      () => getSpacedReviewOpportunity({ manual: false }),
      unexpectedError(),
      () => logger.error("journey.spaced_review_rejected"),
    ),
    settleResult(getLearningStreak, unexpectedError(), () =>
      logger.error("journey.streak_rejected"),
    ),
  ]);

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
  const dueReview = spacedReview.ok && spacedReview.data.due;
  const nextStep = await settleResult(
    () => getNextStep(journey.data, showCompletionArrival ? completedDay : undefined, dueReview),
    unexpectedError(),
    () => logger.error("journey.next_step_rejected"),
  );
  const nextStepSelection = nextStep.ok ? nextStep.data : fallbackNextStepForJourney(journey.data);
  const supportTools = (
    <section aria-labelledby="journey-tools" className="motion-reveal border-y border-border py-5">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-baseline sm:gap-8">
        <h2
          className="font-serif-display text-2xl tracking-[-0.015em] sm:text-3xl"
          id="journey-tools"
        >
          Support for what&apos;s next.
        </h2>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Review, prepare, or get a little more guidance.
        </p>
      </div>
      <div className="mt-5 grid gap-6 border-t border-border pt-5 sm:grid-cols-2 sm:gap-10">
        <section aria-labelledby="journey-tools-learning">
          <h3 className="editorial-eyebrow mb-2" id="journey-tools-learning">
            Keep learning
          </h3>
          <div className="divide-y divide-border border-y border-border">
            <JourneySpacedReview
              compact
              prompt={
                !showCompletionArrival &&
                welcome !== "1" &&
                spacedReview.ok &&
                spacedReview.data.automaticEligible &&
                spacedReview.data.candidate &&
                spacedReview.data.promptCopy
                  ? {
                      challengeId: spacedReview.data.candidate.challengeId,
                      copy: spacedReview.data.promptCopy,
                    }
                  : null
              }
            />
            <ActionRow
              compact
              description="Revisit completed lessons and milestones."
              href="/progress"
              title="Open your learning record"
            />
          </div>
        </section>
        <section aria-labelledby="journey-tools-support">
          <h3 className="editorial-eyebrow mb-2" id="journey-tools-support">
            Get support
          </h3>
          <div className="divide-y divide-border border-y border-border">
            <AiTutorActionRow
              compact
              description="Get calm, plain-language educational answers."
              title="Ask your AI guide"
            />
            <ActionRow
              compact
              description="Gather questions before a visit."
              href="/appointment-prep"
              title="Prepare for an appointment"
            />
          </div>
        </section>
      </div>
    </section>
  );

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

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.7fr)_minmax(15rem,0.7fr)] lg:gap-10">
        <NextStepPanel selection={nextStepSelection} />
        {learningStreak.ok ? <LearningStreakPanel streak={learningStreak.data} /> : null}
      </div>

      {showCompletionArrival ? (
        <LessonCompletionArrival
          completedLessons={journey.data.progress.completedLessons}
          dayNumber={completedDay}
          journeyComplete={journey.data.kind === "complete"}
        />
      ) : null}

      {journey.data.kind === "complete" ? (
        <>
          {supportTools}
          <JourneyCompleteState journey={journey.data} />
        </>
      ) : (
        <>
          <section
            aria-labelledby="why-this-matters"
            className="motion-reveal grid items-start gap-5 border-y border-border py-6 sm:grid-cols-[0.55fr_1.45fr] sm:items-center sm:gap-10"
          >
            <div className="min-w-0">
              <h2 className="editorial-eyebrow" id="why-this-matters">
                Why this matters today
              </h2>
              <div
                aria-hidden="true"
                className="mt-4 w-full overflow-hidden rounded-[1rem] bg-[#f5eee6] sm:mt-5 sm:max-w-[15rem] sm:rounded-[1.25rem]"
              >
                <SunCupIllustration className="block h-auto w-full [aspect-ratio:16/7] sm:[aspect-ratio:24/13]" />
              </div>
            </div>
            <p className="max-w-3xl text-pretty font-serif-display text-2xl font-normal leading-9 text-foreground sm:text-3xl">
              {journey.data.currentLesson.whyItMatters}
            </p>
          </section>

          <JourneyProgressSummary
            journeyTitle={journey.data.journeyTitle}
            progress={journey.data.progress}
          />
        </>
      )}

      {journey.data.kind !== "complete" ? supportTools : null}

      <footer className="flex flex-col items-start gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Want to revisit the short introduction? Previewing it will not change your saved starting
          preference or learning progress.
        </p>
        <Link
          className={buttonVariants({ fullWidth: false, size: "sm", variant: "secondary" })}
          href="/onboarding?mode=preview"
        >
          Preview onboarding
        </Link>
      </footer>
    </section>
  );
}
