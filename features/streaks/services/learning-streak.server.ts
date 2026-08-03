import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import type {
  LearningStreak,
  QualifyingLearningEvent,
} from "@/features/streaks/types/learning-streak";
import { getServerDatabaseClient } from "@/lib/database/server";
import { unexpectedError } from "@/lib/errors/application-error";
import { createServerLogger } from "@/lib/logging/server";
import { err, ok, type Result } from "@/lib/result/result";

const logger = createServerLogger();

type StreakRow = {
  current_streak: number;
  longest_streak: number;
  freeze_balance: number;
  last_qualified_date: string | null;
  timezone: string;
  pending_notice: string | null;
};

function mapStreak(row: StreakRow): LearningStreak | null {
  if (
    !Number.isInteger(row.current_streak) ||
    !Number.isInteger(row.longest_streak) ||
    !Number.isInteger(row.freeze_balance) ||
    row.current_streak < 0 ||
    row.longest_streak < row.current_streak ||
    row.freeze_balance < 0 ||
    !row.timezone ||
    (row.pending_notice !== null &&
      row.pending_notice !== "freeze_used" &&
      row.pending_notice !== "streak_reset")
  ) {
    return null;
  }
  return {
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    freezeBalance: row.freeze_balance,
    lastQualifiedDate: row.last_qualified_date,
    timezone: row.timezone,
    pendingNotice: row.pending_notice,
  };
}

export async function recordQualifyingLearningActivity(event: QualifyingLearningEvent) {
  const database = await getServerDatabaseClient();
  const response = await database.rpc("record_learning_activity", { p_event_type: event });
  const mapped = response.data?.[0] ? mapStreak(response.data[0]) : null;
  if (response.error || !mapped) {
    logger.error("learning_streak.record_failed", { error_code: response.error?.code });
    return err(unexpectedError());
  }
  return ok(mapped);
}

export async function getLearningStreak(): Promise<Result<LearningStreak>> {
  noStore();
  const user = await getAuthenticatedUser();
  if (!user.ok) return err(user.error);
  const database = await getServerDatabaseClient();
  const response = await database.rpc("initialize_learning_streak");
  const mapped = response.data?.[0] ? mapStreak(response.data[0]) : null;
  return response.error || !mapped ? err(unexpectedError()) : ok(mapped);
}
