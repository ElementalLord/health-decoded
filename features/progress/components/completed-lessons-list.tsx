import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { CompletedLessonHistoryEntry } from "@/features/progress/types/progress";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function CompletedLessonsList({ entries }: { entries: CompletedLessonHistoryEntry[] }) {
  return (
    <Card className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-[length:var(--text-section-title)] font-semibold tracking-tight">
          Completed lessons
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Review any completed lesson whenever it feels helpful.
        </p>
      </div>

      {entries.length ? (
        <ul className="divide-y divide-border">
          {entries.map((entry) => (
            <li
              className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
              key={entry.dayNumber}
            >
              <div>
                <p className="font-medium">
                  Day {entry.dayNumber}: {entry.lessonTitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  Completed {formatDate(entry.completedAt)} · {entry.xpAwarded} Confidence XP
                  {entry.confidenceLabel ? ` · ${entry.confidenceLabel}` : ""}
                </p>
              </div>
              <Link
                className="min-h-11 self-start rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:self-auto"
                href={`/lessons/${entry.dayNumber}`}
              >
                Review lesson
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">
          Your progress will appear here after you complete your first lesson.
        </p>
      )}
    </Card>
  );
}
