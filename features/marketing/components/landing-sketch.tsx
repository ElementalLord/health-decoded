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

/** A heart that beats, with little rays that pulse alongside it. */
export function PumpingHeart({ className }: { className?: string }) {
  return (
    <div className={cn(styles.heartWrap, className)}>
      <svg aria-hidden="true" className="h-auto w-full" viewBox="0 0 160 170">
        <g
          className={styles.heartRays}
          fill="none"
          stroke="#c97860"
          strokeLinecap="round"
          strokeWidth="4"
        >
          <path d="M50 14 L56 32" />
          <path d="M80 6 L80 26" />
          <path d="M110 14 L104 32" />
          <path d="M132 150 C138 146 140 140 134 136 C128 132 130 126 138 124" />
        </g>
        <path
          className={styles.heart}
          d="M80 150 C40 120 16 98 16 70 C16 50 31 38 48 38 C62 38 73 46 80 58 C87 46 98 38 112 38 C129 38 144 50 144 70 C144 98 120 120 80 150 Z"
          fill="#e8b4a2"
          stroke="#a85f4b"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}
