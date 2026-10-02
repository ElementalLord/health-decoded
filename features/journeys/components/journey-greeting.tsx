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
  const title = firstVisit ? `Welcome, ${name}` : `Welcome back, ${name}`;
  const message = firstVisit
    ? "Your first lesson is ready. Most lessons take about eight minutes, and your place is saved automatically."
    : journeyComplete
      ? `You completed all ${totalLessons} lessons in the Foundation phase. You can now revisit any lesson or use the practice tools.`
      : currentLessonStatus === "in_progress"
        ? "Your place is saved. Continue from where you stopped."
        : completedLessons > 0
          ? `You’ve completed ${completedLessons} ${completedLessons === 1 ? "lesson" : "lessons"}. Your next lesson is ready.`
          : "Your first lesson is ready. There is no deadline.";

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
