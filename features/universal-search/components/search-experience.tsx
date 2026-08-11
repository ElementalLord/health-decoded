"use client";

import { RotateCw, Search, X } from "lucide-react";
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
const MAX_SEARCH_CHARACTERS = 100;

type SearchFailure = "offline" | "session" | "timeout" | "unavailable";

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
  const [failure, setFailure] = useState<SearchFailure | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [slow, setSlow] = useState(false);
  const hasQuery = Boolean(query.trim());
  const queryTooLong = query.length > MAX_SEARCH_CHARACTERS;
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
      setFailure(null);
      setSlow(false);
      return;
    }
    if (queryTooLong) {
      setResults([]);
      setLoading(false);
      setFailure(null);
      setSlow(false);
      return;
    }
    const controller = new AbortController();
    let abortedForTimeout = false;
    let slowTimer: number | undefined;
    let timeoutTimer: number | undefined;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setFailure(null);
      setSlow(false);
      slowTimer = window.setTimeout(() => setSlow(true), 2_000);
      timeoutTimer = window.setTimeout(() => {
        abortedForTimeout = true;
        controller.abort();
      }, 10_000);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });
        if (response.status === 401) {
          setResults([]);
          setFailure("session");
          return;
        }
        if (!response.ok) throw new Error("Search unavailable");
        const payload = (await response.json()) as { results?: RankedSearchResult[] };
        if (!Array.isArray(payload.results)) throw new Error("Invalid search response");
        setResults(payload.results);
      } catch {
        if (!controller.signal.aborted || abortedForTimeout) {
          setResults([]);
          setFailure(
            abortedForTimeout ? "timeout" : window.navigator.onLine ? "unavailable" : "offline",
          );
        }
      } finally {
        if (slowTimer !== undefined) window.clearTimeout(slowTimer);
        if (timeoutTimer !== undefined) window.clearTimeout(timeoutTimer);
        setSlow(false);
        if (!controller.signal.aborted || abortedForTimeout) setLoading(false);
      }
    }, 120);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
      if (slowTimer !== undefined) window.clearTimeout(slowTimer);
      if (timeoutTimer !== undefined) window.clearTimeout(timeoutTimer);
    };
  }, [hasQuery, query, queryTooLong, retryKey]);

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
          aria-describedby="universal-search-limit"
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
      <p className="sr-only" id="universal-search-limit">
        Search terms can be up to {MAX_SEARCH_CHARACTERS} characters.
      </p>

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
          {queryTooLong
            ? `Search terms can be up to ${MAX_SEARCH_CHARACTERS} characters.`
            : failure === "session"
              ? "Your session ended."
              : failure
                ? "Search is unavailable."
                : loading
                  ? slow
                    ? "Still searching Health Decoded."
                    : "Searching Health Decoded."
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
                {queryTooLong
                  ? "This search is too long."
                  : failure === "session"
                    ? "Your session ended."
                    : failure === "offline"
                      ? "Search needs a connection."
                      : failure
                        ? "We couldn’t search right now."
                        : `No matches for “${query.trim()}”`}
              </h2>
              <p>
                {queryTooLong
                  ? `Shorten it to ${MAX_SEARCH_CHARACTERS} characters or fewer.`
                  : failure === "session"
                    ? "Sign in again to continue searching."
                    : failure === "offline"
                      ? "Reconnect, then try this search again."
                      : failure === "timeout"
                        ? "The search took longer than expected. Try again when you’re ready."
                        : failure
                          ? "Your search is still here. Try it again when you’re ready."
                          : "Try another word or spelling."}
              </p>
              {failure === "session" ? (
                <Link
                  className={buttonVariants({ fullWidth: false, variant: "text" })}
                  href="/login?next=/search"
                  onClick={() => onNavigate?.("/login?next=/search")}
                >
                  Sign in
                </Link>
              ) : failure ? (
                <button
                  className={buttonVariants({ fullWidth: false, variant: "text" })}
                  onClick={() => setRetryKey((value) => value + 1)}
                  type="button"
                >
                  <RotateCw aria-hidden="true" className="size-4" /> Try again
                </button>
              ) : !queryTooLong ? (
                <Link
                  className={buttonVariants({ fullWidth: false, variant: "text" })}
                  href="/ai"
                  onClick={() => onNavigate?.("/ai")}
                >
                  Ask Health Decoded AI
                </Link>
              ) : null}
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
