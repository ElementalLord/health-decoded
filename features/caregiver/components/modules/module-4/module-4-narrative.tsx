import { caregiverModule4 } from "../../../content/caregiver-module-4";
import styles from "../../../styles/caregiver-module-4.module.css";

function ParagraphSection({
  section,
  className,
}: {
  readonly section: {
    readonly id: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
  readonly className?: string | undefined;
}) {
  return (
    <section id={section.id} className={className} aria-labelledby={`${section.id}-heading`}>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      {section.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </section>
  );
}

export function Module4Scenario() {
  const section = caregiverModule4.sections.scenario;
  return (
    <section id={section.id} className={styles.scenario} aria-labelledby={`${section.id}-heading`}>
      <div className={styles.responseVisual} aria-hidden="true">
        <span>Notice the change</span>
        <i />
        <span>Use their plan</span>
        <i />
        <span>Reach human help</span>
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

export function Module4Notice() {
  return (
    <ParagraphSection section={caregiverModule4.sections.notice} className={styles.narrativeBand} />
  );
}
export function Module4Plan() {
  const section = caregiverModule4.sections.plan;
  return (
    <section
      id={section.id}
      className={styles.planSection}
      aria-labelledby={`${section.id}-heading`}
    >
      <div>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
        {section.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className={styles.planBoundary}>
        <p>{caregiverModule4.safety.plan}</p>
        <p>{caregiverModule4.safety.reading}</p>
      </div>
    </section>
  );
}
export function Module4HandoffNarrative() {
  const section = caregiverModule4.sections.handoff;
  return (
    <section
      id={section.id}
      className={styles.handoffNarrative}
      aria-labelledby={`${section.id}-heading`}
    >
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <p>{section.introduction}</p>
      <ol>
        {section.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <p>
        <strong>{section.close}</strong>
      </p>
      <p>{caregiverModule4.safety.professional}</p>
    </section>
  );
}
export function Module4UnsafeNarrative() {
  const section = caregiverModule4.sections.unsafe;
  return (
    <section
      id={section.id}
      className={styles.narrativeBand}
      aria-labelledby={`${section.id}-heading`}
    >
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p>{caregiverModule4.safety.medication}</p>
    </section>
  );
}
export function Module4Misunderstanding() {
  const section = caregiverModule4.sections.misunderstanding;
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
export function Module4Scripts() {
  return (
    <section className={styles.scripts} aria-labelledby="module-4-scripts-heading">
      <p className={styles.sectionLabel}>Practical scripts</p>
      <h2 id="module-4-scripts-heading">Practical Language Scripts</h2>
      <dl>
        {caregiverModule4.scripts.map(([label, copy]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{copy}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
