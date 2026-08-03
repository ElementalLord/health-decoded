"use client";

import { useState, type DragEvent, type FormEvent } from "react";

import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-3.module.css";

type Category = (typeof caregiverModule3.interactions.menu.categories)[number];

export function SupportMenu() {
  const interaction = caregiverModule3.interactions.menu;
  const { markInteractionSubmitted } = useCaregiverSession();
  const [placements, setPlacements] = useState<Record<string, Category | "">>({});
  const [submitted, setSubmitted] = useState(false);
  const complete = interaction.offers.every((offer) => Boolean(placements[offer.id]));
  const allPreferred = interaction.offers.every(
    (offer) => placements[offer.id] === offer.preferredCategory,
  );

  function place(offerId: string, category: Category | "") {
    setPlacements((current) => ({ ...current, [offerId]: category }));
    setSubmitted(false);
  }

  function startDrag(event: DragEvent<HTMLElement>, offerId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", offerId);
  }

  function drop(event: DragEvent<HTMLElement>, category: Category) {
    event.preventDefault();
    const offerId = event.dataTransfer.getData("text/plain");
    if (interaction.offers.some((offer) => offer.id === offerId)) place(offerId, category);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!complete) return;
    setSubmitted(true);
    markInteractionSubmitted(interaction.id);
  }

  function offerCard(offer: (typeof interaction.offers)[number]) {
    const needsReview = submitted && placements[offer.id] !== offer.preferredCategory;
    return (
      <article
        key={offer.id}
        className={styles.menuOffer}
        draggable
        onDragStart={(event) => startDrag(event, offer.id)}
      >
        <div className={styles.dragHandle} aria-hidden="true">
          ⋮⋮
        </div>
        <strong>{offer.label}</strong>
        <p>{offer.preference}</p>
        <label>
          <span className={styles.srOnly}>Place {offer.label}</span>
          <select
            value={placements[offer.id] ?? ""}
            onChange={(event) => {
              const value = event.currentTarget.value as Category | "";
              place(offer.id, value);
            }}
          >
            <option value="">Place offer</option>
            {interaction.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        {needsReview ? (
          <p className={styles.answerNeedsReview}>
            This placement needs review. The stated preference fits {offer.preferredCategory}.
          </p>
        ) : null}
      </article>
    );
  }

  return (
    <section
      className={styles.supportMenu}
      data-interaction-id={interaction.id}
      data-optional-practice="true"
      data-submitted={submitted ? "true" : "false"}
      aria-labelledby={`${interaction.id}-heading`}
    >
      <h2 id={`${interaction.id}-heading`}>{interaction.title}</h2>
      <p>{interaction.prompt}</p>
      <form onSubmit={submit}>
        <div className={styles.menuSurface} aria-label="Support menu placements">
          {interaction.categories.map((category) => (
            <section
              key={category}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => drop(event, category)}
            >
              <h3>{category}</h3>
              <div className={styles.menuDropZone}>
                {interaction.offers
                  .filter((offer) => placements[offer.id] === category)
                  .map(offerCard)}
              </div>
            </section>
          ))}
        </div>
        <div className={styles.menuTray} aria-label="Offers to place">
          {interaction.offers.filter((offer) => !placements[offer.id]).map(offerCard)}
        </div>
        <div className={styles.interactionActions}>
          <button className={styles.primaryAction} type="submit" disabled={!complete}>
            {interaction.submit}
          </button>
          {submitted ? (
            <button className={styles.textAction} type="button" onClick={() => setSubmitted(false)}>
              Revise placements
            </button>
          ) : null}
        </div>
      </form>
      {submitted ? (
        <CaregiverFeedback focusWhen heading={interaction.learningPoint} tone="neutral">
          <p>{allPreferred ? interaction.feedback.preferred : interaction.feedback.mismatch}</p>
        </CaregiverFeedback>
      ) : null}
      {!submitted ? <p>{interaction.learningPoint}</p> : null}
    </section>
  );
}
