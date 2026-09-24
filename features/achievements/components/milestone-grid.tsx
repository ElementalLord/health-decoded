import { MilestoneBadge } from "@/features/achievements/components/milestone-badge";
import type { MilestoneCollectionItem } from "@/features/achievements/types/milestone";
import styles from "@/features/achievements/styles/milestone-collection.module.css";

export function MilestoneGrid({ items }: { items: readonly MilestoneCollectionItem[] }) {
  return (
    <ul aria-label="Milestone collection" className={styles.badgeGrid}>
      {items.map((item) => (
        <li className={styles.badgeCell} key={item.definition.id}>
          <MilestoneBadge item={item} />
        </li>
      ))}
    </ul>
  );
}
