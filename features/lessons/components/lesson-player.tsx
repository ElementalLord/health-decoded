"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { DevelopmentNotice } from "@/components/shared/development-notice";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ActivityRenderer } from "@/features/activities/components/activity-renderer";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonCompletionScreen } from "@/features/lessons/components/lesson-completion-screen";
import { LessonContentBlockView } from "@/features/lessons/components/lesson-content-block";
import type { LessonCompletionResult } from "@/features/lessons/types/lesson-completion";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

export function LessonPlayer({ lesson }: { lesson: LessonPlayerViewModel }) {
  const [blockIndex, setBlockIndex] = useState(lesson.initialBlockIndex);
  const [exitOpen, setExitOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [completion, setCompletion] = useState<LessonCompletionResult | null>(null);
  const [completedActivityIds, setCompletedActivityIds] = useState(
    () =>
      new Set(
        lesson.activities.filter((activity) => activity.isComplete).map((activity) => activity.id),
      ),
  );
  const [isSaving, startTransition] = useTransition();
  const blockHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldMoveFocus = useRef(false);
  const isIntroduction = blockIndex === -1;
  const hasActivities = lesson.activities.length > 0;
  const isActivityStep = blockIndex === lesson.blocks.length;
  const totalSteps = lesson.blocks.length + 1 + (hasActivities ? 1 : 0);
  const currentStep = blockIndex + 2;
  const progress = (currentStep / totalSteps) * 100;
  const isFinalBlock = blockIndex === lesson.blocks.length - 1;
  const activitiesComplete = lesson.activities.every((activity) =>
    completedActivityIds.has(activity.id),
  );

  useEffect(() => {
    if (!shouldMoveFocus.current) return;

    blockHeadingRef.current?.focus();
    shouldMoveFocus.current = false;
  }, [blockIndex]);

  function savePosition(nextBlockIndex: number) {
    if (
      lesson.accessMode === "review" ||
      nextBlockIndex < 0 ||
      nextBlockIndex >= lesson.blocks.length
    ) {
      return;
    }

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

  function completeLesson() {
    startTransition(async () => {
      const result = await completeLessonAction({ lessonProgressId: lesson.lessonProgressId });
      if (!result.ok) {
        setSaveMessage(result.message);
        return;
      }

      setSaveMessage(null);
      setCompletion(result.data);
    });
  }

  if (completion) {
    return (
      <LessonCompletionScreen
        completion={completion}
        keyTakeaway={lesson.keyTakeaway}
        lessonTitle={lesson.title}
      />
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-[680px] flex-col py-2 sm:py-6">
      {lesson.isDevelopmentContent ? <DevelopmentNotice className="mb-5" /> : null}

      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">Day {lesson.dayNumber}</p>
          <h1 className="text-[length:var(--text-page-title)] font-semibold tracking-[-0.02em]">
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

      <article className="flex flex-1 items-center py-6 sm:py-10">
        <div className="w-full">
          {isIntroduction ? (
            <div className="space-y-6">
              <h2
                className="text-[length:var(--text-feature-title)] font-semibold tracking-[-0.02em]"
                ref={blockHeadingRef}
                tabIndex={-1}
              >
                {lesson.subtitle ?? "A small idea for today"}
              </h2>
              <p className="text-lg leading-8 text-foreground/90">{lesson.learningObjective}</p>
            </div>
          ) : isActivityStep ? (
            <div className="space-y-8">
              {lesson.activities.map((activity) => (
                <ActivityRenderer
                  activity={{ ...activity, isComplete: completedActivityIds.has(activity.id) }}
                  headingRef={blockHeadingRef}
                  key={activity.id}
                  lessonProgressId={lesson.lessonProgressId}
                  onComplete={() =>
                    setCompletedActivityIds((currentIds) => new Set([...currentIds, activity.id]))
                  }
                />
              ))}
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
            onClick={() => moveTo(blockIndex - 1)}
            variant="secondary"
          >
            Previous
          </Button>

          {lesson.accessMode === "review" ? (
            <div className="space-y-2 sm:text-right">
              <p className="font-medium text-foreground">Lesson complete</p>
              <p className="text-sm text-muted-foreground">
                Reviewing this lesson does not change your progress.
              </p>
            </div>
          ) : isActivityStep ? (
            <div className="space-y-2 sm:text-right">
              <Button disabled={!activitiesComplete || isSaving} onClick={completeLesson}>
                {isSaving ? "Saving…" : "Complete today’s lesson"}
              </Button>
              <p className="text-sm text-muted-foreground">
                {activitiesComplete
                  ? "Your progress will be saved when you complete this lesson."
                  : "Complete the activity to continue."}
              </p>
            </div>
          ) : isFinalBlock && hasActivities ? (
            <Button disabled={isSaving} onClick={() => moveTo(blockIndex + 1)}>
              Continue to activity
            </Button>
          ) : isFinalBlock ? (
            <div className="space-y-2 sm:text-right">
              <Button disabled={isSaving} onClick={completeLesson}>
                {isSaving ? "Saving…" : "Complete today’s lesson"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Your progress will be saved when you complete this lesson.
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
        <Link className={buttonVariants({ fullWidth: false, variant: "text" })} href="/caregiver">
          Caregiver guidance for this journey
        </Link>
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
