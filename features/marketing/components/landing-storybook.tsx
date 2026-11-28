"use client";

import { createTimeline } from "animejs";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";
import styles from "./landing-storybook.module.css";

export type StorybookPage = {
  readonly image: string;
  readonly imageAlt: string;
  readonly name: string;
  readonly title: string;
  readonly line: string;
};

/**
 * An open book whose pages turn on their own. Each leaf shows a story's illustration on the front
 * and a line from it on the back, so the book flips through every story in turn.
 */
export function LandingStorybook({ pages }: { pages: readonly StorybookPage[] }) {
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const leaves = leafRefs.current.filter((leaf): leaf is HTMLDivElement => leaf !== null);
    if (leaves.length === 0) return;
    const count = leaves.length;
    const state = leaves.map(() => ({ turn: 0 }));

    const render = () => {
      state.forEach(({ turn }, index) => {
        const leaf = leaves[index];
        if (!leaf) return;
        const angle = -180 * turn;
        // Turning leaves lift slightly off the page, like real paper.
        const lift = Math.sin(Math.PI * turn) * 26;
        leaf.style.transform = `rotateY(${angle}deg) rotateX(${lift * 0.12}deg) translateZ(${lift}px)`;
        leaf.style.zIndex = String(turn > 0.5 ? 10 + index : 10 + count - index);
        leaf.style.setProperty("--shade", String(Math.sin(Math.PI * turn) * 0.35));
      });
    };

    if (prefersReducedMotion()) {
      render();
      return;
    }

    render();
    const timeline = createTimeline({ loop: true, onUpdate: render });
    state.forEach((leafState, index) => {
      timeline.add(
        leafState,
        { turn: 1, duration: 1500, ease: "inOutQuart" },
        index === 0 ? 1200 : "+=1700",
      );
    });
    timeline.add(state.slice().reverse(), { turn: 0, duration: 900, ease: "inOutCubic" }, "+=2200");
    timeline.add(state[0]!, { turn: 0, duration: 500 });

    return () => {
      timeline.revert();
    };
  }, []);

  return (
    <div
      aria-label="An animated storybook turning through the stories"
      className={styles.stage}
      role="img"
    >
      <div className={styles.book}>
        <div className={styles.cover} aria-hidden="true" />
        <div className={`${styles.page} ${styles.leftPage}`} aria-hidden="true">
          <p className={styles.kicker}>Health Decoded</p>
          <p className={styles.bookTitle}>Stories for the moments that matter</p>
          <span className={styles.flourish} />
        </div>
        <div className={`${styles.page} ${styles.rightPage}`} aria-hidden="true">
          <p className={styles.kicker}>The end… for now</p>
          <p className={styles.bookTitle}>You decide what happens next.</p>
        </div>

        {pages.map((page, index) => (
          <div
            aria-hidden="true"
            className={styles.leaf}
            key={page.title}
            ref={(element) => {
              leafRefs.current[index] = element;
            }}
          >
            <div className={`${styles.face} ${styles.front}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className={styles.art} src={page.image} />
              <p className={styles.caption}>
                <span>{page.name}</span>
                {page.title}
              </p>
            </div>
            <div className={`${styles.face} ${styles.back}`}>
              <p className={styles.kicker}>{page.name}</p>
              <p className={styles.quote}>{page.line}</p>
              <span className={styles.pageNumber}>{index * 2 + 2}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
