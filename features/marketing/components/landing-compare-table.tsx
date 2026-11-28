"use client";

import { createTimeline, stagger, type Timeline } from "animejs";
import { Fragment, useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";
import { sketchStyles } from "@/features/marketing/components/landing-sketch";

export type Support = "yes" | "partly" | "no";

export type CompareGroup = {
  readonly label: string;
  readonly rows: readonly (readonly [string, Support, Support, Support])[];
};

/**
 * A hand-drawn loop around a box of the given size: slightly wobbly, tilted a touch, and carried a
 * little past its starting point so the end overlaps the beginning, like a pen circling a word.
 */
function roughOval(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2 - 3;
  const ry = height / 2 - 2;
  const tilt = (-3 * Math.PI) / 180;
  const start = -2.55;
  const sweep = Math.PI * 2 * 1.12;
  const steps = 96;
  const points: string[] = [];
  for (let step = 0; step <= steps; step += 1) {
    const t = step / steps;
    const angle = start + sweep * t;
    // Small wobble, and a gentle outward drift so the tail passes just outside the start.
    const scale = 1 + 0.025 * Math.sin(3 * angle + 0.7) - 0.06 * (1 - t) + 0.07 * t;
    const x = Math.cos(angle) * rx * scale;
    const y = Math.sin(angle) * ry * scale;
    const px = cx + x * Math.cos(tilt) - y * Math.sin(tilt);
    const py = cy + x * Math.sin(tilt) + y * Math.cos(tilt);
    points.push(`${step === 0 ? "M" : "L"}${px.toFixed(2)} ${py.toFixed(2)}`);
  }
  return points.join("");
}

const supportLabel: Record<Support, string> = { yes: "Yes", partly: "Partly", no: "No" };

function Mark({ value }: { value: Support }) {
  const glyph = value === "yes" ? "✓" : value === "partly" ? "–" : "✗";
  const tone =
    value === "yes" ? "text-[#4f7a5c]" : value === "partly" ? "text-[#c39a52]" : "text-[#b8a493]";
  return (
    <span
      className={`inline-block font-serif-display text-2xl leading-none sm:text-3xl ${tone}`}
      data-mark=""
    >
      {glyph}
      <span className="sr-only">{supportLabel[value]}</span>
    </span>
  );
}

/**
 * The comparison table. When it scrolls into view the rows slide in one by one, each mark pops
 * into place, and a hand-drawn loop circles the Health Decoded column. It replays when scrolled
 * back into view from below.
 */
export function LandingCompareTable({
  columns,
  groups,
}: {
  columns: readonly string[];
  groups: readonly CompareGroup[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<SVGSVGElement>(null);
  const loopPathRef = useRef<SVGPathElement>(null);

  // Draw the loop at the heading's real pixel size, so the stroke is never stretched. Redrawn
  // whenever that size changes.
  useEffect(() => {
    const svg = loopRef.current;
    const path = loopPathRef.current;
    if (!svg || !path) return;
    const draw = () => {
      const { width, height } = svg.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      path.setAttribute("d", roughOval(width, height));
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const loop = loopPathRef.current;
    if (!root || !loop || prefersReducedMotion()) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("tbody tr"));
    const marks = Array.from(root.querySelectorAll<HTMLElement>("[data-mark]"));
    // The loop is drawn on in one stroke, start to finish.
    const sweep = { drawn: 0 };
    const drawLoop = () => {
      const length = loop.getTotalLength();
      loop.style.strokeDasharray = `${length} ${length}`;
      loop.style.strokeDashoffset = String(length * (1 - sweep.drawn));
    };
    let timeline: Timeline | null = null;

    const hide = () => {
      timeline?.pause();
      rows.forEach((row) => {
        row.style.opacity = "0";
      });
      marks.forEach((mark) => {
        mark.style.transform = "scale(0)";
      });
      sweep.drawn = 0;
      drawLoop();
    };

    const play = () => {
      timeline?.pause();
      timeline = createTimeline()
        .add(rows, {
          opacity: [0, 1],
          x: [-24, 0],
          duration: 700,
          delay: stagger(70),
          ease: "outExpo",
        })
        .add(
          marks,
          {
            scale: [0, 1],
            rotate: [-25, 0],
            duration: 650,
            delay: stagger(35),
            ease: "outBack(2)",
          },
          200,
        );
      timeline.add(sweep, { drawn: 1, duration: 1100, ease: "inOutQuad", onUpdate: drawLoop }, 500);
    };

    hide();
    let shown = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !shown) {
          shown = true;
          play();
        } else if (!entry.isIntersecting && shown && entry.boundingClientRect.top > 0) {
          shown = false;
          hide();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      timeline?.pause();
    };
  }, []);

  return (
    <div className={`${sketchStyles.sketchFrame} relative overflow-hidden`} ref={rootRef}>
      <table className="w-full table-fixed border-collapse text-left">
        <colgroup>
          <col className="w-[40%] sm:w-[46%]" />
          {columns.map((column) => (
            <col key={column} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b-2 border-[#5a4a41]/70">
            <td />
            {columns.map((column, index) => (
              <th className="relative px-1 py-6 text-center sm:px-3" key={column} scope="col">
                {index === 0 ? (
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-[3%] inset-y-[14%] h-[72%] w-[94%] overflow-visible"
                    ref={loopRef}
                  >
                    <path
                      fill="none"
                      ref={loopPathRef}
                      stroke="#c97860"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                ) : null}
                <span
                  className={`relative font-serif-display text-base font-normal leading-tight sm:text-2xl ${index === 0 ? "text-[#382c26]" : "text-[#6b5b52]"}`}
                >
                  {column}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <Fragment key={group.label}>
              <tr>
                <th
                  className="px-3 pb-2 pt-6 font-serif-display text-lg font-normal italic text-[#a85f4b] sm:px-6 sm:text-xl"
                  colSpan={columns.length + 1}
                  scope="colgroup"
                >
                  {group.label}
                </th>
              </tr>
              {group.rows.map(([feature, ...values]) => (
                <tr className="border-t border-dashed border-[#d9cabd]" key={feature}>
                  <th
                    className="px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#382c26] sm:px-6 sm:text-base"
                    scope="row"
                  >
                    {feature}
                  </th>
                  {values.map((value, index) => (
                    <td
                      className={`px-1 py-3 text-center ${index === 0 ? "bg-[#c97860]/[0.07]" : ""}`}
                      key={columns[index]}
                    >
                      <Mark value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
