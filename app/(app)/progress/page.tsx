import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { JourneyProgressExperience } from "@/features/progress/components/journey-progress-experience";
import { ProgressEmptyState } from "@/features/progress/components/progress-empty-state";
import { getProgressData } from "@/features/progress/services/progress.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = { title: "Progress", icons: sectionIcons("progress") };

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ completed?: string; xp?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile.ok) return <ProgressEmptyState />;
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const progress = await getProgressData();
  if (!progress.ok) return <ProgressEmptyState />;

  const data = progress.data;
  const { completed, xp } = await searchParams;
  const completedDay = Number(completed);
  const awardedXp = Number(xp);
  const matchingCompletion = data.completedLessonsHistory.find(
    (entry) => entry.dayNumber === completedDay && entry.xpAwarded === awardedXp,
  );
  const achievement = matchingCompletion
    ? { dayNumber: matchingCompletion.dayNumber, xpAwarded: matchingCompletion.xpAwarded }
    : null;

  return (
    <section className="mx-auto max-w-5xl space-y-10 py-6 sm:space-y-12 sm:py-10">
      <div>
        <PageHeader
          description="This is a record of the lessons and milestones you have completed."
          eyebrow="Your learning journey"
          title="Your progress"
        />
      </div>
      <JourneyProgressExperience achievement={achievement} data={data} />
    </section>
  );
}
