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
      let moving = 0;
      let movingTurn = 0;
      state.forEach(({ turn }, index) => {
        const leaf = leaves[index];
        if (!leaf) return;
        const arc = Math.sin(Math.PI * turn);
        // Each leaf gets its own depth in the stack, so two pages never sit at the same depth
        // and flicker; a turning page lifts a little higher while it moves.
        const depth = (turn > 0.5 ? index : count - index) * 0.8 + 1 + arc * 18;
        leaf.style.transform = `translateZ(${depth.toFixed(2)}px) rotateY(${(-180 * turn).toFixed(2)}deg)`;
        leaf.style.setProperty("--shade", (arc * 0.45).toFixed(3));
        if (arc > moving) {
          moving = arc;
          movingTurn = turn;
        }
      });
      // The page in motion throws a soft shadow across the page beneath it.
      if (castRef.current) {
        castRef.current.style.opacity = (moving * 0.45).toFixed(3);
        castRef.current.style.transform = movingTurn < 0.5 ? "translateX(100%)" : "none";
      }
    };

    if (prefersReducedMotion()) {
      render();
      return;
    }

    render();
    const float = floatRef.current
      ? animate(floatRef.current, {
          y: [0, -6, 0],
          duration: 7000,
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
