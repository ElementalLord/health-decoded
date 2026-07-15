import { Clock3 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CurrentLessonSummary } from "@/features/journeys/types/journey-home";
import { cn } from "@/lib/utils";

const statusLabels = {
  not_started: "Ready to start",
  in_progress: "In progress",
  completed: "Completed",
} as const;

const actionLabels = {
  not_started: "Start today's lesson",
  in_progress: "Continue today's lesson",
  completed: "Review completed lesson",
} as const;

export function TodaysLessonCard({ lesson }: { lesson: CurrentLessonSummary }) {
  const title = lesson.isDevelopmentContent ? "Lesson preview" : lesson.title;
  const subtitle = lesson.isDevelopmentContent ? null : lesson.subtitle;
  const actionLabel = lesson.isDevelopmentContent
    ? "Open lesson preview"
    : actionLabels[lesson.status];

  return (
    <Card className="rounded-[var(--radius-xl)] p-6 sm:p-8 lg:p-10">
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.36fr)] lg:items-end">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="info">Day {lesson.dayNumber}</Badge>
            <Badge>{statusLabels[lesson.status]}</Badge>
          </div>

          <div className="space-y-2.5">
            <p className="text-sm font-semibold text-primary">Today's lesson</p>
            <h2 className="break-words font-serif-display text-[length:var(--text-feature-title)] font-semibold tracking-[-0.02em] text-balance">
              {title}
            </h2>
            {subtitle ? (
              <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 aria-hidden="true" className="size-4" />
            About {lesson.estimatedMinutes} minutes
          </p>
        </div>

        <div className="space-y-2.5">
          <Link
            className={cn(buttonVariants({ size: "lg" }), "min-h-12")}
            href={`/lessons/${lesson.dayNumber}`}
          >
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
