"use client";

import { useEffect } from "react";

import {
  acknowledgeLearningStreakNoticeAction,
  captureBrowserTimezoneAction,
} from "@/features/streaks/actions/learning-streak.actions";
import type { LearningStreak } from "@/features/streaks/types/learning-streak";

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
  return (
    <section
      aria-labelledby="learning-streak-heading"
      className="border-t border-border pt-5 lg:mt-2"
    >
      <p className="editorial-eyebrow">Learning streak</p>
      <h2 className="mt-2 font-serif-display text-2xl" id="learning-streak-heading">
        {streak.currentStreak} learning {dayLabel} in a row
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This reflects activity in Health Decoded, not your health or treatment progress.
      </p>
      <p className="mt-4 text-sm font-medium">
        {streak.freezeBalance} streak {freezeLabel} available
      </p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        A freeze is used automatically when it can protect a missed day.
      </p>
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
