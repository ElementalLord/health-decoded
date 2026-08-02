import Link from "next/link";

import { caregiverModule2 } from "../../../content/caregiver-module-2";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2Orientation() {
  const { opening } = caregiverModule2.sections;

  return (
    <header className={styles.orientation}>
      <nav className={styles.routeNavigation} aria-label="Module 2">
        <Link href="/caregiver">Return to Support Someone You Care About</Link>
        <Link href="/caregiver/urgent-help">Something feels wrong right now</Link>
      </nav>
      <div className={styles.orientationCopy}>
        <p className={styles.eyebrow}>{opening.eyebrow}</p>
        <h1 id="caregiver-module-2-heading">{opening.title}</h1>
        <p className={styles.openingCopy}>{opening.opening}</p>
      </div>
      <div className={styles.sharedTableScene} aria-hidden="true">
        <span className={`${styles.scenePerson} ${styles.scenePersonOne}`}>
          <span className={styles.sceneHead} />
          <span className={styles.sceneBody} />
          <span className={styles.sceneName}>Leah offers</span>
        </span>
        <span className={styles.offerNote}>Want help?</span>
        <span className={styles.sharedPause}>choice stays here</span>
        <span className={`${styles.scenePerson} ${styles.scenePersonTwo}`}>
          <span className={styles.sceneHead} />
          <span className={styles.sceneBody} />
          <span className={styles.sceneName}>Andre chooses</span>
        </span>
        <span className={styles.sceneGround} />
      </div>
      <p className={styles.centralPromise}>{opening.centralIdea}</p>
    </header>
  );
}
