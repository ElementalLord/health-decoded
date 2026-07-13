"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
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
    <section aria-labelledby="confidence-check-title" className="border-b border-border pb-8">
      <div className="max-w-3xl space-y-5">
        <div className="space-y-1">
          <h2
            className="text-[length:var(--text-section-title)] font-medium tracking-tight"
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
            <div className="divide-y divide-border border-y border-border">
              {options.map((option) => {
                const selected = state.savedValue === option.value;

                return (
                  <Button
                    aria-pressed={selected}
                    className={cn(
                      "min-h-12 justify-between rounded-none border-0 bg-transparent px-1 text-left text-foreground shadow-none hover:bg-muted/50",
                      selected && "bg-muted text-foreground",
                    )}
                    disabled={pending}
                    key={option.value}
                    name="confidenceLevel"
                    type="submit"
                    value={option.value}
                    variant="secondary"
                  >
                    <span>{option.label}</span>
                    {selected ? (
                      <span className="text-[length:var(--text-caption)] font-medium">
                        Selected
                      </span>
                    ) : null}
                  </Button>
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
