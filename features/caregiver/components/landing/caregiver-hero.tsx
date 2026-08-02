import Link from "next/link";

import { caregiverLandingContent } from "../../content/caregiver-landing";
import styles from "../../styles/caregiver-landing.module.css";

export function CaregiverHero() {
  const { hero } = caregiverLandingContent;

  return (
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.heroTitle}>{hero.title}</h1>
        <p className={styles.heroExplanation}>{hero.explanation}</p>
        <p className={styles.heroAudience}>{hero.audience}</p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryLink} href="#caregiver-need-router">
            {hero.primaryAction}
            <span aria-hidden="true">↓</span>
          </Link>
          <Link className={styles.secondaryLink} href="#caregiver-guided-path">
            {hero.secondaryAction}
            <span aria-hidden="true">↓</span>
          </Link>
        </div>
      </div>

      <div className={styles.tableScene} aria-hidden="true">
        <div className={styles.window}>
          <span className={styles.windowLight} />
          <span className={styles.windowFrameVertical} />
          <span className={styles.windowFrameHorizontal} />
        </div>
        <div className={styles.table}>
          <span className={styles.tabletop} />
          <span className={styles.tableLegLeft} />
          <span className={styles.tableLegRight} />
          <span className={styles.placeOne} />
          <span className={styles.placeTwo} />
          <span className={styles.placeThree} />
          <span className={styles.cup} />
          <span className={styles.notebook} />
        </div>
      </div>
    </header>
  );
}
