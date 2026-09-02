"use client";

import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-2.module.css";

const emptyParts = Object.fromEntries(
  caregiverModule2.interactions.permissionBuilder.groups.map((group) => [group.id, ""]),
) as Record<string, string>;

export function PermissionLanguageBuilder() {
  const interaction = caregiverModule2.interactions.permissionBuilder;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [groupIndex, setGroupIndex] = useState(0);
  const [parts, setParts] = useState<Record<string, string>>(emptyParts);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [assistedParts, setAssistedParts] = useState<Record<string, boolean>>({});
  const [reviewedParts, setReviewedParts] = useState<Record<string, string> | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const promptRef = useRef<HTMLLegendElement>(null);
  const group = interaction.groups[groupIndex]!;
  const offerIsComplete = interaction.groups.every((item) => Boolean(parts[item.id]));
  const assembledOffer = offerIsComplete
    ? `${parts.opening} ${parts.action}? ${parts.decline}. ${parts.followup}.`
    : "";
  const selectedParts = interaction.groups
    .map((item) => parts[item.id])
    .filter((part): part is string => Boolean(part));
  const offerPreview = offerIsComplete
    ? assembledOffer
    : selectedParts.length
      ? selectedParts.join(" · ")
      : "Your offer will appear here as you choose each part.";
  const evaluatedParts = reviewedParts ?? parts;
  const mismatchedGroup = interaction.groups.find(
    (item) => evaluatedParts[item.id] !== item.options[0],
  );
  const feedback = mismatchedGroup
    ? interaction.feedback[mismatchedGroup.id as keyof typeof interaction.feedback]
    : interaction.feedback.preferred;

  function moveToGroup(nextIndex: number) {
    setGroupIndex(nextIndex);
    requestAnimationFrame(() => promptRef.current?.focus());
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!offerIsComplete) return;
    const nextParts = { ...parts };
    const nextAttempts = { ...attempts };
    const nextAssistedParts: Record<string, boolean> = {};
    interaction.groups.forEach((item) => {
      if (parts[item.id] !== item.options[0]) {
        const attempt = (nextAttempts[item.id] ?? 0) + 1;
        nextAttempts[item.id] = attempt;
        if (attempt >= 3) {
          nextParts[item.id] = item.options[0];
          nextAssistedParts[item.id] = true;
        }
      }
    });
    setParts(nextParts);
    setReviewedParts(nextParts);
    setAttempts(nextAttempts);
    setAssistedParts(nextAssistedParts);
    setSubmitted(true);
    setSubmissionCount((count) => count + 1);
    markInteractionSubmitted(interaction.id);
  }

  function revise() {
    setSubmitted(false);
    setReviewedParts(null);
    moveToGroup(0);
  }

  function readOffer() {
    setReadCount((count) => count + 1);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(assembledOffer));
    }
  }

  return (
    <section
      className={styles.permissionBuilder}
      aria-labelledby={`${interaction.id}-heading`}
      data-interaction-id={interaction.id}
      data-core-application="true"
      data-submitted={submitted ? "true" : "false"}
    >
      <div className={styles.builderHeading}>
        <p className={styles.eyebrow}>Core practice · permission builder</p>
        <h3 id={`${interaction.id}-heading`}>{interaction.title}</h3>
        <p>{interaction.prompt}</p>
      </div>

      <div className={styles.builderSentence} aria-label="Offer being built">
        <p>Offer so far</p>
        <blockquote>{offerPreview}</blockquote>
      </div>

      <form onSubmit={submit}>
        <fieldset className={styles.builderStep}>
          <legend ref={promptRef} tabIndex={-1}>
            <span>
              Step {groupIndex + 1} of {interaction.groups.length}
            </span>
            {group.label}
          </legend>
          <div className={styles.builderChoices}>
            {group.options.map((option) => (
              <label key={option} data-selected={parts[group.id] === option ? "true" : undefined}>
                <input
                  checked={parts[group.id] === option}
                  name={`builder-${group.id}`}
                  onChange={() => {
                    setParts((current) => ({ ...current, [group.id]: option }));
                    setSubmitted(false);
                    setReviewedParts(null);
                  }}
                  required
                  type="radio"
                  value={option}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {assistedParts[group.id] ? (
            <p className={styles.answerAssist}>Answer filled in after three attempts.</p>
          ) : null}
        </fieldset>

        <div className={styles.builderNavigation}>
          <Button
            disabled={groupIndex === 0}
            fullWidth={false}
            onClick={() => moveToGroup(groupIndex - 1)}
            type="button"
            variant="secondary"
          >
            Previous part
          </Button>
          {groupIndex < interaction.groups.length - 1 ? (
            <Button
              disabled={!parts[group.id]}
              fullWidth={false}
              onClick={() => moveToGroup(groupIndex + 1)}
              type="button"
            >
              Next part
            </Button>
          ) : (
            <Button disabled={!offerIsComplete} fullWidth={false} type="submit">
              {interaction.submit}
            </Button>
          )}
        </div>
      </form>

      <div className={styles.readOfferActions}>
        <Button
          disabled={!offerIsComplete}
          fullWidth={false}
          onClick={readOffer}
          type="button"
          variant="secondary"
        >
          {interaction.read}
        </Button>
        {submitted ? (
          <Button fullWidth={false} onClick={revise} type="button" variant="text">
            Revise
          </Button>
        ) : null}
      </div>
      <p key={readCount} className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {readCount > 0 ? assembledOffer : ""}
      </p>

      {submitted ? (
        <CaregiverFeedback
          key={submissionCount}
          focusWhen
          heading={interaction.learningPoint}
          tone="supportive"
        >
          <p className={mismatchedGroup ? styles.answerNeedsReview : styles.answerConfirmed}>
            {mismatchedGroup
              ? "This response needs review."
              : "This response is ready to continue."}
          </p>
          <p>{feedback}</p>
          <blockquote className={styles.offerReview}>
            {`${evaluatedParts.opening} ${evaluatedParts.action}? ${evaluatedParts.decline}. ${evaluatedParts.followup}.`}
          </blockquote>
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
