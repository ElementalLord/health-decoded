"use client";

import { animate, createTimeline, stagger, utils } from "animejs";
import { useEffect, useId, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";

/*
 * Shared light: two people hold one lantern between them, and its glow lights the path ahead for
 * both. The figures stay still (only the lantern sways), so nothing can drift out of place; the
 * motion lives in the light: a breathing glow, a flickering flame, sparks rising from the lantern,
 * and stepping stones along the path brightening one after another.
 */

// The lantern hangs from both people's hands at this point.
const HANDLE = { x: 280, y: 166 };
const LANTERN_TOP = HANDLE.y + 16;

// Stepping stones receding along the path, nearest first.
const STONES = [
  { x: 280, y: 396, rx: 24, ry: 6.5 },
  { x: 280, y: 364, rx: 19, ry: 5.2 },
  { x: 280, y: 337, rx: 15, ry: 4.2 },
  { x: 280, y: 315, rx: 11.5, ry: 3.3 },
  { x: 280, y: 297, rx: 8.5, ry: 2.6 },
  { x: 280, y: 283, rx: 6, ry: 2 },
];

const SPARK_COUNT = 16;

export function LandingSharedLight() {
  const id = useId().replace(/:/g, "");
  const glowRef = useRef<SVGCircleElement>(null);
  const pathLightRef = useRef<SVGPathElement>(null);
  const lanternRef = useRef<SVGGElement>(null);
  const flameRef = useRef<SVGPathElement>(null);
  const sparksRef = useRef<SVGGElement>(null);
  const stonesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const sparks = Array.from(sparksRef.current?.querySelectorAll("circle") ?? []);
    const stones = Array.from(stonesRef.current?.querySelectorAll("ellipse") ?? []);
    const animations = [
      animate(glowRef.current!, {
        r: [140, 160],
        opacity: [0.85, 1],
        duration: 2600,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      }),
      animate(pathLightRef.current!, {
        opacity: [0.55, 0.9],
        duration: 2600,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      }),
      animate(lanternRef.current!, {
        rotate: [-3, 3],
        duration: 3400,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      }),
      animate(flameRef.current!, {
        scaleY: [0.9, 1.12],
        scaleX: [1.04, 0.94],
        duration: 420,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      }),
      // Sparks rise and drift ahead, toward the path, then fade.
      animate(sparks, {
        cx: {
          from: () => HANDLE.x + utils.random(-8, 8),
          to: () => HANDLE.x + utils.random(-60, 60),
        },
        cy: { from: LANTERN_TOP + 28, to: () => LANTERN_TOP - utils.random(40, 130) },
        opacity: [
          { to: 0.95, duration: 500 },
          { to: 0, duration: 2300 },
        ],
        r: { from: () => utils.random(15, 30) / 10, to: 0.6 },
        delay: stagger(220),
        duration: 2800,
        ease: "outSine",
        loop: true,
      }),
    ];
    const path = createTimeline({ loop: true, loopDelay: 1200 })
      .add(stones, {
        opacity: [0.25, 1],
        scale: [0.85, 1],
        duration: 700,
        delay: stagger(260),
        ease: "outCubic",
      })
      .add(stones, { opacity: 0.25, duration: 900, ease: "inOutSine" }, "+=1400");

    return () => {
      animations.forEach((animation) => animation.revert());
      path.revert();
    };
  }, []);

  return (
    <svg
      aria-label="Two people sharing one lantern that lights the path ahead of them"
      className="h-auto w-full"
      role="img"
      viewBox="40 20 500 400"
    >
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#ffd48a" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#f6c27f" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f6c27f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-path`} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#f3d9b4" />
          <stop offset="1" stopColor="#f3d9b4" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Distant hills, and the path ahead with the lantern's light falling on it. */}
      <path
        d="M48 276 C110 258 170 266 230 270 S330 262 390 266 S490 254 536 268"
        fill="none"
        stroke="#cdbfb0"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        d="M196 416 C236 360 262 310 274 272 L286 272 C298 310 324 360 364 416 Z"
        fill="#ece2d6"
      />
      <path
        d="M196 416 C236 360 262 310 274 272 L286 272 C298 310 324 360 364 416 Z"
        fill={`url(#${id}-path)`}
        ref={pathLightRef}
        style={{ opacity: 0.7 }}
      />
      <g fill="#f0c98f" ref={stonesRef}>
        {STONES.map((stone) => (
          <ellipse
            cx={stone.x}
            cy={stone.y}
            key={stone.x}
            rx={stone.rx}
            ry={stone.ry}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </g>

      <circle cx={HANDLE.x} cy={LANTERN_TOP + 26} fill={`url(#${id}-glow)`} r="124" ref={glowRef} />

      <ellipse cx="280" cy="406" fill="#e3d8ca" rx="210" ry="11" />

      {/* Left person */}
      <g>
        <path d="M104 236c0-24 19-43 43-43h46c24 0 43 19 43 43l10 168H94l10-168Z" fill="#b96c55" />
        <circle cx="170" cy="132" fill="#d8bda2" r="46" />
        <path
          d="M125 121c6-40 29-60 63-51 18 5 30 20 35 41-17-11-29-16-48-15-17 1-32 9-50 25Z"
          fill="#5a4034"
        />
        <path
          d="M157 143c8 7 19 7 27 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M150 126c4-3 9-3 13 0M179 126c4-3 9-3 13 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="3.5"
        />
      </g>

      {/* Right person */}
      <g>
        <path d="M332 244c0-22 18-40 40-40h40c22 0 40 18 40 40l10 160H322l10-160Z" fill="#6f947a" />
        <circle cx="392" cy="146" fill="#c7b098" r="43" />
        <path
          d="M350 138c4-37 28-56 58-48 17 4 29 18 34 38-16-9-28-12-43-11-18 1-32 8-49 21Z"
          fill="#9d8874"
        />
        <path
          d="M380 157c8 7 18 7 26 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M372 141c4-3 9-3 13 0M399 141c4-3 9-3 13 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="3.5"
        />
      </g>

      {/* Both people hold the lantern's handle. Arms run from the shoulders up to the handle and
          stay well below both faces. */}
      <path
        d="M232 226 Q240 180 270 170"
        fill="none"
        stroke="#b96c55"
        strokeLinecap="round"
        strokeWidth="20"
      />
      <path
        d="M336 232 Q324 184 290 170"
        fill="none"
        stroke="#6f947a"
        strokeLinecap="round"
        strokeWidth="19"
      />

      <g
        ref={lanternRef}
        style={{ transformBox: "view-box", transformOrigin: `${HANDLE.x}px ${HANDLE.y}px` }}
      >
        <path
          d={`M${HANDLE.x - 9} ${LANTERN_TOP} Q${HANDLE.x} ${HANDLE.y - 4} ${HANDLE.x + 9} ${LANTERN_TOP}`}
          fill="none"
          stroke="#5a4a41"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <rect fill="#5a4a41" height="6" rx="2" width="26" x={HANDLE.x - 13} y={LANTERN_TOP} />
        <rect
          fill="#fff1d2"
          height="40"
          rx="7"
          stroke="#5a4a41"
          strokeWidth="3"
          width="30"
          x={HANDLE.x - 15}
          y={LANTERN_TOP + 6}
        />
        <path
          d={`M${HANDLE.x} ${LANTERN_TOP + 14} C${HANDLE.x + 7} ${LANTERN_TOP + 24} ${HANDLE.x + 6} ${LANTERN_TOP + 34} ${HANDLE.x} ${LANTERN_TOP + 36} C${HANDLE.x - 6} ${LANTERN_TOP + 34} ${HANDLE.x - 7} ${LANTERN_TOP + 24} ${HANDLE.x} ${LANTERN_TOP + 14} Z`}
          fill="#f0a14f"
          ref={flameRef}
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        />
        <rect fill="#5a4a41" height="5" rx="2" width="22" x={HANDLE.x - 11} y={LANTERN_TOP + 45} />
      </g>

      {/* Hands drawn over the handle so both grips read clearly. */}
      <circle cx="271" cy="168" fill="#d8bda2" r="9.5" />
      <circle cx="289" cy="168" fill="#c7b098" r="9.5" />

      <g fill="#ffcf85" ref={sparksRef}>
        {Array.from({ length: SPARK_COUNT }, (_, index) => (
          <circle cx={HANDLE.x} cy={LANTERN_TOP + 20} key={index} opacity="0" r="2" />
        ))}
      </g>
    </svg>
  );
}
