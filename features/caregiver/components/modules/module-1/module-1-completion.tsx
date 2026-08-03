"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { recognizeMilestone } from "@/features/achievements/lib/recognize-milestone.client";
import { isCaregiverModuleComplete } from "../../../lib/caregiver-completion";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1.module.css";

export function Module1Completion() {
  const { progress } = useCaregiverSession();
  const completed = isCaregiverModuleComplete(progress);
  const signaled = useRef(false);
  const completion = caregiverModule1.completion;
  useEffect(() => {
    if (completed && !signaled.current) {
      signaled.current = true;
      void recognizeMilestone({ event: "caregiver_module_completed", moduleId: "CG-M1" });
    }
  }, [completed]);
  return (
    <section
      className={styles.completion}
      aria-labelledby="module-1-completion-heading"
      data-module-completed={completed ? "true" : "false"}
    >
      <p className={styles.sectionLabel}>Module 1 progress</p>
      <h2 id="module-1-completion-heading">
        {completed ? completion.completed : "Module in progress"}
      </h2>
      {completed ? <p>{completion.practiced}</p> : null}
      <dl className={styles.completionGates}>
        <div>
          <dt>Central idea</dt>
          <dd>{progress.centralIdeaReached ? "Reached" : "Not yet reached"}</dd>
        </div>
        <div>
          <dt>Observation workbench</dt>
          <dd>{progress.coreApplicationCompleted ? "Reviewed" : "Not yet reviewed"}</dd>
        </div>
        <div>
          <dt>Practical takeaway</dt>
          <dd>{progress.takeawayViewed ? "Viewed" : "Not yet viewed"}</dd>
        </div>
      </dl>
      {completed && progress.keyIdeaUnderstood !== null ? (
        <p>{progress.keyIdeaUnderstood ? completion.understood : completion.revisit}</p>
      ) : null}
      <div className={styles.completionActions}>
        <a href="#CG-M1-S03">{completion.review}</a>
        <Link href="/caregiver/modules/support-without-taking-over">{completion.continue}</Link>
        <Link href="/caregiver">{completion.return}</Link>
      </div>
    </section>
  );
}
