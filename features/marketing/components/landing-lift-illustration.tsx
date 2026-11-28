"use client";

import { createTimeline } from "animejs";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";

/*
 * A sit-to-stand drawn with simple joints, so the person being helped keeps the same size and
 * actually stands: their hips lift off the chair, their knees straighten and their back comes
 * upright, while the helper leans in, takes their hands and straightens with them.
 */

type Point = { x: number; y: number };

const GROUND = 412;
const THIGH = 80;
const SHIN = 84;
const TORSO = 118;
const NECK = 50;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);
const easeIn = (t: number) => t * t;

/** The knee for a hip and ankle, bending forward (toward the helper on the left). */
function knee(hip: Point, ankle: Point, thigh: number, shin: number): Point {
  const dx = ankle.x - hip.x;
  const dy = ankle.y - hip.y;
  const distance = Math.min(Math.hypot(dx, dy), thigh + shin - 0.01);
  const along = (thigh * thigh - shin * shin + distance * distance) / (2 * distance);
  const height = Math.sqrt(Math.max(0, thigh * thigh - along * along));
  const ux = dx / distance;
  const uy = dy / distance;
  const base = { x: hip.x + ux * along, y: hip.y + uy * along };
  // Two possible knees; pick the one further left.
  const a = { x: base.x - uy * height, y: base.y + ux * height };
  const b = { x: base.x + uy * height, y: base.y - ux * height };
  return a.x < b.x ? a : b;
}

function along(from: Point, angleDeg: number, length: number): Point {
  const angle = (angleDeg * Math.PI) / 180;
  return { x: from.x - Math.sin(angle) * length, y: from.y - Math.cos(angle) * length };
}

function pose(t: number) {
  // The person being helped.
  // Feet stay planted under the knee while seated (thigh level, shin upright).
  const ankle = { x: 372, y: GROUND - 6 };
  const hip = {
    x: lerp(452, 374, easeOut(Math.min(1, t * 1.25))),
    y: lerp(322, GROUND - 6 - THIGH - SHIN + 2, easeIn(Math.max(0, (t - 0.12) / 0.88))),
  };
  const lean = lerp(10, 0, t) + 22 * Math.sin(Math.PI * Math.min(1, t * 1.1)) * (1 - t * 0.6);
  const kneePoint = knee(hip, ankle, THIGH, SHIN);
  const shoulder = along(hip, lean, TORSO);
  const head = along(shoulder, lean * 0.7, NECK);

  // The helper, leaning in at the start and straightening as they lift.
  const helperLean = lerp(-24, -3, easeOut(t));
  const helperHip = { x: lerp(196, 190, t), y: lerp(262, 252, t) };
  const helperKnees = lerp(14, 0, t);
  const helperShoulder = along(helperHip, helperLean, TORSO + 4);
  const helperHead = along(helperShoulder, helperLean * 0.6, NECK + 2);

  const hands = {
    x: lerp(318, 292, easeOut(t)),
    y: lerp(318, 236, t),
  };

  return {
    ankle,
    hip,
    kneePoint,
    shoulder,
    head,
    helperHip,
    helperKnees,
    helperShoulder,
    helperHead,
    hands,
  };
}

const line = (a: Point, b: Point) => `M${a.x} ${a.y}L${b.x} ${b.y}`;
const arm = (shoulder: Point, hands: Point, sag: number) =>
  `M${shoulder.x} ${shoulder.y}Q${(shoulder.x + hands.x) / 2} ${Math.max(shoulder.y, hands.y) + sag} ${hands.x} ${hands.y}`;

