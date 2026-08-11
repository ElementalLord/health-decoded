"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ActionRow } from "@/components/shared/action-row";
import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  recordSpacedReviewPromptAction,
  snoozeSpacedReviewPromptsAction,
} from "@/features/spaced-review/actions/spaced-review.actions";
import { spacedReviewConfig } from "@/features/spaced-review/config/spaced-review.config";

type JourneyReviewPrompt = {
  challengeId: string;
  copy: string;
};

export function JourneySpacedReview({
  compact = false,
  prompt,
}: {
  compact?: boolean;
  prompt: JourneyReviewPrompt | null;
}) {
  const [open, setOpen] = useState(false);
  const promptToken = useRef<string | null>(null);

  useEffect(() => {
    if (!prompt) return;
    const timer = window.setTimeout(() => {
      promptToken.current = window.crypto.randomUUID();
      setOpen(true);
      void recordSpacedReviewPromptAction({
        challengeId: prompt.challengeId,
        token: promptToken.current,
      });
    }, spacedReviewConfig.journeyPromptDelayMs);
    return () => window.clearTimeout(timer);
  }, [prompt]);

  async function notNow() {
    setOpen(false);
    if (prompt) await snoozeSpacedReviewPromptsAction({ challengeId: prompt.challengeId });
  }

  return (
    <>
      <ActionRow
        compact={compact}
        description="Bring back one useful concept. Health Decoded will choose it for you."
        href="/explain-it-back?mode=spaced-review"
        title="Review something"
      />
      {prompt ? (
        <Modal
          className="max-h-[min(34rem,calc(100dvh-2rem))] overflow-y-auto"
          description={prompt.copy}
          onOpenChange={(nextOpen) => {
            if (!nextOpen && open) void notNow();
            else setOpen(nextOpen);
          }}
          open={open}
          title="A quick review"
        >
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button fullWidth={false} onClick={() => void notNow()} variant="text">
              Not now
            </Button>
            <Link
              className={buttonVariants({ fullWidth: false })}
              href="/explain-it-back?mode=spaced-review"
            >
              Review now <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
