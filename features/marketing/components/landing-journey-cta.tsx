"use client";

import { animate, createTimeline, type JSAnimation, type Timeline } from "animejs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";
import { sketchStyles } from "@/features/marketing/components/landing-sketch";

const INK = "#5a4a41";
const CLAY = "#c97860";
const SAGE = "#6f947a";

// Labels sit on whichever side of the path is clear at that point.
const milestones = [
  { at: 0, day: "Day 1", label: "Start here", above: true },
  { at: 0.34, day: "Day 30", label: "Understanding", above: false },
  { at: 0.67, day: "Day 60", label: "Adjusting", above: true },
  { at: 1, day: "Day 90", label: "Living", above: true },
] as const;

/** A seeded random so the pencil wobble is the same on every draw. */
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

type Point = { x: number; y: number };

/**
 * A pencil-drawn map of the 90 days, painted on a canvas: the path sketches itself across the
 * card, each milestone circle is drawn in as the line reaches it, and a small marker then walks
 * the route, leaving a trail of dots like the dividers on the rest of the page.
 */
function JourneyMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduced = prefersReducedMotion();
    const serifElement = document.querySelector(".font-serif-display");
    const serif = serifElement ? getComputedStyle(serifElement).fontFamily : "Georgia, serif";
    const sans = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
    const state = { draw: reduced ? 1 : 0, walk: 0 };
    const rings = milestones.map(() => ({ value: reduced ? 1 : 0 }));
    let width = 0;
    let height = 0;
    let points: Point[] = [];
    let timeline: Timeline | null = null;
    let walker: JSAnimation | null = null;

    const pointAt = (t: number): Point => {
      const index = Math.min(points.length - 1, Math.max(0, Math.round(t * (points.length - 1))));
      return points[index] ?? { x: 0, y: 0 };
    };

    const layout = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const random = seeded(7);
      points = Array.from({ length: 220 }, (_, step) => {
        const t = step / 219;
        const inset = width < 480 ? 0.16 : 0.1;
        const x = width * (inset + t * (1 - inset * 2));
        const y =
          height * (0.72 - t * 0.38) +
          Math.sin(t * Math.PI * 2.4) * height * 0.13 +
          (random() - 0.5) * 1.6;
        return { x, y };
      });
    };

    const sketchLine = (upTo: number, offset: number, alpha: number) => {
      const last = Math.floor(upTo * (points.length - 1));
      if (last < 1) return;
      context.beginPath();
      for (let index = 0; index <= last; index += 1) {
        const point = points[index]!;
        const wobble = Math.sin(index * 0.9 + offset) * 0.9;
        if (index === 0) context.moveTo(point.x, point.y + wobble);
        else context.lineTo(point.x, point.y + wobble);
      }
      context.strokeStyle = INK;
      context.globalAlpha = alpha;
      context.lineWidth = 2;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke();
      context.globalAlpha = 1;
    };

    const render = () => {
      context.clearRect(0, 0, width, height);

      // Two slightly different passes give the line a hand-drawn, pencil feel.
      sketchLine(state.draw, 0, 0.85);
      sketchLine(state.draw, 2.3, 0.3);

      // Dots along the path behind the walker, like the dividers elsewhere on the page.
      if (state.walk > 0) {
        for (let dot = 0; dot < 40; dot += 1) {
          const t = dot / 40;
          if (t > state.walk) break;
          const point = pointAt(t);
          const side = dot % 2 === 0 ? -12 : 12;
          context.beginPath();
          context.arc(point.x, point.y + side, 2.6, 0, Math.PI * 2);
          context.strokeStyle = CLAY;
          context.globalAlpha = 0.25 + 0.6 * (1 - (state.walk - t));
          context.lineWidth = 1.4;
          context.stroke();
        }
        context.globalAlpha = 1;
      }

      milestones.forEach((milestone, index) => {
        const ring = rings[index]?.value ?? 0;
        if (ring <= 0) return;
        const point = pointAt(milestone.at);
        const radius = index === milestones.length - 1 ? 15 : 11;
        context.beginPath();
        context.arc(point.x, point.y, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ring);
        context.strokeStyle = index === milestones.length - 1 ? SAGE : CLAY;
        context.lineWidth = 2.6;
        context.stroke();
        if (ring >= 1) {
          context.beginPath();
          context.arc(point.x, point.y, radius - 5, 0, Math.PI * 2);
          context.fillStyle = index === milestones.length - 1 ? SAGE : CLAY;
          context.globalAlpha = 0.85;
          context.fill();
          context.globalAlpha = 1;
        }
        context.globalAlpha = Math.min(1, ring * 1.4);
        const above = milestone.above;
        context.textAlign = "center";
        context.fillStyle = "#a85f4b";
        context.font = `700 ${width < 480 ? 10 : 11}px ${sans}`;
        context.fillText(milestone.day.toUpperCase(), point.x, point.y + (above ? -44 : 34));
        context.fillStyle = "#382c26";
        context.font = `400 ${width < 480 ? 14 : 17}px ${serif}`;
        context.fillText(milestone.label, point.x, point.y + (above ? -26 : 54));
        context.globalAlpha = 1;
      });

      if (state.walk > 0 && state.walk < 1) {
        const point = pointAt(state.walk);
        context.beginPath();
        context.arc(point.x, point.y, 7, 0, Math.PI * 2);
        context.fillStyle = "#382c26";
        context.fill();
        context.beginPath();
        context.arc(point.x, point.y, 12, 0, Math.PI * 2);
        context.strokeStyle = "rgba(56, 44, 38, 0.25)";
        context.lineWidth = 2;
        context.stroke();
      }
    };

    const play = () => {
      timeline?.pause();
      walker?.pause();
      state.draw = 0;
      state.walk = 0;
      rings.forEach((ring) => {
        ring.value = 0;
      });
      timeline = createTimeline({ onUpdate: render, onComplete: startWalking }).add(
        state,
        { draw: 1, duration: 2400, ease: "inOutSine" },
        0,
      );
      milestones.forEach((milestone, index) => {
        timeline!.add(
          rings[index]!,
          { value: 1, duration: 600, ease: "outCubic" },
          Math.max(0, milestone.at * 2400 - 150),
        );
      });
    };

    const startWalking = () => {
      walker = animate(state, {
        walk: [0, 1],
        duration: 6000,
        ease: "inOutSine",
        loop: true,
        loopDelay: 1400,
        onUpdate: render,
      });
    };

    layout();
    render();

    let shown = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || reduced) return;
        if (entry.isIntersecting && !shown) {
          shown = true;
          play();
        } else if (!entry.isIntersecting && shown) {
          shown = false;
          timeline?.pause();
          walker?.pause();
          if (entry.boundingClientRect.top > 0) {
            state.draw = 0;
            state.walk = 0;
            rings.forEach((ring) => {
              ring.value = 0;
            });
            render();
          }
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(canvas);

    const onResize = () => {
      layout();
      render();
    };
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      timeline?.pause();
      walker?.pause();
    };
  }, []);

  return (
    <canvas
      aria-label="A hand-drawn path from Day 1 to Day 90, through Understanding, Adjusting, and Living"
      className="h-full min-h-64 w-full"
      ref={canvasRef}
      role="img"
    />
  );
}

