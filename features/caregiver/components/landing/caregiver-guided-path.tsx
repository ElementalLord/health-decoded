"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { animate, createTimer } from "animejs";
import { useEffect, useRef } from "react";
import { caregiverLandingContent, caregiverLandingRoutes } from "../../content/caregiver-landing";
import styles from "../../styles/caregiver-landing.module.css";
import { getImplementedCaregiverModuleById } from "../../content/caregiver-module-registry";

const DEFAULT_SPEED = 0.045;
const HOVER_SPEED = 0.002;

export function CaregiverGuidedPath() {
  const { guidedPath } = caregiverLandingContent;
  const trackRef = useRef<HTMLOListElement>(null);
  const speedRef = useRef({ value: DEFAULT_SPEED });
  const positionRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const firstCard = track?.children.item(0) as HTMLElement | null;
    const middleCard = track?.children.item(caregiverLandingRoutes.length) as HTMLElement | null;
    if (!track || !firstCard || !middleCard) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let loopWidth = middleCard.offsetLeft - firstCard.offsetLeft;
    if (loopWidth <= 0) return;

    positionRef.current = loopWidth;
    track.style.transform = `translate3d(${-loopWidth}px, 0, 0)`;

    const resizeObserver = new ResizeObserver(() => {
      const nextLoopWidth = middleCard.offsetLeft - firstCard.offsetLeft;
      if (nextLoopWidth <= 0) return;

      const cycleProgress = (positionRef.current - loopWidth) / loopWidth;
      loopWidth = nextLoopWidth;
      positionRef.current = loopWidth * (1 + cycleProgress);
    });
    resizeObserver.observe(firstCard);

    const timer = createTimer({
      onUpdate: (self) => {
        const nextPosition = positionRef.current + self.deltaTime * speedRef.current.value;
        const normalizedOffset = (((nextPosition - loopWidth) % loopWidth) + loopWidth) % loopWidth;
        positionRef.current = loopWidth + normalizedOffset;
        track.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`;
      },
    });

    const handleVisibility = () => {
      if (document.hidden) timer.pause();
      else timer.resume();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      resizeObserver.disconnect();
      timer.revert();
    };
  }, []);

  function changeSpeed(value: number, duration: number) {
    animate(speedRef.current, {
      value,
      duration,
      ease: "out(4)",
    });
  }

  const lessonCards = [0, 1, 2].flatMap((copyIndex) =>
    caregiverLandingRoutes.map((route) => {
      const duplicate = copyIndex !== 1;

      return (
        <li
          key={`${route.id}-${copyIndex}`}
          data-caregiver-destination={route.id}
          data-duplicate={duplicate}
          aria-hidden={duplicate || undefined}
        >
          <article>
            <div className={styles.moduleCardHeader}>
              <span className={styles.moduleOrder}>{String(route.order).padStart(2, "0")}</span>
              <span className={styles.moduleTime}>{route.time}</span>
            </div>
            <h3>{route.moduleTitle}</h3>
            <p>{route.purpose}</p>
            {getImplementedCaregiverModuleById(route.id) ? (
              <Link
                className={styles.textButton}
                href={getImplementedCaregiverModuleById(route.id)!.route}
                tabIndex={duplicate ? -1 : undefined}
              >
                {route.action}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ) : null}
          </article>
        </li>
      );
    }),
  );

  return (
    <section
      id="caregiver-guided-path"
      className={styles.guidedPath}
      aria-labelledby="caregiver-guided-path-title"
    >
      <div className={styles.sectionHeading}>
        <p className={styles.sectionNumber}>Five short lessons</p>
        <h2 id="caregiver-guided-path-title">{guidedPath.sectionTitle}</h2>
        <p>{guidedPath.introduction}</p>
      </div>

      <div
        className={styles.moduleMarquee}
        onMouseEnter={() => changeSpeed(HOVER_SPEED, 90)}
        onMouseLeave={() => changeSpeed(DEFAULT_SPEED, 180)}
        onFocusCapture={() => changeSpeed(0, 90)}
        onBlurCapture={() => changeSpeed(DEFAULT_SPEED, 180)}
      >
        <ol ref={trackRef} className={styles.moduleSequence} aria-label="Caregiver lessons">
          {lessonCards}
        </ol>
      </div>
    </section>
  );
}
