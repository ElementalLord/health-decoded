import { caregiverModule2 } from "../../../content/caregiver-module-2";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2Scenario() {
  const section = caregiverModule2.sections.scenario;

  return (
    <section
      id={section.id}
      className={styles.scenario}
      aria-labelledby={`${section.id}-heading`}
      data-content-id={section.id}
    >
      <div className={styles.scenarioHeading}>
        <p className={styles.sectionLabel}>Illustrative scenario</p>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
      </div>
      <div className={styles.kitchenScene} aria-hidden="true">
        <span className={styles.groceryBag}>groceries</span>
        <span className={styles.coffeeCup}>coffee</span>
        <span className={styles.phone}>phone</span>
        <span className={styles.appointmentNote}>private</span>
      </div>
      <div className={styles.dialogue}>
        {section.paragraphs.map((paragraph, index) => (
          <p key={paragraph} data-dialogue={index > 0 && index < 5 ? "true" : undefined}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

export function Module2IntentionImpactNarrative() {
  const section = caregiverModule2.sections.intentionImpact;

  return (
    <section
      id={section.id}
      className={styles.editorialSection}
      aria-labelledby={`${section.id}-heading`}
      data-content-id={section.id}
    >
      <p className={styles.sectionLabel}>Intention and impact</p>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <div className={styles.readingMeasure}>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function Module2DistinctionNarrative() {
  const section = caregiverModule2.sections.distinction;

  return (
    <section
      id={section.id}
      className={styles.distinctionSection}
      aria-labelledby={`${section.id}-heading`}
      data-content-id={section.id}
    >
      <p className={styles.sectionLabel}>How the relationship changes the action</p>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <dl className={styles.definitionList}>
        {section.definitions.map((definition) => (
          <div key={definition.term}>
            <dt>{definition.term}</dt>
            <dd>{definition.example}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.sectionClose}>{section.closing}</p>
    </section>
  );
}

export function Module2PermissionNarrative() {
  const section = caregiverModule2.sections.permission;

  return (
    <section
      id={section.id}
      className={styles.permissionSection}
      aria-labelledby={`${section.id}-heading`}
      data-content-id={section.id}
    >
      <div>
        <p className={styles.sectionLabel}>Five points of consent</p>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
      </div>
      <ol className={styles.permissionQuestions}>
        {section.questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
      <dl className={styles.permissionExamples}>
        {section.examples.map((example) => (
          <div key={example.label}>
            <dt>{example.label}</dt>
            <dd>{example.copy}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Module2AppointmentsNarrative() {
  const section = caregiverModule2.sections.appointments;

  return (
    <section
      id={section.id}
      className={styles.appointmentSection}
      aria-labelledby={`${section.id}-heading`}
      data-content-id={section.id}
    >
      <p className={styles.sectionLabel}>Roles stay separate</p>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <div className={styles.readingMeasure}>
        {section.paragraphs.map((paragraph, index) => (
          <p key={paragraph} className={index === 1 || index === 2 ? styles.scriptLine : undefined}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

export function Module2RepairNarrative() {
  const section = caregiverModule2.sections.repair;

  return (
    <section
      id={section.id}
      className={styles.repairNarrative}
      aria-labelledby={`${section.id}-heading`}
      data-content-id={section.id}
    >
      <p className={styles.sectionLabel}>Repair is a change in behavior</p>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <p>{section.opening}</p>
      <ol>
        {section.steps.map((step) => (
          <li key={step.label}>
            <strong>{step.label}:</strong> {step.copy}
          </li>
        ))}
      </ol>
      <p>{section.closing}</p>
    </section>
  );
}

export function Module2BoundariesNarrative() {
  const section = caregiverModule2.sections.boundaries;

  return (
    <section
      id={section.id}
      className={styles.boundarySection}
      aria-labelledby={`${section.id}-heading`}
      data-content-id={section.id}
    >
      <p className={styles.sectionLabel}>Limits without leverage</p>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <p>{section.opening}</p>
      <dl className={styles.boundaryComparison}>
        <div>
          <dt>Usable boundary</dt>
          <dd>{section.usableBoundary}</dd>
        </div>
        <div>
          <dt>Punitive boundary</dt>
          <dd>{section.punitiveBoundary}</dd>
        </div>
      </dl>
      <p>{section.explanation}</p>
      <div className={styles.misunderstanding}>
        <p>
          <strong>Common misunderstanding:</strong> {section.misunderstanding}
        </p>
        <p>
          <strong>Correction:</strong> {section.correction}
        </p>
      </div>
    </section>
  );
}

export function Module2Scripts() {
  return (
    <section className={styles.scriptsSection} aria-labelledby="module-2-scripts-heading">
      <h2 id="module-2-scripts-heading">Practical Language Scripts</h2>
      <dl>
        {caregiverModule2.scripts.map((script) => (
          <div key={script.label}>
            <dt>{script.label}</dt>
            <dd>{script.copy}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
