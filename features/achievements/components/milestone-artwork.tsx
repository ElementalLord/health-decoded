import { LockKeyhole } from "lucide-react";
import Image from "next/image";

import type { MilestoneCollectionItem } from "@/features/achievements/types/milestone";
import styles from "@/features/achievements/styles/milestone-collection.module.css";

export function MilestoneArtwork({
  item,
  variant = "collection",
}: {
  item: MilestoneCollectionItem;
  variant?: "collection" | "celebration" | "detail";
}) {
  const locked = !item.unlockedAt;
  const concealed = item.definition.hidden && locked;
  const detail = variant === "detail";
  return (
    <span
      aria-hidden="true"
      className={`${styles.artwork} ${variant === "celebration" ? styles.artworkCelebration : ""} ${detail ? styles.artworkLarge : ""}`}
      data-category={item.definition.category}
      data-locked={locked}
    >
      <span className={styles.artworkInner}>
        {concealed ? (
          <span className={styles.secretMark}>?</span>
        ) : (
          <Image
            alt=""
            height={detail ? 320 : 160}
            sizes={
              detail
                ? "(max-width: 767px) 72vw, 336px"
                : variant === "celebration"
                  ? "92px"
                  : "(max-width: 640px) 96px, 128px"
            }
            src={`/milestones/${item.definition.icon}.png`}
            width={detail ? 320 : 160}
          />
        )}
      </span>
      {locked ? (
        <span className={styles.lockMark}>
          <LockKeyhole />
        </span>
      ) : null}
    </span>
  );
}
