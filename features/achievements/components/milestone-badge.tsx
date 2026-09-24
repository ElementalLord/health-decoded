import Link from "next/link";

import { MilestoneArtwork } from "@/features/achievements/components/milestone-artwork";
import type { MilestoneCollectionItem } from "@/features/achievements/types/milestone";
import styles from "@/features/achievements/styles/milestone-collection.module.css";
import { formatDateSafely } from "@/lib/dates/format-date";

function earnedDate(value: string) {
  return formatDateSafely(value, { dateStyle: "medium", timeZone: "UTC" }, "en-US");
}

function accessibleLabel(item: MilestoneCollectionItem) {
  const { definition, progress, unlockedAt } = item;
  if (definition.hidden && !unlockedAt) return "Hidden milestone. Not earned yet.";
  if (unlockedAt) {
    const date = earnedDate(unlockedAt);
    return `${definition.name} milestone. Earned${date ? ` ${date}` : ""}.`;
  }
  if (progress) {
    const current = Math.min(Math.max(progress.current, 0), progress.target);
    return `${definition.name} milestone. Not earned yet. ${current} of ${progress.target} ${progress.unit}.`;
  }
  return `${definition.name} milestone. Not earned yet.`;
}

export function MilestoneBadge({ item }: { item: MilestoneCollectionItem }) {
  const locked = !item.unlockedAt;
  const concealed = item.definition.hidden && locked;
  const name = concealed ? "???" : item.definition.name;
  const status = item.unlockedAt
    ? `Earned ${earnedDate(item.unlockedAt) || ""}`.trim()
    : item.progress
      ? `${Math.min(Math.max(item.progress.current, 0), item.progress.target)} of ${item.progress.target}`
      : "Not earned yet";

  return (
    <Link
      aria-label={accessibleLabel(item)}
      className={styles.badgeLink}
      data-locked={locked}
      href={`/milestones/${item.definition.slug}`}
    >
      <MilestoneArtwork item={item} />
      <span aria-hidden="true" className={styles.badgeLabel}>
        <strong>{name}</strong>
        <small>{status}</small>
      </span>
    </Link>
  );
}
