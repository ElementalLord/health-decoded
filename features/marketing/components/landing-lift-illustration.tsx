"use client";

import { createTimeline } from "animejs";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";

// Geometry of the person being helped up, from seated (t = 0) to standing (t = 1).
const GROUND = 418;
const BODY_HEIGHT = 238; // standing torso + legs, from shoulders to the ground
const SEATED_SCALE = 0.56;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function pose(t: number) {
  const scale = lerp(SEATED_SCALE, 1, t);
  const bodyTop = GROUND - BODY_HEIGHT * scale;
  const lean = lerp(14, 0, t); // degrees, leaning forward while seated
  const helperLean = lerp(9, 0, t); // the helper bends toward them while lifting
  const hands = { x: lerp(318, 316, t), y: lerp(318, 236, t) };
  return { scale, bodyTop, lean, helperLean, hands };
}

export function LandingLiftIllustration() {
  const risingRef = useRef<SVGGElement>(null);
  const risingBodyRef = useRef<SVGPathElement>(null);
  const risingHeadRef = useRef<SVGGElement>(null);
  const helperRef = useRef<SVGGElement>(null);
  const helperArmRef = useRef<SVGPathElement>(null);
  const risingArmRef = useRef<SVGPathElement>(null);
  const handsRef = useRef<SVGCircleElement>(null);
  const sparkRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const render = (t: number) => {
      const p = pose(t);
      risingBodyRef.current?.setAttribute(
        "transform",
        `translate(0 ${GROUND}) scale(1 ${p.scale}) translate(0 ${-GROUND})`,
      );
      risingHeadRef.current?.setAttribute(
        "transform",
        `translate(0 ${p.bodyTop - (GROUND - BODY_HEIGHT)})`,
      );
      risingRef.current?.setAttribute("transform", `rotate(${-p.lean} 392 ${GROUND})`);
      helperRef.current?.setAttribute("transform", `rotate(${p.helperLean} 188 ${GROUND})`);

      // Helper's shoulder follows their lean; arms meet at the clasped hands.
      const helperShoulder = { x: 238 + p.helperLean * 3.2, y: 214 + p.helperLean * 0.8 };
      const risingShoulder = { x: 352 + p.lean * 2.2, y: p.bodyTop + 30 + p.lean * 1.2 };
      helperArmRef.current?.setAttribute(
        "d",
        `M${helperShoulder.x} ${helperShoulder.y} Q${(helperShoulder.x + p.hands.x) / 2 + 6} ${Math.max(helperShoulder.y, p.hands.y) + 26} ${p.hands.x} ${p.hands.y}`,
      );
      risingArmRef.current?.setAttribute(
        "d",
        `M${risingShoulder.x} ${risingShoulder.y} Q${(risingShoulder.x + p.hands.x) / 2} ${Math.max(risingShoulder.y, p.hands.y) + 22} ${p.hands.x} ${p.hands.y}`,
      );
      handsRef.current?.setAttribute("cx", String(p.hands.x));
      handsRef.current?.setAttribute("cy", String(p.hands.y));
      if (sparkRef.current) sparkRef.current.style.opacity = String(Math.max(0, (t - 0.82) / 0.18));
    };

    if (prefersReducedMotion()) {
      render(1);
      return;
    }

    const state = { t: 0 };
    render(0);
    const timeline = createTimeline({ loop: true, onUpdate: () => render(state.t) })
      .add(state, { t: 1, duration: 2200, ease: "inOutCubic" }, 700)
      .add(state, { t: 1, duration: 2000 })
      .add(state, { t: 0, duration: 1900, ease: "inOutSine" })
      .add(state, { t: 0, duration: 600 });

    return () => {
      timeline.revert();
    };
  }, []);

  return (
    <svg
      aria-label="One person helping another stand up from a chair"
      className="h-auto w-full"
      role="img"
      viewBox="0 0 560 460"
    >
      <ellipse cx="290" cy={GROUND + 4} fill="#e8e0d5" rx="230" ry="20" />

      {/* Chair behind the person being helped */}
      <g fill="#d9c6b2">
        <rect height="150" rx="16" width="22" x="452" y="250" />
        <rect height="26" rx="10" width="150" x="324" y="318" />
        <rect height="78" rx="6" width="14" x="332" y="340" />
        <rect height="78" rx="6" width="14" x="452" y="340" />
      </g>

      <g ref={helperRef}>
        <circle cx="188" cy="118" fill="#d8bda2" r="48" />
        <path
          d="M145 106c6-41 29-62 63-53 18 5 31 20 36 42-17-11-29-16-48-15-17 1-32 9-51 26Z"
          fill="#5a4034"
        />
        <path
          d="M172 128c8 7 19 7 27 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path d="M134 202c0-22 18-40 40-40h34c22 0 40 18 40 40l12 216H122l12-216Z" fill="#b96c55" />
      </g>

      <g ref={risingRef}>
        <path
          d={`M348 ${GROUND - BODY_HEIGHT + 22}c0-12 10-22 22-22h44c12 0 22 10 22 22l8 ${BODY_HEIGHT - 22}H340l8-${BODY_HEIGHT - 22}Z`}
          fill="#6f947a"
          ref={risingBodyRef}
        />
        <g ref={risingHeadRef}>
          <circle cx="392" cy={GROUND - BODY_HEIGHT - 42} fill="#c7b098" r="42" />
          <path
            d={`M352 ${GROUND - BODY_HEIGHT - 48}c4-36 27-55 57-48 17 4 29 18 34 38-16-8-28-11-42-10-17 1-31 8-49 20Z`}
            fill="#9d8874"
          />
          <path
            d={`M378 ${GROUND - BODY_HEIGHT - 30}c8 7 18 7 26 0`}
            fill="none"
            stroke="#755344"
            strokeLinecap="round"
            strokeWidth="5"
          />
        </g>
      </g>

      <path
        fill="none"
        ref={helperArmRef}
        stroke="#b96c55"
        strokeLinecap="round"
        strokeWidth="24"
      />
      <path
        fill="none"
        ref={risingArmRef}
        stroke="#6f947a"
        strokeLinecap="round"
        strokeWidth="22"
      />
      <circle fill="#d1b59a" r="17" ref={handsRef} />

      <g
        fill="none"
        ref={sparkRef}
        stroke="#c97860"
        strokeLinecap="round"
        strokeWidth="4"
        style={{ opacity: 0 }}
      >
        <path d="M296 196l-8-16" />
        <path d="M318 190v-18" />
        <path d="M340 196l8-16" />
      </g>
    </svg>
  );
}
