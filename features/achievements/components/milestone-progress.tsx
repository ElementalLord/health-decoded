import { ProgressBar } from "@/components/ui/progress-bar";
import type { MilestoneProgress as MilestoneProgressValue } from "@/features/achievements/types/milestone";
import styles from "@/features/achievements/styles/milestone-collection.module.css";

export function MilestoneProgress({ progress }: { progress: MilestoneProgressValue }) {
  const target = Math.max(progress.target, 1);
  const current = Math.min(Math.max(progress.current, 0), target);
  const percentage = (current / target) * 100;
  const label = `${current} of ${target} ${progress.unit}`;
  return (
    <div className={styles.detailProgress}>
      <div>
        <strong>Your progress</strong>
        <span>{label}</span>
      </div>
      <ProgressBar className={styles.detailProgressBar!} label={label} value={percentage} />
    </div>
  );
}
