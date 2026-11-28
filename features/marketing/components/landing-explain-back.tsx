"use client";

import { Check, CircleAlert, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type {
  LandingExplainDemo,
  LandingExplainSample,
} from "@/features/marketing/content/landing-interactive-content";
import {
  landingChoice,
  landingLink,
  landingMuted,
  landingPanel,
} from "@/features/marketing/components/landing-ui";

const verdictIcon: Record<LandingExplainSample["id"], typeof Check> = {
  got_it: Check,
  almost_there: CircleAlert,
  try_again: X,
};

const verdictTone: Record<LandingExplainSample["id"], string> = {
  got_it: "text-[#4f7a5c]",
  almost_there: "text-[#a8782c]",
  try_again: "text-[#a85f4b]",
};

export function LandingExplainBack({ demo }: { demo: LandingExplainDemo }) {
  const [selectedId, setSelectedId] = useState<LandingExplainSample["id"] | null>(null);
  const selected = demo.samples.find((sample) => sample.id === selectedId) ?? null;
  const Icon = selected ? verdictIcon[selected.id] : null;

  return (
    <div className={landingPanel}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a85f4b]">
        Explain it back · {demo.title}
      </p>
      <p className="mt-4 font-serif-display text-2xl leading-snug text-[#382c26] sm:text-3xl">
        {demo.prompt}
      </p>
      <p className={`mt-3 text-sm leading-6 ${landingMuted}`}>
        Pick a sample answer to see the feedback it gets. With an account, you write your own and
        the AI checks it the same way.
      </p>

      <div aria-label="Sample answers" className="mt-6 grid gap-3" role="group">
        {demo.samples.map((sample) => (
          <button
            aria-pressed={sample.id === selectedId}
            className={landingChoice}
            key={sample.id}
            onClick={() => setSelectedId(sample.id)}
            type="button"
          >
            &ldquo;{sample.answer}&rdquo;
          </button>
        ))}
      </div>

      {selected && Icon ? (
        <div
          aria-live="polite"
          className="animate-fade-in mt-5 rounded-[16px] bg-[#f4ede4] p-5"
          key={selected.id}
        >
          <p
            className={`flex items-center gap-2 font-serif-display text-xl ${verdictTone[selected.id]}`}
          >
            <Icon aria-hidden="true" className="size-5 shrink-0" />
            {selected.label}
          </p>
          {selected.covered.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm font-bold text-[#382c26]">What you covered</p>
              <ul className="mt-1 grid gap-1">
                {selected.covered.map((item) => (
                  <li className={`text-sm leading-6 ${landingMuted}`} key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {selected.missing ? (
            <p className="mt-3 text-sm leading-6 text-[#382c26]">
              <span className="font-bold">To add: </span>
              {selected.missing}
            </p>
          ) : null}
          {selected.correction ? (
            <p className="mt-3 text-sm leading-6 text-[#382c26]">
              <span className="font-bold">A correction: </span>
              {selected.correction}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              className={`${landingChoice} w-auto`}
              onClick={() => setSelectedId(null)}
              type="button"
            >
              <RotateCcw aria-hidden="true" className="mr-2 size-4" /> Try another
            </button>
            <Link className={landingLink} href="/login?next=%2Fexplain-it-back">
              Write your own answer
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
