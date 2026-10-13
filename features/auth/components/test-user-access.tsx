"use client";

import { Unlock } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { testUserLoginAction } from "@/features/auth/actions/auth.actions";

export function TestUserAccess({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(testUserLoginAction, {
    status: "idle" as const,
    message: null,
  });

  return (
    <section
      aria-labelledby="test-user-title"
      className="rounded-2xl border-2 border-accent-warm/70 bg-accent-warm/10 p-5 shadow-[0_4px_0_rgb(126_79_45/0.16)]"
    >
      <p className="editorial-eyebrow text-center">Judges and reviewers</p>
      <form action={formAction} className="mt-3">
        <input name="next" type="hidden" value={next} />
        <Button
          className="min-h-20 rounded-xl px-6 text-xl leading-tight sm:text-2xl"
          disabled={pending}
          id="test-user-title"
          type="submit"
        >
          <Unlock aria-hidden="true" className="size-6 shrink-0" strokeWidth={2.25} />
          {pending ? "Opening full access…" : "Congressional App Challenge"}
        </Button>
      </form>
      <p className="mt-3 text-center text-sm leading-6 text-muted-foreground">
        Enter as Bob with every lesson, activity, and resource unlocked.
      </p>
      {state.message ? (
        <p
          aria-live="polite"
          className="motion-status mt-3 text-center text-sm text-destructive"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
