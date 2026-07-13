import { Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CurrentLessonSummary } from "@/features/journeys/types/journey-home";

const statusLabels = {
  not_started: "Ready to start",
  in_progress: "In progress",
  completed: "Completed",
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
          <Button disabled size="lg">
            Lesson experience coming next
          </Button>
          <p className="text-center text-xs leading-5 text-muted-foreground">
            Your lesson will open when the lesson experience is ready.
          </p>
        </div>
      </div>
    </Card>
  );
}
