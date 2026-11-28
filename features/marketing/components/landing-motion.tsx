"use client";

import { animate, stagger, type JSAnimation } from "animejs";
import { useEffect, useRef, type ReactNode } from "react";

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Runs before first paint (inline in the page) so revealable elements start hidden instead of
 * flashing in and then disappearing. Without JavaScript, or with reduced motion, nothing is hidden.
 */
const STYLE_ID = "landing-reveal-style";
const HIDE_RULE =
  "[data-reveal]:not([data-reveal-stagger]),[data-reveal][data-reveal-stagger]>*{opacity:0}";

export const landingRevealBootScript = `try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&!document.getElementById("${STYLE_ID}")){var s=document.createElement("style");s.id="${STYLE_ID}";s.textContent="${HIDE_RULE}";document.head.appendChild(s)}}catch(e){}`;

function setHidingStyle(enabled: boolean) {
  const existing = document.getElementById(STYLE_ID);
  if (!enabled) {
    existing?.remove();
    return;
  }
  if (existing) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = HIDE_RULE;
  document.head.appendChild(style);
}

type RevealKind = "up" | "left" | "right" | "scale";

const fromState: Record<RevealKind, { x?: number; y?: number; scale?: number }> = {
  up: { y: 36 },
  left: { x: -48 },
  right: { x: 48 },
  scale: { scale: 0.92, y: 16 },
};

const running = new WeakMap<HTMLElement, JSAnimation>();

function revealTargets(element: HTMLElement): HTMLElement[] {
  return element.hasAttribute("data-reveal-stagger")
    ? Array.from(element.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement,
      )
    : [element];
}

function revealElement(element: HTMLElement) {
  const kind = (element.dataset.reveal as RevealKind) || "up";
  const from = fromState[kind] ?? fromState.up;
  const delay = Number(element.dataset.revealDelay ?? 0);
  const targets = revealTargets(element);
  if (targets.length === 0) return;

  running.get(element)?.pause();
  running.set(
    element,
    animate(targets, {
      opacity: { from: 0, to: 1 },
      ...(from.x !== undefined ? { x: { from: from.x, to: 0 } } : {}),
      ...(from.y !== undefined ? { y: { from: from.y, to: 0 } } : {}),
      ...(from.scale !== undefined ? { scale: { from: from.scale, to: 1 } } : {}),
      duration: targets.length > 1 ? 900 : 1000,
      delay: targets.length > 1 ? stagger(110, { start: delay }) : delay,
      ease: "outExpo",
    }),
  );
  element.dispatchEvent(new CustomEvent("landing:reveal"));
}

/** Puts an element back in its hidden starting state so it can reveal again. */
function resetElement(element: HTMLElement) {
  running.get(element)?.pause();
  running.delete(element);
  for (const target of revealTargets(element)) {
    target.style.opacity = "0";
    target.style.transform = "";
  }
  element.dispatchEvent(new CustomEvent("landing:reset"));
}

/** Reveals every `[data-reveal]` element inside it with anime.js as it scrolls into view. */
export function LandingMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setHidingStyle(false);
      return;
    }
    setHidingStyle(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            if (!element.dataset.revealed) {
              element.dataset.revealed = "true";
              revealElement(element);
            }
            continue;
          }
          // Leaving through the bottom of the screen (scrolling back up): reset it, so it
          // animates in again on the way back down. Elements that scroll off the top stay put.
          if (element.dataset.revealed && entry.boundingClientRect.top > 0) {
            delete element.dataset.revealed;
            resetElement(element);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      setHidingStyle(false);
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
