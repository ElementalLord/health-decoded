"use client";

import Link from "next/link";

import { isCaregiverModuleComplete } from "../../../lib/caregiver-completion";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2Completion() {
  const { progress } = useCaregiverSession();
  const completed = isCaregiverModuleComplete(progress);
  const completion = caregiverModule2.completion;

  return (
    <section
      className={styles.completion}
      aria-labelledby="module-2-completion-heading"
      data-module-completed={completed ? "true" : "false"}
    >
      <p className={styles.sectionLabel}>Module 2 progress</p>
      <h2 id="module-2-completion-heading">
        {completed ? completion.completed : "Module in progress"}
      </h2>
      {completed ? <p>{completion.practiced}</p> : null}
      <dl className={styles.completionGates}>
        <div>
          <dt>Central idea</dt>
          <dd>{progress.centralIdeaReached ? "Reached" : "Not yet reached"}</dd>
        </div>
        <div>
          <dt>Permission-based offer</dt>
          <dd>{progress.coreApplicationCompleted ? "Reviewed" : "Not yet reviewed"}</dd>
        </div>
        <div>
          <dt>Practical takeaway</dt>
          <dd>{progress.takeawayViewed ? "Viewed" : "Not yet viewed"}</dd>
        </div>
      </dl>
      {completed ? (
        <p>{progress.keyIdeaUnderstood === false ? completion.revisit : completion.understood}</p>
      ) : null}
      <div className={styles.completionActions}>
        <a href="#CG-M2-S03">{completion.review}</a>
        <span className={styles.unavailableNext} aria-disabled="true">
          {completion.continue}
        </span>
        <Link href="/caregiver">{completion.return}</Link>
      </div>
    </section>
  );
}
