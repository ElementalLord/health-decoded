import { cn } from "@/lib/utils";

import styles from "./landing-sketch.module.css";

export const sketchStyles = styles;

/** Animated lattice band that separates the landing page sections. */
export function LatticeDivider() {
  return (
    <div aria-hidden="true" className={styles.divider}>
      <div className={styles.dividerLattice} />
      <div className={styles.dividerDots} />
    </div>
  );
}

/** A hand-drawn wavy vertical rule used between columns on wide screens. */
export function WavyRule({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(styles.wavyRule, className)}
      preserveAspectRatio="none"
      viewBox="0 0 20 400"
    >
      <path
        d="M10 0 C18 25 2 25 10 50 S18 75 10 100 S2 125 10 150 S18 175 10 200 S2 225 10 250 S18 275 10 300 S2 325 10 350 S18 375 10 400"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
