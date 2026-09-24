import { Sparkles } from "lucide-react";

import styles from "./glucose-insulin-animation.module.css";

export function GlucoseInsulinAnimation() {
  return (
    <section aria-label="Animated explanation of glucose and insulin" className={styles.scene}>
      <div className="relative z-10 flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a85f4b]">
            <Sparkles aria-hidden="true" className="size-3.5" /> How insulin helps
          </p>
          <h2 className="mt-2 max-w-sm font-serif-display text-xl font-semibold text-[#382c26] sm:text-3xl">
            Insulin helps glucose find its way into cells.
          </h2>
        </div>
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
    </section>
  );
}
