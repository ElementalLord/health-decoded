import { redirect } from "next/navigation";

import { CompletedLessonsList } from "@/features/progress/components/completed-lessons-list";
import { ConfidenceHistoryList } from "@/features/progress/components/confidence-history-list";
import { ConfidenceMap } from "@/features/progress/components/confidence-map";
import { ConfidenceXpSummary } from "@/features/progress/components/confidence-xp-summary";
import { ProgressEmptyState } from "@/features/progress/components/progress-empty-state";
import { getProgressData } from "@/features/progress/services/progress.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { JourneyProgressSummaryCard } from "@/features/journeys/components/journey-progress-summary";
import Link from "next/link";

export default async function ProgressPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) return <ProgressEmptyState />;
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const progress = await getProgressData();
  if (!progress.ok) return <ProgressEmptyState />;

  const data = progress.data;

  return (
    <section className="mx-auto max-w-4xl space-y-8 py-6 sm:space-y-10 sm:py-10">
      <header className="max-w-2xl space-y-2">
        <h1 className="text-[length:var(--text-page-title)] font-semibold tracking-tight">
          Your progress
        </h1>
        <p className="leading-7 text-muted-foreground">
          This is a record of your learning. Confidence can change from day to day, and lower
          confidence is not failure.
        </p>
      </header>

      <ConfidenceMap milestones={data.milestones} />
      <JourneyProgressSummaryCard
        journeyTitle={data.journeyTitle}
        progress={{
          completedLessons: data.completedLessons,
          currentDay: data.journeyComplete
            ? data.totalLessons
            : (data.milestones.find((milestone) => milestone.state === "current")?.dayNumber ??
              data.totalLessons),
          percentage: data.percentage,
          totalDays: data.totalLessons,
        }}
      />
      <ConfidenceXpSummary total={data.totalConfidenceXp} />
      <ConfidenceHistoryList entries={data.confidenceHistory} />
      <CompletedLessonsList entries={data.completedLessonsHistory} />
      <Link
        className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-primary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        href="/stories"
      >
        Read patient stories
      </Link>
    </section>
  );
}
