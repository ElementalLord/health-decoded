import { useId, type ReactNode } from "react";

import styles from "../../styles/caregiver-foundation.module.css";

export interface CaregiverShellProps {
  readonly children: ReactNode;
  readonly heading: string;
  readonly eyebrow?: string;
  readonly introduction?: string;
  readonly urgentAccess?: ReactNode;
  readonly localNavigation?: ReactNode;
}

export function CaregiverShell({
  children,
  eyebrow,
  heading,
  introduction,
  localNavigation,
  urgentAccess,
}: CaregiverShellProps) {
  const headingId = useId();

  return (
    <section className={styles.shell} aria-labelledby={headingId} data-caregiver-foundation="">
      <a className={styles.skipLink} href={`#${headingId}-content`}>
        Skip to caregiver content
      </a>
      <header className={styles.shellHeader}>
        <div className={styles.shellHeading}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h1 id={headingId} className={styles.title}>
            {heading}
          </h1>
          {introduction ? <p className={styles.introduction}>{introduction}</p> : null}
        </div>
        {urgentAccess ? <aside className={styles.urgentAccess}>{urgentAccess}</aside> : null}
      </header>
      {localNavigation ? (
        <nav className={styles.localNavigation} aria-label="Support Someone">
          {localNavigation}
        </nav>
      ) : null}
      <div id={`${headingId}-content`} className={styles.shellContent} tabIndex={-1}>
        {children}
      </div>
    </section>
  );
}
