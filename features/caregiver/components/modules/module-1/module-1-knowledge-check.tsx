"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ModuleVisibilityMarker } from "../foundation/module-visibility-marker";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import { Module1Completion } from "./module-1-completion";
import { Module1Reflection } from "./module-1-reflection";
import styles from "../../../styles/caregiver-module-1.module.css";

export function Module1KnowledgeCheck() {
  const promptRef = useRef<HTMLLegendElement>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const question = caregiverModule1.questions[questionIndex]!;
  const answer = answers[question.id];
  const answered = answer !== undefined;
  const accurate = answer === question.preferredIndex;
  const isLast = questionIndex === caregiverModule1.questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  function choose(value: number) {
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    if (Object.keys(nextAnswers).length === caregiverModule1.questions.length) {
      setKeyIdeaUnderstood(
        caregiverModule1.questions.every((item) => nextAnswers[item.id] === item.preferredIndex),
      );
    }
  }

  function moveToQuestion(nextIndex: number) {
    setQuestionIndex(nextIndex);
    requestAnimationFrame(() => promptRef.current?.focus());
  }

  return (
    <section className={styles.knowledgeCheck} aria-labelledby="module-1-check-heading">
      <div className={styles.checkIntro}>
        <p className={styles.eyebrow}>Three real-world checks</p>
        <h2 id="module-1-check-heading" tabIndex={-1}>
          Choose the most careful first step.
        </h2>
        <p>
          These situations test different skills: uncertain meaning, privacy and practical help, and
          returning after a pause. Take one at a time.
        </p>
      </div>

      <form onSubmit={(event) => event.preventDefault()}>
        <fieldset className={styles.checkQuestion}>
          <legend ref={promptRef} tabIndex={-1}>
            <span>
              Question {questionIndex + 1} of {caregiverModule1.questions.length}
            </span>
            {question.question}
          </legend>
          <div className={styles.answerChoices}>
            {question.choices.map((choice, choiceIndex) => (
              <label key={choice} data-selected={answer === choiceIndex ? "true" : undefined}>
                <input
                  checked={answer === choiceIndex}
                  name={question.id}
                  onChange={() => choose(choiceIndex)}
                  type="radio"
                  value={choiceIndex}
                />
                <span aria-hidden="true">{String.fromCharCode(65 + choiceIndex)}</span>
                <strong>{choice}</strong>
                <i aria-hidden="true">{answer === choiceIndex ? "✓" : ""}</i>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.checkFeedback} aria-live="polite" aria-atomic="true">
          {answered ? (
            <>
              <p>
                <strong>
                  {accurate
                    ? "That keeps the person’s choice intact."
                    : "Pause and look for the added assumption."}
                </strong>
              </p>
              <p>{question.explanation}</p>
            </>
          ) : (
            <p>Select a response to see why it fits, or what to reconsider.</p>
          )}
        </div>

        <div className={styles.questionNavigation}>
          <Button
            disabled={questionIndex === 0}
            fullWidth={false}
            onClick={() => moveToQuestion(questionIndex - 1)}
            type="button"
            variant="secondary"
          >
            Previous question
          </Button>
          {!isLast ? (
            <Button
              disabled={!answered}
              fullWidth={false}
              onClick={() => moveToQuestion(questionIndex + 1)}
              type="button"
            >
              Next question
            </Button>
          ) : answeredCount === caregiverModule1.questions.length ? (
            <p className={styles.activityComplete}>✓ All three situations reviewed</p>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export function Module1Closing({ onReview }: { readonly onReview: () => void }) {
  const { markTakeawayViewed } = useCaregiverSession();

  return (
    <section className={styles.closingStage} aria-labelledby="module-1-takeaway-heading">
      <ModuleVisibilityMarker onViewed={markTakeawayViewed}>
        <div className={styles.takeaway}>
          <p className={styles.eyebrow}>Keep this close</p>
          <h2 id="module-1-takeaway-heading" tabIndex={-1}>
            Care without filling in the blanks.
          </h2>
          <ol className={styles.threeIdeas}>
            <li>
              <span>1</span>
              <strong>Notice what happened.</strong>
            </li>
            <li>
              <span>2</span>
              <strong>Don’t decide why.</strong>
            </li>
            <li>
              <span>3</span>
              <strong>Ask what kind of support they want.</strong>
            </li>
          </ol>
        </div>
      </ModuleVisibilityMarker>

      <section className={styles.scripts} aria-labelledby="module-1-scripts-heading">
        <p className={styles.eyebrow}>Useful phrases</p>
        <h3 id="module-1-scripts-heading">You do not have to find the perfect sentence.</h3>
        <ul>
          {caregiverModule1.scripts.slice(0, 3).map((script) => (
            <li key={script.label}>
              <span>{script.label}</span>
              <q>{script.copy.replaceAll("“", "").replaceAll("”", "")}</q>
            </li>
          ))}
        </ul>
        <details className={styles.quietDetails}>
          <summary>See all seven phrases</summary>
          <ul className={styles.moreScripts}>
            {caregiverModule1.scripts.slice(3).map((script) => (
              <li key={script.label}>
                <strong>{script.label}</strong>
                <q>{script.copy.replaceAll("“", "").replaceAll("”", "")}</q>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <details className={styles.quietDetails}>
        <summary>Explore this more deeply</summary>
        <div className={styles.referenceContent}>
          <h3>{caregiverModule1.passiveReading.title}</h3>
          {caregiverModule1.passiveReading.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className={styles.readingSubsections}>
            {caregiverModule1.passiveReading.subsections.map((subsection) => (
              <section key={subsection.title}>
                <h4>{subsection.title}</h4>
                {subsection.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
          <Module1Reflection />
        </div>
      </details>

      <Module1Completion onReview={onReview} />
    </section>
  );
}
