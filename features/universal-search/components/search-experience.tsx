"use client";

import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { buttonVariants } from "@/components/ui/button";
import { suggestedDestinations } from "@/features/universal-search/content/suggested-search-documents";
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
  const displayed = useMemo(
    () => filterResults(hasQuery ? results : suggestedDestinations, filter),
    [filter, hasQuery, results],
  );

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
      } catch (error) {
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

  const grouped = displayed.reduce<
    Partial<Record<UniversalSearchResultType, UniversalSearchDocument[]>>
  >((groups, result) => {
    (groups[result.type] ??= []).push(result);
    return groups;
  }, {});

  function openResult(result: UniversalSearchDocument | undefined) {
    if (!result) return;
    onNavigate?.(result.route);
  }

  return (
    <div className={cn(styles.experience, compact && styles.compact)}>
      <div className={styles.inputWrap}>
        <Search aria-hidden="true" />
        <input
          aria-activedescendant={displayed.length ? `search-result-${selectedIndex}` : undefined}
          aria-controls="universal-search-results"
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
          placeholder="Search lessons, tools, terms, stories, and resources"
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

      <p aria-live="polite" className={styles.resultCount} role="status">
        {loading
          ? "Searching Health Decoded."
          : hasQuery
            ? `${displayed.length} ${displayed.length === 1 ? "result" : "results"} found.`
            : "Suggested destinations"}
      </p>

      <div className={styles.results} id="universal-search-results">
        {!loading && hasQuery && !displayed.length ? (
          <section className={styles.noResults}>
            <h2>
              {failed
                ? "Search is temporarily unavailable."
                : "We couldn’t find that in Health Decoded."}
            </h2>
            <p>Try a shorter term or another spelling.</p>
            <p>Still need help? Ask Health Decoded AI.</p>
            <Link
              className={buttonVariants({ fullWidth: false })}
              href="/ai"
              onClick={() => onNavigate?.("/ai")}
            >
              Ask Health Decoded AI <ArrowRight aria-hidden="true" />
            </Link>
          </section>
        ) : null}

        {!loading && displayed.length ? (
          <div className={styles.groups}>
            {Object.entries(grouped).map(([type, items]) => (
              <section aria-labelledby={`search-group-${type}`} key={type}>
                <h2 id={`search-group-${type}`}>{typeLabels[type as UniversalSearchResultType]}</h2>
                <ul>
                  {items?.map((result) => {
                    const index = displayed.findIndex((candidate) => candidate.id === result.id);
                    return (
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
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <span>
                            <strong>{result.title}</strong>
                            <span>{result.description}</span>
                            {result.sectionLabel ? <em>{result.sectionLabel}</em> : null}
                          </span>
                          <ArrowRight aria-hidden="true" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
