"use client";

import { ArrowLeft, ArrowRight, Check, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ContextualNextStep } from "@/features/cohesion/components/contextual-next-step";
import { getNextLearningAction } from "@/features/cohesion/lib/get-next-learning-action";
import {
  crackerLabel,
  decodeLabelQuestions,
  decodeLabelSectionLabels,
  fruitYogurtLabel,
  plainYogurtLabel,
} from "@/features/decode-the-label/content/decode-the-label-content";
import type { DecodeLabelAnswer } from "@/features/decode-the-label/types/decode-the-label";

import { NutritionFacts } from "./nutrition-facts";
import styles from "../styles/decode-the-label.module.css";

type Phase = "intro" | "exercise" | "recap";

const decodeContinuation = getNextLearningAction({
  sourceType: "decode-the-label",
  sourceId: "decode-the-label",
});

function FocusFirst() {
  return (
    <aside aria-labelledby="focus-first-heading" className={styles.focusFirst}>
      <p className="editorial-eyebrow">What to focus on first</p>
      <h2 id="focus-first-heading">Five useful places to look</h2>
      <ol>
        <li>Serving size</li>
        <li>Total carbohydrate</li>
        <li>Fiber</li>
        <li>Added sugars</li>
        <li>Protein</li>
      </ol>
    </aside>
  );
}

function ConceptNote() {
  return (
    <aside aria-labelledby="concept-note-title" className={styles.conceptNote}>
      <p className="editorial-eyebrow">A useful first habit</p>
      <h2 id="concept-note-title">Sugar is one detail, not the whole label.</h2>
      <p>
        When people are new to diabetes, they often zoom in on sugar first. A steadier place to
        begin is serving size and total carbohydrate, then fiber, added sugars, and protein for
        extra context.
      </p>
    </aside>
  );
}

function LabelReference({ section }: { section: "warm-up" | "concept" | "comparison" }) {
  if (section === "concept") return <ConceptNote />;
  if (section === "comparison")
    return (
      <div aria-label="Compare two fictional yogurt labels" className={styles.comparisonLabels}>
        <NutritionFacts compact label={plainYogurtLabel} />
        <NutritionFacts compact label={fruitYogurtLabel} />
      </div>
    );
  return <NutritionFacts label={crackerLabel} />;
}

