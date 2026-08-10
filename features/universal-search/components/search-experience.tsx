"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { buttonVariants } from "@/components/ui/button";
import type {
  RankedSearchResult,
  UniversalSearchDocument,
  UniversalSearchResultType,
} from "@/features/universal-search/types/universal-search";
import { cn } from "@/lib/utils";

import styles from "../styles/universal-search.module.css";

type FilterId = "all" | "pages-tools" | Exclude<UniversalSearchResultType, "navigation" | "tool">;

const filters: readonly {
  id: FilterId;
  label: string;
  types?: readonly UniversalSearchResultType[];
}[] = [
  { id: "all", label: "All" },
  { id: "pages-tools", label: "Pages and tools", types: ["navigation", "tool"] },
  { id: "lesson", label: "Lessons", types: ["lesson"] },
  { id: "glossary", label: "Glossary", types: ["glossary"] },
  { id: "story", label: "Stories", types: ["story"] },
  { id: "resource", label: "Resources", types: ["resource"] },
  { id: "caregiver", label: "Caregiver", types: ["caregiver"] },
];

const typeLabels: Record<UniversalSearchResultType, string> = {
  navigation: "Page",
  lesson: "Lesson",
  glossary: "Glossary",
  story: "Story",
  resource: "Resource",
  caregiver: "Caregiver",
  tool: "Tool",
};

const COMMAND_RESULT_LIMIT = 6;

function filterResults(results: readonly UniversalSearchDocument[], filter: FilterId) {
  if (filter === "all") return [...results];
  const definition = filters.find((candidate) => candidate.id === filter);
  return results.filter((result) => definition?.types?.includes(result.type));
}

export function SearchExperience({
  compact = false,
  inputRef,
  onNavigate,
}: {
  compact?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  onNavigate?: (route: string) => void;
}) {
  const internalInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef ?? internalInputRef;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RankedSearchResult[]>([]);
  const [filter, setFilter] = useState<FilterId>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasQuery = Boolean(query.trim());
  const availableResults = useMemo(
    () => (hasQuery ? filterResults(results, filter) : []),
    [filter, hasQuery, results],
  );
  const displayed = useMemo(
    () =>
      compact && hasQuery ? availableResults.slice(0, COMMAND_RESULT_LIMIT) : availableResults,
    [availableResults, compact, hasQuery],
  );
  const hasMoreResults = compact && hasQuery && availableResults.length > displayed.length;

  useEffect(() => {
    if (!hasQuery) {
      setResults([]);
      setLoading(false);
      setFailed(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setFailed(false);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search unavailable");
        const payload = (await response.json()) as { results?: RankedSearchResult[] };
        setResults(Array.isArray(payload.results) ? payload.results : []);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
          setFailed(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 120);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [hasQuery, query]);

  useEffect(() => setSelectedIndex(0), [filter, query]);
  useEffect(() => {
    document.getElementById(`search-result-${selectedIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  function openResult(result: UniversalSearchDocument | undefined) {
    if (!result) return;
    onNavigate?.(result.route);
  }

  return (
    <div className={cn(styles.experience, compact && styles.compact)}>
      <div className={styles.searchField}>
        <Search aria-hidden="true" />
        <input
          aria-activedescendant={displayed.length ? `search-result-${selectedIndex}` : undefined}
          aria-controls="universal-search-results"
          aria-expanded={!compact || hasQuery}
          aria-label="Search Health Decoded"
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setSelectedIndex((index) => Math.min(index + 1, displayed.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setSelectedIndex((index) => Math.max(index - 1, 0));
            } else if (event.key === "Enter" && displayed.length) {
              event.preventDefault();
              openResult(displayed[selectedIndex]);
            }
          }}
          placeholder="Search Health Decoded..."
          ref={activeInputRef}
          role="combobox"
          spellCheck={false}
          value={query}
        />
        {query ? (
          <button aria-label="Clear search" onClick={() => setQuery("")} type="button">
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {!compact && hasQuery ? (
        <div aria-label="Filter search results" className={styles.filters} role="group">
          {filters.map((item) => (
            <button
              aria-pressed={filter === item.id}
              key={item.id}
              onClick={() => setFilter(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      {!compact || hasQuery ? (
        <p
          aria-live="polite"
          className={cn(styles.resultCount, compact && styles.compactResultCount)}
          role="status"
        >
          {loading
            ? "Searching Health Decoded."
            : hasQuery
              ? `${availableResults.length} ${availableResults.length === 1 ? "result" : "results"} found.`
              : "Ready to search."}
        </p>
      ) : null}

      {!compact || hasQuery ? (
        <div className={styles.results} id="universal-search-results">
          {!loading && hasQuery && !displayed.length ? (
            <section className={styles.noResults}>
              <h2>
                {failed ? "Search is temporarily unavailable." : "No results for this search."}
              </h2>
              <p>Try another word or spelling.</p>
              <Link
                className={buttonVariants({ fullWidth: false, variant: "text" })}
                href="/ai"
                onClick={() => onNavigate?.("/ai")}
              >
                Ask Health Decoded AI
              </Link>
            </section>
          ) : null}

          {!loading && !hasQuery && !compact ? (
            <section className={styles.searchPrimer}>
              <p className="editorial-eyebrow">One search, across your learning</p>
              <h2>Find the exact lesson, definition, story, resource, or tool you need.</h2>
              <p>Start with a word, question, medication name, or topic.</p>
            </section>
          ) : null}

          {!loading && hasQuery && displayed.length ? (
            <SearchResultList
              onNavigate={onNavigate}
              results={displayed}
              selectedIndex={selectedIndex}
              showDescriptions
              showTypeLabels
              onSelect={setSelectedIndex}
            />
          ) : null}

          {hasMoreResults ? (
            <Link
              className={styles.fullSearchLink}
              href="/search"
              onClick={() => onNavigate?.("/search")}
            >
              View all {availableResults.length} results
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function SearchResultList({
  onNavigate,
  onSelect,
  results,
  selectedIndex,
  showDescriptions,
  showTypeLabels,
}: {
  onNavigate: ((route: string) => void) | undefined;
  onSelect: (index: number) => void;
  results: readonly UniversalSearchDocument[];
  selectedIndex: number;
  showDescriptions: boolean;
  showTypeLabels: boolean;
}) {
  function openResult(result: UniversalSearchDocument) {
    onNavigate?.(result.route);
  }

  return (
    <ul className={styles.resultList}>
      {results.map((result, index) => (
        <li key={result.id}>
          <Link
            aria-current={index === selectedIndex ? "true" : undefined}
            className={styles.resultRow}
            href={result.route}
            id={`search-result-${index}`}
            onClick={(event) => {
              if (!onNavigate) return;
              event.preventDefault();
              openResult(result);
            }}
            onMouseEnter={() => onSelect(index)}
          >
            <span>
              {showTypeLabels ? <em>{typeLabels[result.type]}</em> : null}
              <strong>{result.title}</strong>
              {showDescriptions ? <span>{result.description}</span> : null}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
