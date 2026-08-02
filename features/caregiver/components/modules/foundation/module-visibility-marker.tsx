"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ModuleVisibilityMarker({
  children,
  onViewed,
}: {
  readonly children: ReactNode;
  readonly onViewed: () => void;
}) {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    if (!("IntersectionObserver" in window)) {
      onViewed();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        onViewed();
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, [onViewed]);

  return <div ref={markerRef}>{children}</div>;
}
