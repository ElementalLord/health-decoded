import styles from "@/features/caregiver/styles/caregiver-module-1-story.module.css";

export default function CaregiverModuleLoading() {
  return (
    <main className={styles.page} aria-busy="true" data-route-loading>
      <section className={styles.loadingShell} role="status" aria-label="Opening caregiver module">
        <div className={styles.loadingHeader} aria-hidden="true">
          <span className={styles.loadingKicker} />
          <span className={styles.loadingCount} />
        </div>
        <div className={styles.loadingProgress} aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className={styles.loadingBody} aria-hidden="true">
          <span className={styles.loadingEyebrow} />
          <div className={styles.loadingTitle}>
            <span />
            <span />
          </div>
          <span className={styles.loadingCopy} />
          <div className={styles.loadingPanel}>
            <span />
            <span />
            <span />
          </div>
        </div>
        <p className={styles.loadingStatus}>Opening caregiver module</p>
      </section>
    </main>
  );
}
