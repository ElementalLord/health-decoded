"use client";

import dynamic from "next/dynamic";

import { StandardLessonPlayer } from "@/features/lessons/components/standard-lesson-player";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";

function ExperienceLoading() {
  return (
    <section
      aria-busy="true"
      className="mx-auto flex min-h-[60dvh] max-w-[920px] items-center justify-center py-12"
      role="status"
    >
      <p className="text-sm text-muted-foreground">Preparing today&apos;s lesson…</p>
    </section>
  );
}

const FirstFiveMinutesExperience = dynamic(
  () =>
    import("@/features/lessons/components/first-five-minutes-experience").then(
      (module) => module.FirstFiveMinutesExperience,
    ),
  { loading: ExperienceLoading },
);

const DayTwoExperience = dynamic(
  () =>
    import("@/features/lessons/components/day-two-experience").then(
      (module) => module.DayTwoExperience,
    ),
  { loading: ExperienceLoading },
);

const DayThreeExperience = dynamic(
  () =>
    import("@/features/lessons/components/day-three-experience").then(
      (module) => module.DayThreeExperience,
    ),
  { loading: ExperienceLoading },
);

const DayFourExperience = dynamic(
  () =>
    import("@/features/lessons/components/day-four-experience").then(
      (module) => module.DayFourExperience,
    ),
  { loading: ExperienceLoading },
);

export function LessonPlayer({ lesson }: { lesson: LessonPlayerViewModel }) {
  if (lesson.dayNumber === 1) return <FirstFiveMinutesExperience lesson={lesson} />;
  if (lesson.dayNumber === 2) return <DayTwoExperience lesson={lesson} />;
  if (lesson.dayNumber === 3) return <DayThreeExperience lesson={lesson} />;
  if (lesson.dayNumber === 4) return <DayFourExperience lesson={lesson} />;
  return <StandardLessonPlayer lesson={lesson} />;
}
