"use client";

import { animate, createTimeline, type JSAnimation, type Timeline } from "animejs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";
import { sketchStyles } from "@/features/marketing/components/landing-sketch";

const INK = "#5a4a41";
const CLAY = "#c97860";
const SUN = "#f2c98c";
const PAPER = "#fffaf3";
const STEPS = 7;

/**
 * A pencil-drawn sunrise painted on a canvas, as a picture of beginning: the horizon and a path
 * sketch themselves in, the sun rises over the hills, its rays reach out, and footsteps appear one
 * after another up the path. It plays when the card scrolls into view.
 */
function SunriseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reduced = prefersReducedMotion();
    const state = {
      sketch: reduced ? 1 : 0,
      sun: reduced ? 1 : 0,
      rays: reduced ? 1 : 0,
      steps: reduced ? STEPS : 0,
      glow: 0,
    };
    let width = 0;
    let height = 0;
    let timeline: Timeline | null = null;
    let breathe: JSAnimation | null = null;

    const layout = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    /** A slightly wobbly line, drawn up to `progress` of its length, like pencil on paper. */
    const pencil = (points: [number, number][], progress: number, lineWidth = 2, alpha = 0.85) => {
      if (progress <= 0) return;
      const segments = 60;
      const last = Math.floor(segments * Math.min(1, progress));
      context.beginPath();
      for (let index = 0; index <= last; index += 1) {
        const t = index / segments;
        const span = t * (points.length - 1);
        const at = Math.min(points.length - 2, Math.floor(span));
        const local = span - at;
        const [x1, y1] = points[at]!;
        const [x2, y2] = points[at + 1]!;
        const x = x1 + (x2 - x1) * local;
        const y = y1 + (y2 - y1) * local + Math.sin(index * 1.7) * 0.6;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = INK;
      context.globalAlpha = alpha;
      context.lineWidth = lineWidth;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke();
      context.globalAlpha = 1;
    };

    /** The hill line: gentle rises on each side and a soft dip where the path meets it. */
    const hill = (x: number) => {
      const u = x / width;
      const horizon = height * 0.6;
      return (
        horizon -
        height *
          (0.07 * Math.sin(u * Math.PI * 1.15 + 0.15) + 0.025 * Math.sin(u * Math.PI * 3.4 + 1)) +
        height * 0.05 * Math.exp(-((u - 0.5) ** 2) / 0.006)
      );
    };

    const hillPoints = (): [number, number][] =>
      Array.from({ length: 41 }, (_, index) => {
        const x = (width * index) / 40;
        return [x, hill(x)];
      });

    const render = () => {
      context.clearRect(0, 0, width, height);
      const apex = { x: width * 0.5, y: hill(width * 0.5) };
      const sunRadius = Math.min(width * 0.09, height * 0.2);
      const sunY = apex.y + sunRadius * 1.15 - state.sun * sunRadius * 1.75;

      // One soft wash of morning light, fading out in every direction.
      if (state.sun > 0) {
        const light = context.createRadialGradient(apex.x, sunY, 0, apex.x, sunY, width * 0.6);
        const strength = 0.5 * state.sun + state.glow * 0.06;
        light.addColorStop(0, `rgba(246, 203, 148, ${strength})`);
        light.addColorStop(0.45, `rgba(246, 203, 148, ${strength * 0.35})`);
        light.addColorStop(1, "rgba(246, 203, 148, 0)");
        context.fillStyle = light;
        context.fillRect(0, 0, width, height);
      }

      // Rays and sun sit behind the hills; the land drawn next covers whatever is below.
      if (state.rays > 0) {
        for (let index = 0; index < 11; index += 1) {
          const angle = Math.PI + (Math.PI * (index + 0.5)) / 11;
          const inner = sunRadius * 1.35;
          const outer = inner + sunRadius * (0.5 + (index % 2) * 0.32) * state.rays;
          context.beginPath();
          context.moveTo(apex.x + Math.cos(angle) * inner, sunY + Math.sin(angle) * inner);
          context.lineTo(apex.x + Math.cos(angle) * outer, sunY + Math.sin(angle) * outer);
          context.strokeStyle = CLAY;
          context.globalAlpha = 0.7;
          context.lineWidth = 2.2;
          context.lineCap = "round";
          context.stroke();
        }
        context.globalAlpha = 1;
      }
      if (state.sun > 0) {
        context.beginPath();
        context.arc(apex.x, sunY, sunRadius, 0, Math.PI * 2);
        context.fillStyle = SUN;
        context.fill();
        context.strokeStyle = CLAY;
        context.lineWidth = 2;
        context.stroke();
      }

      // The land, in the card's own paper colour so the scene runs into the text below.
      const points = hillPoints();
      context.beginPath();
      context.moveTo(0, height);
      points.forEach(([x, y]) => context.lineTo(x, y));
      context.lineTo(width, height);
      context.closePath();
      const land = context.createLinearGradient(0, apex.y, 0, height);
      land.addColorStop(0, "#fbf1e4");
      land.addColorStop(1, PAPER);
      context.fillStyle = land;
      context.fill();

      // The path, widening toward us and meeting the hills exactly at the dip.
      const pathReveal = Math.max(0, state.sketch * 1.2 - 0.2);
      if (pathReveal > 0) {
        const left = width * 0.5 - Math.min(width * 0.16, 190);
        const right = width * 0.5 + Math.min(width * 0.16, 190);
        context.beginPath();
        context.moveTo(left, height);
        context.quadraticCurveTo(width * 0.47, apex.y + (height - apex.y) * 0.35, apex.x, apex.y);
        context.quadraticCurveTo(width * 0.53, apex.y + (height - apex.y) * 0.35, right, height);
        context.closePath();
        const pathFill = context.createLinearGradient(0, apex.y, 0, height);
        pathFill.addColorStop(0, `rgba(240, 214, 180, ${0.2 * pathReveal})`);
        pathFill.addColorStop(1, `rgba(240, 214, 180, ${0.75 * pathReveal})`);
        context.fillStyle = pathFill;
        context.fill();
        const edge = (side: 1 | -1): [number, number][] =>
          Array.from({ length: 17 }, (_, index) => {
            const t = index / 16;
            const startX = width * 0.5 + side * Math.min(width * 0.16, 190);
            const controlX = width * (0.5 + side * 0.03);
            const controlY = apex.y + (height - apex.y) * 0.35;
            const x = (1 - t) ** 2 * startX + 2 * (1 - t) * t * controlX + t * t * apex.x;
            const y = (1 - t) ** 2 * height + 2 * (1 - t) * t * controlY + t * t * apex.y;
            return [x, y];
          });
        pencil(edge(-1), pathReveal, 1.8);
        pencil(edge(1), pathReveal, 1.8);
      }

      pencil(points, state.sketch);

      // Footsteps climbing the path, the nearest first.
      for (let step = 0; step < STEPS; step += 1) {
        const appear = Math.min(1, Math.max(0, state.steps - step));
        if (appear <= 0) break;
        const t = step / STEPS;
        const y = height - 14 - t * (height - apex.y - 30);
        const scale = 1 - t * 0.72;
        const side = step % 2 === 0 ? -1 : 1;
        const x = width * 0.5 + side * 10 * scale;
        context.beginPath();
        context.ellipse(x, y, 4.5 * scale, 8 * scale, side * 0.15, 0, Math.PI * 2);
        context.fillStyle = CLAY;
        context.globalAlpha = 0.85 * appear;
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const reset = () => {
      timeline?.pause();
      breathe?.pause();
      state.sketch = 0;
      state.sun = 0;
      state.rays = 0;
      state.steps = 0;
      render();
    };

    const play = () => {
      reset();
      timeline = createTimeline({
        onUpdate: render,
        onComplete: () => {
          breathe = animate(state, {
            glow: [0, 1],
            duration: 2600,
            ease: "inOutSine",
            loop: true,
            alternate: true,
            onUpdate: render,
          });
        },
      })
        .add(state, { sketch: 1, duration: 1400, ease: "inOutSine" }, 0)
        .add(state, { sun: 1, duration: 1800, ease: "outCubic" }, 700)
        .add(state, { rays: 1, duration: 900, ease: "outBack(1.4)" }, 1900)
        .add(state, { steps: STEPS, duration: 2100, ease: "linear" }, 2100);
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
        } else if (!entry.isIntersecting && shown && entry.boundingClientRect.top > 0) {
          shown = false;
          reset();
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
      breathe?.pause();
    };
  }, []);

  return (
    <canvas
      aria-label="A pencil sketch of the sun rising over a path, with footsteps leading up it"
      className="block h-56 w-full sm:h-64 lg:h-72"
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
    <div className={`${sketchStyles.sketchFrame} overflow-hidden`}>
      <SunriseCanvas />
      <div className="grid gap-8 px-6 pb-8 pt-2 sm:px-10 md:grid-cols-[1fr_auto] md:items-center md:gap-12 lg:px-14 lg:py-10">
        <div>
          <h2 className="font-serif-display text-4xl font-normal leading-tight text-[#382c26] sm:text-5xl">
            Start your journey today
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-[#6b5b52]">
            The first lesson takes about eight minutes. Read it today, and tomorrow&apos;s will be
            waiting for you.
          </p>
        </div>
        <Link
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[14px] bg-[#382c26] px-9 text-lg font-semibold text-[#fffaf3] shadow-[0_3px_0_#211814] transition hover:-translate-y-px hover:bg-[#4b3931] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c97860] focus-visible:ring-offset-2 active:translate-y-px active:shadow-[0_1px_0_#211814] md:justify-self-end"
          href="/login"
        >
          Begin
          <ArrowRight aria-hidden="true" className="size-5" ref={arrowRef} />
        </Link>
      </div>
    </div>
  );
}
