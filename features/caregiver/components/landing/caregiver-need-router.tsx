"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { CaregiverFeedback } from "../foundation/caregiver-feedback";
import { caregiverLandingContent, caregiverLandingRoutes } from "../../content/caregiver-landing";
import type { CaregiverModuleId } from "../../content/caregiver-ids";
import styles from "../../styles/caregiver-landing.module.css";
import { getImplementedCaregiverModuleById } from "../../content/caregiver-module-registry";

export function CaregiverNeedRouter() {
  const firstChoiceRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<CaregiverModuleId | null>(null);
  const [submittedId, setSubmittedId] = useState<CaregiverModuleId | null>(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const { needRouter } = caregiverLandingContent;
  const submittedRoute = caregiverLandingRoutes.find((route) => route.id === submittedId);

  function reviseSelection(nextId: CaregiverModuleId) {
    setSelectedId(nextId);
    setSubmittedId(null);
  }

  function submitSelection() {
    if (!selectedId) return;
    setSubmittedId(selectedId);
    setSubmissionCount((count) => count + 1);
  }

  function clearSelection() {
    setSelectedId(null);
    setSubmittedId(null);
    firstChoiceRef.current?.focus();
  }

  return (
    <section
      id="caregiver-need-router"
      className={styles.needRouter}
      aria-labelledby="caregiver-need-router-title"
      data-interaction-id="CG-LANDING-I01"
    >
      <div className={styles.sectionHeading}>
        <p className={styles.sectionNumber}>{needRouter.interactionTitle}</p>
        <h2 id="caregiver-need-router-title">{needRouter.sectionTitle}</h2>
        <p>{needRouter.introduction}</p>
      </div>

      <fieldset className={styles.routeFieldset}>
        <legend>{needRouter.prompt}</legend>
        <div className={styles.routeChoices}>
          {caregiverLandingRoutes.map((route, index) => {
            const descriptionId = `caregiver-route-${route.order}-description`;
            return (
              <label
                key={route.id}
                className={styles.routeChoice}
                data-selected={selectedId === route.id ? "true" : "false"}
              >
                <span className={styles.routeNumber} aria-hidden="true">
                  {String(route.order).padStart(2, "0")}
                </span>
                <input
                  ref={index === 0 ? firstChoiceRef : undefined}
                  type="radio"
                  name="caregiver-starting-point"
                  value={route.id}
                  checked={selectedId === route.id}
                  aria-describedby={descriptionId}
                  onChange={() => reviseSelection(route.id)}
                />
                <span className={styles.routeChoiceCopy}>
                  <span className={styles.routeChoiceTitle}>{route.title}</span>
                  <span id={descriptionId} className={styles.routeChoiceDescription}>
                    {route.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className={styles.interactionActions}>
        <button
          className={styles.actionButton}
          type="button"
          disabled={!selectedId}
          onClick={submitSelection}
        >
          {needRouter.submit}
        </button>
        <button
          className={styles.textButton}
          type="button"
          disabled={!selectedId && !submittedId}
          onClick={clearSelection}
        >
          {needRouter.clear}
        </button>
      </div>

      {submittedRoute ? (
        <div className={styles.routeResult}>
          <CaregiverFeedback
            key={submissionCount}
            focusWhen
            heading={submittedRoute.action}
            tone={submittedRoute.id === "CG-M4" ? "warning" : "supportive"}
          >
            <p>{submittedRoute.feedback}</p>
            <p>{submittedRoute.description}</p>
            {getImplementedCaregiverModuleById(submittedRoute.id) ? (
              <Link
                className={styles.actionButton}
                href={getImplementedCaregiverModuleById(submittedRoute.id)!.route}
              >
                {submittedRoute.action}
              </Link>
            ) : (
              <p className={styles.destinationUnavailable}>{submittedRoute.moduleTitle}</p>
            )}
          </CaregiverFeedback>
          <button className={styles.textButton} type="button" onClick={clearSelection}>
            {needRouter.revise}
          </button>
        </div>
      ) : null}
    </section>
  );
}