export function LandingJourneyCta() {
  const arrowRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !arrowRef.current) return;
    const nudge = animate(arrowRef.current, {
      x: [0, 5, 0],
      duration: 1400,
      ease: "inOutSine",
      loop: true,
      loopDelay: 1200,
    });
    return () => {
      nudge.revert();
    };
  }, []);

  return (
    <div
      className={`${sketchStyles.sketchFrame} grid gap-8 overflow-hidden px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10 lg:px-14`}
    >
      <div className="text-center lg:text-left">
        <h2 className="font-serif-display text-4xl font-normal leading-tight text-[#382c26] sm:text-6xl">
          Start your <span className={sketchStyles.wavyUnderline}>journey</span> today
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-[#6b5b52] lg:mx-0">
          Eight minutes a day, at your own pace. Your progress is saved as you go.
        </p>
        <Link
          className="group mt-8 inline-flex min-h-14 items-center gap-3 rounded-[14px] bg-[#382c26] px-8 text-lg font-semibold text-[#fffaf3] shadow-[0_3px_0_#211814] transition hover:-translate-y-px hover:bg-[#4b3931] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c97860] focus-visible:ring-offset-2 active:translate-y-px active:shadow-[0_1px_0_#211814]"
          href="/login"
        >
          Begin
          <ArrowRight aria-hidden="true" className="size-5" ref={arrowRef} />
        </Link>
      </div>
      <div className="h-72 sm:h-80">
        <JourneyMap />
      </div>
    </div>
  );
}
