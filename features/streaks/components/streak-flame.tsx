import styles from "@/features/streaks/components/streak-flame.module.css";

export function StreakFlame({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`${styles.flame} ${active ? styles.active : "opacity-40 grayscale"}`}
      fill="none"
      height="56"
      viewBox="0 0 56 64"
      width="49"
    >
      <path
        className={styles.outer}
        d="M28 2c4 12-7 16-3 27 3-5 10-8 11-17 12 13 17 25 11 39-3 8-10 11-19 11C12 62 5 51 8 38c2-10 10-15 13-25 1 9 3 12 7 16 4-9-2-17 0-27Z"
        fill="#d95d28"
      />
      <path
        className={styles.middle}
        d="M28 18c4 8-3 13 1 20 3-3 6-6 7-11 6 8 8 15 4 23-3 5-7 7-12 7-9 0-14-8-11-16 2-6 7-10 8-16 1 5 2 8 3 10 3-5 0-10 0-17Z"
        fill="#f08a2c"
      />
      <path
        className={styles.inner}
        d="M29 33c3 5 0 9 2 13 2-2 3-4 4-7 4 6 3 12-1 15-4 3-9 2-12-2-3-5 0-10 4-14 0 3 1 5 3 6 2-3 0-6 0-11Z"
        fill="#ffd66b"
      />
    </svg>
  );
}
