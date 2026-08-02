import { caregiverLandingContent, caregiverLandingTools } from "../../content/caregiver-landing";
import styles from "../../styles/caregiver-landing.module.css";

export function CaregiverToolsIntroduction() {
  const { tools } = caregiverLandingContent;

  return (
    <section className={styles.toolsIntroduction} aria-labelledby="caregiver-tools-title">
      <div className={styles.sectionHeading}>
        <p className={styles.sectionNumber}>Practical tools</p>
        <h2 id="caregiver-tools-title">{tools.sectionTitle}</h2>
        <p>{tools.copy}</p>
      </div>
      <div className={styles.toolList}>
        {caregiverLandingTools.map((tool) => (
          <article key={tool.id} className={styles.toolItem} data-caregiver-destination={tool.id}>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
          </article>
        ))}
      </div>
      <p className={styles.unavailableAction}>{tools.actionLabel}</p>
    </section>
  );
}