export function LandingLiftIllustration() {
  const refs = {
    thigh: useRef<SVGPathElement>(null),
    shin: useRef<SVGPathElement>(null),
    torso: useRef<SVGPathElement>(null),
    head: useRef<SVGGElement>(null),
    risingArm: useRef<SVGPathElement>(null),
    helperLegs: useRef<SVGPathElement>(null),
    helperTorso: useRef<SVGPathElement>(null),
    helperHead: useRef<SVGGElement>(null),
    helperArm: useRef<SVGPathElement>(null),
    hands: useRef<SVGCircleElement>(null),
    spark: useRef<SVGGElement>(null),
  };

  useEffect(() => {
    const render = (t: number) => {
      const p = pose(t);
      refs.thigh.current?.setAttribute("d", line(p.hip, p.kneePoint));
      refs.shin.current?.setAttribute("d", line(p.kneePoint, p.ankle));
      refs.torso.current?.setAttribute("d", line(p.hip, p.shoulder));
      refs.head.current?.setAttribute("transform", `translate(${p.head.x} ${p.head.y})`);
      refs.risingArm.current?.setAttribute("d", arm(p.shoulder, p.hands, 18));

      const leftFoot = { x: 168, y: GROUND - 6 };
      const rightFoot = { x: 214, y: GROUND - 6 };
      const kneeBend = p.helperKnees;
      const leftKnee = {
        x: (leftFoot.x + p.helperHip.x) / 2 + kneeBend,
        y: (leftFoot.y + p.helperHip.y) / 2,
      };
      const rightKnee = {
        x: (rightFoot.x + p.helperHip.x) / 2 + kneeBend,
        y: (rightFoot.y + p.helperHip.y) / 2,
      };
      refs.helperLegs.current?.setAttribute(
        "d",
        `M${p.helperHip.x - 12} ${p.helperHip.y}L${leftKnee.x - 6} ${leftKnee.y}L${leftFoot.x} ${leftFoot.y}M${p.helperHip.x + 12} ${p.helperHip.y}L${rightKnee.x + 6} ${rightKnee.y}L${rightFoot.x} ${rightFoot.y}`,
      );
      refs.helperTorso.current?.setAttribute("d", line(p.helperHip, p.helperShoulder));
      refs.helperHead.current?.setAttribute(
        "transform",
        `translate(${p.helperHead.x} ${p.helperHead.y})`,
      );
      refs.helperArm.current?.setAttribute("d", arm(p.helperShoulder, p.hands, 20));
      refs.hands.current?.setAttribute("cx", String(p.hands.x));
      refs.hands.current?.setAttribute("cy", String(p.hands.y));
      if (refs.spark.current) {
        refs.spark.current.style.opacity = String(Math.max(0, (t - 0.85) / 0.15));
        refs.spark.current.setAttribute("transform", `translate(${p.hands.x} ${p.hands.y - 40})`);
      }
    };

    if (prefersReducedMotion()) {
      render(1);
      return;
    }

    const state = { t: 0 };
    render(0);
    const timeline = createTimeline({ loop: true, onUpdate: () => render(state.t) })
      .add(state, { t: 0, duration: 900 })
      .add(state, { t: 1, duration: 2600, ease: "inOutSine" })
      .add(state, { t: 1, duration: 2200 })
      .add(state, { t: 0, duration: 2200, ease: "inOutSine" });

    return () => {
      timeline.revert();
    };
    // The refs object is stable for the component's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg
      aria-label="One person helping another stand up from a chair"
      className="h-auto w-full"
      role="img"
      viewBox="40 20 500 430"
    >
      <ellipse cx="300" cy={GROUND + 4} fill="#e8e0d5" rx="220" ry="18" />

      {/* Chair */}
      <g fill="#d9c6b2">
        <rect height="170" rx="12" width="20" x="496" y="230" />
        <rect height="22" rx="10" width="100" x="418" y="330" />
        <rect height="64" rx="6" width="12" x="426" y="346" />
        <rect height="64" rx="6" width="12" x="500" y="346" />
      </g>

      {/* Helper */}
      <path
        fill="none"
        ref={refs.helperLegs}
        stroke="#7a4a3c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="28"
      />
      <path
        fill="none"
        ref={refs.helperTorso}
        stroke="#b96c55"
        strokeLinecap="round"
        strokeWidth="78"
      />
      <g ref={refs.helperHead}>
        <circle fill="#d8bda2" r="44" />
        <path
          d="M-42-10c6-36 28-54 58-46 16 4 27 17 32 36-15-9-26-13-42-12-15 1-29 8-48 22Z"
          fill="#5a4034"
        />
        <path
          d="M-12 12c8 7 18 7 26 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </g>

      {/* Person being helped */}
      <path fill="none" ref={refs.shin} stroke="#55705e" strokeLinecap="round" strokeWidth="28" />
      <path fill="none" ref={refs.thigh} stroke="#55705e" strokeLinecap="round" strokeWidth="30" />
      <path fill="none" ref={refs.torso} stroke="#6f947a" strokeLinecap="round" strokeWidth="70" />
      <g ref={refs.head}>
        <circle fill="#c7b098" r="40" />
        <path
          d="M-38-6c4-34 26-52 54-45 16 4 27 17 32 36-15-8-26-11-40-10-16 1-29 7-46 19Z"
          fill="#9d8874"
        />
        <path
          d="M-14 12c8 7 18 7 26 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </g>

      {/* Arms meet at the clasped hands */}
      <path
        fill="none"
        ref={refs.risingArm}
        stroke="#6f947a"
        strokeLinecap="round"
        strokeWidth="22"
      />
      <path
        fill="none"
        ref={refs.helperArm}
        stroke="#b96c55"
        strokeLinecap="round"
        strokeWidth="24"
      />
      <circle fill="#d1b59a" r="16" ref={refs.hands} />

      <g
        fill="none"
        ref={refs.spark}
        stroke="#c97860"
        strokeLinecap="round"
        strokeWidth="4"
        style={{ opacity: 0 }}
      >
        <path d="M-22 4l-8-14" />
        <path d="M0 0v-18" />
        <path d="M22 4l8-14" />
      </g>
    </svg>
  );
}
