"use client";

import { useState } from "react";
import { CaregiverFeedback } from "../../foundation/caregiver-feedback";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-4.module.css";

export function ProfessionalHandoffSequence() {
  const item = caregiverModule4.interactions.handoff;
  const [order, setOrder] = useState<string[]>(item.items.map((entry) => entry.id));
  const [excluded, setExcluded] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [assisted, setAssisted] = useState(false);
  const { markInteractionSubmitted } = useCaregiverSession();
  const move = (id: string, offset: number) =>
    setOrder((current) => {
      const from = current.indexOf(id);
      const to = from + offset;
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      const fromItem = next[from];
      const toItem = next[to];
      if (fromItem === undefined || toItem === undefined) return current;
      next[from] = toItem;
      next[to] = fromItem;
      return next;
    });
  const invalid = item.items.filter((entry) => !entry.include && !excluded.includes(entry.id));
  return (
    <section
      className={styles.handoffBuilder}
      data-interaction-id={item.id}
      data-core-application="false"
      aria-labelledby={`${item.id}-heading`}
    >
      <h2 id={`${item.id}-heading`}>{item.title}</h2>
      <p>{item.prompt}</p>
      <ol>
        {order.map((id, index) => {
          const entry = item.items.find((candidate) => candidate.id === id)!;
          const needsReview = submitted && !entry.include && !excluded.includes(entry.id);
          return (
            <li
              key={id}
              data-excluded={excluded.includes(id)}
              data-needs-review={needsReview ? "true" : undefined}
            >
              <span>{entry.copy}</span>
              <div>
                <button
                  type="button"
                  disabled={index === 0 || excluded.includes(id)}
                  onClick={() => move(id, -1)}
                >
                  Move up
                </button>
                <button
                  type="button"
                  disabled={index === order.length - 1 || excluded.includes(id)}
                  onClick={() => move(id, 1)}
                >
                  Move down
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExcluded((current) =>
                      current.includes(id)
                        ? current.filter((value) => value !== id)
                        : [...current, id],
                    );
                    setSubmitted(false);
                  }}
                >
                  {excluded.includes(id) ? "Include" : "Exclude"}
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <div className={styles.actions}>
        <button
          className={styles.primaryAction}
          type="button"
          onClick={() => {
            const nextAttempt = attempts + (invalid.length ? 1 : 0);
            setAttempts(nextAttempt);
            if (invalid.length && nextAttempt >= 3) {
              setExcluded(["cause", "search"]);
              setOrder(["with", "stopped", "slow", "time", "cause", "search"]);
              setAssisted(true);
            }
            setSubmitted(true);
            markInteractionSubmitted(item.id);
          }}
        >
          {item.submit}
        </button>
      </div>
      {submitted ? (
        <CaregiverFeedback
          focusWhen
          heading={invalid.length ? "Handoff needs review" : "Handoff reviewed"}
          tone={invalid.length ? "warning" : "supportive"}
        >
          <p>
            {invalid.some((entry) => entry.id === "cause")
              ? item.feedback.cause
              : invalid.some((entry) => entry.id === "search")
                ? item.feedback.search
                : item.feedback.preferred}
          </p>
          <p>{item.learningPoint}</p>
          {assisted ? <p>Answer filled in after three attempts.</p> : null}
        </CaregiverFeedback>
      ) : null}
    </section>
  );
}
