"use client";

import { ArrowRight, Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { recognizeMilestone } from "@/features/achievements/lib/recognize-milestone.client";
import { mythCheckCards } from "@/features/mythbusters/content/myth-check-cards";
import { mythCheckSourceById } from "@/features/mythbusters/content/myth-check-sources";
import {
  createMythCheckRound,
  mythCheckModeDetails,
} from "@/features/mythbusters/lib/myth-check-rounds";
import type {
  MythCheckAnswer,
  MythCheckCard,
  MythCheckMode,
  MythCheckVerdict,
} from "@/features/mythbusters/types/myth-check";
import styles from "@/features/mythbusters/styles/diabetes-myth-check.module.css";

const verdictLabels: Record<MythCheckVerdict, string> = {
  myth: "Myth",
  fact: "Fact",
  depends: "It depends",
};

const categoryLabels: Record<MythCheckCard["category"], string> = {
  basics: "Diabetes Basics",
  food: "Food and Carbohydrates",
  monitoring: "Tests and Monitoring",
  treatment: "Treatment and Safety",
};

type Phase = "start" | "round" | "summary";

function Sources({ card, onOpen }: { card: MythCheckCard; onOpen: () => void }) {
  const sources = card.sourceIds.flatMap((id) => {
    const source = mythCheckSourceById.get(id);
    return source ? [source] : [];
  });

  return (
    <details className={styles.sources} onToggle={(event) => event.currentTarget.open && onOpen()}>
      <summary>View sources</summary>
      <ul>
        {sources.map((source) => (
          <li key={source.id}>
            <span>{source.organization}</span>
            <a href={source.url} rel="noreferrer noopener" target="_blank">
              {source.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function DiabetesMythCheck() {
  const [phase, setPhase] = useState<Phase>("start");
  const [round, setRound] = useState<readonly MythCheckCard[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<MythCheckVerdict | null>(null);
  const [answers, setAnswers] = useState<readonly MythCheckAnswer[]>([]);
  const [isReplay, setIsReplay] = useState(false);
  const [reviewedSourceClaims, setReviewedSourceClaims] = useState<ReadonlySet<string>>(new Set());
  const claimRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLHeadingElement>(null);

  const current = round[index];
  const misunderstood = useMemo(
    () => answers.filter((answer) => !answer.understood),
    [answers],
  );

  useEffect(() => {
    if (phase === "round" && !selected) claimRef.current?.focus();
  }, [index, phase, selected]);

  useEffect(() => {
    if (selected) feedbackRef.current?.focus();
  }, [selected]);

  function begin(cards: readonly MythCheckCard[]) {
    setRound(cards);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setPhase("round");
  }

  function startMode(mode: Exclude<MythCheckMode, "replay">) {
    setIsReplay(false);
    begin(createMythCheckRound(mythCheckCards, mode));
  }

  function answer(verdict: MythCheckVerdict) {
    if (!current || selected) return;
    setSelected(verdict);
    setAnswers((existing) => [
      ...existing,
      { cardId: current.id, selected: verdict, understood: verdict === current.verdict },
    ]);
  }

  function next() {
    if (index === round.length - 1) {
      void recognizeMilestone({ event: isReplay ? "myth_replay_completed" : "myth_round_completed" });
      setPhase("summary");
      return;
    }
    setSelected(null);
    setIndex((value) => value + 1);
  }

  function replay() {
    const ids = new Set(misunderstood.map((answer) => answer.cardId));
    setIsReplay(true);
    begin(round.filter((entry) => ids.has(entry.id)));
  }

  function reviewSources(cardId: string) {
    if (reviewedSourceClaims.has(cardId)) return;
    const next = new Set(reviewedSourceClaims).add(cardId);
    setReviewedSourceClaims(next);
    if (next.size === 3)
      void recognizeMilestone({ event: "myth_sources_reviewed", distinctClaimCount: 3 });
  }

  if (phase === "start") {
    return (
      <main className={styles.mythCheck}>
        <header className={styles.hero}>
          <p className="editorial-eyebrow">Evidence, in plain language</p>
          <h1>Diabetes Myth Check</h1>
          <p className={styles.supporting}>
            Test common diabetes claims and learn what the evidence actually says.
          </p>
          <p className={styles.boundary}>
            This activity explains general diabetes information. It does not interpret your
            symptoms, results, medicines, or treatment plan.
          </p>
        </header>

        <section aria-labelledby="choose-round" className={styles.modeSection}>
          <div className={styles.sectionHeading}>
            <p>Choose your round</p>
            <h2 id="choose-round">Start with what feels useful today.</h2>
          </div>
          <div className={styles.modeGrid}>
            {mythCheckModeDetails.map((mode, modeIndex) => (
              <button key={mode.id} onClick={() => startMode(mode.id)} type="button">
                <span>{String(modeIndex + 1).padStart(2, "0")}</span>
                <strong>{mode.title}</strong>
                <small>{mode.description}</small>
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (phase === "summary") {
    const understood = answers.filter((answer) => answer.understood).length;
    return (
      <main className={styles.mythCheck}>
        <section aria-labelledby="round-summary" className={styles.summary}>
          <p className="editorial-eyebrow">Round complete</p>
          <h1 id="round-summary">You reviewed {round.length} common diabetes claims.</h1>
          <p>
            You understood {understood} {understood === 1 ? "claim" : "claims"} on the first
            attempt. {misunderstood.length ? `${misunderstood.length} may be worth another look.` : "Every takeaway landed this time."}
          </p>

          {misunderstood.length ? (
            <section aria-labelledby="revisit-heading" className={styles.revisit}>
              <h2 id="revisit-heading">Claims worth revisiting</h2>
              <ul>
                {misunderstood.map((answer) => {
                  const entry = round.find((card) => card.id === answer.cardId);
                  return entry ? <li key={entry.id}>{entry.takeaway}</li> : null;
                })}
              </ul>
            </section>
          ) : null}

          <div className={styles.summaryActions}>
            {misunderstood.length ? (
              <Button fullWidth={false} onClick={replay}>
                <RotateCcw aria-hidden="true" /> Replay these claims
              </Button>
            ) : null}
            <Button fullWidth={false} onClick={() => setPhase("start")} variant="secondary">
              Start another round
            </Button>
            <Link href="/resources">Return to Resources</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!current) return null;
  const isCorrect = selected === current.verdict;

  return (
    <main className={styles.mythCheck}>
      <section aria-labelledby="current-claim" className={styles.round}>
        <header className={styles.roundHeader}>
          <div>
            <p>{categoryLabels[current.category]}</p>
            <span>Claim {index + 1} of {round.length}</span>
          </div>
          <ProgressBar
            label={`Claim ${index + 1} of ${round.length}`}
            value={((index + 1) / round.length) * 100}
          />
        </header>

        <div className={styles.claimPanel}>
          <p>What does the evidence say?</p>
          <h1 id="current-claim" ref={claimRef} tabIndex={-1}>{current.claim}</h1>
          <div aria-label="Choose the best answer" className={styles.answers} role="group">
            {(["myth", "fact", "depends"] as const).map((verdict) => (
              <button
                aria-pressed={selected === verdict}
                className={selected === verdict ? styles.selectedAnswer : undefined}
                disabled={selected !== null}
                key={verdict}
                onClick={() => answer(verdict)}
                type="button"
              >
                {selected === verdict ? <Check aria-hidden="true" /> : null}
                {verdictLabels[verdict]}
              </button>
            ))}
          </div>
        </div>

        {selected ? (
          <section aria-labelledby="feedback-heading" aria-live="polite" className={styles.feedback}>
            <p>{isCorrect ? "That’s the best answer." : `The best answer is ${verdictLabels[current.verdict]}.`}</p>
            <h2 id="feedback-heading" ref={feedbackRef} tabIndex={-1}>Reality</h2>
            <p className={styles.explanation}>{current.explanation}</p>
            <aside className={styles.takeaway}>
              <strong>Keep this with you</strong>
              <p>{current.takeaway}</p>
            </aside>
            <Sources card={current} onOpen={() => reviewSources(current.id)} />
            <Button fullWidth={false} onClick={next}>
              {index === round.length - 1 ? "Review this round" : "Next claim"}
              <ArrowRight aria-hidden="true" />
            </Button>
          </section>
        ) : null}
      </section>
    </main>
  );
}
