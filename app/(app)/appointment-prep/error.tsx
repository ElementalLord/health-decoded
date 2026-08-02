"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AppointmentPreparationError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-2xl space-y-5 py-12">
      <p className="editorial-eyebrow">Appointment preparation</p>
      <h1 className="font-serif-display text-4xl font-medium">This workspace could not open</h1>
      <p className="leading-7 text-muted-foreground">
        Nothing from this workspace has been saved. You can try opening a fresh session or return to
        your journey.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button fullWidth={false} onClick={reset}>
          Try again
        </Button>
        <Link
          className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
          href="/journey"
        >
          Return to your journey
        </Link>
      </div>
    </section>
  );
}
