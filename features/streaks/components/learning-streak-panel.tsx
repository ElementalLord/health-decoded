"use client";

import { useEffect } from "react";

import {
  acknowledgeLearningStreakNoticeAction,
  captureBrowserTimezoneAction,
} from "@/features/streaks/actions/learning-streak.actions";
import type { LearningStreak } from "@/features/streaks/types/learning-streak";
import { StreakFlame } from "@/features/streaks/components/streak-flame";

export function LearningStreakPanel({ streak }: { streak: LearningStreak }) {
  useEffect(() => {
    if (streak.pendingNotice) void acknowledgeLearningStreakNoticeAction();
  }, [streak.pendingNotice]);

  useEffect(() => {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (browserTimezone) void captureBrowserTimezoneAction(browserTimezone);
  }, []);

  const dayLabel = streak.currentStreak === 1 ? "day" : "days";
  const freezeLabel = streak.freezeBalance === 1 ? "freeze" : "freezes";
  const isFirstDay = streak.currentStreak === 1 && streak.longestStreak === 1;
  const streakHeading =
    streak.currentStreak === 0
      ? "Your first learning day starts when you do"
      : isFirstDay
        ? "Your learning streak starts today"
        : `${streak.currentStreak} learning ${dayLabel} in a row`;
  return (
    <section
      aria-labelledby="learning-streak-heading"
      className="border-y border-border py-5 lg:mt-4"
    >
      <div className="flex items-center gap-3">
        <StreakFlame active={streak.isStreakActive} />
        <div>
          <p className="editorial-eyebrow">Learning streak</p>
          <h2 className="mt-1 font-serif-display text-2xl" id="learning-streak-heading">
            {streakHeading}
          </h2>
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {streak.currentStreak === 0
          ? "You’re at the start. Nothing is behind, and there is no deadline."
          : "This reflects activity in Health Decoded, not your health or treatment progress."}
      </p>
      <div className="mt-4 border-t border-border pt-3">
        <p className="text-sm font-medium">
          {streak.freezeBalance} streak {freezeLabel} available
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          A freeze is used automatically when it can protect a missed day.
        </p>
      </div>
      {streak.pendingNotice ? (
        <p aria-live="polite" className="mt-4 text-sm font-medium" role="status">
          {streak.pendingNotice === "freeze_used"
            ? "A streak freeze covered the missed day."
            : "Today starts a new learning streak."}
        </p>
      ) : null}
    </section>
  );
}
