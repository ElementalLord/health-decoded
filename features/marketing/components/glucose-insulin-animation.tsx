"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";

import styles from "./glucose-insulin-animation.module.css";

export function GlucoseInsulinAnimation() {
  const [replay, setReplay] = useState(0);

  return (
    <section
      aria-describedby="glucose-animation-caption"
      aria-label="Animated explanation of glucose and insulin"
      className={styles.scene}
      key={replay}
    >
      <div className="relative z-10 flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a85f4b]">
            <Sparkles aria-hidden="true" className="size-3.5" /> The glucose chase
          </p>
          <h2 className="mt-2 max-w-sm font-serif-display text-xl font-semibold text-[#382c26] sm:text-3xl">
            Insulin helps glucose find its way into cells.
          </h2>
        </div>
        <button
          aria-label="Replay the glucose and insulin animation"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[#cbbdaf] bg-[#fffaf3] text-[#382c26] shadow-[0_2px_0_rgb(56_44_38/0.14)] transition hover:-translate-y-0.5 hover:border-[#a85f4b] active:translate-y-px active:shadow-none"
          onClick={() => setReplay((value) => value + 1)}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div className={styles.animationStage}>
        <div aria-hidden="true" className={styles.bloodstream}>
          <div className={`${styles.glucose} ${styles.glucoseOne}`}>G</div>
          <div className={`${styles.glucose} ${styles.glucoseTwo}`}>G</div>
          <div className={`${styles.glucose} ${styles.glucoseThree}`}>G</div>
          <div className={styles.insulin} />
          <div className={styles.signal} />
          <div className={styles.cell}>Cell</div>
          <div className={styles.cellDoor} />
        </div>
      </div>

      <p
        className="border-t border-[#d7cbbd] px-5 py-4 text-xs leading-5 text-[#786a61] sm:px-7"
        id="glucose-animation-caption"
      >
        A visual metaphor: insulin does not literally catch glucose, it signals many cells to take
        glucose in for energy.
      </p>
    </section>
  );
}
