"use client";

import { ArrowRight, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "@/features/progress/components/journey-progress-experience.module.css";
import type {
  CompletedLessonHistoryEntry,
  ProgressMilestone,
  ProgressViewModel,
} from "@/features/progress/types/progress";
import { formatDateSafely } from "@/lib/dates/format-date";
import { cn } from "@/lib/utils";

type Achievement = { dayNumber: number; xpAwarded: number } | null;

const phases = [
  { dayRange: "Days 1–5", maximumDay: 5, minimumDay: 1, number: 1, title: "Foundations" },
  { dayRange: "Days 6–10", maximumDay: 10, minimumDay: 6, number: 2, title: "Daily tools" },
  { dayRange: "Days 11–14", maximumDay: 14, minimumDay: 11, number: 3, title: "Looking ahead" },
] as const;

function hasReducedMotion() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.querySelector('[data-reduced-motion="true"]') !== null
  );
}

function useJourneyEntrance(
  targetPercentage: number,
  targetXp: number,
  completedLessons: number,
  totalLessons: number,
  achievement: Achievement,
) {
  const startPercentage = achievement
    ? Math.round((Math.max(0, completedLessons - 1) / totalLessons) * 100)
    : 0;
  const startXp = achievement ? Math.max(0, targetXp - achievement.xpAwarded) : 0;
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (hasReducedMotion()) {
      setEntered(true);
      return;
    }

    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [achievement, startPercentage, startXp, targetPercentage, targetXp]);

  return { entered, startPercentage, startXp };
}

function AnimatedNumber({
  className,
  duration,
  from,
  live = false,
  to,
}: {
  className: string | undefined;
  duration: number;
  from: number;
  live?: boolean;
  to: number;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const numberElement = numberRef.current;
    if (!numberElement) return;

    if (hasReducedMotion() || from === to) {
      numberElement.textContent = String(to);
      return;
    }

    const startedAt = performance.now();
    let frame = 0;
    let lastPaintedAt = -Infinity;

    function tick(now: number) {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      if (elapsed === 1 || now - lastPaintedAt >= 34) {
        const activeNumberElement = numberRef.current;
        if (!activeNumberElement) return;
        const eased = 1 - Math.pow(1 - elapsed, 3);
        activeNumberElement.textContent = String(Math.round(from + (to - from) * eased));
        lastPaintedAt = now;
      }
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, from, to]);

  return (
    <span aria-live={live ? "polite" : "off"} className={className} ref={numberRef}>
      {from}
    </span>
  );
}

function ProgressRing({
  entered,
  startValue,
  value,
}: {
  entered: boolean;
  startValue: number;
  value: number;
}) {
  const visibleValue = entered ? value : startValue;

  return (
    <div
      aria-label={`${value} percent of learning journey completed`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value}
      className={styles.ring}
      role="progressbar"
    >
      <svg aria-hidden="true" className={styles.ringSvg} viewBox="0 0 180 180">
        <circle className={styles.ringTrack} cx="90" cy="90" fill="none" r="78" />
        <circle
          className={styles.ringValue}
          cx="90"
          cy="90"
          fill="none"
          pathLength="100"
          r="78"
          style={{ strokeDashoffset: 100 - visibleValue }}
        />
      </svg>
      <span className={styles.ringNumber}>
        <AnimatedNumber
          className={styles.ringNumberValue}
          duration={950}
          from={startValue}
          to={value}
        />
        %
      </span>
      <span className={styles.ringLabel}>Explored</span>
    </div>
  );
}

function phaseForDay(day: number) {
  return phases.find((phase) => day >= phase.minimumDay && day <= phase.maximumDay);
}

function formatDate(value: string) {
  return formatDateSafely(value, { day: "numeric", month: "short", year: "numeric" });
}

