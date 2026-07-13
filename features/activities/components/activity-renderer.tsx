"use client";

import { MatchPairActivityView } from "@/features/activities/components/match-pair-activity";
import type { LessonActivity } from "@/features/activities/types/activity";
import type { RefObject } from "react";

export function ActivityRenderer({
  activity,
  headingRef,
  lessonProgressId,
  onComplete,
}: {
  activity: LessonActivity;
  headingRef?: RefObject<HTMLHeadingElement | null> | undefined;
  lessonProgressId: string;
  onComplete: () => void;
}) {
  switch (activity.type) {
    case "match_pair":
      return (
        <MatchPairActivityView
          activity={activity}
          headingRef={headingRef}
          lessonProgressId={lessonProgressId}
          onComplete={onComplete}
        />
      );
  }
}
