"use client";

import { type RefObject, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { evaluateMatchPairAction } from "@/features/activities/actions/activity.actions";
import type { MatchPairActivity } from "@/features/activities/types/activity";
import { cn } from "@/lib/utils";

export function MatchPairActivityView({
  activity,
  headingRef,
  lessonProgressId,
  onComplete,
}: {
  activity: MatchPairActivity;
  headingRef?: RefObject<HTMLHeadingElement | null> | undefined;
  lessonProgressId: string;
  onComplete: () => void;
}) {
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const [isSaving, startTransition] = useTransition();
  const isComplete = activity.isComplete;
  const pairCount = Object.keys(pairs).length;
  const usedRightIds = new Set(Object.values(pairs));

  function selectRight(rightId: string) {
    if (!selectedLeftId || usedRightIds.has(rightId) || isComplete) return;

    setPairs((currentPairs) => ({ ...currentPairs, [selectedLeftId]: rightId }));
    setSelectedLeftId(null);
    setFeedback(null);
    setCanRetry(false);
  }

  function checkResponse() {
    startTransition(async () => {
      const result = await evaluateMatchPairAction({
        activityId: activity.id,
        lessonProgressId,
        pairs,
      });

      if (!result.ok) {
        setFeedback(result.message);
        return;
      }

      setFeedback(result.feedback);
      setCanRetry(!result.isCorrect);
      if (result.isComplete) onComplete();
    });
  }

  return (
    <section aria-labelledby={`activity-${activity.id}`} className="space-y-6">
      <div className="space-y-2">
        <p className="editorial-eyebrow">Practice</p>
        <h2
          className="font-serif-display text-[length:var(--text-feature-title)] font-normal leading-tight"
          id={`activity-${activity.id}`}
          ref={headingRef}
          tabIndex={-1}
        >
          {activity.title}
        </h2>
        <p className="text-base leading-7 text-muted-foreground">{activity.instructions}</p>
        <p className="text-lg leading-8 text-foreground/90">{activity.configuration.prompt}</p>
        {activity.configuration.helperText ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {activity.configuration.helperText}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Choose a label</legend>
          <div className="divide-y divide-border border-y border-border">
            {activity.configuration.leftItems.map((item) => {
              const paired = pairs[item.id];
              const selected = selectedLeftId === item.id;

              return (
                <Button
                  aria-pressed={selected}
                  className={cn(
                    "min-h-14 justify-between rounded-none border-0 bg-transparent px-1 text-left text-foreground shadow-none hover:bg-muted/50",
                    selected && "bg-muted text-foreground",
                  )}
                  disabled={Boolean(paired) || isSaving || isComplete}
                  key={item.id}
                  onClick={() => setSelectedLeftId(item.id)}
                  type="button"
                  variant="secondary"
                >
                  <span>{item.label}</span>
                  {paired ? (
                    <span className="text-[length:var(--text-caption)]">Matched</span>
                  ) : null}
                </Button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Choose its description</legend>
          <div className="divide-y divide-border border-y border-border">
            {activity.configuration.rightItems.map((item) => {
              const unavailable = usedRightIds.has(item.id);

              return (
                <Button
                  className="min-h-14 justify-between rounded-none border-0 bg-transparent px-1 text-left text-foreground shadow-none hover:bg-muted/50"
                  disabled={!selectedLeftId || unavailable || isSaving || isComplete}
                  key={item.id}
                  onClick={() => selectRight(item.id)}
                  type="button"
                  variant="secondary"
                >
                  <span>{item.label}</span>
                  {unavailable ? (
                    <span className="text-[length:var(--text-caption)]">Matched</span>
                  ) : null}
                </Button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {isComplete ? (
        <div aria-live="polite" className="border-l-2 border-success bg-info px-4 py-3">
          <p className="font-medium text-success">These connections are in place.</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            You can keep moving, or pause here and read through them once more.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {pairCount} of {activity.configuration.leftItems.length} pairs selected
          </p>
          <Button
            disabled={pairCount !== activity.configuration.leftItems.length || isSaving}
            onClick={checkResponse}
          >
            {isSaving ? "Checking…" : "Check response"}
          </Button>
        </div>
      )}

      {feedback ? (
        <div
          aria-live="polite"
          className={cn(
            "motion-status border-l-2 px-4 py-3 text-sm leading-6",
            canRetry ? "border-warning bg-warning/10" : "border-success bg-info",
          )}
          role="status"
        >
          <p className="font-semibold text-foreground">
            {canRetry ? "A useful place to pause" : "You found the connections"}
          </p>
          <p className="mt-1 text-muted-foreground">{feedback}</p>
        </div>
      ) : (
        <div aria-hidden="true" className="min-h-6" />
      )}
      {!isComplete && canRetry ? (
        <Button
          fullWidth={false}
          onClick={() => {
            setPairs({});
            setSelectedLeftId(null);
            setFeedback(null);
            setCanRetry(false);
          }}
          variant="text"
        >
          Revisit the pairs
        </Button>
      ) : null}
    </section>
  );
}
