"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonContentBlockView } from "@/features/lessons/components/lesson-content-block";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

export function LessonPlayer({ lesson }: { lesson: LessonPlayerViewModel }) {
  const [blockIndex, setBlockIndex] = useState(lesson.initialBlockIndex);
  const [exitOpen, setExitOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();
  const blockHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldMoveFocus = useRef(false);
  const isIntroduction = blockIndex === -1;
  const totalSteps = lesson.blocks.length + 1;
  const currentStep = blockIndex + 2;
  const progress = (currentStep / totalSteps) * 100;
  const isFinalBlock = blockIndex === lesson.blocks.length - 1;

  useEffect(() => {
    if (!shouldMoveFocus.current) return;

    blockHeadingRef.current?.focus();
    shouldMoveFocus.current = false;
  }, [blockIndex]);

  function savePosition(nextBlockIndex: number) {
    if (lesson.accessMode === "review" || nextBlockIndex < 0) return;

    startTransition(async () => {
      const result = await saveLessonPositionAction({
        blockIndex: nextBlockIndex,
        lessonProgressId: lesson.lessonProgressId,
      });

      setSaveMessage(result.ok ? null : result.message);
    });
  }

  function moveTo(nextBlockIndex: number) {
    shouldMoveFocus.current = true;
    setBlockIndex(nextBlockIndex);
    savePosition(nextBlockIndex);
  }

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-[760px] flex-col py-2 sm:py-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-primary">Day {lesson.dayNumber}</p>
          <h1 className="text-[length:var(--text-page-title)] font-semibold tracking-tight">
            {lesson.title}
          </h1>
          <p className="text-sm text-muted-foreground">About {lesson.estimatedMinutes} minutes</p>
        </div>
        <Button fullWidth={false} onClick={() => setExitOpen(true)} variant="text">
          Exit lesson
        </Button>
      </header>

      <div className="space-y-3 py-6">
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>{isIntroduction ? "Introduction" : `Step ${currentStep} of ${totalSteps}`}</span>
          {lesson.accessMode === "review" ? <span>Review</span> : null}
        </div>
        <ProgressBar
          label={`Lesson reading progress: ${isIntroduction ? "introduction" : `step ${currentStep} of ${totalSteps}`}`}
          value={progress}
        />
      </div>

      <article aria-live="polite" className="flex flex-1 items-center py-6 sm:py-10">
        <div className="w-full">
          {isIntroduction ? (
            <div className="space-y-6">
              <h2
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
                ref={blockHeadingRef}
                tabIndex={-1}
              >
                {lesson.subtitle ?? "A small idea for today"}
              </h2>
              <p className="text-lg leading-8 text-foreground/90">{lesson.learningObjective}</p>
            </div>
          ) : (
            <div>
              <h2 className="sr-only" ref={blockHeadingRef} tabIndex={-1}>
                Lesson step {currentStep} of {totalSteps}
              </h2>
              <LessonContentBlockView block={lesson.blocks[blockIndex]!} />
            </div>
          )}
        </div>
      </article>

      <footer className="border-t border-border pt-5">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            disabled={isIntroduction || isSaving}
            fullWidth={false}
            onClick={() => moveTo(blockIndex - 1)}
            variant="secondary"
          >
            Previous
          </Button>

          {isFinalBlock ? (
            <div className="space-y-2 sm:text-right">
              <Button disabled>Ready for your check-in</Button>
              <p className="text-sm text-muted-foreground">
                The learning activity will be available in the next step.
              </p>
            </div>
          ) : (
            <Button disabled={isSaving} onClick={() => moveTo(blockIndex + 1)}>
              Continue
            </Button>
          )}
        </div>
        <p
          aria-live="polite"
          className={cn("mt-3 min-h-6 text-sm text-destructive", !saveMessage && "invisible")}
        >
          {saveMessage ?? ""}
        </p>
      </footer>

      <Modal
        description="Your place will be saved so you can return later."
        onOpenChange={setExitOpen}
        open={exitOpen}
        title="Leave this lesson?"
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button fullWidth={false} onClick={() => setExitOpen(false)} variant="secondary">
            Keep reading
          </Button>
          <Link className={buttonVariants({ fullWidth: false })} href="/journey">
            Leave lesson
          </Link>
        </div>
      </Modal>
    </section>
  );
}
