import Image from "next/image";

import { caregiverModule2 } from "../../../content/caregiver-module-2";
import styles from "../../../styles/caregiver-module-2.module.css";

const permissionTraits = ["Specific", "Private", "Time-bound", "Changeable", "Easy to decline"];

export function Module2Scenario() {
  const section = caregiverModule2.sections.scenario;
  const beats = [
    { label: "Before the tension", paragraphs: [section.paragraphs[0]!] },
    { label: "The groceries", paragraphs: section.paragraphs.slice(1, 3) },
    { label: "The question", paragraphs: section.paragraphs.slice(3, 5) },
    { label: "The phone", paragraphs: [section.paragraphs[5]!] },
    { label: "Later that evening", paragraphs: section.paragraphs.slice(6, 8) },
    { label: "Still unresolved", paragraphs: section.paragraphs.slice(8, 10) },
  ];

  return (
    <section
      id={section.id}
      className={styles.scenario}
      aria-labelledby={`${section.id}-heading`}
      data-content-id={section.id}
    >
      <div className={styles.scenarioIntro}>
        <p className={styles.eyebrow}>A moment between Leah and Andre</p>
        <h2 id={`${section.id}-heading`} tabIndex={-1}>
          {section.title}
        </h2>
        <p>
          Worry becomes action one small step at a time. Stay with the whole scene before deciding
          what either person should have done.
        </p>
      </div>

      <figure className={styles.kitchenScene} aria-labelledby="kitchen-scene-caption">
        <Image
          className={styles.sceneImage}
          src="/caregiver/module-2/phone-boundary-kitchen.png"
          alt="Leah pauses beside Andre's lit phone on the kitchen counter while he walks toward the shower."
          width={1536}
          height={1024}
          sizes="(max-width: 72rem) 100vw, 56rem"
        />
        <figcaption id="kitchen-scene-caption">
          Groceries, coffee, a closed doorway, and a phone left on the kitchen counter.
        </figcaption>
      </figure>

      <div className={styles.storySequence}>
        {beats.map((beat) => (
          <section key={beat.label}>
            <h3 className={styles.storyMoment}>{beat.label}</h3>
            {beat.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
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
      className={styles.intentionNarrative}
      aria-labelledby={`${section.id}-heading`}
      data-content-id={section.id}
    >
      <div className={styles.narrativeIntro}>
        <p className={styles.eyebrow}>Both can be true</p>
        <h2 id={`${section.id}-heading`} tabIndex={-1}>
          {section.title}
        </h2>
        <p>{section.paragraphs[0]}</p>
      </div>
      <div className={styles.threePartModel}>
        <div>
          <span>01</span>
          <strong>What Leah may mean</strong>
          <p>Reduce risk, make the household easier, or manage her fear.</p>
        </div>
        <div>
          <span>02</span>
          <strong>What Andre may experience</strong>
          <p>{section.paragraphs[1]}</p>
        </div>
        <div>
          <span>03</span>
          <strong>What remains open</strong>
          <p>Andre&apos;s exact experience remains his to describe or not describe.</p>
        </div>
      </div>
      <p className={styles.centralIdea}>{section.paragraphs[2]}</p>
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
      <div className={styles.narrativeIntro}>
        <p className={styles.eyebrow}>Permission changes the action</p>
        <h2 id={`${section.id}-heading`} tabIndex={-1}>
          {section.title}
        </h2>
        <p>
          These are not fixed moral ranks. Notice what happens to permission, privacy, repetition,
          and freedom to decline.
        </p>
      </div>
      <dl className={styles.permissionSpectrum}>
        {section.definitions.map((definition, index) => (
          <div
            key={definition.term}
            data-zone={index < 3 ? "shared" : index === 3 ? "narrow" : "crossed"}
          >
            <dt>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {definition.term}
            </dt>
            <dd>{definition.example}</dd>
          </div>
        ))}
      </dl>
      <aside className={styles.oneYesLesson}>
        <p className={styles.eyebrow}>One yes, one scope</p>
        <p>{section.closing}</p>
      </aside>
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
      <div className={styles.narrativeIntro}>
        <p className={styles.eyebrow}>More useful than “ask first”</p>
        <h2 id={`${section.id}-heading`} tabIndex={-1}>
          {section.title}
        </h2>
        <p>A usable agreement makes its edges visible to both people.</p>
      </div>
      <ol className={styles.permissionQuestions}>
        {section.questions.map((question, index) => (
          <li key={question}>
            <span>{permissionTraits[index]}</span>
            <strong>{question}</strong>
          </li>
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
  const roles = ["Attend", "Listen", "Take notes", "Ask a chosen question", "Wait outside"];

  return (
    <section
      id={section.id}
      className={styles.appointmentSection}
      aria-labelledby={`${section.id}-heading`}
      data-content-id={section.id}
    >
      <div className={styles.narrativeIntro}>
        <p className={styles.eyebrow}>Roles stay separate</p>
        <h2 id={`${section.id}-heading`} tabIndex={-1}>
          {section.title}
        </h2>
        <p>{section.paragraphs[0]}</p>
      </div>

      <div className={styles.appointmentComposition}>
        <div className={styles.appointmentDialogue}>
          <blockquote>{section.paragraphs[1]}</blockquote>
          <blockquote>{section.paragraphs[2]}</blockquote>
        </div>
        <div className={styles.roleThreshold} aria-label="Appointment roles are separately agreed">
          {roles.map((role, index) => (
            <div key={role}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{role}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.appointmentNotes}>
        <p>{section.paragraphs[3]}</p>
        <p>{section.paragraphs[4]}</p>
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
      <div className={styles.narrativeIntro}>
        <p className={styles.eyebrow}>Repair is changed behavior</p>
        <h2 id={`${section.id}-heading`} tabIndex={-1}>
          {section.title}
        </h2>
        <p>{section.opening}</p>
      </div>
      <ol className={styles.repairFramework}>
        {section.steps.map((step, index) => (
          <li key={step.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{step.label}</strong>
              <blockquote>{step.copy}</blockquote>
            </div>
          </li>
        ))}
      </ol>
      <aside className={styles.repairWarning}>
        <strong>Leave defense out of the apology.</strong>
        <p>{section.closing}</p>
      </aside>
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
      <div className={styles.narrativeIntro}>
        <p className={styles.eyebrow}>Limits without leverage</p>
        <h2 id={`${section.id}-heading`} tabIndex={-1}>
          {section.title}
        </h2>
        <p>{section.opening}</p>
      </div>
      <div className={styles.boundaryLesson}>
        <section className={styles.boundaryExample}>
          <p className={styles.exampleCue}>A boundary names my capacity</p>
          <h3>Usable boundary</h3>
          <blockquote>{section.usableBoundary}</blockquote>
        </section>
        <p className={styles.boundaryBridge}>
          The focus changes when help is made conditional on another adult&apos;s decision.
        </p>
        <section className={styles.boundaryExample}>
          <p className={styles.exampleCue}>Leverage tries to direct your decision</p>
          <h3>Punitive leverage</h3>
          <blockquote>{section.punitiveBoundary}</blockquote>
        </section>
      </div>
      <p className={styles.boundaryExplanation}>{section.explanation}</p>
      <section className={styles.misunderstanding}>
        <p className={styles.exampleCue}>A common worry</p>
        <h3>{section.misunderstanding}</h3>
        <p>{section.correction}</p>
      </section>
    </section>
  );
}

export function Module2Scripts() {
  const scripts = caregiverModule2.scripts;

  return (
    <section className={styles.scriptsSection} aria-labelledby="module-2-scripts-heading">
      <p className={styles.eyebrow}>Useful language</p>
      <h2 id="module-2-scripts-heading">Borrow a phrase when worry makes words harder.</h2>
      <ul>
        {scripts.slice(0, 4).map((script) => (
          <li key={script.label}>
            <span>{script.label}</span>
            <q>{script.copy.replaceAll("“", "").replaceAll("”", "")}</q>
          </li>
        ))}
      </ul>
      <details className={styles.quietDetails}>
        <summary>See all nine phrases</summary>
        <ul className={styles.moreScripts}>
          {scripts.slice(4).map((script) => (
            <li key={script.label}>
              <strong>{script.label}</strong>
              <q>{script.copy.replaceAll("“", "").replaceAll("”", "")}</q>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

export function Module2FurtherReading() {
  const reading = caregiverModule2.passiveReading;

  return (
    <section className={styles.furtherReading} aria-labelledby="module-2-further-reading-heading">
      <div className={styles.narrativeIntro}>
        <p className={styles.eyebrow}>Reliable support</p>
        <h2 id="module-2-further-reading-heading" tabIndex={-1}>
          {reading.title}
        </h2>
        <p>{reading.paragraphs[0]}</p>
      </div>
      <div className={styles.reliablePrinciples}>
        {reading.paragraphs.slice(1).map((paragraph, index) => (
          <section key={paragraph}>
            <span>{index === 0 ? "Specific permission" : "Repair"}</span>
            <p>{paragraph}</p>
          </section>
        ))}
      </div>
      <details className={styles.quietDetails}>
        <summary>Explore this more deeply</summary>
        <div className={styles.readingSubsections}>
          {reading.subsections.map((subsection) => (
            <section key={subsection.title}>
              <h3>{subsection.title}</h3>
              {subsection.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </details>
    </section>
  );
}
