import { redirect } from "next/navigation";

import { LessonPlayer } from "@/features/lessons/components/lesson-player";
import { LessonUnavailableState } from "@/features/lessons/components/lesson-unavailable-state";
import { lessonDaySchema } from "@/features/lessons/schemas/lesson-route.schema";
import { getAuthorizedLesson } from "@/features/lessons/services/lesson-player.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export const metadata = { title: "Lesson" };

export default async function LessonPage({ params }: { params: Promise<{ day: string }> }) {
  const { day: rawDay } = await params;
  const parsedDay = lessonDaySchema.safeParse(rawDay);
  if (!parsedDay.success) redirect("/journey");

  const profile = await getCurrentProfile();
  if (!profile.ok) {
    return <LessonUnavailableState />;
  }

  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const lesson = await getAuthorizedLesson(parsedDay.data);
  if (lesson.kind === "denied") redirect("/journey");
  if (lesson.kind === "unavailable") return <LessonUnavailableState />;

  return <LessonPlayer lesson={lesson.data} />;
}
