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

const DayFiveExperience = dynamic(
  () =>
    import("@/features/lessons/components/day-five-experience").then(
      (module) => module.DayFiveExperience,
    ),
  { loading: ExperienceLoading },
);

const DaySixExperience = dynamic(
  () =>
    import("@/features/lessons/components/day-six-experience").then(
      (module) => module.DaySixExperience,
    ),
  { loading: ExperienceLoading },
);

const DaySevenExperience = dynamic(
  () =>
    import("@/features/lessons/components/day-seven-experience").then(
      (module) => module.DaySevenExperience,
    ),
  { loading: ExperienceLoading },
);

const DayEightExperience = dynamic(
  () =>
    import("@/features/lessons/components/day-eight-experience").then(
      (module) => module.DayEightExperience,
    ),
  { loading: ExperienceLoading },
);

const DayNineExperience = dynamic(
  () =>
    import("@/features/lessons/components/day-nine-experience").then(
      (module) => module.DayNineExperience,
    ),
  { loading: ExperienceLoading },
);

const DayTenExperience = dynamic(
  () =>
    import("@/features/lessons/components/day-ten-experience").then(
      (module) => module.DayTenExperience,
    ),
  { loading: ExperienceLoading },
);

export function LessonPlayer({ lesson }: { lesson: LessonPlayerViewModel }) {
  if (lesson.dayNumber === 1) return <FirstFiveMinutesExperience lesson={lesson} />;
  if (lesson.dayNumber === 2) return <DayTwoExperience lesson={lesson} />;
  if (lesson.dayNumber === 3) return <DayThreeExperience lesson={lesson} />;
  if (lesson.dayNumber === 4) return <DayFourExperience lesson={lesson} />;
  if (lesson.dayNumber === 5) return <DayFiveExperience lesson={lesson} />;
  if (lesson.dayNumber === 6) return <DaySixExperience lesson={lesson} />;
  if (lesson.dayNumber === 7) return <DaySevenExperience lesson={lesson} />;
  if (lesson.dayNumber === 8) return <DayEightExperience lesson={lesson} />;
  if (lesson.dayNumber === 9) return <DayNineExperience lesson={lesson} />;
  if (lesson.dayNumber === 10) return <DayTenExperience lesson={lesson} />;
  return <StandardLessonPlayer lesson={lesson} />;
}
