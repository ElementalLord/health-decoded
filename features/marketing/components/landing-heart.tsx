"use client";

import { animate, createDrawable } from "animejs";
import { useEffect, useId, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";
import { cn } from "@/lib/utils";

const RAY_COUNT = 12;
const CENTER = 160;
const HEART =
  "M160 252 C108 214 70 182 70 138 C70 108 93 86 120 86 C138 86 152 96 160 110 C168 96 182 86 200 86 C227 86 250 108 250 138 C250 182 212 214 160 252 Z";
// A short squiggle that starts at the origin and runs outward along +x.
const SQUIGGLE = "M0 0 C6 -7 12 -7 18 0 S30 7 36 0 S48 -7 54 0";

/**
 * A heart framing a photo of a caregiver and the person they support. It breathes slowly while
 * evenly spaced squiggles drift outward from it.
 */
export function LandingHeart({ className }: { className?: string }) {
  const clipId = useId();
  const heartRef = useRef<SVGGElement>(null);
  const raysRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !heartRef.current || !raysRef.current) return;
    const rays = Array.from(raysRef.current.querySelectorAll<SVGPathElement>("path"));

    const breathe = animate(heartRef.current, {
      scale: [1, 1.045],
      duration: 3200,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });

    // Each squiggle draws outward and then retracts, with no pause between cycles. The rays start
    // one after another around the heart (only the first cycle is offset), so the motion keeps
    // travelling around it in an endless loop.
    const cycle = 6500;
    const drift = rays.map((ray, index) =>
      animate(createDrawable(ray), {
        draw: ["0 0", "0 1", "1 1"],
        duration: cycle,
        delay: (cycle / rays.length) * index,
        ease: "inOutSine",
        loop: true,
      }),
    );

    return () => {
      breathe.revert();
      drift.forEach((animation) => animation.revert());
    };
  }, []);

  return (
    <svg
      aria-label="A heart framing a caregiver bringing groceries to someone they support"
      className={cn("h-auto w-full overflow-visible", className)}
      role="img"
      viewBox="0 0 320 320"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={HEART} />
        </clipPath>
      </defs>

      <g fill="none" ref={raysRef} stroke="#c97860" strokeLinecap="round" strokeWidth="3.5">
        {Array.from({ length: RAY_COUNT }, (_, index) => {
          const angle = (360 / RAY_COUNT) * index - 90;
          return (
            <path
              d={SQUIGGLE}
              key={angle}
              transform={`translate(${CENTER} ${CENTER + 6}) rotate(${angle}) translate(112 0)`}
            />
          );
        })}
      </g>

      <g ref={heartRef} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <image
          clipPath={`url(#${clipId})`}
          height="190"
          href="/caregiver/landing/support-with-permission-v2.jpg"
          preserveAspectRatio="xMidYMid slice"
          width="190"
          x="65"
          y="74"
        />
        <path d={HEART} fill="none" stroke="#a85f4b" strokeLinejoin="round" strokeWidth="5" />
      </g>
    </svg>
  );
}
