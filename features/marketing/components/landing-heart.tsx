"use client";

import { animate } from "animejs";
import { useEffect, useId, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";
import { cn } from "@/lib/utils";

const RAY_COUNT = 12;
const CENTER = 160;
const HEART =
  "M160 252 C108 214 70 182 70 138 C70 108 93 86 120 86 C138 86 152 96 160 110 C168 96 182 86 200 86 C227 86 250 108 250 138 C250 182 212 214 160 252 Z";
// A long, shallow wave that starts at the origin and runs outward along +x.
const WAVE = "M0 0 C8 -3 16 -3 24 0 S40 3 48 0 S64 -3 72 0";
// Dash pattern: the offset loops over whole multiples of it, so the flow never jumps.
const DASH = 9;
const GAP = 9;

/**
 * A heart framing a photo of a caregiver and the person they support. It breathes slowly while
 * light flows outward from it along evenly spaced, gently waving rays.
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

    // Dashes travel outward along every wave at a steady pace, without pausing.
    const drift = animate(rays, {
      strokeDashoffset: [0, -(DASH + GAP) * 2],
      duration: 1800,
      ease: "linear",
      loop: true,
    });

    return () => {
      breathe.revert();
      drift.revert();
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
        {/* Rays fade in just outside the heart and fade out at their tips. */}
        <radialGradient
          cx={CENTER}
          cy={CENTER + 6}
          gradientUnits="userSpaceOnUse"
          id={`${clipId}-fade`}
          r="190"
        >
          <stop offset="0.52" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.64" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.98" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${clipId}-mask`}>
          <rect fill={`url(#${clipId}-fade)`} height="320" width="320" />
        </mask>
      </defs>

      <g
        fill="none"
        mask={`url(#${clipId}-mask)`}
        ref={raysRef}
        stroke="#c97860"
        strokeDasharray={`${DASH} ${GAP}`}
        strokeLinecap="round"
        strokeWidth="2.4"
      >
        {Array.from({ length: RAY_COUNT }, (_, index) => {
          const angle = (360 / RAY_COUNT) * index - 90;
          return (
            <path
              d={WAVE}
              key={angle}
              transform={`translate(${CENTER} ${CENTER + 6}) rotate(${angle}) translate(98 0)`}
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
