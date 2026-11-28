"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { useState } from "react";

import type { LandingMythCard } from "@/features/marketing/content/landing-interactive-content";
import {
  landingChoice,
  landingMuted,
  landingPanel,
  landingPrimaryButton,
} from "@/features/marketing/components/landing-ui";
import type { MythCheckVerdict } from "@/features/mythbusters/types/myth-check";

const verdictOptions: readonly { value: MythCheckVerdict; label: string }[] = [
  { value: "myth", label: "Myth" },
  { value: "fact", label: "Fact" },
  { value: "depends", label: "It depends" },
];

const verdictName: Record<MythCheckVerdict, string> = {
  myth: "Myth",
  fact: "Fact",
  depends: "It depends",
};

export function LandingMythCheck({
  cards,
  totalCount,
}: {
  cards: readonly LandingMythCard[];
  totalCount: number;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, MythCheckVerdict>>({});

  const finished = index >= cards.length;
  const card = finished ? null : cards[index];
  const selected = card ? answers[card.id] : undefined;
  const score = cards.filter((candidate) => answers[candidate.id] === candidate.verdict).length;

  function restart() {
    setAnswers({});
    setIndex(0);
  }

  return (
    <div className={landingPanel}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a85f4b]">Myth or fact?</p>
        <div aria-hidden="true" className="flex gap-1.5">
          {cards.map((candidate, dotIndex) => {
            const answer = answers[candidate.id];
            const tone =
              answer === undefined
                ? dotIndex === index
                  ? "bg-[#382c26]"
                  : "bg-[#ddd0c3]"
                : answer === candidate.verdict
                  ? "bg-[#6f947a]"
                  : "bg-[#c97860]";
            return <span className={`h-2 w-6 rounded-full ${tone}`} key={candidate.id} />;
          })}
        </div>
      </div>

      <div aria-live="polite">
        {card ? (
          <div className="animate-fade-in" key={card.id}>
            <p className="mt-2 text-sm font-semibold text-[#6b5b52]">
              {index + 1} of {cards.length}
            </p>
            <p className="mt-4 font-serif-display text-2xl leading-snug text-[#382c26] sm:text-3xl">
              &ldquo;{card.claim}&rdquo;
            </p>

            <div aria-label="Your answer" className="mt-6 grid gap-3 sm:grid-cols-3" role="group">
              {verdictOptions.map((option) => (
                <button
                  aria-pressed={selected === option.value}
                  className={`${landingChoice} justify-center text-center`}
                  disabled={selected !== undefined}
                  key={option.value}
                  onClick={() => setAnswers((current) => ({ ...current, [card.id]: option.value }))}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>

            {selected ? (
              <div className="animate-fade-in mt-6 rounded-[16px] bg-[#f4ede4] p-5">
                <p className="flex items-center gap-2 font-semibold text-[#382c26]">
                  {selected === card.verdict ? (
                    <Check aria-hidden="true" className="size-5 text-[#4f7a5c]" />
                  ) : (
                    <X aria-hidden="true" className="size-5 text-[#a85f4b]" />
                  )}
                  {selected === card.verdict ? "You got it." : "Not quite."} The answer is{" "}
                  {verdictName[card.verdict].toLowerCase()}.
                </p>
                <p className={`mt-3 leading-7 ${landingMuted}`}>{card.explanation}</p>
                <p className="mt-3 font-semibold text-[#382c26]">{card.takeaway}</p>
                {card.source ? (
                  <p className="mt-3 text-sm text-[#6b5b52]">
                    Source:{" "}
                    <a
                      className="underline underline-offset-4 hover:text-[#382c26]"
                      href={card.source.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {card.source.organization}
                    </a>
                  </p>
                ) : null}
                <button
                  className={`${landingPrimaryButton} mt-5`}
                  onClick={() => setIndex((current) => current + 1)}
                  type="button"
                >
                  {index + 1 < cards.length ? "Next claim" : "See my score"}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="animate-fade-in py-6 text-center">
            <p className="font-serif-display text-6xl text-[#382c26]">
              {score}
              <span className="text-[#b8a493]">/{cards.length}</span>
            </p>
            <p className="mt-3 text-lg font-semibold text-[#382c26]">
              {score === cards.length
                ? "Every one right."
                : score >= cards.length - 2
                  ? "Most of these trip people up. Nice work."
                  : "These are some of the most common mix-ups. Now you know."}
            </p>
            <p className={`mx-auto mt-2 max-w-md ${landingMuted}`}>
              Myth Check has {totalCount} claims in all, grouped by basics, food, monitoring, and
              treatment.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <button
                className={`${landingChoice} w-auto justify-center gap-2`}
                onClick={restart}
                type="button"
              >
                <RotateCcw aria-hidden="true" className="size-4" /> Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
