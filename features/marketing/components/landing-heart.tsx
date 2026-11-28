"use client";

import { animate } from "animejs";
import { useEffect, useId, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";
import { cn } from "@/lib/utils";

const HEART =
  "M160 252 C108 214 70 182 70 138 C70 108 93 86 120 86 C138 86 152 96 160 110 C168 96 182 86 200 86 C227 86 250 108 250 138 C250 182 212 214 160 252 Z";

/**
 * A heart framing a photo of a caregiver and the person they support, beating gently: a soft
 * "lub-dub", then a rest.
 */
export function LandingHeart({ className }: { className?: string }) {
  const clipId = useId();
  const heartRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !heartRef.current) return;
    const beat = animate(heartRef.current, {
      scale: [
        { to: 1.035, duration: 420, ease: "inOutSine" },
        { to: 1.005, duration: 380, ease: "inOutSine" },
        { to: 1.025, duration: 380, ease: "inOutSine" },
        { to: 1, duration: 900, ease: "inOutSine" },
      ],
      loop: true,
      loopDelay: 1600,
    });
    return () => {
      beat.revert();
    };
  }, []);

  return (
    <svg
      aria-label="A heart framing a caregiver bringing groceries to someone they support"
      className={cn("h-auto w-full overflow-visible", className)}
      role="img"
      viewBox="58 74 204 192"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={HEART} />
        </clipPath>
      </defs>

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
