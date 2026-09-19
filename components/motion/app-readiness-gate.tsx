"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const VIEWPORT_LOAD_MARGIN = 0.5;

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function isNearViewport(element: Element) {
  const bounds = element.getBoundingClientRect();
  const margin = window.innerHeight * VIEWPORT_LOAD_MARGIN;

  return bounds.bottom >= -margin && bounds.top <= window.innerHeight + margin;
}

function prepareImageForLoading(image: HTMLImageElement) {
  if (image.loading === "lazy") image.loading = "eager";
  if (isNearViewport(image)) image.fetchPriority = "high";
}

function waitForImage(image: HTMLImageElement) {
  if (image.complete) {
    return image.decode?.().catch(() => undefined) ?? Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const finish = () => {
      image.removeEventListener("load", finish);
      image.removeEventListener("error", finish);
      const decoding = image.decode?.();

      if (!decoding) {
        resolve();
        return;
      }

      void decoding.then(resolve, resolve);
    };

    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
  });
}

function backgroundImageUrls(element: Element) {
  const value = window.getComputedStyle(element).backgroundImage;
  const matches = value.matchAll(/url\(["']?([^"')]+)["']?\)/g);

  return Array.from(matches, (match) => match[1]).filter(
    (url): url is string => typeof url === "string" && !url.startsWith("data:"),
  );
}

function preloadBackground(url: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => {
      const decoding = image.decode?.();

      if (!decoding) {
        resolve();
        return;
      }

      void decoding.then(resolve, resolve);
    };
    image.onerror = () => resolve();
    image.src = url;

    if (image.complete) {
      const decoding = image.decode?.();
      if (!decoding) resolve();
      else void decoding.then(resolve, resolve);
    }
  });
}

async function waitForVisualAssets(root: HTMLElement, signal: AbortSignal) {
  const backgroundLoads = new Map<string, Promise<void>>();
  let lastMutation = window.performance.now();

  const observer = new MutationObserver(() => {
    lastMutation = window.performance.now();
  });

  observer.observe(root, {
    attributeFilter: ["class", "src", "srcset", "style"],
    attributes: true,
    childList: true,
    subtree: true,
  });

  try {
    while (!signal.aborted) {
      const mutationAtScan = lastMutation;
      const images = Array.from(root.querySelectorAll("img"));

      images.forEach(prepareImageForLoading);
      const visibleElements = [root, ...Array.from(root.querySelectorAll("*"))].filter(
        isNearViewport,
      );

      for (const element of visibleElements) {
        for (const url of backgroundImageUrls(element)) {
          if (!backgroundLoads.has(url)) backgroundLoads.set(url, preloadBackground(url));
        }
      }

      const fontReady = "fonts" in document ? document.fonts.ready : Promise.resolve();
      const assetsReady = Promise.allSettled([
        fontReady,
        ...images.map(waitForImage),
        ...backgroundLoads.values(),
      ]);
      await assetsReady;

      if (signal.aborted) return;

      await nextFrame();
      await nextFrame();

      if (lastMutation > mutationAtScan) continue;

      const hasPendingImage = images.some((image) => !image.complete);
      const treeWasStableForTwoFrames = window.performance.now() - lastMutation > 24;

      if (!hasPendingImage && treeWasStableForTwoFrames) return;
    }
  } finally {
    observer.disconnect();
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

export function AppReadinessGate({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const controller = new AbortController();
    setReadyState(root, false);

    void waitForVisualAssets(root, controller.signal).then(() => {
      if (!controller.signal.aborted) setReadyState(root, true);
    });

    return () => controller.abort();
  }, [children, pathname]);

  return (
    <div className="app-readiness-gate" data-ready="false" ref={rootRef}>
      <div aria-hidden="true" data-ready-content inert>
        {children}
      </div>

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
