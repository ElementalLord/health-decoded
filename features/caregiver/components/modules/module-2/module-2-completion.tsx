"use client";

import { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { recognizeMilestone } from "@/features/achievements/lib/recognize-milestone.client";
import { cn } from "@/lib/utils";

import { isCaregiverModuleComplete } from "../../../lib/caregiver-completion";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { caregiverModuleRegistry } from "../../../content/caregiver-module-registry";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2Completion({ onReview }: { readonly onReview: () => void }) {
  const { progress } = useCaregiverSession();
  const completed = isCaregiverModuleComplete(progress);
  const signaled = useRef(false);
  const completion = caregiverModule2.completion;
  useEffect(() => {
    if (completed && !signaled.current) {
      signaled.current = true;
      void recognizeMilestone({ event: "caregiver_module_completed", moduleId: "CG-M2" });
    }
  }, [completed]);

  return (
    <section
      className={styles.completion}
      aria-labelledby="module-2-completion-heading"
      data-module-completed={completed ? "true" : "false"}
    >
      <p className={styles.sectionLabel}>Module 2 progress</p>
      <h2 id="module-2-completion-heading" tabIndex={-1}>
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
      {completed && progress.keyIdeaUnderstood !== null ? (
        <p>{progress.keyIdeaUnderstood ? completion.understood : completion.revisit}</p>
      ) : null}
      <div className={styles.completionActions}>
        <button
          className={cn(buttonVariants({ fullWidth: false, variant: "text" }), styles.reviewAction)}
          onClick={onReview}
          type="button"
        >
          {completion.review}
        </button>
        <a
          className={cn(buttonVariants({ fullWidth: false }), styles.completionPrimary)}
          href={caregiverModuleRegistry["everyday-support-that-actually-helps"].route}
        >
          {completion.continue}
        </a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className={buttonVariants({ fullWidth: false, variant: "secondary" })} href="/caregiver">
          {completion.return}
        </a>
      </div>
    </section>
  );
}
