"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { openAiTutor } from "@/features/ai/components/ai-tutor-dialog";

import styles from "../styles/universal-search.module.css";

const loadSearchExperience = () =>
  import("@/features/universal-search/components/search-experience");
const preloadSearchExperience = () => {
  void loadSearchExperience().catch(() => {});
};
const SearchExperience = lazy(() =>
  loadSearchExperience().then((module) => ({ default: module.SearchExperience })),
);

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase("en") === "k") {
        event.preventDefault();
        preloadSearchExperience();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    let active = true;
    void loadSearchExperience()
      .then(() => {
        if (active) window.requestAnimationFrame(() => inputRef.current?.focus());
      })
      .catch(() => {});
    return () => {
      active = false;
      previouslyFocused?.focus();
    };
  }, [open]);

  function close() {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function openAiTutorFromSearch() {
    setOpen(false);
    window.requestAnimationFrame(() => openAiTutor());
  }

  return (
    <>
      <button
        className={styles.searchTrigger}
        onClick={() => {
          preloadSearchExperience();
          setOpen(true);
        }}
        onFocus={preloadSearchExperience}
        onPointerEnter={preloadSearchExperience}
        ref={triggerRef}
        type="button"
      >
        <Search aria-hidden="true" />
        <span>Search</span>
        <kbd aria-hidden="true">⌘ / Ctrl K</kbd>
      </button>
      {open
        ? createPortal(
            <div
              className={styles.backdrop}
              onPointerDown={(event) => event.target === event.currentTarget && close()}
            >
              <div
                aria-label="Search Health Decoded"
                aria-modal="true"
                className={styles.dialog}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    close();
                  }
                  if (event.key === "Tab" && dialogRef.current) {
                    const focusable = [
                      ...dialogRef.current.querySelectorAll<HTMLElement>("input, button, a[href]"),
                    ].filter((element) => !element.hasAttribute("disabled"));
                    const first = focusable[0];
                    const last = focusable.at(-1);
                    if (event.shiftKey && document.activeElement === first) {
                      event.preventDefault();
                      last?.focus();
                    } else if (!event.shiftKey && document.activeElement === last) {
                      event.preventDefault();
                      first?.focus();
                    }
                  }
                }}
                ref={dialogRef}
                role="dialog"
              >
                <span aria-hidden="true" className={styles.escapeHint}>
                  Esc
                </span>
                <Suspense
                  fallback={
                    <p aria-live="polite" className={styles.resultCount} role="status">
                      Preparing search…
                    </p>
                  }
                >
                  <SearchExperience
                    compact
                    inputRef={inputRef}
                    onNavigate={(route) => {
                      setOpen(false);
                      router.push(route);
                    }}
                    onOpenAiTutor={openAiTutorFromSearch}
                  />
                </Suspense>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
