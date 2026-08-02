"use client";

import Link from "next/link";
import { caregiverModule5 } from "../../../content/caregiver-module-5";
import { isCaregiverModuleComplete } from "../../../lib/caregiver-completion";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-5.module.css";

export function Module5Completion() {
  const { progress } = useCaregiverSession();
  const done = isCaregiverModuleComplete(progress);
  const item = caregiverModule5.completion;
  return (
    <section
      className={styles.completion}
      data-module-completed={done}
      aria-labelledby="m5-completion-heading"
    >
      <p className={styles.sectionLabel}>Module 5 progress</p>
      <h2 id="m5-completion-heading">{done ? item.completed : "Module in progress"}</h2>
      {done ? <p>{item.practiced}</p> : null}
      <dl className={styles.gates}>
        <div>
          <dt>Central idea</dt>
          <dd>{progress.centralIdeaReached ? "Reached" : "Not yet reached"}</dd>
        </div>
        <div>
          <dt>Responsibility map</dt>
          <dd>{progress.coreApplicationCompleted ? "Reviewed" : "Not yet reviewed"}</dd>
        </div>
        <div>
          <dt>Practical takeaway</dt>
          <dd>{progress.takeawayViewed ? "Viewed" : "Not yet viewed"}</dd>
        </div>
      </dl>
      {done ? <p>{item.keyIdea}</p> : null}
      <div className={styles.completionActions}>
        <a href="#CG-M5-I01">{item.review}</a>
        <Link href="/caregiver">{item.next}</Link>
        <Link href="/caregiver">{item.reviewModule}</Link>
        <Link href="/caregiver">{item.return}</Link>
      </div>
    </section>
  );
}