function LessonRow({
  achievement,
  completion,
  milestone,
}: {
  achievement: boolean;
  completion: CompletedLessonHistoryEntry | undefined;
  milestone: ProgressMilestone;
}) {
  const completed = milestone.state === "completed";
  const current = milestone.state === "current";
  const content = (
    <>
      <span
        className={cn(styles.lessonMarker, completed && styles.lessonMarkerComplete)}
        data-achievement={achievement ? "true" : "false"}
      >
        {completed ? (
          <Check aria-hidden="true" />
        ) : current ? (
          <ArrowRight aria-hidden="true" />
        ) : null}
      </span>
      <span className={styles.lessonCopy}>
        <span className={styles.lessonMeta}>
          Day {milestone.dayNumber}
          {current ? " · Next lesson" : ""}
        </span>
        <span className={cn(styles.lessonTitle, milestone.state === "locked" && styles.quiet)}>
          {milestone.lessonTitle ?? "Future lesson"}
        </span>
        {completion ? (
          <span className={styles.lessonDetail}>
            {formatDate(completion.completedAt)} · {completion.xpAwarded} XP
          </span>
        ) : null}
      </span>
      {(completed || current) && <ArrowRight aria-hidden="true" className={styles.rowArrow} />}
    </>
  );

  return (
    <li className={styles.lessonItem}>
      {completed || current ? (
        <Link
          aria-label={`${completed ? "Review" : "Continue"} day ${milestone.dayNumber}: ${milestone.lessonTitle}`}
          className={styles.lessonLink}
          href={`/lessons/${milestone.dayNumber}`}
        >
          {content}
        </Link>
      ) : (
        <div className={styles.lessonLocked}>{content}</div>
      )}
    </li>
  );
}

