import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { MilestoneArtwork } from "@/features/achievements/components/milestone-artwork";
import { MilestoneProgress } from "@/features/achievements/components/milestone-progress";
import { milestonePathwayById } from "@/features/achievements/content/milestone-definitions";
import type { MilestoneCollectionItem } from "@/features/achievements/types/milestone";
import styles from "@/features/achievements/styles/milestone-collection.module.css";
import { formatDateSafely } from "@/lib/dates/format-date";

function dateLabel(value: string) {
  return formatDateSafely(value, { dateStyle: "long", timeZone: "UTC" }, "en-US");
}

export function MilestoneDetail({ item }: { item: MilestoneCollectionItem }) {
  const earned = Boolean(item.unlockedAt);
  const concealed = item.definition.hidden && !earned;
  const name = concealed ? "???" : item.definition.name;
  const pathway = milestonePathwayById.get(item.definition.id);
  const pathwayLabel = earned
    ? "Revisit this activity"
    : item.progress && item.progress.current > 0
      ? pathway?.actionLabel.replace(/^Start /, "Continue ")
      : pathway?.actionLabel;

  return (
    <main className={styles.detailPage}>
      <Link className={styles.backLink} href="/milestones">
        <ArrowLeft aria-hidden="true" />
        All Milestones
      </Link>

      <div className={styles.detailLayout}>
        <div className={styles.detailArtworkColumn}>
          <MilestoneArtwork item={item} variant="detail" />
        </div>

        <article className={styles.detailCopy}>
          <p className="editorial-eyebrow">{earned ? "Milestone earned" : "Milestone"}</p>
          <h1>{name}</h1>
          <p className={styles.detailLead}>
            {concealed
              ? "A hidden achievement. Keep exploring Health Decoded to discover it."
              : item.definition.shortDescription}
          </p>

          <div className={styles.detailStatus} data-earned={earned}>
            {earned ? <Check aria-hidden="true" /> : <span aria-hidden="true" />}
            <strong>
              {earned && item.unlockedAt
                ? `Earned ${dateLabel(item.unlockedAt) || ""}`.trim()
                : "Not earned yet"}
            </strong>
          </div>

          {!concealed ? (
            <div className={styles.detailSections}>
              <section>
                <h2>{earned ? "Why you earned it" : "How to unlock"}</h2>
                <p>{earned ? item.definition.description : item.definition.criteriaLabel}</p>
              </section>
              {earned ? (
                <section>
                  <h2>How you earned it</h2>
                  <p>{item.definition.criteriaLabel}</p>
                </section>
              ) : null}
              {item.progress ? <MilestoneProgress progress={item.progress} /> : null}
              {pathway ? (
                <Link className={styles.detailAction} href={pathway.href}>
                  {pathwayLabel}
                  <ArrowRight aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          ) : null}
        </article>
      </div>
    </main>
  );
}
