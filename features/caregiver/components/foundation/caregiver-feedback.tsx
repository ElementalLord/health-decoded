"use client";

import { useId, type ReactNode } from "react";

import { CaregiverFocusTarget } from "./caregiver-focus-target";
import styles from "../../styles/caregiver-foundation.module.css";

export interface CaregiverFeedbackProps {
  readonly children: ReactNode;
  readonly heading: string;
  readonly focusWhen?: boolean;
  readonly tone?: "neutral" | "supportive" | "warning" | "error";
}

export function CaregiverFeedback({
  children,
  focusWhen = false,
  heading,
  tone = "neutral",
}: CaregiverFeedbackProps) {
  const headingId = useId();
  const isAssertive = tone === "error";

  return (
    <CaregiverFocusTarget
      className={styles.feedback}
      data-tone={tone}
      focusWhen={focusWhen}
      role={isAssertive ? "alert" : "status"}
      aria-live={isAssertive ? "assertive" : "polite"}
      aria-atomic="true"
      aria-labelledby={headingId}
    >
      <p id={headingId} className={styles.feedbackHeading}>
        {heading}
      </p>
      <div className={styles.feedbackBody}>{children}</div>
    </CaregiverFocusTarget>
  );
}
