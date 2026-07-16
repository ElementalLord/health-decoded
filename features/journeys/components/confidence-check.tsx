"use client";

import { Check } from "lucide-react";
import { useActionState } from "react";

import {
  saveConfidenceCheckInAction,
  type ConfidenceActionState,
} from "@/features/journeys/actions/confidence.actions";
import type { ConfidenceLevel } from "@/features/journeys/types/journey-home";
import { cn } from "@/lib/utils";

const options: readonly { label: string; value: ConfidenceLevel }[] = [
  { label: "Not very confident", value: "not_yet" },
  { label: "Getting there", value: "somewhat" },
  { label: "Pretty confident", value: "confident" },
];

export function ConfidenceCheck({
  lessonProgressId,
  initialValue,
}: {
  lessonProgressId: string;
  initialValue: ConfidenceLevel | null;
}) {
  const initialState: ConfidenceActionState = {
    status: "idle",
    message: null,
    savedValue: initialValue,
  };
  const [state, action, pending] = useActionState(saveConfidenceCheckInAction, initialState);

  return (
    <section
      aria-labelledby="confidence-check-title"
      className="border-y border-border bg-[#f0ebe3] px-5 py-8 sm:px-8 sm:py-10"
    >
      <div className="space-y-5">
        <div className="space-y-1">
          <h2
            className="font-serif-display text-[length:var(--text-feature-title)] font-medium leading-tight"
            id="confidence-check-title"
          >
            How confident do you feel today?
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            This is optional. Choose what feels closest right now.
          </p>
        </div>

        <form action={action}>
          <input name="lessonProgressId" type="hidden" value={lessonProgressId} />
          <fieldset disabled={pending}>
            <legend className="sr-only">Choose your confidence level</legend>
            <div className="grid gap-2 sm:grid-cols-3" role="group">
              {options.map((option) => {
                const selected = state.savedValue === option.value;

                return (
                  <button
                    aria-pressed={selected}
                    className={cn(
                      "flex min-h-14 items-center justify-between gap-3 rounded-[9px] border border-border bg-card px-4 py-3 text-left text-sm font-semibold text-foreground shadow-[0_2px_0_rgb(61_47_41/0.08)] transition hover:-translate-y-0.5 hover:border-accent-warm focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      selected && "border-accent-warm bg-[#f6e7df] text-primary",
                    )}
                    disabled={pending}
                    key={option.value}
                    name="confidenceLevel"
                    type="submit"
                    value={option.value}
                  >
                    <span>{option.label}</span>
                    {selected ? (
                      <Check aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.5} />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </form>

        <p
          aria-live="polite"
          className={cn(
            "min-h-6 text-sm",
            state.status === "error" ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {pending ? "Saving your check-in…" : state.message}
        </p>
      </div>
    </section>
  );
}
