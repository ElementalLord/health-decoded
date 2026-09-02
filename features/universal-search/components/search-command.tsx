"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

import { SearchExperience } from "@/features/universal-search/components/search-experience";
import { openAiTutor } from "@/features/ai/components/ai-tutor-dialog";

import styles from "../styles/universal-search.module.css";

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
    inputRef.current?.focus();
    return () => previouslyFocused?.focus();
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
        onClick={() => setOpen(true)}
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
                <SearchExperience
                  compact
                  inputRef={inputRef}
                  onNavigate={(route) => {
                    setOpen(false);
                    router.push(route);
                  }}
                  onOpenAiTutor={openAiTutorFromSearch}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
