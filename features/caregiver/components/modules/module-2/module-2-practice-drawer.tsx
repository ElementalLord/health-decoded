import type { ReactNode } from "react";

import styles from "../../../styles/caregiver-module-2.module.css";

interface Module2PracticeDrawerProps {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}

export function Module2PracticeDrawer({
  number,
  title,
  description,
  children,
}: Module2PracticeDrawerProps) {
  return (
    <details className={styles.practiceDrawer}>
      <summary>
        <span className={styles.practiceNumber}>{number}</span>
        <span className={styles.practiceSummaryCopy}>
          <strong>{title}</strong>
          <span>{description}</span>
        </span>
        <span className={styles.practiceToggle} aria-hidden="true">
          +
        </span>
      </summary>
      <div className={styles.practiceDrawerBody}>{children}</div>
    </details>
  );
}