export function JourneyProgressExperience({
  achievement,
  data,
}: {
  achievement: Achievement;
  data: ProgressViewModel;
}) {
  const { entered, startPercentage, startXp } = useJourneyEntrance(
    Math.round(data.percentage),
    data.totalLearningXp,
    data.completedLessons,
    data.totalLessons,
    achievement,
  );
  const currentLesson = data.milestones.find((milestone) => milestone.state === "current");
  const currentPhase = currentLesson ? phaseForDay(currentLesson.dayNumber) : phases.at(-1);
  const [openPhase, setOpenPhase] = useState<number>(currentPhase?.number ?? 1);
  const completionByDay = useMemo(
    () => new Map(data.completedLessonsHistory.map((entry) => [entry.dayNumber, entry])),
    [data.completedLessonsHistory],
  );
  const achievementPhase = achievement ? phaseForDay(achievement.dayNumber) : undefined;
  const completedPhase = achievementPhase?.maximumDay === achievement?.dayNumber;
  const lessonsLeftInPhase = currentPhase
    ? data.milestones.filter(
        (milestone) =>
          milestone.dayNumber >= currentPhase.minimumDay &&
          milestone.dayNumber <= currentPhase.maximumDay &&
          milestone.state !== "completed",
      ).length
    : 0;
  const visiblePercentage = entered ? Math.round(data.percentage) : startPercentage;

  useEffect(() => {
    if (!achievement || hasReducedMotion()) return;
    window.history.replaceState(window.history.state, "", "/progress");
  }, [achievement]);

  return (
    <div className={styles.experience} data-achievement={achievement ? "true" : "false"}>
      <section aria-labelledby="progress-overview" className={styles.overview}>
        <ProgressRing
          entered={entered}
          startValue={startPercentage}
          value={Math.round(data.percentage)}
        />
        <div className={styles.overviewCopy}>
          <p className="editorial-eyebrow">Your {data.totalLessons}-day journey</p>
          <div className={styles.overviewHeadingRow}>
            <div>
              <h2 className={styles.overviewTitle} id="progress-overview">
                Journey overview
              </h2>
              <p className={styles.journeyTitle}>{data.journeyTitle}</p>
            </div>
            <p aria-live={achievement ? "polite" : "off"} className={styles.lessonCount}>
              {data.completedLessons} of {data.totalLessons} lessons complete
            </p>
          </div>
          <div
            aria-label={`${data.completedLessons} of ${data.totalLessons} lessons complete`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={Math.round(data.percentage)}
            className={styles.progressTrack}
            role="progressbar"
          >
            <span
              className={styles.progressValue}
              style={{ transform: `scaleX(${visiblePercentage / 100})` }}
            />
          </div>
          <div className={styles.overviewFoot}>
            <p>
              {data.journeyComplete
                ? "Your full learning journey is ready to revisit."
                : lessonsLeftInPhase === 1
                  ? `One lesson left in ${currentPhase?.title}.`
                  : `${lessonsLeftInPhase} lessons remain in ${currentPhase?.title}.`}
            </p>
            <div className={styles.xp}>
              <AnimatedNumber
                className={styles.xpNumber}
                duration={950}
                from={startXp}
                live={Boolean(achievement)}
                to={data.totalLearningXp}
              />
              <span>
                <strong>Learning XP</strong>
                <small>Lesson progress, not medical progress.</small>
              </span>
              {achievement && achievement.xpAwarded > 0 ? (
                <span className={styles.xpGain}>+{achievement.xpAwarded}</span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {currentLesson ? (
        <section aria-labelledby="continue-journey" className={styles.continueSection}>
          <p className="editorial-eyebrow">Continue your journey</p>
          <Link className={styles.continueRow} href={`/lessons/${currentLesson.dayNumber}`}>
            <span className={styles.continueCopy}>
              <span className={styles.continueMeta}>
                Day {currentLesson.dayNumber} · {currentPhase?.title}
              </span>
              <span className={styles.continueTitle} id="continue-journey">
                {currentLesson.lessonTitle}
              </span>
              {currentLesson.subtitle ? (
                <span className={styles.continueDescription}>{currentLesson.subtitle}</span>
              ) : null}
            </span>
            <span className={styles.continueAction}>
              <span>About {currentLesson.estimatedMinutes} min</span>
              <strong>
                Continue <ArrowRight aria-hidden="true" />
              </strong>
            </span>
          </Link>
        </section>
      ) : null}

      {completedPhase && achievementPhase ? (
        <aside aria-live="polite" className={styles.phaseCompletion}>
          <p className="editorial-eyebrow">{achievementPhase.title} complete</p>
          <p>
            {achievementPhase.number === 1
              ? "You’ve learned the essentials. Next, you’ll start applying them to everyday decisions."
              : achievementPhase.number === 2
                ? "You’ve built a practical toolkit. Next, you’ll look toward confident long-term care."
                : "You’ve completed the full learning journey. Your lessons remain here whenever you want to return."}
          </p>
          {currentLesson ? (
            <Link href={`/lessons/${currentLesson.dayNumber}`}>
              Continue to {currentPhase?.title} <ArrowRight aria-hidden="true" />
            </Link>
          ) : null}
        </aside>
      ) : null}

      <section aria-labelledby="learning-record-title" className={styles.record}>
        <div className={styles.recordHeading}>
          <div>
            <h2 className={styles.recordTitle} id="learning-record-title">
              Your learning record
            </h2>
            <p>Follow the path, revisit completed lessons, or open what comes next.</p>
          </div>
        </div>

        <div className={styles.timeline}>
          <span aria-hidden="true" className={styles.timelineTrack} />
          <span
            aria-hidden="true"
            className={styles.timelineValue}
            style={{ transform: `scaleY(${visiblePercentage / 100})` }}
          />
          {phases.map((phase, index) => {
            const phaseMilestones = data.milestones.filter(
              (milestone) =>
                milestone.dayNumber >= phase.minimumDay && milestone.dayNumber <= phase.maximumDay,
            );
            const completedInPhase = phaseMilestones.filter(
              (milestone) => milestone.state === "completed",
            ).length;
            const phaseComplete = completedInPhase === phaseMilestones.length;
            const phaseCurrent =
              !phaseComplete && phaseMilestones.some((item) => item.state === "current");
            const open = openPhase === phase.number;

            return (
              <article
                className={styles.phase}
                data-state={phaseComplete ? "completed" : phaseCurrent ? "current" : "future"}
                key={phase.number}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span aria-hidden="true" className={styles.phaseNode}>
                  {phaseComplete ? <Check /> : null}
                </span>
                <button
                  aria-controls={`learning-phase-${phase.number}`}
                  aria-expanded={open}
                  className={styles.phaseButton}
                  onClick={() => setOpenPhase(open ? 0 : phase.number)}
                  type="button"
                >
                  <span className={styles.phaseNumber}>0{phase.number}</span>
                  <span className={styles.phaseHeadingCopy}>
                    <span className={styles.phaseTitle}>{phase.title}</span>
                    <span className={styles.phaseMeta}>
                      {phase.dayRange} · {completedInPhase} of {phaseMilestones.length} complete
                      {phaseCurrent ? <em>Current</em> : null}
                    </span>
                  </span>
                  <ChevronDown aria-hidden="true" className={styles.chevron} />
                </button>
                <div className={styles.phaseReveal} data-open={open ? "true" : "false"}>
                  <div>
                    <ol className={styles.lessonList} id={`learning-phase-${phase.number}`}>
                      {phaseMilestones.map((milestone) => (
                        <LessonRow
                          achievement={achievement?.dayNumber === milestone.dayNumber}
                          completion={completionByDay.get(milestone.dayNumber)}
                          key={milestone.dayNumber}
                          milestone={milestone}
                        />
                      ))}
                    </ol>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
