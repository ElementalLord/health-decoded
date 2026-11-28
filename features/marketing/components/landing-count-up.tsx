"use client";

import { animate, type JSAnimation } from "animejs";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";

/**
 * A number that counts up from zero when it scrolls into view, and again whenever it comes back
 * into view from below. The final value is in the markup, so it reads correctly without motion.
 */
export function LandingCountUp({ value, duration = 1800 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;
    const counter = { value: 0 };
    let animation: JSAnimation | null = null;
    let shown = false;
    const write = () => {
      element.textContent = String(Math.round(counter.value));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !shown) {
          shown = true;
          animation?.pause();
          counter.value = 0;
          animation = animate(counter, {
            value,
            duration,
            ease: "outExpo",
            onUpdate: write,
          });
        } else if (!entry.isIntersecting && shown && entry.boundingClientRect.top > 0) {
          shown = false;
          animation?.pause();
          counter.value = 0;
          write();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.pause();
      element.textContent = String(value);
    };
  }, [value, duration]);

  return (
    <span className="tabular-nums" ref={ref}>
      {value}
    </span>
  );
}
