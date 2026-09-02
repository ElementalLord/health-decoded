"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2KnowledgeCheck({
  onReviewSection,
}: {
  readonly onReviewSection: (sectionId: string) => void;
}) {
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assistedAnswers, setAssistedAnswers] = useState<Record<string, boolean>>({});
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const promptRef = useRef<HTMLLegendElement>(null);
  const question = caregiverModule2.questions[questionIndex]!;
  const answer = answers[question.id];
  const questionReviewed = Boolean(reviewed[question.id]);
  const allReviewed = caregiverModule2.questions.every((item) => reviewed[item.id]);

  function reviewAnswer() {
    if (answer === undefined) return;
    const nextAnswers = { ...answers };
    const nextAttempts = { ...attempts };
    if (answer !== question.preferredIndex) {
      const attempt = (nextAttempts[question.id] ?? 0) + 1;
      nextAttempts[question.id] = attempt;
      if (attempt >= 3) {
        nextAnswers[question.id] = question.preferredIndex;
        setAssistedAnswers((current) => ({ ...current, [question.id]: true }));
      }
    }
    const nextReviewed = { ...reviewed, [question.id]: true };
    setAnswers(nextAnswers);
    setAttempts(nextAttempts);
    setReviewed(nextReviewed);
    if (caregiverModule2.questions.every((item) => nextReviewed[item.id])) {
      setKeyIdeaUnderstood(
        caregiverModule2.questions.every((item) => nextAnswers[item.id] === item.preferredIndex),
      );
    }
  }

  function moveToQuestion(nextIndex: number) {
    setQuestionIndex(nextIndex);
    requestAnimationFrame(() => promptRef.current?.focus());
  }

  const displayedAnswer = assistedAnswers[question.id] ? question.preferredIndex : answer;
  const displayedAccurate = displayedAnswer === question.preferredIndex;

  return (
    <section className={styles.knowledgeCheck} aria-labelledby="module-2-check-heading">
      <div className={styles.checkIntro}>
        <p className={styles.eyebrow}>Three real-world checks</p>
        <h2 id="module-2-check-heading" tabIndex={-1}>
          Keep the agreement visible.
        </h2>
        <p>
          Take one situation at a time. Feedback is here to help you notice scope, repetition, and
          changing permission—not to grade you.
        </p>
      </div>

      <form onSubmit={(event) => event.preventDefault()}>
        <fieldset className={styles.checkQuestion} data-question-id={question.id} id={question.id}>
          <legend ref={promptRef} tabIndex={-1}>
            <span>
              Question {questionIndex + 1} of {caregiverModule2.questions.length}
            </span>
            {question.question}
          </legend>
          <div className={styles.answerChoices}>
            {question.choices.map((choice, choiceIndex) => (
              <label key={choice} data-selected={answer === choiceIndex ? "true" : undefined}>
                <input
                  checked={answer === choiceIndex}
                  name={question.id}
                  onChange={() => {
                    setAnswers((current) => ({ ...current, [question.id]: choiceIndex }));
                    setReviewed((current) => ({ ...current, [question.id]: false }));
                  }}
                  type="radio"
                  value={choiceIndex}
                />
                <span aria-hidden="true">{String.fromCharCode(65 + choiceIndex)}</span>
                <strong>{choice}</strong>
              </label>
            ))}
          </div>
        </fieldset>

        {!questionReviewed ? (
          <Button
            disabled={answer === undefined}
            fullWidth={false}
            onClick={reviewAnswer}
            type="button"
          >
            Review answer
          </Button>
        ) : null}
      </form>

      {questionReviewed ? (
        <CaregiverFeedback
          focusWhen
          heading={
            displayedAccurate
              ? "That keeps the agreement in its current scope."
              : "Pause and look for the missing permission."
          }
          tone="neutral"
        >
          <p className={displayedAccurate ? styles.answerConfirmed : styles.answerNeedsReview}>
            {displayedAccurate
              ? "This response is ready to continue."
              : "This response needs review."}
          </p>
          <p>{question.explanation}</p>
          {assistedAnswers[question.id] ? (
            <p className={styles.answerAssist}>
              The answer was filled in after three attempts so you can continue.
            </p>
          ) : null}
          {!displayedAccurate ? (
            <Button
              fullWidth={false}
              onClick={() => onReviewSection(question.relatedSection)}
              type="button"
              variant="text"
            >
              {question.reviewLabel}
            </Button>
          ) : null}
          <div className={styles.questionNavigation}>
            {questionIndex > 0 ? (
              <Button
                fullWidth={false}
                onClick={() => moveToQuestion(questionIndex - 1)}
                type="button"
                variant="secondary"
              >
                Previous question
              </Button>
            ) : null}
            {questionIndex < caregiverModule2.questions.length - 1 ? (
              <Button
                fullWidth={false}
                onClick={() => moveToQuestion(questionIndex + 1)}
                type="button"
              >
                Next question
              </Button>
            ) : allReviewed ? (
              <p className={styles.activityComplete}>✓ All three situations reviewed</p>
            ) : null}
          </div>
        </CaregiverFeedback>
      ) : null}

      <p className={styles.srOnly} aria-live="polite">
        {questionReviewed
          ? `${displayedAccurate ? "Response ready to continue." : "Response needs review."} ${question.explanation}`
          : ""}
      </p>
    </section>
  );
}
