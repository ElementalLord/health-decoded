"use client";

import Link from "next/link";
import { isCaregiverModuleComplete } from "../../../lib/caregiver-completion";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-3.module.css";

export function Module3Completion() {
  const { progress } = useCaregiverSession();
  const completed = isCaregiverModuleComplete(progress);
  const completion = caregiverModule3.completion;
  return (
    <section
      className={styles.completion}
      aria-labelledby="module-3-completion-heading"
      data-module-completed={completed ? "true" : "false"}
    >
      <p className={styles.sectionLabel}>Module 3 progress</p>
      <h2 id="module-3-completion-heading">
        {completed ? completion.completed : "Module in progress"}
      </h2>
      {completed ? <p>{completion.practiced}</p> : null}
      <dl className={styles.completionGates}>
        <div>
          <dt>Central idea</dt>
          <dd>{progress.centralIdeaReached ? "Reached" : "Not yet reached"}</dd>
        </div>
        <div>
          <dt>Request matching</dt>
          <dd>{progress.coreApplicationCompleted ? "Reviewed" : "Not yet reviewed"}</dd>
        </div>
        <div>
          <dt>Practical takeaway</dt>
          <dd>{progress.takeawayViewed ? "Viewed" : "Not yet viewed"}</dd>
        </div>
      </dl>
      {completed && progress.keyIdeaUnderstood !== null ? <p>{completion.keyIdea}</p> : null}
      <div className={styles.completionActions}>
        <a href="#CG-M3-S04">{completion.review}</a>
        <span className={styles.unavailableNext} aria-disabled="true">
          {completion.continue}
        </span>
        <Link href="/caregiver">{completion.return}</Link>
      </div>
    </section>
  );
}
