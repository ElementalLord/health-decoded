"use client";

import { animate, createDrawable, createTimeline, stagger, type Timeline } from "animejs";
import { Fragment, useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";
import { sketchStyles } from "@/features/marketing/components/landing-sketch";

export type Support = "yes" | "partly" | "no";

export type CompareGroup = {
  readonly label: string;
  readonly rows: readonly (readonly [string, Support, Support, Support])[];
};

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
  const loopRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const loop = loopRef.current;
    if (!root || !loop || prefersReducedMotion()) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("tbody tr"));
    const marks = Array.from(root.querySelectorAll<HTMLElement>("[data-mark]"));
    const [drawable] = createDrawable(loop);
    let timeline: Timeline | null = null;

    const hide = () => {
      timeline?.pause();
      rows.forEach((row) => {
        row.style.opacity = "0";
      });
      marks.forEach((mark) => {
        mark.style.transform = "scale(0)";
      });
      if (drawable) animate(drawable, { draw: "0 0", duration: 0 });
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
      if (drawable) {
        timeline.add(drawable, { draw: ["0 0", "0 1"], duration: 1100, ease: "inOutQuad" }, 500);
      }
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
                    className="pointer-events-none absolute inset-x-1 inset-y-2 h-[calc(100%-1rem)] w-[calc(100%-0.5rem)] overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 200 80"
                  >
                    <path
                      d="M30 14 C80 2 150 4 184 22 C204 36 190 66 140 74 C88 82 22 76 10 52 C0 32 30 12 70 9"
                      fill="none"
                      ref={loopRef}
                      stroke="#c97860"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      vectorEffect="non-scaling-stroke"
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
