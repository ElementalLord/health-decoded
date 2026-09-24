import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import styles from "@/features/progress/components/progress-page.module.css";
import { JourneyProgressExperience } from "@/features/progress/components/journey-progress-experience";
import { ProgressEmptyState } from "@/features/progress/components/progress-empty-state";
import { getProgressData } from "@/features/progress/services/progress.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { sectionIcons } from "@/lib/section-icons";
import { cn } from "@/lib/utils";

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
    <section className={styles.progressPage}>
      <div className={styles.progressContent}>
        <div className={styles.progressHeader}>
          <PageHeader
            description="This is a record of the lessons and milestones you have completed."
            eyebrow="Your learning journey"
            title="Your progress"
          />
          <Link
            aria-label="View all milestones"
            className={cn(
              buttonVariants({ fullWidth: false, variant: "secondary" }),
              styles.milestonesLink,
            )}
            href="/milestones"
          >
            View milestones
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <JourneyProgressExperience achievement={achievement} data={data} />
      </div>
    </section>
  );
}
