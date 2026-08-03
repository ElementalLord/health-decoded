import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import type { EarnedMilestone } from "@/features/achievements/types/milestone";
import styles from "@/features/achievements/styles/milestones.module.css";

export function RecentMilestones({ earned }: { earned: readonly EarnedMilestone[] }) {
  return (
    <section aria-labelledby="journey-milestones" className={styles.journeyPanel}>
      <div>
        <p className="editorial-eyebrow">Milestones</p>
        <h2 id="journey-milestones">
          {earned.length ? "A meaningful step, recognized." : "Meaningful steps will appear here."}
        </h2>
        <p>{earned.length ? earned[0]!.definition.description : "Complete learning and preparation activities when they are useful to you."}</p>
      </div>
      {earned.length ? (
        <ul>{earned.slice(0, 3).map((entry) => <li key={entry.definition.id}><CheckCircle2 aria-hidden="true" />{entry.definition.name}</li>)}</ul>
      ) : null}
      <Link href="/milestones">View all milestones</Link>
    </section>
  );
}
