type JourneyGreetingProps = {
  displayName: string | null;
  journeyComplete?: boolean;
};

export function JourneyGreeting({ displayName, journeyComplete = false }: JourneyGreetingProps) {
  const name = displayName?.trim() || "there";

  return (
    <header className="motion-cascade space-y-4 border-b border-border pb-8">
      <p className="editorial-eyebrow">Today&apos;s Journey</p>
      <h1 className="break-words font-serif-display text-[length:var(--text-page-title)] font-normal leading-[0.96] text-balance">
        Welcome back, {name}
      </h1>
      <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
        {journeyComplete
          ? "Your completed lessons are here whenever you want to revisit them."
          : "One calm lesson is ready when you are."}
      </p>
    </header>
  );
}
