"use client";

import { ArrowRight, Check, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ashaRiceOnTheTableStory } from "@/features/stories/content/asha-rice-on-the-table";
import { devonNumberScreenStory } from "@/features/stories/content/devon-number-screen";
import { marcusParkingLotStory } from "@/features/stories/content/marcus-parking-lot";
import { noraPrescriptionBagStory } from "@/features/stories/content/nora-prescription-bag";
import {
  getStoryPreviewStatus,
  getStoryStorageKey,
  parseStoryProgress,
} from "@/features/stories/lib/story-progress";
import {
  getRecommendedStorySlug,
  prioritizeStorySlugs,
} from "@/features/stories/lib/story-recommendation";
import type {
  InteractiveStory,
  StoryPreviewStatus,
} from "@/features/stories/types/interactive-story";
import { safeGetLocalStorage } from "@/lib/storage/safe-local-storage";

import styles from "./story-landing.module.css";

const stories = [
  marcusParkingLotStory,
  ashaRiceOnTheTableStory,
  noraPrescriptionBagStory,
  devonNumberScreenStory,
] as const;

const actionByStatus: Record<StoryPreviewStatus, string> = {
  "not-started": "Start",
  "in-progress": "Continue",
  completed: "Read again",
};

type PreviewState = {
  status: StoryPreviewStatus;
  scene: number;
};

const defaultPreviewState: PreviewState = { status: "not-started", scene: 1 };

function loadPreviewState(slug: string): PreviewState {
  const progress = parseStoryProgress(safeGetLocalStorage(getStoryStorageKey(slug)));
  return {
    status: getStoryPreviewStatus(progress),
    scene: progress.currentScene + 1,
  };
}

function StoryPreview({
  progress,
  story,
  variant,
}: {
  progress: PreviewState;
  story: InteractiveStory;
  variant: "featured" | "row" | "row-reverse";
}) {
  const timeLabel = (story.estimatedTimeLabel ?? "5 to 7 minutes")
    .replace(" to ", "–")
    .replace(" minutes", " min");
  const lessonLabel = story.relatedLessonLabel ?? "Lesson 1";
  const storyHref =
    progress.status === "not-started" ? `/stories/${story.slug}?begin=1` : `/stories/${story.slug}`;

  return (
    <article className={`${styles.preview} ${styles[variant]}`} data-theme={story.visualTheme}>
      <div className={styles.cover}>
        <Image
          alt={story.imageAlt}
          height={900}
          priority={variant === "featured"}
          sizes="(max-width: 60rem) calc(100vw - 3rem), (max-width: 76rem) 36vw, 420px"
          src={story.imagePath}
          width={1600}
        />
      </div>
      <div className={styles.previewBody}>
        <div className={styles.previewMain}>
          <div className={styles.labels}>
            <span>{story.topic}</span>
          </div>
          <h3>{story.title}</h3>
          <p className={styles.previewIntroduction}>{story.introduction}</p>
        </div>
        <footer className={styles.previewFooter}>
          <div className={styles.metadata}>
            <span>
              <Clock3 aria-hidden="true" size={17} />
              {timeLabel}
            </span>
            <span>{lessonLabel}</span>
            {progress.status === "completed" ? (
              <span className={styles.completedStatus}>
                <Check aria-hidden="true" size={17} />
                Completed
              </span>
            ) : progress.status === "in-progress" ? (
              <span>Scene {progress.scene} of 6</span>
            ) : (
              <span>New</span>
            )}
          </div>
          <Link className={styles.storyAction} href={storyHref}>
            {actionByStatus[progress.status]}
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </footer>
      </div>
    </article>
  );
}

export function StoryLanding() {
  const [progressByStory, setProgressByStory] = useState<Record<string, PreviewState>>({
    [marcusParkingLotStory.slug]: { status: "not-started", scene: 1 },
    [ashaRiceOnTheTableStory.slug]: { status: "not-started", scene: 1 },
    [noraPrescriptionBagStory.slug]: { status: "not-started", scene: 1 },
    [devonNumberScreenStory.slug]: { status: "not-started", scene: 1 },
  });

  useEffect(() => {
    try {
      setProgressByStory({
        [marcusParkingLotStory.slug]: loadPreviewState(marcusParkingLotStory.slug),
        [ashaRiceOnTheTableStory.slug]: loadPreviewState(ashaRiceOnTheTableStory.slug),
        [noraPrescriptionBagStory.slug]: loadPreviewState(noraPrescriptionBagStory.slug),
        [devonNumberScreenStory.slug]: loadPreviewState(devonNumberScreenStory.slug),
      });
    } catch {
      // All stories remain available even if browser storage is blocked.
    }
  }, []);

  const storyBySlug = new Map(stories.map((story) => [story.slug, story]));
  const orderedSlugs = prioritizeStorySlugs(
    stories.map((story) => story.slug),
    progressByStory,
  );
  const recommendedSlug = getRecommendedStorySlug(orderedSlugs, progressByStory);
  const recommendedStory = recommendedSlug ? storyBySlug.get(recommendedSlug) : undefined;
  const recommendedProgress = recommendedSlug
    ? (progressByStory[recommendedSlug] ?? defaultPreviewState)
    : undefined;
  const remainingStories = orderedSlugs
    .filter((slug) => slug !== recommendedSlug)
    .map((slug) => storyBySlug.get(slug))
    .filter((story): story is (typeof stories)[number] => story !== undefined);

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1>Stories</h1>
        <p>Real-life moments with Type 2 diabetes.</p>
      </header>

      {recommendedStory && recommendedProgress ? (
        <section
          aria-labelledby="recommended-story-heading"
          className={styles.featuredSection}
          id="recommended-story"
        >
          <div className={styles.sectionHeading}>
            <p>{recommendedProgress.status === "in-progress" ? "Continue" : "Recommended"}</p>
            <h2 id="recommended-story-heading">
              {recommendedProgress.status === "in-progress"
                ? "Pick up where you left off"
                : "Start with this story"}
            </h2>
          </div>
          <StoryPreview
            progress={recommendedProgress}
            story={recommendedStory}
            variant="featured"
          />
        </section>
      ) : null}

      <section aria-labelledby="more-stories-heading" className={styles.moreStories}>
        <div className={styles.sectionHeading}>
          <p>More stories</p>
          <h2 id="more-stories-heading">More moments</h2>
        </div>
        <div className={styles.storyRows}>
          {remainingStories.map((story, index) => (
            <div id={`${story.slug}-story`} key={story.slug}>
              <StoryPreview
                progress={progressByStory[story.slug] ?? defaultPreviewState}
                story={story}
                variant={index % 2 === 0 ? "row" : "row-reverse"}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
