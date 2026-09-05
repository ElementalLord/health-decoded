"use client";

import type { CSSProperties, FocusEvent } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { caregiverLandingContent, caregiverLandingRoutes } from "../../content/caregiver-landing";
import { getImplementedCaregiverModuleById } from "../../content/caregiver-module-registry";
import styles from "../../styles/caregiver-landing.module.css";

const lessonArtwork = [
  "/caregiver/landing/listen-with-curiosity-v2.jpg",
  "/caregiver/landing/support-with-permission-v2.jpg",
  "/caregiver/landing/everyday-support-v2.jpg",
  "/caregiver/landing/know-the-plan-v2.jpg",
  "/caregiver/landing/caregiver-matters-v2.jpg",
] as const;

const orbitDelays = ["0s", "-15s", "-30s", "-45s", "-60s"] as const;

const lessonLabels = [
  "Understand their feelings",
  "Support with permission",
  "Help with everyday life",
  "Know when to get help",
  "Care for your capacity",
] as const;

type OrbitStyle = CSSProperties & {
  "--orbit-delay": string;
};

const RESTING_RATE = 1;
const HOVER_RATE = 0;

function prefersLessMotion(element: HTMLElement) {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    element.closest('[data-reduced-motion="true"]') !== null
  );
}

export function CaregiverGuidedPath() {
  const { guidedPath } = caregiverLandingContent;
  const sequenceRef = useRef<HTMLOListElement>(null);
  const guideRef = useRef<SVGSVGElement>(null);
  const animationsRef = useRef<Animation[]>([]);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const rateRef = useRef(RESTING_RATE);
  const targetRateRef = useRef(RESTING_RATE);
  const velocityRef = useRef(0);

  function collectOrbitAnimations() {
    const sequence = sequenceRef.current;
    if (!sequence || prefersLessMotion(sequence)) return [];

    const itemAnimations = Array.from(sequence.children).flatMap((item) => item.getAnimations());
    const animations = [
      ...itemAnimations,
      ...(guideRef.current?.getAnimations({ subtree: true }) ?? []),
    ];
    animationsRef.current = animations;
    return animations;
  }

  function setPlaybackRate(rate: number) {
    const animations = animationsRef.current.length
      ? animationsRef.current
      : collectOrbitAnimations();

    for (const animation of animations) animation.playbackRate = rate;
  }

  function easeOrbitToward(targetRate: number) {
    const sequence = sequenceRef.current;
    if (!sequence || prefersLessMotion(sequence)) return;

    targetRateRef.current = targetRate;
    if (frameRef.current !== null) return;

    const step = (now: number) => {
      const previous = lastFrameRef.current ?? now;
      const delta = Math.min((now - previous) / 1000, 0.032);
      const stiffness = targetRateRef.current < rateRef.current ? 16 : 12;
      const damping = 2 * Math.sqrt(stiffness);
      const acceleration =
        stiffness * (targetRateRef.current - rateRef.current) - damping * velocityRef.current;

      velocityRef.current += acceleration * delta;
      rateRef.current += velocityRef.current * delta;
      lastFrameRef.current = now;
      setPlaybackRate(Math.max(HOVER_RATE, Math.min(RESTING_RATE, rateRef.current)));

      const settled =
        Math.abs(targetRateRef.current - rateRef.current) < 0.002 &&
        Math.abs(velocityRef.current) < 0.002;

      if (settled) {
        rateRef.current = targetRateRef.current;
        velocityRef.current = 0;
        lastFrameRef.current = null;
        frameRef.current = null;
        setPlaybackRate(rateRef.current);
        return;
      }

      frameRef.current = window.requestAnimationFrame(step);
    };

    frameRef.current = window.requestAnimationFrame(step);
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      easeOrbitToward(RESTING_RATE);
    }
  }

  useEffect(() => {
    const discoveryFrame = window.requestAnimationFrame(collectOrbitAnimations);

    return () => {
      window.cancelAnimationFrame(discoveryFrame);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section
      id="caregiver-guided-path"
      className={styles.guidedPath}
      aria-labelledby="caregiver-guided-path-title"
    >
      <div className={styles.guidedPathHeading}>
        <p className={styles.sectionNumber}>Five short lessons</p>
        <h2 id="caregiver-guided-path-title">{guidedPath.sectionTitle}</h2>
        <p>{guidedPath.introduction}</p>
      </div>

      <div className={styles.orbitHeart} aria-hidden="true">
        <Image
          className={styles.centerIllustration}
          src="/caregiver/landing/caregiver-embrace-v1.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="176px"
        />
      </div>

      <svg ref={guideRef} className={styles.orbitGuide} aria-hidden="true" viewBox="0 0 928 512">
        <defs>
          <mask
            id="caregiver-orbit-guide-mask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="928"
            height="512"
          >
            <rect width="928" height="512" fill="white" />
            <ellipse
              className={styles.orbitGuideCutouts}
              cx="464"
              cy="256"
              rx="462"
              ry="254"
              pathLength="100"
            />
          </mask>
        </defs>
        <ellipse
          className={styles.orbitGuideTrack}
          cx="464"
          cy="256"
          rx="462"
          ry="254"
          pathLength="100"
          mask="url(#caregiver-orbit-guide-mask)"
        />
      </svg>

      <ol ref={sequenceRef} className={styles.moduleSequence} aria-label="Caregiver lessons">
        {caregiverLandingRoutes.map((route, index) => {
          const implementedModule = getImplementedCaregiverModuleById(route.id);
          const orbitStyle = {
            "--orbit-delay": orbitDelays[index]!,
          } as OrbitStyle;

          return (
            <li key={route.id} style={orbitStyle} data-caregiver-destination={route.id}>
              <div className={styles.orbitCounter}>
                <div className={styles.orbitCorrection}>
                  {implementedModule ? (
                    <Link
                      className={styles.moduleCardLink}
                      href={implementedModule.route}
                      aria-label={`Open lesson ${route.order}: ${route.moduleTitle}`}
                      onPointerEnter={() => easeOrbitToward(HOVER_RATE)}
                      onPointerLeave={() => easeOrbitToward(RESTING_RATE)}
                      onFocus={() => easeOrbitToward(HOVER_RATE)}
                      onBlur={handleBlur}
                    >
                      <article className={styles.moduleCard}>
                        <div className={styles.moduleArtwork} aria-hidden="true">
                          <Image
                            src={lessonArtwork[index]!}
                            alt=""
                            aria-hidden="true"
                            fill
                            sizes="(max-width: 1024px) 176px, 160px"
                          />
                          <span className={styles.moduleOrder}>
                            {String(route.order).padStart(2, "0")}
                          </span>
                        </div>

                        <div className={styles.moduleCardCopy}>
                          <div className={styles.moduleCardHeader}>
                            <span>Lesson {route.order}</span>
                            <span className={styles.moduleTime}>{route.time}</span>
                          </div>
                          <h3>
                            {lessonLabels[index]!}
                            <ArrowUpRight className={styles.moduleArrow} aria-hidden="true" />
                          </h3>
                        </div>
                      </article>
                    </Link>
                  ) : (
                    <article className={styles.moduleCard}>
                      <div className={styles.moduleArtwork} aria-hidden="true">
                        <Image
                          src={lessonArtwork[index]!}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="(max-width: 1024px) 176px, 160px"
                        />
                        <span className={styles.moduleOrder}>
                          {String(route.order).padStart(2, "0")}
                        </span>
                      </div>
                      <div className={styles.moduleCardCopy}>
                        <h3>{lessonLabels[index]!}</h3>
                      </div>
                    </article>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
