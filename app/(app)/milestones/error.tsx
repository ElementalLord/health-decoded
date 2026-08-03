"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function MilestonesError({ reset }: { error: Error; reset: () => void }) {
  return <section className="mx-auto max-w-2xl space-y-5 py-12"><p className="editorial-eyebrow">Milestones</p><h1 className="font-serif-display text-4xl font-medium">Milestones could not open</h1><p>Try again or return to your Journey.</p><div className="flex gap-3"><Button fullWidth={false} onClick={reset}>Try again</Button><Link className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4" href="/journey">Return to Journey</Link></div></section>;
}
