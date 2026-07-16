"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
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

export function StandardLessonPlayer({ lesson }: { lesson: LessonPlayerViewModel }) {
  const [activeBlockIndex, setActiveBlockIndex] = useState(Math.max(0, lesson.initialBlockIndex));
  const [exitOpen, setExitOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [completion, setCompletion] = useState<LessonCompletionResult | null>(null);
  const [completedActivityIds, setCompletedActivityIds] = useState(
    () =>
      new Set(
        lesson.activities.filter((activity) => activity.isComplete).map((activity) => activity.id),
      ),
  );
  const [isCompleting, startCompletion] = useTransition();
  const compositionRef = useRef<HTMLDivElement>(null);
  const highestObservedIndexRef = useRef(lesson.initialBlockIndex);
  const persistedIndexRef = useRef(lesson.initialBlockIndex);
  const saveInFlightRef = useRef(false);
  const finalBlockIndex = lesson.blocks.length - 1;
  const activitiesComplete = lesson.activities.every((activity) =>
    completedActivityIds.has(activity.id),
  );
  const incompleteActivityTitles = lesson.activities
    .filter((activity) => !completedActivityIds.has(activity.id))
    .map((activity) => activity.title);
  const progress = ((activeBlockIndex + 1) / lesson.blocks.length) * 100;

  useEffect(() => {
    const root = compositionRef.current;
    if (!root) return;

    let cancelled = false;

    async function persistHighestObservedBlock() {
      if (saveInFlightRef.current || lesson.accessMode === "review") return;
      saveInFlightRef.current = true;

      while (!cancelled && highestObservedIndexRef.current > persistedIndexRef.current) {
        const blockIndex = highestObservedIndexRef.current;
        const result = await saveLessonPositionAction({
          blockIndex,
          lessonProgressId: lesson.lessonProgressId,
        });

        if (!result.ok) {
          if (!cancelled) setSaveMessage(result.message);
          break;
        }

        persistedIndexRef.current = blockIndex;
        if (!cancelled) setSaveMessage(null);
      }

      saveInFlightRef.current = false;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        const visibleEntry = visibleEntries[0];
        if (!visibleEntry) return;

        const blockIndex = Number((visibleEntry.target as HTMLElement).dataset.lessonBlockIndex);
        if (!Number.isInteger(blockIndex)) return;

        setActiveBlockIndex(blockIndex);
        if (blockIndex > highestObservedIndexRef.current) {
          highestObservedIndexRef.current = blockIndex;
          void persistHighestObservedBlock();
        }
      },
      { rootMargin: "-32% 0px -58% 0px", threshold: 0 },
    );

    root.querySelectorAll<HTMLElement>("[data-lesson-block-index]").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [lesson.accessMode, lesson.lessonProgressId]);

  function scrollToBlock(blockIndex: number) {
    const target = compositionRef.current?.querySelector<HTMLElement>(
      `[data-lesson-block-index="${blockIndex}"]`,
    );
    const reducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.querySelector('[data-reduced-motion="true"]') !== null;
    target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    target?.focus({ preventScroll: true });
  }

  function completeLesson() {
    startCompletion(async () => {
      const positionResult = await saveLessonPositionAction({
        blockIndex: finalBlockIndex,
        lessonProgressId: lesson.lessonProgressId,
      });
      if (!positionResult.ok) {
        setSaveMessage(positionResult.message);
        return;
      }

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
        dayNumber={lesson.dayNumber}
        keyTakeaway={lesson.keyTakeaway}
        lessonTitle={lesson.title}
      />
    );
  }

  return (
    <article className="mx-auto max-w-6xl pb-10">
      <header className="grid gap-8 border-b border-border py-8 sm:py-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-16">
        <div>
          <p className="editorial-eyebrow">
            Day {String(lesson.dayNumber).padStart(2, "0")} ·{" "}
            {String(lesson.estimatedMinutes).padStart(2, "0")} min read
          </p>
          <h1 className="mt-6 font-serif-display text-[length:var(--text-page-title)] font-normal leading-[0.94] tracking-[-0.035em] text-balance">
            {lesson.title}
          </h1>
          {lesson.subtitle ? (
            <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground">
              {lesson.subtitle}
            </p>
          ) : null}
        </div>
        <aside className="border-l-2 border-accent-warm pl-6">
          <p className="editorial-eyebrow">What you&apos;ll understand</p>
          <p className="mt-3 text-pretty leading-7 text-foreground/80">
            {lesson.learningObjective}
          </p>
        </aside>
      </header>

      <div className="sticky top-[4.5rem] z-20 -mx-5 border-b border-border bg-background px-5 py-3 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex justify-between gap-4 text-xs text-muted-foreground">
              <span>
                Section {activeBlockIndex + 1} of {lesson.blocks.length}
              </span>
              {lesson.accessMode === "review" ? (
                <span>Reviewing</span>
              ) : (
                <span>Saved as you read</span>
              )}
            </div>
            <ProgressBar
              label={`Lesson reading progress: section ${activeBlockIndex + 1} of ${lesson.blocks.length}`}
              value={progress}
            />
          </div>
          <Button fullWidth={false} onClick={() => setExitOpen(true)} size="sm" variant="text">
            Exit
          </Button>
        </div>
      </div>

      {lesson.accessMode === "active" && lesson.initialBlockIndex > 0 ? (
        <aside className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 border-y border-success/30 bg-info px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6">You have already explored part of this lesson.</p>
          <Button
            fullWidth={false}
            onClick={() => scrollToBlock(lesson.initialBlockIndex)}
            size="sm"
            variant="secondary"
          >
            Resume where I left off
          </Button>
        </aside>
      ) : null}

      <div className="divide-y divide-border/65" ref={compositionRef}>
        {lesson.composition.map((item, compositionIndex) => (
          <section
            className="scroll-mt-36 outline-none"
            data-lesson-block-index={item.blockIndex}
            id={`lesson-section-${compositionIndex + 1}`}
            key={item.key}
            tabIndex={-1}
          >
            {item.kind === "content" ? (
              <LessonContentBlockView block={item.block} index={compositionIndex} />
            ) : (
              <div className="motion-reveal mx-auto max-w-5xl border-y border-accent-warm/30 bg-[#f4ede5] px-5 py-10 sm:px-9 sm:py-14">
                <ActivityRenderer
                  activity={{
                    ...item.activity,
                    isComplete: completedActivityIds.has(item.activity.id),
                  }}
                  lessonProgressId={lesson.lessonProgressId}
                  onComplete={() =>
                    setCompletedActivityIds(
                      (currentIds) => new Set([...currentIds, item.activity.id]),
                    )
                  }
                />
              </div>
            )}
          </section>
        ))}
      </div>

      <footer className="border-t border-border py-10 sm:py-14">
        {lesson.accessMode === "review" ? (
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif-display text-2xl font-semibold">
                You reached the end again.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Reviewing does not change your saved progress.
              </p>
            </div>
            <Link className={buttonVariants({ fullWidth: false })} href="/journey">
              Return to lesson library
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="editorial-eyebrow">End of today&apos;s lesson</p>
              <h2 className="mt-3 font-serif-display text-3xl font-normal sm:text-4xl">
                Ready to save what you explored?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                {activitiesComplete
                  ? "Your reading position and completed activities are ready to save."
                  : incompleteActivityTitles.length === 1
                    ? `Complete “${incompleteActivityTitles[0]}” before finishing.`
                    : `Complete these activities before finishing: ${incompleteActivityTitles.join(", ")}.`}
              </p>
            </div>
            <Button disabled={!activitiesComplete || isCompleting} onClick={completeLesson}>
              {isCompleting ? "Saving lesson…" : "Complete today’s lesson"}
            </Button>
          </div>
        )}

        <p
          aria-live="polite"
          className={cn("mt-4 min-h-6 text-sm text-destructive", !saveMessage && "invisible")}
          role={saveMessage ? "alert" : undefined}
        >
          {saveMessage ?? ""}
        </p>
        <Link className={buttonVariants({ fullWidth: false, variant: "text" })} href="/caregiver">
          Caregiver guidance for this journey
        </Link>
      </footer>

      <Modal
        description={
          lesson.accessMode === "review"
            ? "You can return to this completed lesson from your lesson library."
            : "Your furthest-read section is saved so you can return later."
        }
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
    </article>
  );
}
