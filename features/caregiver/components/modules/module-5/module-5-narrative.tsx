import { caregiverModule5 } from "../../../content/caregiver-module-5";
import styles from "../../../styles/caregiver-module-5.module.css";

export function Module5Scenario() {
  const section = caregiverModule5.sections.scenario;
  return (
    <section id={section.id} className={styles.scenario} aria-labelledby={`${section.id}-heading`}>
      <div className={styles.clockScene} aria-hidden="true">
        <span className={styles.clock}>6:10</span>
        <span className={styles.folder} />
        <span className={styles.phone} />
      </div>
      <div>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
        {section.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
export function Module5ResponsibilityNarrative() {
  const section = caregiverModule5.sections.responsibility;
  return (
    <section
      id={section.id}
      className={styles.responsibilityNarrative}
      aria-labelledby={`${section.id}-heading`}
    >
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <dl>
        {section.groups.map(([label, copy]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{copy}</dd>
          </div>
        ))}
      </dl>
      <p>{section.close}</p>
    </section>
  );
}
export function Module5Strain() {
  const section = caregiverModule5.sections.strain;
  return (
    <section id={section.id} className={styles.strain} aria-labelledby={`${section.id}-heading`}>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      {section.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </section>
  );
}
export function Module5BoundaryNarrative() {
  const section = caregiverModule5.sections.boundary;
  return (
    <section
      id={section.id}
      className={styles.boundaryNarrative}
      aria-labelledby={`${section.id}-heading`}
    >
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <dl>
        {section.examples.map(([label, copy], index) => (
          <div key={`${label}-${index}`} data-kind={label.toLowerCase()}>
            <dt>{label}</dt>
            <dd>{copy}</dd>
          </div>
        ))}
      </dl>
      <p>{section.close}</p>
    </section>
  );
}
export function Module5Backup() {
  const section = caregiverModule5.sections.backup;
  return (
    <section id={section.id} className={styles.backup} aria-labelledby={`${section.id}-heading`}>
      <div>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
        {section.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className={styles.wideningPath} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
export function Module5Relationship() {
  const section = caregiverModule5.sections.relationship;
  return (
    <section
      id={section.id}
      className={styles.relationship}
      aria-labelledby={`${section.id}-heading`}
    >
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      {section.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <dl>
        <div>
          <dt>Common misunderstanding</dt>
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
export function Module5Scripts() {
  return (
    <section className={styles.scripts} aria-labelledby="m5-scripts-heading">
      <p className={styles.sectionLabel}>Practical scripts</p>
      <h2 id="m5-scripts-heading">Practical Language Scripts</h2>
      <dl>
        {caregiverModule5.scripts.map(([label, copy]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{copy}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
