import { Clock3 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CurrentLessonSummary } from "@/features/journeys/types/journey-home";

const statusLabels = {
  not_started: "Ready to start",
  in_progress: "In progress",
  completed: "Completed",
} as const;

const actionLabels = {
  not_started: "Start today’s lesson",
  in_progress: "Continue today’s lesson",
  completed: "Review completed lesson",
} as const;

export function TodaysLessonCard({ lesson }: { lesson: CurrentLessonSummary }) {
  const title = lesson.isDevelopmentContent ? "Lesson preview" : lesson.title;
  const subtitle = lesson.isDevelopmentContent ? null : lesson.subtitle;
  const actionLabel = lesson.isDevelopmentContent
    ? "Open lesson preview"
    : actionLabels[lesson.status];

  return (
    <Card className="rounded-2xl p-5 sm:p-7 lg:p-8">
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.36fr)] lg:items-end">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="info">Day {lesson.dayNumber}</Badge>
            <Badge>{statusLabels[lesson.status]}</Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary">Today&apos;s lesson</p>
            <h2 className="max-w-3xl break-words text-[length:var(--text-feature-title)] font-semibold tracking-[-0.02em]">
              {title}
            </h2>
            {subtitle ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 aria-hidden="true" className="size-4" />
            About {lesson.estimatedMinutes} minutes
          </p>
        </div>

        <div className="space-y-2">
          <Link className={buttonVariants({ size: "lg" })} href={`/lessons/${lesson.dayNumber}`}>
            {actionLabel}
          </Link>
          <p className="text-center text-[length:var(--text-caption)] leading-5 text-muted-foreground">
            Take this lesson at your own pace.
          </p>
        </div>
      </div>
    </Card>
  );
}
