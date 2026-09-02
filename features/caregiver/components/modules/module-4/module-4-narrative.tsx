import Image from "next/image";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import styles from "../../../styles/caregiver-module-4.module.css";

export function Module4Scenario() {
  const section = caregiverModule4.sections.scenario;
  return (
    <section id={section.id} className={styles.scenario} aria-labelledby={`${section.id}-heading`}>
      <div className={styles.scenarioHeading}>
        <p className={styles.sectionLabel}>A moment between neighbors</p>
        <h2 id={`${section.id}-heading`} tabIndex={-1}>{section.title}</h2>
        <p>Notice the concrete change before adding an explanation.</p>
      </div>
      <figure className={styles.scenarioArt}>
        <Image src="/caregiver/module-4/unfinished-errand.png" alt="Celeste sits partway up an apartment stairwell beside her bag while Omar stands nearby with groceries, attentive and uncertain." width={1536} height={1024} sizes="(max-width: 56rem) 100vw, 76vw" />
        <figcaption>The scene shows a change. It does not reveal the cause.</figcaption>
      </figure>
      <div className={styles.storyText}>
        {section.paragraphs.map((paragraph, index) => <p key={paragraph} data-dialogue={index === 1 ? "omar" : index === 2 ? "celeste" : undefined}>{paragraph}</p>)}
      </div>
      <div className={styles.observationSplit}>
        <div><p>What Omar can report</p><ul><li>Stopped halfway upstairs</li><li>Sat down</li><li>Answers more slowly than usual</li><li>Said a plan is in her bag</li></ul></div>
        <div><p>What Omar does not know</p><ul><li>What caused the change</li><li>What a personal reading means</li><li>Which improvised action would help</li></ul></div>
      </div>
    </section>
  );
}

export function Module4Notice() {
  const section = caregiverModule4.sections.notice;
  return (
    <section id={section.id} className={styles.notice} aria-labelledby={`${section.id}-heading`}>
      <p className={styles.sectionLabel}>Facts before conclusions</p>
      <h2 id={`${section.id}-heading`} tabIndex={-1}>{section.title}</h2>
      {section.paragraphs.map((paragraph, index) => <p key={paragraph} className={index === 2 ? styles.readingBoundary : undefined}>{paragraph}</p>)}
    </section>
  );
}

export function Module4Plan() {
  const section = caregiverModule4.sections.plan;
  return (
    <section id={section.id} className={styles.planSection} aria-labelledby={`${section.id}-heading`}>
      <div className={styles.planCopy}>
        <p className={styles.sectionLabel}>Individual guidance already exists</p>
        <h2 id={`${section.id}-heading`} tabIndex={-1}>{section.title}</h2>
        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <ul className={styles.planContents} aria-label="What a clinician-created plan may contain">
          <li>Known signs</li><li>Agreed supporter role</li><li>Where instructions are kept</li><li>Whom to contact</li>
        </ul>
      </div>
      <div className={styles.planBoundaries}>
        <section><h3>The individualized layer</h3><p>{caregiverModule4.safety.plan}</p></section>
        <section className={styles.noReading}><h3>Do not enter a glucose reading here</h3><p>{caregiverModule4.safety.reading}</p></section>
      </div>
    </section>
  );
}

export function Module4HandoffNarrative() {
  const section = caregiverModule4.sections.handoff;
  return (
    <section id={section.id} className={styles.handoffNarrative} aria-labelledby={`${section.id}-heading`}>
      <p className={styles.sectionLabel}>Enough to begin getting help</p>
      <h2 id={`${section.id}-heading`} tabIndex={-1}>{section.title}</h2>
      <p>{section.introduction}</p>
      <ol>{section.items.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol>
      <p className={styles.doNotDelay}><strong>{section.close}</strong> {caregiverModule4.safety.doNotDelay}</p>
      <details className={styles.professionalDisclosure}><summary>Which human help does this module mean?</summary><p>{caregiverModule4.safety.professional}</p></details>
    </section>
  );
}

export function Module4UnsafeNarrative() {
  const section = caregiverModule4.sections.unsafe;
  return (
    <section id={section.id} className={styles.unsafeNarrative} aria-labelledby={`${section.id}-heading`}>
      <p className={styles.sectionLabel}>Authority matters</p>
      <h2 id={`${section.id}-heading`} tabIndex={-1}>{section.title}</h2>
      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <p className={styles.medicationBoundary}>{caregiverModule4.safety.medication}</p>
    </section>
  );
}

export function Module4Misunderstanding() {
  const section = caregiverModule4.sections.misunderstanding;
  return (
    <section id={section.id} className={styles.misunderstanding} aria-labelledby={`${section.id}-heading`}>
      <p className={styles.sectionLabel}>When more checking becomes delay</p>
      <h2 id={`${section.id}-heading`} tabIndex={-1}>{section.title}</h2>
      <blockquote>{section.misunderstanding}</blockquote>
      <div className={styles.delaySequence} aria-label="Repeated checking can preserve uncertainty"><span>One more reading</span><span>One more search</span><span>One more check</span><strong>Still uncertain</strong></div>
      <p>{section.correction}</p>
    </section>
  );
}

export function Module4Scripts() {
  const firstScripts = caregiverModule4.scripts.slice(0, 3);
  const moreScripts = caregiverModule4.scripts.slice(3);
  const renderScript = ([label, copy]: (typeof caregiverModule4.scripts)[number]) => <div key={label}><dt>{label}</dt><dd>{copy}</dd></div>;
  return (
    <section className={styles.scripts} aria-labelledby="module-4-scripts-heading">
      <p className={styles.sectionLabel}>Practical scripts</p>
      <h2 id="module-4-scripts-heading" tabIndex={-1}>Language for the next layer</h2>
      <p>Use plain language that reports change, locates the plan, or names the need for human help.</p>
      <dl>{firstScripts.map(renderScript)}</dl>
      <details><summary>See all useful phrases</summary><dl>{moreScripts.map(renderScript)}</dl></details>
    </section>
  );
}
