import { ProgressBar } from "@/components/ui/progress-bar";
import { MilestoneGrid } from "@/features/achievements/components/milestone-grid";
import type { MilestoneCollectionItem } from "@/features/achievements/types/milestone";
import styles from "@/features/achievements/styles/milestone-collection.module.css";

export function MilestonesPage({ items }: { items: readonly MilestoneCollectionItem[] }) {
  const earnedCount = items.filter((item) => item.unlockedAt).length;
  const completion = items.length ? (earnedCount / items.length) * 100 : 0;

  return (
    <main className={styles.collectionPage}>
      <header className={styles.collectionHeader}>
        <div>
          <p className="editorial-eyebrow">Your progress</p>
          <h1>Your Milestones</h1>
          <p>
            {earnedCount === 0
              ? "Your first milestones will appear as you learn, practice, and prepare. None of them measure your health."
              : "Small wins add up. See everything you’ve accomplished on your journey."}
          </p>
        </div>
        <div className={styles.collectionSummary}>
          <p>
            <strong>{earnedCount}</strong> of {items.length} milestones earned
          </p>
          <ProgressBar
            className={styles.collectionProgress!}
            label={`${earnedCount} of ${items.length} milestones earned`}
            value={completion}
          />
        </div>
      </header>

      <section aria-labelledby="milestone-collection-heading" className={styles.collection}>
        <h2 className={styles.visuallyHidden} id="milestone-collection-heading">
          Milestone collection
        </h2>
        <MilestoneGrid items={items} />
      </section>

      <p className={styles.collectionBoundary}>
        Milestones recognize learning and preparation inside Health Decoded. They do not measure
        your health, treatment success, or quality of diabetes management.
      </p>
    </main>
  );
}
