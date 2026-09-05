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
      </div>
    </header>
  );
}
