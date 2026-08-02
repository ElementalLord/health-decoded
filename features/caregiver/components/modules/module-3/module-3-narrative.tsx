import { caregiverModule3 } from "../../../content/caregiver-module-3";
import styles from "../../../styles/caregiver-module-3.module.css";

export function Module3Scenario() {
  const section = caregiverModule3.sections.scenario;
  return (
    <section id={section.id} className={styles.scenario} aria-labelledby={`${section.id}-heading`}>
      <div className={styles.scenarioHeading}>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
      </div>
      <div className={styles.kitchenScene} aria-hidden="true">
        <span className={styles.cabinet} />
        <span className={styles.snackShelf} />
        <span className={styles.recipePage}>recipe</span>
        <span className={styles.pharmacyClock}>7:00</span>
      </div>
      <div className={styles.storyText}>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function Module3MealsNarrative() {
  const section = caregiverModule3.sections.meals;
  return (
    <section id={section.id} className={styles.meals} aria-labelledby={`${section.id}-heading`}>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      {section.paragraphs.map((paragraph, index) => (
        <p key={paragraph} className={index === 2 ? styles.householdQuestion : undefined}>
          {paragraph}
        </p>
      ))}
      <div className={styles.tableInterlude} aria-hidden="true">
        <span className={styles.plateOne} />
        <span className={styles.plateTwo} />
        <span className={styles.passingBowl} />
        <span className={styles.napkin} />
      </div>
    </section>
  );
}

export function Module3SpecificNarrative() {
  const section = caregiverModule3.sections.specific;
  return (
    <section id={section.id} className={styles.specific} aria-labelledby={`${section.id}-heading`}>
      <div>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <dl className={styles.offerComparison}>
        <div>
          <dt>Broad</dt>
          <dd>{section.broad}</dd>
        </div>
        <div>
          <dt>Specific</dt>
          <dd>{section.specific}</dd>
        </div>
      </dl>
    </section>
  );
}

export function Module3ChangesNarrative() {
  const section = caregiverModule3.sections.changes;
  return (
    <section id={section.id} className={styles.changes} aria-labelledby={`${section.id}-heading`}>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}

export function Module3NormalLifeNarrative() {
  const section = caregiverModule3.sections.normalLife;
  return (
    <section
      id={section.id}
      className={styles.normalLife}
      aria-labelledby={`${section.id}-heading`}
    >
      <div className={styles.dayRhythm} aria-hidden="true">
        <span>morning</span>
        <span>errand</span>
        <span>dinner</span>
        <span>evening</span>
        <i />
      </div>
      <div>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function Module3MisunderstandingNarrative() {
  const section = caregiverModule3.sections.misunderstanding;
  return (
    <section
      id={section.id}
      className={styles.misunderstanding}
      aria-labelledby={`${section.id}-heading`}
    >
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <dl>
        <div>
          <dt>Misunderstanding</dt>
          <dd>{section.misunderstanding}</dd>
        </div>
        <div>
          <dt>Correction</dt>
          <dd>{section.correction}</dd>
        </div>
      </dl>
    </section>
  );
}

export function Module3FurtherReading() {
  const reading = caregiverModule3.passiveReading;
  return (
    <section className={styles.furtherReading} aria-labelledby="module-3-further-reading-heading">
      <p className={styles.sectionLabel}>Read and reflect</p>
      <h2 id="module-3-further-reading-heading">{reading.title}</h2>
      <div className={styles.readingIntro}>
        {reading.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className={styles.readingSubsections}>
        {reading.subsections.map((subsection) => (
          <div key={subsection.title} className={styles.readingSubsection}>
            <h3>{subsection.title}</h3>
            {subsection.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function Module3Scripts() {
  return (
    <section className={styles.scripts} aria-labelledby="module-3-scripts-heading">
      <p className={styles.sectionLabel}>Practical scripts</p>
      <h2 id="module-3-scripts-heading">Practical Language Scripts</h2>
      <dl>
        {caregiverModule3.scripts.map((script) => (
          <div key={script.label}>
            <dt>{script.label}</dt>
            <dd>{script.copy}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
