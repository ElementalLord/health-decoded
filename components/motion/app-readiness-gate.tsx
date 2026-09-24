"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const VIEWPORT_LOAD_MARGIN = 0.5;
const VISUAL_QUIET_PERIOD_MS = 160;

function nextFrame(signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }

    const frame = requestAnimationFrame(() => {
      signal.removeEventListener("abort", cancel);
      resolve();
    });
    const cancel = () => {
      cancelAnimationFrame(frame);
      resolve();
    };

    signal.addEventListener("abort", cancel, { once: true });
  });
}

function isNearViewport(element: Element) {
  if (element.getClientRects().length === 0) return false;

  const bounds = element.getBoundingClientRect();
  const margin = window.innerHeight * VIEWPORT_LOAD_MARGIN;

  return bounds.bottom >= -margin && bounds.top <= window.innerHeight + margin;
}

function waitForImage(image: HTMLImageElement, signal: AbortSignal) {
  if (image.complete) {
    return image.decode?.().catch(() => undefined) ?? Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const preloader = new Image();
    const finish = () => {
      preloader.onload = null;
      preloader.onerror = null;
      signal.removeEventListener("abort", finish);

      if (signal.aborted) {
        resolve();
        return;
      }

      const decoding = preloader.decode?.();
      if (!decoding) resolve();
      else void decoding.then(resolve, resolve);
    };

    preloader.decoding = "async";
    preloader.fetchPriority = isNearViewport(image) ? "high" : "auto";
    if (image.sizes) preloader.sizes = image.sizes;
    if (image.srcset) preloader.srcset = image.srcset;
    preloader.onload = finish;
    preloader.onerror = finish;
    signal.addEventListener("abort", finish, { once: true });
    const source = image.currentSrc || image.src;
    if (!source && !image.srcset) {
      finish();
      return;
    }
    preloader.src = source;

    if (preloader.complete) finish();
  });
}

function backgroundImageUrls(element: Element, pseudoElement?: "::before" | "::after") {
  const value = window.getComputedStyle(element, pseudoElement).backgroundImage;
  const matches = value.matchAll(/url\(["']?([^"')]+)["']?\)/g);

  return Array.from(matches, (match) => match[1]).filter(
    (url): url is string => typeof url === "string" && !url.startsWith("data:"),
  );
}

function allBackgroundImageUrls(element: Element) {
  return [
    ...backgroundImageUrls(element),
    ...backgroundImageUrls(element, "::before"),
    ...backgroundImageUrls(element, "::after"),
  ];
}

function preloadBackground(url: string, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const backgroundPreloader = new Image();
    const finish = () => {
      backgroundPreloader.onload = null;
      backgroundPreloader.onerror = null;
      signal.removeEventListener("abort", finish);

      if (signal.aborted) {
        resolve();
        return;
      }

      const decoding = backgroundPreloader.decode?.();
      if (!decoding) resolve();
      else void decoding.then(resolve, resolve);
    };

    backgroundPreloader.onload = finish;
    backgroundPreloader.onerror = finish;
    signal.addEventListener("abort", finish, { once: true });
    backgroundPreloader.src = url;

    if (backgroundPreloader.complete) finish();
  });
}

async function waitForQuietLayout(getLastVisualChange: () => number, signal: AbortSignal) {
  while (!signal.aborted) {
    const quietFor = window.performance.now() - getLastVisualChange();
    if (quietFor >= VISUAL_QUIET_PERIOD_MS) return;
    await nextFrame(signal);
  }
}

function finishInitialAnimations(content: HTMLElement) {
  for (const animation of content.getAnimations({ subtree: true })) {
    const iterations = animation.effect?.getComputedTiming().iterations;
    if (iterations === Infinity || animation.playState === "finished") continue;

    try {
      animation.finish();
    } catch {
      // Scroll-driven animations do not always have a finite timeline. They
      // are decorative and do not need to delay the visual handoff.
    }
  }
}

