type JourneyGreetingProps = {
  completedLessons: number;
  currentLessonStatus: "not_started" | "in_progress" | "completed" | undefined;
  displayName: string | null;
  firstVisit?: boolean;
  journeyComplete?: boolean;
  totalLessons: number;
};

export function JourneyGreeting({
  completedLessons,
  currentLessonStatus,
  displayName,
  firstVisit = false,
  journeyComplete = false,
  totalLessons,
}: JourneyGreetingProps) {
  const name = displayName?.trim() || "there";
  const title = firstVisit ? `You’re in the right place, ${name}` : `Welcome back, ${name}`;
  const message = firstVisit
    ? "Nothing here needs to happen all at once. Your first calm lesson is ready whenever you are."
    : journeyComplete
      ? `You completed all ${totalLessons} lessons. Everything you learned is here whenever you want another look.`
      : currentLessonStatus === "in_progress"
        ? "Your place is saved. Continue from exactly where you stopped, whenever it feels right."
        : completedLessons > 0
          ? `You’ve completed ${completedLessons} ${completedLessons === 1 ? "lesson" : "lessons"}. Today is one more small step, not a test.`
          : "One calm lesson is ready when you are. There is no deadline and no perfect pace.";

  return (
    <header className="motion-cascade space-y-4 border-b border-border pb-8">
      <p className="editorial-eyebrow">Today&apos;s Journey</p>
      <h1 className="break-words font-serif-display text-[length:var(--text-page-title)] font-normal leading-[0.96] text-balance">
        {title}
      </h1>
      <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">{message}</p>
    </header>
  );
}
