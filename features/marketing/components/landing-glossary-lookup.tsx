"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useState } from "react";

import { searchGlossary } from "@/features/glossary/lib/search-glossary";
import type { MedicalGlossaryEntry } from "@/features/glossary/types/medical-glossary";
import {
  landingChip,
  landingLink,
  landingMuted,
  landingPanel,
} from "@/features/marketing/components/landing-ui";

export function LandingGlossaryLookup({
  entries,
  suggestions,
}: {
  entries: readonly MedicalGlossaryEntry[];
  suggestions: readonly string[];
}) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const results = useMemo(
    () => (trimmed ? searchGlossary(entries, trimmed).slice(0, 3) : []),
    [entries, trimmed],
  );

  return (
    <div className={landingPanel}>
      <label className="font-serif-display text-2xl text-[#382c26]" htmlFor={inputId}>
        Look up a word from your visit
      </label>
      <div className="relative mt-4">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8d7b70]"
        />
        <input
          autoComplete="off"
          className="h-14 w-full rounded-[14px] border border-[#d9cabd] bg-white pl-12 pr-4 text-base text-[#382c26] placeholder:text-[#9a8a80] focus:border-[#382c26] focus:outline-none focus:ring-2 focus:ring-[#c97860]/40"
          id={inputId}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try A1C, metformin, or hypoglycemia"
          type="search"
          value={query}
        />
      </div>
      <div aria-label="Common words" className="mt-4 flex flex-wrap gap-2" role="group">
        {suggestions.map((suggestion) => (
          <button
            aria-pressed={trimmed.toLowerCase() === suggestion.toLowerCase()}
            className={landingChip}
            key={suggestion}
            onClick={() => setQuery(suggestion)}
            type="button"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-6">
        {!trimmed ? (
          <p className={landingMuted}>
            {entries.length} terms, written in plain language and checked against sources like the
            American Diabetes Association and NIH. What you type here stays on your device.
          </p>
        ) : results.length === 0 ? (
          <p className={landingMuted}>
            No match for &ldquo;{trimmed}&rdquo;. Try a shorter word, or ask the AI guide once
            you&apos;re signed in.
          </p>
        ) : (
          <ul className="grid gap-3">
            {results.map((entry, index) => (
              <li
                className={`rounded-[16px] p-5 ${index === 0 ? "bg-[#f4ede4]" : "border border-[#ebe1d6]"}`}
                key={entry.id}
              >
                <p className="font-serif-display text-xl font-semibold text-[#382c26]">
                  {entry.term}
                  {entry.abbreviation ? (
                    <span className="ml-2 text-base font-normal text-[#6b5b52]">
                      ({entry.abbreviation})
                    </span>
                  ) : null}
                </p>
                <p className={`mt-2 leading-7 ${landingMuted}`}>{entry.definition}</p>
                {index === 0 && entry.commonlyConfusedWith ? (
                  <p className="mt-3 text-sm leading-6 text-[#493a32]">
                    <span className="font-semibold">
                      Not the same as {entry.commonlyConfusedWith.term}:
                    </span>{" "}
                    {entry.commonlyConfusedWith.explanation}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link className={`${landingLink} mt-4`} href="/login?next=%2Fglossary">
        Open the full glossary
      </Link>
    </div>
  );
}