async function waitForVisualAssets(root: HTMLElement, signal: AbortSignal) {
  const content = root.querySelector<HTMLElement>("[data-ready-content]");
  if (!content) return;

  const backgroundLoads = new Map<string, Promise<void>>();
  let visualRevision = 0;
  let lastVisualChange = window.performance.now();

  const noteVisualChange = () => {
    visualRevision += 1;
    lastVisualChange = window.performance.now();
  };
  const mutationObserver = new MutationObserver(noteVisualChange);
  const resizeObserver = new ResizeObserver(noteVisualChange);

  mutationObserver.observe(content, {
    // Deliberately ignore inline `style` mutations: Framer Motion writes
    // transforms every frame, and those decorative updates must not keep the
    // application behind the loading surface forever. Layout changes are
    // still covered by ResizeObserver.
    attributeFilter: ["class", "hidden", "sizes", "src", "srcset"],
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });
  resizeObserver.observe(content);

  try {
    while (!signal.aborted) {
      // A Next.js loading.tsx fallback is deliberately never revealed. Its
      // replacement will mutate the tree and restart this readiness pass.
      if (content.querySelector("[data-route-loading]")) {
        const fallbackRevision = visualRevision;
        while (!signal.aborted && fallbackRevision === visualRevision) {
          await nextFrame(signal);
        }
        continue;
      }

      finishInitialAnimations(content);
      const revisionAtScan = visualRevision;
      const images = Array.from(content.querySelectorAll("img"));

      const renderedElements = [content, ...Array.from(content.querySelectorAll("*"))].filter(
        (element) => element.getClientRects().length > 0,
      );

      for (const element of renderedElements) {
        for (const url of allBackgroundImageUrls(element)) {
          if (!backgroundLoads.has(url)) {
            backgroundLoads.set(url, preloadBackground(url, signal));
          }
        }
      }

      const fontReady = "fonts" in document ? document.fonts.ready : Promise.resolve();
      await Promise.allSettled([
        fontReady,
        ...images.map((image) => waitForImage(image, signal)),
        ...backgroundLoads.values(),
      ]);

      if (signal.aborted) return;

      finishInitialAnimations(content);
      await waitForQuietLayout(() => lastVisualChange, signal);
      await nextFrame(signal);
      await nextFrame(signal);

      if (signal.aborted) return;
      if (content.querySelector("[data-route-loading]")) continue;
      if (visualRevision !== revisionAtScan) continue;

      finishInitialAnimations(content);
      await nextFrame(signal);
      if (signal.aborted) return;
      if (visualRevision !== revisionAtScan) continue;

      return;
    }
  } finally {
    mutationObserver.disconnect();
    resizeObserver.disconnect();
  }
}

function setReadyState(root: HTMLDivElement, ready: boolean) {
  const content = root.querySelector<HTMLElement>("[data-ready-content]");
  const status = root.querySelector<HTMLElement>("[data-ready-status]");

  root.dataset.ready = String(ready);
  content?.toggleAttribute("inert", !ready);
  content?.setAttribute("aria-hidden", String(!ready));
  status?.setAttribute("aria-hidden", String(ready));
}

function clearRouteLoadingSnapshot(root: HTMLDivElement) {
  const snapshot = root.querySelector<HTMLElement>("[data-ready-snapshot]");
  if (!snapshot) return;

  snapshot.replaceChildren();
  snapshot.hidden = true;
}

function captureRouteLoadingSnapshot(root: HTMLDivElement, content: HTMLElement) {
  const snapshot = root.querySelector<HTMLElement>("[data-ready-snapshot]");
  if (!snapshot) return;

  const clonedChildren = Array.from(content.childNodes, (node) => node.cloneNode(true));
  snapshot.replaceChildren(...clonedChildren);
  snapshot.hidden = false;
}

export function AppReadinessGate({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const restoreCompletedPage = (event: PageTransitionEvent) => {
      if (!event.persisted) return;

      const root = rootRef.current;
      if (!root) return;

      const content = root.querySelector<HTMLElement>("[data-ready-content]");
      if (content) finishInitialAnimations(content);

      setReadyState(root, true);
      clearRouteLoadingSnapshot(root);
    };

    window.addEventListener("pageshow", restoreCompletedPage);
    return () => window.removeEventListener("pageshow", restoreCompletedPage);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const controller = new AbortController();
    const content = root.querySelector<HTMLElement>("[data-ready-content]");
    const routeIsLoading = Boolean(content?.querySelector("[data-route-loading]"));

    setReadyState(root, false);
    if (routeIsLoading && content) {
      // Keep the project's existing route-specific skeleton visible while the
      // replacement page prepares off-screen. React can then replace the live
      // fallback without changing what the user sees.
      captureRouteLoadingSnapshot(root, content);
    }

    void waitForVisualAssets(root, controller.signal).then(() => {
      if (!controller.signal.aborted) {
        setReadyState(root, true);
        clearRouteLoadingSnapshot(root);
      }
    });

    return () => controller.abort();
  }, [children, pathname]);

  return (
    <div className="app-readiness-gate" data-ready="false" ref={rootRef}>
      <div aria-hidden="true" data-ready-content inert>
        {children}
      </div>

      <div
        aria-hidden="true"
        className="app-readiness-route-snapshot"
        data-ready-snapshot
        hidden
        inert
      />

      <div aria-live="polite" className="app-readiness-status" data-ready-status role="status">
        <div className="app-readiness-card">
          <p className="editorial-eyebrow">Preparing Health Decoded</p>
          <div aria-hidden="true" className="app-readiness-lines">
            <span />
            <span />
            <span />
          </div>
          <span className="sr-only">The page is loading.</span>
        </div>
      </div>
    </div>
  );
}