export function DecodeTheLabelExperience() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<readonly DecodeLabelAnswer[]>([]);
  const [introImageFailed, setIntroImageFailed] = useState(false);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const current = decodeLabelQuestions[index];

  useEffect(() => {
    if (phase === "exercise" && !selectedChoiceId) questionRef.current?.focus();
  }, [index, phase, selectedChoiceId]);

  useEffect(() => {
    if (selectedChoiceId) feedbackRef.current?.focus();
  }, [selectedChoiceId]);

  function start() {
    setIndex(0);
    setAnswers([]);
    setSelectedChoiceId(null);
    setPhase("exercise");
  }

  function answer(choiceId: string) {
    if (!current || selectedChoiceId) return;
    const correct = choiceId === current.correctChoiceId;
    setSelectedChoiceId(choiceId);
    setAnswers((existing) => [...existing, { questionId: current.id, choiceId, correct }]);
  }

  function next() {
    if (index === decodeLabelQuestions.length - 1) {
      setPhase("recap");
      return;
    }
    setIndex((value) => value + 1);
    setSelectedChoiceId(null);
  }

  if (phase === "intro")
    return (
      <main className={styles.page}>
        <header className={styles.introHero}>
          <div className={styles.introCopy}>
            <p className="editorial-eyebrow">A practical food-label exercise</p>
            <h1>Decode the Label</h1>
            <p className={styles.subtitle}>
              Learn how to read a nutrition label without overthinking it.
            </p>
            <p className={styles.introduction}>
              Nutrition labels can feel overwhelming at first. You do not need to memorize every
              line. A good place to start is learning where the main pieces of information live and
              what a few of them mean. This activity helps you practice that in a simple way.
            </p>
            <p className={styles.time}>
              <Clock3 aria-hidden="true" /> 4–6 minutes
            </p>
            <Button fullWidth={false} onClick={start} size="lg">
              Start the activity <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <figure className={styles.introArtwork}>
            {introImageFailed ? (
              <div
                aria-label="The illustration is unavailable. The activity’s nutrition facts remain available as text."
                className={styles.imageFallback}
                role="img"
              >
                <p className="editorial-eyebrow">Illustration unavailable</p>
                <p>The nutrition facts in the activity are still fully available as text.</p>
              </div>
            ) : (
              <Image
                alt="An illustrated pantry counter with a fictional food package turned to show its nutrition label"
                height={1024}
                onError={() => setIntroImageFailed(true)}
                priority
                sizes="(max-width: 48rem) 100vw, 44vw"
                src="/decode-the-label/pantry-label-editorial.png"
                width={1536}
              />
            )}
          </figure>
        </header>

        <section className={styles.introLower}>
          <FocusFirst />
          <div className={styles.calmReminder}>
            <p className="editorial-eyebrow">Keep in mind</p>
            <p>This activity is for learning, not for judging yourself or your food choices.</p>
            <p>
              A better question than “Can I eat this?” is often “What does this label help me
              understand about this food?”
            </p>
          </div>
        </section>
      </main>
    );

  if (phase === "recap")
    return (
      <main className={styles.page}>
        <section aria-labelledby="decode-recap-title" className={styles.recap}>
          <p className="editorial-eyebrow">Practice complete</p>
          <h1 id="decode-recap-title">You practiced reading a nutrition label.</h1>
          <p>
            You found useful starting points and compared two foods using context instead of
            judgment.
          </p>
          <div className={styles.recapNotes}>
            <h2>Three ideas to keep</h2>
            <ul>
              <li>
                <Check aria-hidden="true" /> Start with serving size.
              </li>
              <li>
                <Check aria-hidden="true" /> Then look for total carbohydrate.
              </li>
              <li>
                <Check aria-hidden="true" /> Use fiber, added sugars, and protein for extra context.
              </li>
            </ul>
          </div>
          <p className={styles.reassurance}>
            You do not need to read every label perfectly. The goal is to understand a little more
            each time.
          </p>
          <div className={styles.recapActions}>
            {decodeContinuation ? (
              <ContextualNextStep action={decodeContinuation} label="Try one thing next" />
            ) : null}
          </div>
        </section>
      </main>
    );

  if (!current) return null;
  const isCorrect = selectedChoiceId === current.correctChoiceId;

  return (
    <main className={styles.page}>
      <header className={styles.exerciseHeader}>
        <Link href="/resources">
          <ArrowLeft aria-hidden="true" /> Resources
        </Link>
        <div>
          <p>
            {decodeLabelSectionLabels[current.section]} · {index + 1} of{" "}
            {decodeLabelQuestions.length}
          </p>
          <ProgressBar
            label={`Question ${index + 1} of ${decodeLabelQuestions.length}`}
            value={((index + 1) / decodeLabelQuestions.length) * 100}
          />
        </div>
      </header>

      <div className={styles.exerciseGrid}>
        <aside className={styles.labelReference}>
          <LabelReference section={current.section} />
        </aside>

        <section aria-labelledby="decode-question" className={styles.questionPanel}>
          <p className="editorial-eyebrow">Question {index + 1}</p>
          <h1 id="decode-question" ref={questionRef} tabIndex={-1}>
            {current.prompt}
          </h1>
          <div aria-label="Choose one answer" className={styles.choices} role="group">
            {current.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;
              const choiceIsCorrect =
                selectedChoiceId !== null && choice.id === current.correctChoiceId;
              return (
                <button
                  aria-pressed={isSelected}
                  className={
                    choiceIsCorrect
                      ? styles.correctChoice
                      : isSelected
                        ? styles.chosenChoice
                        : undefined
                  }
                  disabled={selectedChoiceId !== null}
                  key={choice.id}
                  onClick={() => answer(choice.id)}
                  type="button"
                >
                  <span>{choice.label}</span>
                  {choiceIsCorrect ? <Check aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>

          {selectedChoiceId ? (
            <div
              aria-live="polite"
              className={styles.feedback}
              ref={feedbackRef}
              role="status"
              tabIndex={-1}
            >
              <p className={styles.feedbackLabel}>{isCorrect ? "That’s right" : "Look here"}</p>
              <p>{isCorrect ? current.correctFeedback : current.incorrectFeedback}</p>
              <Button fullWidth={false} onClick={next}>
                {index === decodeLabelQuestions.length - 1
                  ? "Review what you practiced"
                  : "Next question"}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </section>
      </div>

      <p className="sr-only" aria-live="polite">
        {answers.length ? `${answers.length} questions answered.` : ""}
      </p>
    </main>
  );
}
