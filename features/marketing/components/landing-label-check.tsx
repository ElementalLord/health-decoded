"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { NutritionFacts } from "@/features/decode-the-label/components/nutrition-facts";
import type {
  DecodeLabelQuestion,
  NutritionLabel,
} from "@/features/decode-the-label/types/decode-the-label";
import {
  landingChoice,
  landingLink,
  landingMuted,
  landingPanel,
  landingPrimaryButton,
} from "@/features/marketing/components/landing-ui";

export function LandingLabelCheck({
  labels,
  questions,
}: {
  labels: { plain: NutritionLabel; fruit: NutritionLabel };
  questions: readonly DecodeLabelQuestion[];
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const question = questions[index];
  const selected = question ? answers[question.id] : undefined;
  const isLast = index === questions.length - 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-12">
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <NutritionFacts compact label={labels.plain} />
        <NutritionFacts compact label={labels.fruit} />
      </div>

      <div className={landingPanel}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a85f4b]">
          Compare the labels · {Math.min(index + 1, questions.length)} of {questions.length}
        </p>
        <div aria-live="polite">
          {question ? (
            <div className="animate-fade-in" key={question.id}>
              <p className="mt-4 font-serif-display text-2xl leading-snug text-[#382c26]">
                {question.prompt}
              </p>
              <div aria-label="Your answer" className="mt-5 grid gap-2.5" role="group">
                {question.choices.map((choice) => (
                  <button
                    aria-pressed={selected === choice.id}
                    className={landingChoice}
                    disabled={selected !== undefined}
                    key={choice.id}
                    onClick={() =>
                      setAnswers((current) => ({ ...current, [question.id]: choice.id }))
                    }
                    type="button"
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
              {selected ? (
                <div className="animate-fade-in mt-5 rounded-[16px] bg-[#f4ede4] p-5">
                  <p className="flex items-start gap-2 leading-7 text-[#382c26]">
                    {selected === question.correctChoiceId ? (
                      <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#4f7a5c]" />
                    ) : (
                      <X aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#a85f4b]" />
                    )}
                    <span>
                      {selected === question.correctChoiceId
                        ? question.correctFeedback
                        : question.incorrectFeedback}
                    </span>
                  </p>
                  {isLast ? (
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                      <button
                        className={`${landingChoice} w-auto`}
                        onClick={() => {
                          setAnswers({});
                          setIndex(0);
                        }}
                        type="button"
                      >
                        Start over
                      </button>
                      <Link className={landingLink} href="/login?next=%2Fdecode-the-label">
                        Try all 12 label questions
                      </Link>
                    </div>
                  ) : (
                    <button
                      className={`${landingPrimaryButton} mt-5`}
                      onClick={() => setIndex((current) => current + 1)}
                      type="button"
                    >
                      Next question
                    </button>
                  )}
                </div>
              ) : (
                <p className={`mt-4 text-sm ${landingMuted}`}>
                  Look at both labels, then pick an answer.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
