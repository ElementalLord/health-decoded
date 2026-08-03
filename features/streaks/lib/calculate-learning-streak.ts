import type { LearningStreak, StreakCalculation } from "@/features/streaks/types/learning-streak";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function dayNumber(value: string) {
  if (!datePattern.test(value)) return null;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isNaN(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value
    ? null
    : Math.floor(timestamp / 86_400_000);
}

export function calculateLearningStreak(
  state: LearningStreak,
  activityDate: string,
): StreakCalculation {
  const activityDay = dayNumber(activityDate);
  const lastDay = state.lastQualifiedDate ? dayNumber(state.lastQualifiedDate) : null;
  if (activityDay === null || (state.lastQualifiedDate && lastDay === null)) {
    throw new Error("Learning streak dates must be valid calendar dates.");
  }

  if (lastDay !== null && activityDay <= lastDay) {
    return { ...state, dayRecorded: false, freezeUsed: 0 };
  }

  if (lastDay === null || state.currentStreak === 0) {
    return {
      ...state,
      currentStreak: 1,
      longestStreak: Math.max(state.longestStreak, 1),
      lastQualifiedDate: activityDate,
      pendingNotice: null,
      dayRecorded: true,
      freezeUsed: 0,
    };
  }

  const missedDays = activityDay - lastDay - 1;
  if (missedDays <= state.freezeBalance) {
    const currentStreak = state.currentStreak + missedDays + 1;
    return {
      ...state,
      currentStreak,
      longestStreak: Math.max(state.longestStreak, currentStreak),
      freezeBalance: state.freezeBalance - missedDays,
      lastQualifiedDate: activityDate,
      pendingNotice: missedDays > 0 ? "freeze_used" : null,
      dayRecorded: true,
      freezeUsed: missedDays,
    };
  }

  return {
    ...state,
    currentStreak: 1,
    longestStreak: Math.max(state.longestStreak, 1),
    lastQualifiedDate: activityDate,
    pendingNotice: "streak_reset",
    dayRecorded: true,
    freezeUsed: 0,
  };
}
