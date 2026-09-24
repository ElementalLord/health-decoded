"use client";

import { ArrowRight, Check, RotateCcw } from "lucide-react";
import Image from "next/image";
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

const wheelColors = ["#7898b5", "#a17ca4", "#c88b73", "#db795f", "#f0b958", "#7da08f"];
const wheelLabels = [
  ["Quick", "Mix"],
  ["Diabetes", "Basics"],
  ["Food +", "Carbs"],
  ["Tests +", "Monitoring"],
  ["Treatment +", "Safety"],
  ["Review", "All"],
] as const;
const wheelLabelPositions = [
  [200, 105],
  [280, 153],
  [280, 247],
  [200, 295],
  [120, 247],
  [120, 153],
] as const;
const wheelPaths = [
  "M 200 200 L 105 35.5 A 190 190 0 0 1 295 35.5 Z",
  "M 200 200 L 295 35.5 A 190 190 0 0 1 390 200 Z",
  "M 200 200 L 390 200 A 190 190 0 0 1 295 364.5 Z",
  "M 200 200 L 295 364.5 A 190 190 0 0 1 105 364.5 Z",
  "M 200 200 L 105 364.5 A 190 190 0 0 1 10 200 Z",
  "M 200 200 L 10 200 A 190 190 0 0 1 105 35.5 Z",
] as const;

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
  const [isSpinning, setIsSpinning] = useState(false);
  const [landedMode, setLandedMode] = useState<Exclude<MythCheckMode, "replay"> | null>(null);
  const claimRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLHeadingElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const wheelAnimationRef = useRef<Animation | null>(null);
  const wheelLabelAnimationsRef = useRef<Animation[]>([]);
  const wheelRotationRef = useRef(0);

  const current = round[index];
  const misunderstood = useMemo(() => answers.filter((answer) => !answer.understood), [answers]);

  useEffect(() => {
    if (phase === "round" && !selected) claimRef.current?.focus();
  }, [index, phase, selected]);

  useEffect(() => {
    if (selected) feedbackRef.current?.focus();
  }, [selected]);

  useEffect(
    () => () => {
      wheelAnimationRef.current?.cancel();
      wheelLabelAnimationsRef.current.forEach((animation) => animation.cancel());
    },
    [],
  );

  function stopWheel() {
    wheelAnimationRef.current?.cancel();
    wheelAnimationRef.current = null;
    wheelLabelAnimationsRef.current.forEach((animation) => animation.cancel());
    wheelLabelAnimationsRef.current = [];
    setIsSpinning(false);
  }

  function begin(cards: readonly MythCheckCard[]) {
    setRound(cards);
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setPhase("round");
  }

  function startMode(mode: Exclude<MythCheckMode, "replay">) {
    stopWheel();
    setIsReplay(false);
    begin(createMythCheckRound(mythCheckCards, mode));
  }

  function spinWheel() {
    const wheel = wheelRef.current;
    if (!wheel || isSpinning) return;

    const modeIndex = Math.floor(Math.random() * mythCheckModeDetails.length);
    const mode = mythCheckModeDetails[modeIndex];
    if (!mode) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desiredRotation = (360 - modeIndex * 60) % 360;
    const currentRotation = wheelRotationRef.current;
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const alignment = (desiredRotation - normalizedRotation + 360) % 360;
    const targetRotation = currentRotation + (reducedMotion ? alignment : 360 * 5 + alignment);
    const animationOptions: KeyframeAnimationOptions = {
      duration: reducedMotion ? 1 : 4_400,
      easing: "cubic-bezier(0.12, 0.74, 0.16, 1)",
      fill: "forwards",
    };

    const finishSpin = () => {
      wheelRotationRef.current = targetRotation;
      wheel.style.transform = `rotate(${targetRotation}deg)`;
      labels.forEach((label) => {
        label.style.transform = `rotate(${-targetRotation}deg)`;
      });
      wheelLabelAnimationsRef.current.forEach((animation) => animation.cancel());
      wheelLabelAnimationsRef.current = [];
      wheelAnimationRef.current?.cancel();
      wheelAnimationRef.current = null;
      setIsSpinning(false);
      setLandedMode(mode.id);
      if (!reducedMotion && typeof navigator.vibrate === "function") navigator.vibrate(18);
    };

    setLandedMode(null);
    setIsSpinning(true);
    const labels = [...wheel.querySelectorAll<SVGTextElement>("[data-wheel-label]")];
    try {
      wheelAnimationRef.current = wheel.animate(
        [
          { transform: `rotate(${currentRotation}deg)` },
          { transform: `rotate(${targetRotation}deg)` },
        ],
        animationOptions,
      );
      wheelLabelAnimationsRef.current = labels.map((label) =>
        label.animate(
          [
            { transform: `rotate(${-currentRotation}deg)` },
            { transform: `rotate(${-targetRotation}deg)` },
          ],
          animationOptions,
        ),
      );
      wheelAnimationRef.current.onfinish = finishSpin;
    } catch {
      wheelLabelAnimationsRef.current.forEach((animation) => animation.cancel());
      wheelLabelAnimationsRef.current = [];
      wheelAnimationRef.current?.cancel();
      wheelAnimationRef.current = null;
      finishSpin();
    }
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
      void recognizeMilestone({
        event: isReplay ? "myth_replay_completed" : "myth_round_completed",
      });
      setPhase("summary");
      return;
    }
    setSelected(null);
    setIndex((value) => value + 1);
  }

  function replay() {
    const ids = new Set(misunderstood.map((answer) => answer.cardId));
    setIsReplay(true);
    begin(misunderstood.length ? round.filter((entry) => ids.has(entry.id)) : round);
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
            <p>Choose a round</p>
            <h2 id="choose-round">Pick a topic or let the wheel decide.</h2>
            <span>Spin for a surprise, or choose any round yourself.</span>
          </div>
          <div className={styles.wheelLayout}>
            <div className={styles.wheelColumn}>
              <div className={styles.wheelStage}>
                <svg aria-hidden="true" className={styles.wheelPointer} viewBox="0 0 52 72">
                  <defs>
                    <linearGradient id="wheel-pointer-gold" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0" stopColor="#f8df96" />
                      <stop offset="0.48" stopColor="#b87424" />
                      <stop offset="1" stopColor="#7f4719" />
                    </linearGradient>
                    <linearGradient id="wheel-pointer-enamel" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#5a4035" />
                      <stop offset="1" stopColor="#2f211d" />
                    </linearGradient>
                  </defs>
                  <path
                    className={styles.pointerOutline}
                    d="M6 8 Q26 0 46 8 L34 43 L26 69 L18 43 Z"
                  />
                  <path
                    className={styles.pointerInset}
                    d="M11 12 Q26 7 41 12 L30 42 L26 57 L22 42 Z"
                  />
                  <circle className={styles.pointerRivet} cx="26" cy="18" r="5" />
                  <circle className={styles.pointerHighlight} cx="24.5" cy="16.5" r="1.6" />
                </svg>
                <div
                  aria-label="Round choice wheel with six choices"
                  className={styles.wheel}
                  data-spinning={isSpinning ? "" : undefined}
                  ref={wheelRef}
                  role="img"
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    className={styles.wheelFace}
                    fill
                    priority
                    quality={90}
                    sizes="(max-width: 768px) 90vw, 480px"
                    src="/myth-check/myth-check-wheel-face-v1.webp"
                  />
                  <svg aria-hidden="true" viewBox="0 0 400 400">
                    {wheelPaths.map((path, modeIndex) => {
                      const position = wheelLabelPositions[modeIndex];
                      const label = wheelLabels[modeIndex];
                      return position && label ? (
                        <g key={path}>
                          <path d={path} fill="transparent" />
                          <text data-wheel-label x={position[0]} y={position[1] - 8}>
                            <tspan x={position[0]}>{label[0]}</tspan>
                            <tspan dy="20" x={position[0]}>
                              {label[1]}
                            </tspan>
                          </text>
                        </g>
                      ) : null;
                    })}
                    <circle className={styles.wheelRim} cx="200" cy="200" r="190" />
                  </svg>
                </div>
                <Image
                  alt=""
                  aria-hidden="true"
                  className={styles.wheelFrame}
                  fill
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 90vw, 480px"
                  src="/myth-check/myth-check-wheel-frame-v1.webp"
                />
              </div>
              <Button
                className={styles.spinButton}
                disabled={isSpinning}
                fullWidth={false}
                onClick={spinWheel}
              >
                <RotateCcw aria-hidden="true" />
                {isSpinning ? "Spinning" : "Spin the wheel"}
              </Button>
              {landedMode ? (
                <div aria-live="polite" className={styles.landedChoice}>
                  <span>Your wheel chose</span>
                  <strong>
                    {mythCheckModeDetails.find((mode) => mode.id === landedMode)?.title}
                  </strong>
                  <Button fullWidth={false} onClick={() => startMode(landedMode)}>
                    Start this round <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              ) : null}
            </div>

            <div className={styles.directChoice}>
              <p>Know what you want?</p>
              <h3>Choose your own round</h3>
              <div className={styles.choiceList}>
                {mythCheckModeDetails.map((mode, modeIndex) => (
                  <button key={mode.id} onClick={() => startMode(mode.id)} type="button">
                    <span style={{ background: wheelColors[modeIndex] }} />
                    <span>
                      <strong>{mode.title}</strong>
                      <small>{mode.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
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
            attempt.{" "}
            {misunderstood.length
              ? `${misunderstood.length} may be worth another look.`
              : "Every takeaway landed this time."}
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
            <Button fullWidth={false} onClick={replay}>
              <RotateCcw aria-hidden="true" />
              {misunderstood.length ? "Replay these claims" : "Replay this round"}
            </Button>
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
      <section
        aria-labelledby="current-claim"
        className={`${styles.round} ${selected ? styles.roundAnswered : ""}`}
      >
        <header className={styles.roundHeader}>
          <div>
            <p>{categoryLabels[current.category]}</p>
            <span>
              Claim {index + 1} of {round.length}
            </span>
          </div>
          <ProgressBar
            label={`Claim ${index + 1} of ${round.length}`}
            value={((index + 1) / round.length) * 100}
          />
        </header>

        <div className={styles.claimPanel}>
          <p>What does the evidence say?</p>
          <h1 id="current-claim" ref={claimRef} tabIndex={-1}>
            {current.claim}
          </h1>
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
          <section
            aria-labelledby="feedback-heading"
            aria-live="polite"
            className={styles.feedback}
          >
            <p>
              {isCorrect
                ? "That’s the best answer."
                : `The best answer is ${verdictLabels[current.verdict]}.`}
            </p>
            <h2 id="feedback-heading" ref={feedbackRef} tabIndex={-1}>
              Reality
            </h2>
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
