type JourneyGreetingProps = {
  displayName: string | null;
};

export function JourneyGreeting({ displayName }: JourneyGreetingProps) {
  const name = displayName?.trim() || "there";

  return (
    <header className="space-y-2">
      <h1 className="break-words text-[length:var(--text-page-title)] font-semibold tracking-[-0.02em]">
        Welcome back, {name}
      </h1>
      <p className="max-w-2xl text-[length:var(--text-supporting)] leading-7 text-muted-foreground">
        Your next lesson and recent progress are ready below.
      </p>
    </header>
  );
}
