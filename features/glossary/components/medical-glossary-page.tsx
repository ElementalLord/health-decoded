"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  availableGlossaryLetters,
  glossaryLetters,
  medicalGlossary,
} from "@/features/glossary/content/medical-glossary";
import { filterGlossaryByLetter, searchGlossary } from "@/features/glossary/lib/search-glossary";
import type { MedicalGlossaryEntry } from "@/features/glossary/types/medical-glossary";
import styles from "@/features/glossary/styles/medical-glossary.module.css";

function GlossaryEntry({ entry }: { entry: MedicalGlossaryEntry }) {
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
            <strong>Commonly confused with: {entry.commonlyConfusedWith.term}</strong>
            <p>{entry.commonlyConfusedWith.explanation}</p>
          </aside>
        ) : null}
      </dd>
    </div>
  );
}

export function MedicalGlossaryPage() {
  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("All");
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
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
      <header className={styles.header}>
        <p className="editorial-eyebrow">Plain-language reference</p>
        <h1 ref={headingRef} tabIndex={-1}>
          Medical Glossary
        </h1>
        <p className={styles.supporting}>Understand common words used in diabetes care.</p>
        <p className={styles.boundary}>
          This glossary explains general medical language. It does not interpret personal symptoms,
          test results, medicines, or treatment decisions.
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
            placeholder="Try A1C, blood sugar, CGM, or deductible"
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
      </section>

      <div aria-atomic="true" aria-live="polite" className={styles.resultCount} role="status">
        {results.length} glossary {results.length === 1 ? "term" : "terms"} found.
      </div>

      {results.length ? (
        <div className={styles.groups}>
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
            <Link href="/ai">Ask Health Decoded AI</Link>
          </div>
        </section>
      )}
    </div>
  );
}
