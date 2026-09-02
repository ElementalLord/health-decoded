"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1.module.css";

const possibleExplanations = [
  "fear",
  "irritation",
  "information overload",
  "embarrassment",
  "fatigue",
  "grief",
  "wanting a normal evening",
  "conflict unrelated to diabetes",
  "work stress",
  "family stress",
  "financial concerns",
  "something else entirely",
] as const;

const readinessExamples = [
  ["Talk in the morning", "Not after work"],
  ["Accept practical help", "Not discuss feelings"],
  ["Explain something once", "Not provide regular updates"],
  ["Want company", "Not want advice"],
  ["Want help today", "Want privacy tomorrow"],
] as const;

export function Module1Scenario() {
  const scenario = caregiverModule1.sections.scenario;

  return (
    <section
      className={styles.scenario}
      aria-labelledby={`${scenario.id}-heading`}
      id={scenario.id}
    >
      <div className={styles.scenarioIntro}>
        <p className={styles.eyebrow}>A moment between Mira and Jules</p>
        <h2 id={`${scenario.id}-heading`} tabIndex={-1}>
          The unanswered call
        </h2>
        <p>
          Concern builds one small action at a time. Notice the whole sequence before deciding what
          any one moment means.
        </p>
      </div>

      <figure className={styles.scenarioScene} aria-labelledby="module-1-scenario-caption">
        <Image
          className={styles.sceneImage}
          src="/caregiver/module-1/unanswered-call-across-city.png"
          alt="Mira and Jules spend the evening in separate apartments across the city, each near a phone."
          width={1536}
          height={1024}
          sizes="(max-width: 70rem) 100vw, 50rem"
        />
        <figcaption id="module-1-scenario-caption">
          Two homes, an unanswered call, and more than one possible explanation.
        </figcaption>
      </figure>

      <div className={styles.storySequence}>
        <section>
          <h3 className={styles.storyMoment}>The pattern</h3>
          <div>
            <p>
              Jules lives in another city from his older sister, Mira. Since she mentioned a new
              diabetes medication at dinner last week, he has texted every evening.
            </p>
          </div>
        </section>
        <section>
          <h3 className={styles.storyMoment}>Tuesday evening</h3>
          <div>
            <blockquote>“How are you feeling? Did you figure everything out?”</blockquote>
          </div>
        </section>
        <section>
          <h3 className={styles.storyMoment}>Three hours later</h3>
          <div>
            <blockquote>“Busy. Can we not do diabetes tonight?”</blockquote>
          </div>
        </section>
        <section>
          <h3 className={styles.storyMoment}>Jules fills in the silence</h3>
          <div>
            <p>
              He thinks she may be scared and avoiding it. He also wonders whether she is angry with
              him.
            </p>
            <p className={styles.deletedMessage}>
              <span>Draft deleted</span> “I’m only asking because I care.”
            </p>
          </div>
        </section>
        <section>
          <h3 className={styles.storyMoment}>He calls anyway</h3>
          <div>
            <p>Mira does not answer.</p>
          </div>
        </section>
      </div>
    </section>
  );
}

