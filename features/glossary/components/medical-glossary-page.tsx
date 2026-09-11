"use client";

import Image from "next/image";
import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContextualNextStep } from "@/features/cohesion/components/contextual-next-step";
import { AiTutorTrigger } from "@/features/ai/components/ai-tutor-trigger";
import { getNextLearningAction } from "@/features/cohesion/lib/get-next-learning-action";
import {
  availableGlossaryLetters,
  glossaryLetters,
  medicalGlossary,
} from "@/features/glossary/content/medical-glossary";
import { filterGlossaryByLetter, searchGlossary } from "@/features/glossary/lib/search-glossary";
import type { MedicalGlossaryEntry } from "@/features/glossary/types/medical-glossary";
import styles from "@/features/glossary/styles/medical-glossary.module.css";

function GlossaryEntry({ entry }: { entry: MedicalGlossaryEntry }) {
  const continuation = getNextLearningAction({ sourceType: "glossary", sourceId: entry.id });

  return (
    <div className={styles.entry}>
      <dt>
        {entry.term}
        {entry.abbreviation ? <span> ({entry.abbreviation})</span> : null}
      </dt>
      <dd>
        <p>{entry.definition}</p>
        {entry.commonlyConfusedWith ? (
          <aside
            className={styles.confused}
            aria-label={`Commonly confused with ${entry.commonlyConfusedWith.term}`}
          >
            <strong>
              Commonly confused with: <mark>{entry.commonlyConfusedWith.term}</mark>
            </strong>
            <p>{entry.commonlyConfusedWith.explanation}</p>
          </aside>
        ) : null}
        {continuation ? <ContextualNextStep action={continuation} /> : null}
      </dd>
    </div>
  );
}

export function MedicalGlossaryPage() {
  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("All");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultsViewportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  useEffect(() => {
    if (resultsViewportRef.current) resultsViewportRef.current.scrollTop = 0;
  }, [query, selectedLetter]);
  const results = useMemo(() => {
    const searched = searchGlossary(medicalGlossary, query);
    return filterGlossaryByLetter(searched, selectedLetter);
  }, [query, selectedLetter]);
  const grouped = useMemo(() => {
    const groups = new Map<string, MedicalGlossaryEntry[]>();
    for (const entry of results) {
      const letter = entry.term.charAt(0).toUpperCase();
      groups.set(letter, [...(groups.get(letter) ?? []), entry]);
    }
    return [...groups.entries()];
  }, [results]);

  function clearSearch() {
    setQuery("");
    setSelectedLetter("All");
    requestAnimationFrame(() => document.getElementById("glossary-search")?.focus());
  }

  return (
    <div className={styles.glossary}>
      <Image
        alt=""
        aria-hidden="true"
        className={styles.glossaryBackdrop}
        draggable={false}
        height={941}
        priority
        quality={90}
        sizes="100vw"
        src="/glossary/glossary-background-wide-v2.png"
        width={1672}
      />
      <div className={styles.glossaryContent}>
        <header className={styles.header}>
          <p className="editorial-eyebrow">Plain-language reference</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Medical Glossary
          </h1>
          <p className={styles.supporting}>Understand common words used in diabetes care.</p>
          <p className={styles.boundary}>
            This glossary explains general medical language. It does not interpret personal
            symptoms, test results, medicines, or treatment decisions.
          </p>
        </header>

        <section aria-labelledby="glossary-search-heading" className={styles.searchArea}>
          <h2 className="sr-only" id="glossary-search-heading">
            Search and browse the glossary
          </h2>
          <label htmlFor="glossary-search">Search for a medical word or abbreviation</label>
          <div className={styles.searchControl}>
            <Search aria-hidden="true" />
            <Input
              autoComplete="off"
              id="glossary-search"
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedLetter("All");
              }}
              placeholder="Try A1C, CGM, or deductible"
              type="search"
              value={query}
            />
            {query ? (
              <Button
                aria-label="Clear glossary search"
                fullWidth={false}
                onClick={clearSearch}
                size="sm"
                variant="text"
              >
                <X aria-hidden="true" /> Clear
              </Button>
            ) : null}
          </div>

          <nav aria-label="Browse glossary by first letter" className={styles.alphabet}>
            <button
              aria-pressed={selectedLetter === "All"}
              onClick={() => setSelectedLetter("All")}
              type="button"
            >
              All
            </button>
            {glossaryLetters.map((letter) => {
              const available = availableGlossaryLetters.has(letter);
              return (
                <button
                  aria-disabled={!available}
                  aria-label={
                    available
                      ? `Show terms beginning with ${letter}`
                      : `No terms begin with ${letter}`
                  }
                  aria-pressed={selectedLetter === letter}
                  disabled={!available}
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  type="button"
                >
                  {letter}
                </button>
              );
            })}
          </nav>
          <div className={styles.mobileLetterPicker}>
            <label htmlFor="glossary-letter-picker">Browse by first letter</label>
            <div>
              <select
                id="glossary-letter-picker"
                onChange={(event) => setSelectedLetter(event.target.value)}
                value={selectedLetter}
              >
                <option value="All">All terms</option>
                {glossaryLetters.map((letter) => (
                  <option
                    disabled={!availableGlossaryLetters.has(letter)}
                    key={letter}
                    value={letter}
                  >
                    {availableGlossaryLetters.has(letter) ? letter : `${letter} — no terms`}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" />
            </div>
          </div>
        </section>

        <div className={styles.resultsMeta}>
          <div
            aria-atomic="true"
            aria-live="polite"
            className={styles.resultCount}
            id="glossary-result-count"
            role="status"
          >
            {results.length} glossary {results.length === 1 ? "term" : "terms"} found.
          </div>
          {results.length > 10 ? (
            <div className={styles.scrollCue}>
              <Image
                alt=""
                aria-hidden="true"
                className={styles.scrollCueArt}
                height={72}
                src="/glossary/scroll-cue-arrows.png"
                width={72}
              />
              <p>
                <strong>More words this way</strong>
                <span>Scroll inside the list to keep exploring.</span>
              </p>
            </div>
          ) : null}
        </div>

        {results.length ? (
          <div
            aria-describedby="glossary-result-count"
            aria-label="Glossary results"
            className={styles.groups}
            ref={resultsViewportRef}
            role="region"
            tabIndex={0}
          >
            {grouped.map(([letter, entries]) => (
              <section
                aria-labelledby={`glossary-letter-${letter}`}
                className={styles.group}
                key={letter}
              >
                <h2 id={`glossary-letter-${letter}`}>{letter}</h2>
                <dl>
                  {entries.map((entry) => (
                    <GlossaryEntry entry={entry} key={entry.id} />
                  ))}
                </dl>
              </section>
            ))}
          </div>
        ) : (
          <section aria-labelledby="glossary-no-results" className={styles.noResults}>
            <p className="editorial-eyebrow">No matching definition</p>
            <h2 id="glossary-no-results">
              Can’t find the word you’re looking for? Ask Health Decoded AI.
            </h2>
            <p>
              Try a shorter word, an abbreviation, or another spelling. Your search will not be sent
              to the AI guide.
            </p>
            <div>
              <Button fullWidth={false} onClick={clearSearch} variant="secondary">
                Clear search
              </Button>
              <AiTutorTrigger>Ask Health Decoded AI</AiTutorTrigger>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
