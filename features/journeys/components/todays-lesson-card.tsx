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
  return (
    <Card className="border-primary/25 bg-card p-6 shadow-card sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="info">Day {lesson.dayNumber}</Badge>
            <Badge>{statusLabels[lesson.status]}</Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
              Today&apos;s Journey
            </p>
            <h2 className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
              {lesson.title}
            </h2>
            {lesson.subtitle ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                {lesson.subtitle}
              </p>
            ) : null}
          </div>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 aria-hidden="true" className="size-4" />
            About {lesson.estimatedMinutes} minutes
          </p>
        </div>

        <div className="space-y-2 lg:w-64">
          <Link className={buttonVariants({ size: "lg" })} href={`/lessons/${lesson.dayNumber}`}>
            {actionLabels[lesson.status]}
          </Link>
          <p className="text-center text-xs leading-5 text-muted-foreground">
            Take this lesson at your own pace.
          </p>
        </div>
      </div>
    </Card>
  );
}
