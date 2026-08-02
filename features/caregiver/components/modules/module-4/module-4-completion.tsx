"use client";

import Link from "next/link";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { isCaregiverModuleComplete } from "../../../lib/caregiver-completion";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function Module4Completion() {
  const { progress } = useCaregiverSession();
  const done = isCaregiverModuleComplete(progress);
  const item = caregiverModule4.completion;
  return (
    <section
      className={styles.completion}
      data-module-completed={done}
      aria-labelledby="m4-completion-heading"
    >
      <p className={styles.sectionLabel}>Module 4 progress</p>
      <h2 id="m4-completion-heading">{done ? item.completed : "Module in progress"}</h2>
      {done ? <p>{item.practiced}</p> : null}
      <dl className={styles.gates}>
        <div>
          <dt>Central idea</dt>
          <dd>{progress.centralIdeaReached ? "Reached" : "Not yet reached"}</dd>
        </div>
        <div>
          <dt>Source matching</dt>
          <dd>{progress.coreApplicationCompleted ? "Reviewed" : "Not yet reviewed"}</dd>
        </div>
        <div>
          <dt>Practical takeaway</dt>
          <dd>{progress.takeawayViewed ? "Viewed" : "Not yet viewed"}</dd>
        </div>
      </dl>
      {done ? <p>{item.keyIdea}</p> : null}
      <div className={styles.completionActions}>
        <a href="#CG-M4-I02">{item.review}</a>
        <Link href="/caregiver/modules/the-caregiver-matters-too">{item.continue}</Link>
        <Link href="/caregiver">{item.return}</Link>
      </div>
    </section>
  );
}