export function Module1Meaning() {
  const { markCentralIdeaReached } = useCaregiverSession();
  const scenario = caregiverModule1.sections.scenario;
  const explanations = caregiverModule1.sections.explanations;
  const observed = [
    "Mira replied after three hours.",
    "She said she was busy.",
    "She asked not to discuss diabetes that night.",
    "She did not answer the call.",
  ];
  const unknown = [
    "Why she replied late.",
    "What she feels.",
    "Whether she wants support later.",
    "Whether the call felt caring or pressuring.",
    "Whether the silence had anything to do with diabetes.",
  ];

  return (
    <ModuleVisibilityMarker onViewed={markCentralIdeaReached}>
      <section
        className={styles.meaningStage}
        aria-labelledby={`${explanations.id}-heading`}
        id={explanations.id}
      >
        <div className={styles.meaningIntro}>
          <p className={styles.eyebrow}>Observation leaves room</p>
          <h2 id={`${explanations.id}-heading`} tabIndex={-1}>
            What is known, and what is still open?
          </h2>
          <p>
            An observable event and a plausible explanation are not the same kind of information.
          </p>
        </div>

        <div className={styles.knownUnknown}>
          <section aria-labelledby="known-heading">
            <h3 id="known-heading">Jules can verify</h3>
            <ul>
              {observed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="unknown-heading">
            <h3 id="unknown-heading">Jules cannot know yet</h3>
            <ul>
              {unknown.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className={styles.observationTurn}>
          <p className={styles.centralIdea}>Something happened. The reason is still uncertain.</p>
          <p className={styles.sourceSummary}>
            {scenario.observable} What remains unknown includes {scenario.unknown.toLowerCase()}
          </p>
        </div>
      </section>
    </ModuleVisibilityMarker>
  );
}

export function Module1Possibilities() {
  const [revealedCount, setRevealedCount] = useState(3);
  const explanations = caregiverModule1.sections.explanations;

  return (
    <section className={styles.possibilitiesStage} aria-labelledby="module-1-possibilities-heading">
      <div className={styles.possibilitiesIntro}>
        <p className={styles.eyebrow}>Possibility is not proof</p>
        <h2 id="module-1-possibilities-heading" tabIndex={-1}>
          One event can hold several explanations.
        </h2>
        <p>
          Listing possibilities is useful only when it protects uncertainty. It is not a way to
          diagnose someone from a distance.
        </p>
      </div>

      <div className={styles.possibilityReveal} aria-live="polite">
        <p className={styles.possibilityStem}>Mira’s response could come from…</p>
        <ul>
          {possibleExplanations.slice(0, revealedCount).map((possibility) => (
            <li key={possibility}>{possibility}</li>
          ))}
        </ul>
        {revealedCount < possibleExplanations.length ? (
          <Button
            fullWidth={false}
            onClick={() => setRevealedCount((count) => Math.min(count + 3, 12))}
            type="button"
            variant="secondary"
          >
            Show more possibilities
          </Button>
        ) : (
          <p className={styles.possibilitiesComplete}>None of these possibilities is a fact.</p>
        )}
      </div>

      <div className={styles.ordinaryLifeLesson}>
        <p className={styles.ordinaryLabel}>An ordinary evening is a real possibility.</p>
        <p>
          A person may want part of the day, or part of a relationship, not to revolve around
          diabetes. A short reply is not automatically denial, fear, avoidance, or distrust.
        </p>
      </div>

      <aside className={styles.pressureLesson}>
        <p>
          <strong>Gentle can still become pressure.</strong>
          {explanations.paragraphs[1]}
        </p>
      </aside>
    </section>
  );
}

export function Module1Readiness() {
  const [languageIndex, setLanguageIndex] = useState(0);
  const readiness = caregiverModule1.sections.readiness;
  const language = readiness.language[languageIndex]!;

  return (
    <section
      className={styles.readinessStage}
      aria-labelledby={`${readiness.id}-heading`}
      id={readiness.id}
    >
      <div className={styles.readinessIntro}>
        <p className={styles.eyebrow}>A preference for this moment</p>
        <h2 id={`${readiness.id}-heading`} tabIndex={-1}>
          Readiness changes.
        </h2>
        <p>
          Someone can want connection while changing what kind of support feels manageable.
          Readiness is not a test of trust.
        </p>
      </div>

      <ul className={styles.readinessPairs} aria-label="Examples of changing readiness">
        {readinessExamples.map(([first, second]) => (
          <li key={first}>
            <span>{first}</span>
            <small>and at another time</small>
            <span>{second}</span>
          </li>
        ))}
      </ul>

      <section className={styles.permissionLanguage} aria-labelledby="permission-language-heading">
        <div>
          <p className={styles.eyebrow}>Language to borrow</p>
          <h3 id="permission-language-heading">Ask without assuming access.</h3>
        </div>
        <div className={styles.languageViewer} aria-live="polite">
          <p>{language.label}</p>
          <blockquote>{language.copy}</blockquote>
          <div>
            <Button
              disabled={languageIndex === 0}
              fullWidth={false}
              onClick={() => setLanguageIndex((index) => Math.max(0, index - 1))}
              type="button"
              variant="secondary"
            >
              Previous phrase
            </Button>
            <span>
              {languageIndex + 1} of {readiness.language.length}
            </span>
            <Button
              disabled={languageIndex === readiness.language.length - 1}
              fullWidth={false}
              onClick={() =>
                setLanguageIndex((index) => Math.min(readiness.language.length - 1, index + 1))
              }
              type="button"
              variant="secondary"
            >
              Next phrase
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
}

export function Module1Returning() {
  const returning = caregiverModule1.sections.returning;
  const misunderstanding = caregiverModule1.sections.misunderstanding;

  return (
    <section
      className={styles.returningStage}
      aria-labelledby={`${returning.id}-heading`}
      id={returning.id}
    >
      <div className={styles.returningIntro}>
        <p className={styles.eyebrow}>Care can return quietly</p>
        <h2 id={`${returning.id}-heading`} tabIndex={-1}>
          A pause does not need a dramatic reopening.
        </h2>
        <p>{returning.opening}</p>
      </div>

      <ol className={styles.returningSequence}>
        <li>
          <span>First</span>
          <div>
            <strong>Let ordinary conversation stay ordinary.</strong>
            <p>Talk about the weekend, work, a show, or whatever usually belongs between you.</p>
          </div>
        </li>
        <li>
          <span>Then</span>
          <div>
            <strong>Ask before reopening the topic.</strong>
            <blockquote>{returning.tryLine.replace("Try: ", "")}</blockquote>
          </div>
        </li>
        <li>
          <span>If no</span>
          <div>
            <strong>Accept the answer without withdrawing.</strong>
            <blockquote>
              {returning.noLine.replace("If the answer is no, accept it: ", "")}
            </blockquote>
          </div>
        </li>
      </ol>

      <section
        className={styles.caregiverFear}
        aria-labelledby={`${misunderstanding.id}-heading`}
        id={misunderstanding.id}
      >
        <div>
          <p className={styles.eyebrow}>A common caregiver fear</p>
          <h3 id={`${misunderstanding.id}-heading`}>{misunderstanding.misunderstanding}</h3>
        </div>
        <div>
          <p>{misunderstanding.correction}</p>
          <ul>
            <li>Make one specific offer.</li>
            <li>Keep ordinary conversation present.</li>
            <li>Respect the pause.</li>
            <li>Stay available without requesting updates.</li>
          </ul>
        </div>
      </section>

      <aside className={styles.remoteSupport}>
        <span>When you do not live nearby</span>
        <blockquote>
          “I’m thinking about you. No update is needed. If you want help with one call or errand,
          ask me.”
        </blockquote>
      </aside>
    </section>
  );
}
