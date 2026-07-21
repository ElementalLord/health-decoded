import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ConfidenceXpSummary } from "@/features/progress/components/confidence-xp-summary";
import { LearningRecord } from "@/features/progress/components/learning-record";
import { ProgressEmptyState } from "@/features/progress/components/progress-empty-state";
import { getProgressData } from "@/features/progress/services/progress.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export const metadata = { title: "Progress" };

export default async function ProgressPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) return <ProgressEmptyState />;
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const progress = await getProgressData();
  if (!progress.ok) return <ProgressEmptyState />;

  const data = progress.data;

  return (
    <section className="mx-auto max-w-5xl space-y-10 py-6 sm:space-y-12 sm:py-10">
      <div className="motion-reveal">
        <PageHeader
          description="This is a record of your learning. Confidence can change from day to day, and lower confidence is not failure."
          eyebrow="Your learning journey"
          title="Your progress"
        />
      </div>

      <section
        aria-labelledby="progress-overview"
        className="motion-reveal grid gap-8 border-y border-border py-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-12 sm:py-10"
      >
        <div>
          <p className="font-serif-display text-8xl font-light leading-none text-accent-warm sm:text-9xl">
            {Math.round(data.percentage)}%
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            percent explored
          </p>
        </div>
        <div className="space-y-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2
                className="font-serif-display text-[length:var(--text-section-title)] font-semibold tracking-tight"
                id="progress-overview"
              >
                Journey overview
              </h2>
              <p className="text-sm text-muted-foreground">{data.journeyTitle}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-foreground">
              {data.completedLessons} of {data.totalLessons} lessons complete
            </p>
          </div>
          <ProgressBar
            label={`${data.completedLessons} of ${data.totalLessons} lessons complete`}
            value={data.percentage}
          />
        </div>
      </section>

      <div className="motion-reveal">
        <ConfidenceXpSummary total={data.totalConfidenceXp} />
      </div>
      <div className="motion-reveal">
        <LearningRecord
          completedLessons={data.completedLessonsHistory}
          confidenceHistory={data.confidenceHistory}
          milestones={data.milestones}
        />
      </div>
    </section>
  );
}
