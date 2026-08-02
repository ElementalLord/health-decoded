"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlossaryError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-2xl space-y-5 py-12">
      <p className="editorial-eyebrow">Medical Glossary</p>
      <h1 className="font-serif-display text-4xl font-medium">The glossary could not open</h1>
      <p className="leading-7 text-muted-foreground">
        Try opening the glossary again or return to Resources.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button fullWidth={false} onClick={reset}>
          Try again
        </Button>
        <Link
          className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
          href="/resources"
        >
          Return to Resources
        </Link>
      </div>
    </section>
  );
}
