"use client";

import { animate, createTimeline } from "animejs";
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
  const floatRef = useRef<HTMLDivElement>(null);
  const castRef = useRef<HTMLDivElement>(null);

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
        const arc = Math.sin(Math.PI * turn);
        // Turning paper lifts off the page and bends a little at its free edge.
        leaf.style.transform = `rotateY(${angle}deg) translateZ(${arc * 22}px) skewY(${arc * (turn < 0.5 ? -4 : 4)}deg)`;
        leaf.style.zIndex = String(turn > 0.5 ? 10 + index : 10 + count - index);
        leaf.style.setProperty("--shade", String(arc * 0.38));
        leaf.style.setProperty("--shine", String(arc * 0.55));
      });
      // The page in motion throws a soft shadow across the page beneath it.
      const moving = state.reduce((most, { turn }) => Math.max(most, Math.sin(Math.PI * turn)), 0);
      const movingTurn = state.find(({ turn }) => turn > 0.02 && turn < 0.98)?.turn ?? 0;
      if (castRef.current) {
        castRef.current.style.opacity = String(moving * 0.5);
        castRef.current.style.left = movingTurn < 0.5 ? "50%" : "0%";
      }
    };

    if (prefersReducedMotion()) {
      render();
      return;
    }

    render();
    const float = floatRef.current
      ? animate(floatRef.current, {
          y: [0, -8, 0],
          rotate: [-1.2, 0.6, -1.2],
          duration: 6000,
          ease: "inOutSine",
          loop: true,
        })
      : null;
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
      float?.revert();
    };
  }, []);

  return (
    <div
      aria-label="An animated storybook turning through the stories"
      className={styles.stage}
      role="img"
    >
      <div className={styles.floater} ref={floatRef}>
        <div className={styles.book}>
          <div className={styles.cover} aria-hidden="true" />
          <div className={styles.stackLeft} aria-hidden="true" />
          <div className={styles.stackRight} aria-hidden="true" />
          <span className={styles.ribbon} aria-hidden="true" />
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
                {/* This side faces the next story's picture, so it carries that story's
                    opening line. The last leaf closes the book. */}
                <p className={styles.kicker}>{pages[index + 1]?.name ?? "Your turn"}</p>
                <p className={styles.quote}>
                  {pages[index + 1]?.line ?? "Every story has a choice in it. What would you do?"}
                </p>
                <span className={styles.pageNumber}>{index * 2 + 2}</span>
              </div>
            </div>
          ))}
          <div className={styles.cast} aria-hidden="true" ref={castRef} />
          <div className={styles.gutter} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
