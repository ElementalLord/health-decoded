"use client";

import { ArrowLeft, ArrowRight, Check, ExternalLink, Lightbulb, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  explainItBackChallenges,
  getExplainItBackChallenge,
} from "@/features/explain-it-back/content/explain-it-back-content";
import { hasUsefulExplanation } from "@/features/explain-it-back/services/explain-it-back-evaluator";
import type { ExplainFeedback } from "@/features/explain-it-back/types/explain-it-back";

import styles from "../styles/explain-it-back.module.css";

type Phase = "intro" | "browse" | "challenge";
type EvaluationResponse =
  | { status: "evaluated"; feedback: ExplainFeedback }
  | { status: "safety"; message: string; personalMedicalContent: boolean };

const groups = ["Foundations", "Food & labels"] as const;

export function ExplainItBackExperience({
  initialChallengeId,
}: {
  readonly initialChallengeId?: string;
}) {
  const [phase, setPhase] = useState<Phase>(initialChallengeId ? "challenge" : "intro");
  const [challengeId, setChallengeId] = useState<string | null>(initialChallengeId ?? null);
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState<ExplainFeedback | null>(null);
  const [safetyMessage, setSafetyMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const challenge = challengeId ? getExplainItBackChallenge(challengeId) : null;
  const useful = useMemo(() => hasUsefulExplanation(explanation), [explanation]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [phase, challengeId]);

  useEffect(() => {
    if (feedback || safetyMessage || formError) feedbackRef.current?.focus();
  }, [feedback, formError, safetyMessage]);

  function chooseChallenge(id: string) {
    setChallengeId(id);
    setExplanation("");
    setFeedback(null);
    setSafetyMessage(null);
    setFormError(null);
    setAttempts(0);
    setShowExample(false);
    setPhase("challenge");
  }

  function chooseAnother() {
    setPhase("browse");
    setChallengeId(null);
    setExplanation("");
    setFeedback(null);
    setSafetyMessage(null);
    setFormError(null);
    setShowExample(false);
  }

  function retry() {
    setFeedback(null);
    setSafetyMessage(null);
    setFormError(null);
    setShowExample(false);
    textareaRef.current?.focus();
  }

  async function submit() {
    if (!challenge || !useful || submitting) return;
    setSubmitting(true);
    setFormError(null);
    setSafetyMessage(null);
    try {
      const response = await fetch("/api/explain-it-back/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: challenge.id, explanation }),
      });
      const body = (await response.json()) as EvaluationResponse | { error?: { message?: string } };
      if (!response.ok || !("status" in body)) {
        throw new Error("error" in body ? body.error?.message : undefined);
      }
      setAttempts((count) => count + 1);
      if (body.status === "safety") {
        setFeedback(null);
        setSafetyMessage(body.message);
      } else {
        setSafetyMessage(null);
        setFeedback(body.feedback);
      }
    } catch (error) {
      setFormError(
        error instanceof Error && error.message
          ? error.message
          : "I couldn't check that explanation right now. Your answer is still here, so you can try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "intro") {
    return (
      <main className={styles.page}>
        <section className={styles.intro}>
          <div className={styles.introCopy}>
            <p className="editorial-eyebrow">A teach-back exercise</p>
            <h1 ref={headingRef} tabIndex={-1}>
              Explain It Back
            </h1>
            <p className={styles.subtitle}>Put a diabetes concept into your own words.</p>
            <p className={styles.introduction}>
              Understanding something well enough to explain it can be different from recognizing it
              on a page. Pick a concept, explain the main idea in your own words, and Health Decoded
              will check whether the idea came through.
            </p>
            <Button fullWidth={false} onClick={() => setPhase("browse")} size="lg">
              Choose a concept <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <div aria-hidden="true" className={styles.ideaSequence}>
            <MessageCircle />
            <span />
            <Lightbulb />
            <span />
            <Check />
          </div>
        </section>
        <aside className={styles.notes}>
          <p>Spelling and grammar don&apos;t count.</p>
          <p>Use your notes if you want. This isn&apos;t a memory test.</p>
        </aside>
      </main>
    );
  }

  if (phase === "browse") {
    return (
      <main className={styles.page}>
        <button className={styles.back} onClick={() => setPhase("intro")} type="button">
          <ArrowLeft aria-hidden="true" /> Back
        </button>
        <header className={styles.browserHeader}>
          <p className="editorial-eyebrow">Explain It Back</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Choose one idea to make your own.
          </h1>
          <p>Start anywhere. You can use simple language, a short answer, or an analogy.</p>
        </header>
        <div className={styles.conceptGroups}>
          {groups.map((group) => (
            <section aria-labelledby={`group-${group}`} className={styles.conceptGroup} key={group}>
              <h2 id={`group-${group}`}>{group}</h2>
              <div>
                {explainItBackChallenges
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <button key={item.id} onClick={() => chooseChallenge(item.id)} type="button">
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.shortDescriptor}</small>
                      </span>
                      <ArrowRight aria-hidden="true" />
                    </button>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    );
  }

  if (!challenge) return null;

  const evaluated = Boolean(feedback || safetyMessage || formError);
  const canShowExample = attempts >= 2 && feedback?.verdict !== "got_it";

  return (
    <main className={styles.page}>
      <button className={styles.back} onClick={chooseAnother} type="button">
        <ArrowLeft aria-hidden="true" /> All concepts
      </button>
      <div className={styles.challengeLayout}>
        <section aria-labelledby="challenge-title" className={styles.challenge}>
          <p className="editorial-eyebrow">Explain It Back · Concept</p>
          <h1 id="challenge-title" ref={headingRef} tabIndex={-1}>
            {challenge.title}
          </h1>
          <p className={styles.prompt}>{challenge.prompt}</p>
          <p className={styles.help}>
            You don&apos;t need perfect wording. Just explain the main idea.
          </p>

          <label htmlFor="explanation">Your explanation</label>
          <textarea
            aria-describedby="explanation-help"
            disabled={submitting}
            id="explanation"
            maxLength={1_000}
            onChange={(event) => setExplanation(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                void submit();
              }
            }}
            placeholder="Explain it like you were telling someone who had never heard the term before…"
            ref={textareaRef}
            value={explanation}
          />
          <div className={styles.textareaMeta} id="explanation-help">
            <span>We check the idea—not your writing.</span>
            <span>{explanation.length}/1000</span>
          </div>
          {!useful && explanation.length > 0 ? (
            <p className={styles.inlineHint}>Add a little more so there is an idea to check.</p>
          ) : null}
          <Button
            disabled={!useful || submitting}
            fullWidth={false}
            onClick={() => void submit()}
            size="lg"
          >
            {submitting ? "Checking the idea…" : "Check my explanation"}
          </Button>
        </section>

        <aside aria-label="Explanation feedback" className={styles.feedbackRail}>
          {evaluated ? (
            <div
              aria-live="polite"
              className={styles.feedback}
              ref={feedbackRef}
              role="status"
              tabIndex={-1}
            >
              {formError ? (
                <>
                  <p className={styles.feedbackLabel}>Your answer is still here.</p>
                  <p>{formError}</p>
                  <Button fullWidth={false} onClick={() => void submit()} variant="secondary">
                    Try checking again
                  </Button>
                </>
              ) : safetyMessage ? (
                <>
                  <p className={styles.feedbackLabel}>Keep this one general.</p>
                  <p>{safetyMessage}</p>
                  <Button fullWidth={false} onClick={retry} variant="secondary">
                    Revise my explanation
                  </Button>
                </>
              ) : feedback ? (
                <>
                  <p className={styles.feedbackLabel}>{feedback.label}</p>
                  {feedback.verdict === "got_it" ? (
                    <div>
                      <p className={styles.feedbackHeading}>You explained that:</p>
                      <ul className={styles.coveredList}>
                        {feedback.covered.map((item) => (
                          <li key={item}>
                            <Check aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : feedback.verdict === "almost_there" ? (
                    <>
                      {feedback.covered[0] ? (
                        <div>
                          <p className={styles.feedbackHeading}>You captured:</p>
                          <p>{feedback.covered[0]}</p>
                        </div>
                      ) : null}
                      <div>
                        <p className={styles.feedbackHeading}>One piece to add:</p>
                        <p>{feedback.missing}</p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className={styles.feedbackHeading}>
                        {feedback.correction ? "One part needs a rethink:" : "Try explaining:"}
                      </p>
                      <p>{feedback.correction ?? feedback.missing}</p>
                      {feedback.correction && feedback.missing ? (
                        <p className={styles.hint}>Hint: {feedback.missing}</p>
                      ) : null}
                    </div>
                  )}
                  {feedback.personalMedicalContent ? (
                    <p className={styles.personalNote}>
                      Explain It Back checks general concepts, not personal medical results. Try
                      explaining the concept itself without using your own numbers.
                    </p>
                  ) : null}
                  <div className={styles.feedbackActions}>
                    {feedback.verdict === "got_it" ? (
                      <Link className={styles.journeyLink} href="/journey">
                        Back to Journey <ArrowRight aria-hidden="true" />
                      </Link>
                    ) : (
                      <Button fullWidth={false} onClick={retry}>
                        Try again
                      </Button>
                    )}
                    {canShowExample && !showExample ? (
                      <Button fullWidth={false} onClick={() => setShowExample(true)} variant="text">
                        See an example explanation
                      </Button>
                    ) : null}
                  </div>
                </>
              ) : null}

              {showExample ? (
                <section className={styles.example}>
                  <p className={styles.feedbackHeading}>One clear example</p>
                  <blockquote>{challenge.referenceAnswer}</blockquote>
                  <p>You don&apos;t have to explain it this way. This is just one clear example.</p>
                  <div className={styles.feedbackActions}>
                    <Button fullWidth={false} onClick={retry} variant="secondary">
                      Try again
                    </Button>
                    <Button fullWidth={false} onClick={chooseAnother} variant="text">
                      Choose another concept
                    </Button>
                  </div>
                </section>
              ) : null}

              {feedback || showExample ? (
                <section className={styles.sources}>
                  <p className={styles.feedbackHeading}>Learn from</p>
                  {challenge.sources.map((source) => (
                    <a href={source.url} key={source.url} rel="noreferrer noopener" target="_blank">
                      <span>
                        <strong>{source.organization}</strong>
                        <small>{source.title}</small>
                      </span>
                      <ExternalLink aria-hidden="true" />
                    </a>
                  ))}
                </section>
              ) : null}
            </div>
          ) : (
            <div className={styles.waitingNote}>
              <p className="editorial-eyebrow">What gets checked</p>
              <p>
                Whether the important idea came through—not exact wording, grammar, or spelling.
              </p>
              <small>Use ⌘ Enter or Ctrl Enter when you&apos;re ready.</small>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
