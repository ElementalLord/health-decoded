import { caregiverModule1 } from "../../../content/caregiver-module-1";
import styles from "../../../styles/caregiver-module-1.module.css";

export function Module1Scenario() {
  const section = caregiverModule1.sections.scenario;
  return (
    <section id={section.id} className={styles.scenario} aria-labelledby={`${section.id}-heading`}>
      <div className={styles.scenarioHeading}>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
      </div>
      <div className={styles.messageScene} aria-hidden="true">
        <span className={styles.messageTime}>3 hours</span>
        <span className={styles.messageText}>Busy.</span>
        <span className={styles.messagePause}>not tonight</span>
        <span className={styles.phoneRing} />
      </div>
      <div className={styles.storyText}>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <dl className={styles.factUnknowns}>
          <div>
            <dt>What is observable</dt>
            <dd>{section.observable}</dd>
          </div>
          <div>
            <dt>What is not known</dt>
            <dd>{section.unknown}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function Module1ExplanationsNarrative() {
  const section = caregiverModule1.sections.explanations;
  return (
    <section
      id={section.id}
      className={styles.explanations}
      aria-labelledby={`${section.id}-heading`}
    >
      <aside className={styles.marginNote}>Stay uncertain about what it means.</aside>
      <div>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className={styles.possibilityOrbit} aria-hidden="true">
        <span>fear</span>
        <span>fatigue</span>
        <span>normal evening</span>
        <span>something else</span>
      </div>
    </section>
  );
}

export function Module1ReadinessNarrative() {
  const section = caregiverModule1.sections.readiness;
  return (
    <section id={section.id} className={styles.readiness} aria-labelledby={`${section.id}-heading`}>
      <div>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <dl className={styles.languageLines}>
        {section.language.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.copy}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Module1ListeningNarrative() {
  const section = caregiverModule1.sections.listening;
  return (
    <section id={section.id} className={styles.listening} aria-labelledby={`${section.id}-heading`}>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <div className={styles.responseContrast}>
        <p>
          <strong>Listening response</strong>
          {section.listeningResponse}
        </p>
        <p>
          <strong>Fixing response</strong>
          {section.fixingResponse}
        </p>
      </div>
      <p>{section.closing}</p>
    </section>
  );
}

export function Module1ReturningNarrative() {
  const section = caregiverModule1.sections.returning;
  return (
    <section id={section.id} className={styles.returning} aria-labelledby={`${section.id}-heading`}>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <p>{section.opening}</p>
      <p className={styles.scriptLine}>{section.tryLine}</p>
      <p>{section.noLine}</p>
      <div className={styles.returnLoop} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

export function Module1MisunderstandingNarrative() {
  const section = caregiverModule1.sections.misunderstanding;
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

export function Module1FurtherReading() {
  const reading = caregiverModule1.passiveReading;
  return (
    <section className={styles.furtherReading} aria-labelledby="module-1-further-reading-heading">
      <p className={styles.sectionLabel}>Read and reflect</p>
      <h2 id="module-1-further-reading-heading">{reading.title}</h2>
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

export function Module1Scripts() {
  return (
    <section className={styles.scripts} aria-labelledby="module-1-scripts-heading">
      <p className={styles.sectionLabel}>Practical scripts</p>
      <h2 id="module-1-scripts-heading">Practical Language Scripts</h2>
      <dl>
        {caregiverModule1.scripts.map((script) => (
          <div key={script.label}>
            <dt>{script.label}</dt>
            <dd>{script.copy}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
