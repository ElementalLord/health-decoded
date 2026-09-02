import Image from "next/image";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import styles from "../../../styles/caregiver-module-3.module.css";

export function Module3Scenario() {
  const section = caregiverModule3.sections.scenario;
  return (
    <section id={section.id} className={styles.scenario} aria-labelledby={`${section.id}-heading`}>
      <div className={styles.scenarioHeading}>
        <p className={styles.sectionLabel}>A moment between roommates</p>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
        <p className={styles.scenarioDeck}>A sincere effort misses the work Cam actually named.</p>
      </div>
      <figure className={styles.scenarioArt}>
        <Image src="/caregiver/module-3/dinner-at-seven.png" alt="Nia holds a recipe near an open cabinet while Cam arrives home with keys and notices the changed snack shelf." width={1536} height={1024} sizes="(max-width: 56rem) 100vw, 76vw" />
        <figcaption>The cabinet changed. The pharmacy ride did not happen.</figcaption>
      </figure>
      <div className={styles.storyText}>
        {section.paragraphs.map((paragraph, index) => (
          <p key={paragraph} data-speaker={index === 1 || index === 3 ? "nia" : index === 2 || index === 4 ? "cam" : undefined}>{paragraph}</p>
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
      <p className={styles.sectionKicker}>Keep the table recognizable</p>
      {section.paragraphs.map((paragraph, index) => (
        <p key={paragraph} className={index === 2 ? styles.householdQuestion : undefined}>
          {paragraph}
        </p>
      ))}
      <ul className={styles.mealPossibilities} aria-label="What an easier dinner might involve">
        {['Timing', 'Budget', 'Shared ingredients', 'Cleanup', 'Transportation', 'No change'].map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

export function Module3SpecificNarrative() {
  const section = caregiverModule3.sections.specific;
  return (
    <section id={section.id} className={styles.specific} aria-labelledby={`${section.id}-heading`}>
      <div className={styles.specificCopy}>
        <p className={styles.sectionLabel}>One task. Clear edges.</p>
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
      <p className={styles.sectionLabel}>Preferences are current, not permanent</p>
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
      <Image className={styles.normalLifeArt} src="/caregiver/module-3/shared-evening-plan.png" alt="Two roommates sharing an ordinary evening of groceries, cooking, and conversation." width={1536} height={1024} sizes="(max-width: 56rem) 100vw, 48vw" />
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
      <p className={styles.sectionLabel}>Explore this more deeply</p>
      <h2 id="module-3-further-reading-heading">{reading.title}</h2>
      <details className={styles.readingDisclosure}>
        <summary>Read the deeper explanation</summary>
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
      </details>
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
