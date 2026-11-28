"use client";

import { animate, createTimeline } from "animejs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";

type Mote = { x: number; y: number; r: number; speed: number; phase: number; hue: string };

const PALETTE = ["#c97860", "#e2a98f", "#6f947a", "#a9c2ad", "#d9b26f"];

/**
 * A canvas of drifting light that bends toward the pointer, behind a single, inviting Begin button.
 * The motes trace gentle paths toward a winding road, a quiet picture of a journey starting.
 */
export function LandingJourneyCta() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reduced = prefersReducedMotion();

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };
    let motes: Mote[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.round(Math.min(110, (width * height) / 9000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.5 + Math.random() * 3.5,
        speed: 0.15 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        hue: PALETTE[Math.floor(Math.random() * PALETTE.length)]!,
      }));
    };

    const drawRoad = (time: number) => {
      // A soft winding path that runs from the bottom-left corner to the button.
      context.save();
      context.lineCap = "round";
      for (let lane = 0; lane < 3; lane += 1) {
        context.beginPath();
        for (let step = 0; step <= 60; step += 1) {
          const t = step / 60;
          const x = width * (0.02 + t * 0.96);
          const wave = Math.sin(t * Math.PI * 2.2 + time * 0.0004 + lane * 0.6) * height * 0.12;
          const y = height * (0.92 - t * 0.5) + wave + lane * 14;
          if (step === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(201, 120, 96, ${0.14 - lane * 0.035})`;
        context.lineWidth = 26 - lane * 8;
        context.stroke();
      }
      context.restore();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      drawRoad(time);
      for (const mote of motes) {
        if (!reduced) {
          mote.x += mote.speed;
          mote.y += Math.sin(time * 0.001 + mote.phase) * 0.25 - mote.speed * 0.25;
          const dx = pointer.x - mote.x;
          const dy = pointer.y - mote.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 160) {
            mote.x += (dx / distance) * 0.9;
            mote.y += (dy / distance) * 0.9;
          }
          if (mote.x > width + 10) mote.x = -10;
          if (mote.y < -10) mote.y = height + 10;
          if (mote.y > height + 10) mote.y = -10;
        }
        const twinkle = 0.55 + Math.sin(time * 0.002 + mote.phase) * 0.35;
        context.beginPath();
        context.globalAlpha = twinkle;
        context.fillStyle = mote.hue;
        context.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const loop = (time: number) => {
      if (visible) draw(time);
      frame = requestAnimationFrame(loop);
    };

    resize();
    if (reduced) draw(0);
    else frame = requestAnimationFrame(loop);

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    canvas.parentElement?.addEventListener("pointermove", onPointer);
    canvas.parentElement?.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("pointermove", onPointer);
      canvas.parentElement?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !arrowRef.current || !glowRef.current) return;
    const nudge = createTimeline({ loop: true })
      .add(arrowRef.current, { x: [0, 7, 0], duration: 1100, ease: "inOutSine" }, 0)
      .add(
        glowRef.current,
        { opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1], duration: 2200, ease: "inOutSine" },
        0,
      );
    return () => {
      nudge.revert();
    };
  }, []);

  const press = (scale: number) => {
    if (!buttonRef.current || prefersReducedMotion()) return;
    animate(buttonRef.current, { scale, duration: 450, ease: "outElastic(1, .6)" });
  };

  return (
    <div className="relative isolate overflow-hidden rounded-[32px] border border-[#e2d6ca] bg-[radial-gradient(circle_at_70%_40%,#fffaf3_0%,#f6ece0_55%,#efe2d3_100%)]">
      <canvas aria-hidden="true" className="absolute inset-0 -z-10 size-full" ref={canvasRef} />
      <div className="grid gap-10 px-6 py-16 sm:px-12 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:px-16 lg:py-24">
        <div className="text-center lg:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#a85f4b]">
            Your first step
          </p>
          <h2 className="mt-4 font-serif-display text-5xl font-normal leading-[1.02] text-[#382c26] sm:text-7xl">
            Start your journey today.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#6b5b52] lg:mx-0">
            Eight minutes a day, at your own pace, with people who care how this feels. Your
            progress is saved as you go.
          </p>
        </div>

        <div className="relative mx-auto grid place-items-center">
          <span
            aria-hidden="true"
            className="absolute size-56 rounded-full bg-[radial-gradient(circle,rgb(201_120_96/0.45),transparent_68%)] blur-md sm:size-72"
            ref={glowRef}
          />
          <Link
            className="group relative inline-flex min-h-20 items-center gap-4 overflow-hidden rounded-full bg-[linear-gradient(135deg,#c97860,#a85f4b)] py-4 pl-10 pr-4 font-serif-display text-4xl text-[#fffaf3] shadow-[0_18px_40px_-12px_rgb(168_95_75/0.75),inset_0_1px_0_rgb(255_255_255/0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#382c26]/40 sm:min-h-24 sm:pl-12 sm:text-5xl"
            href="/login"
            onBlur={() => press(1)}
            onFocus={() => press(1.04)}
            onPointerEnter={() => press(1.06)}
            onPointerLeave={() => press(1)}
            ref={buttonRef}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 transition-[left] duration-700 ease-out group-hover:left-[120%]"
            />
            Begin
            <span className="grid size-12 place-items-center rounded-full bg-[#fffaf3] text-[#a85f4b] sm:size-16">
              <ArrowRight aria-hidden="true" className="size-6 sm:size-8" ref={arrowRef} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
