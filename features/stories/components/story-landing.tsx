"use client";

import { ArrowRight, Check, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { StoryJourneyPath } from "@/features/stories/components/story-journey-path";
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

const illustrationByStorySlug: Record<string, { height: number; src: string; width: number }> = {
  "marcus-parking-lot": {
    height: 1024,
    src: "/stories/landing/marcus-parking-lot-illustration.png",
    width: 1536,
  },
  "asha-rice-on-the-table": {
    height: 1024,
    src: "/stories/landing/asha-rice-table-illustration.webp",
    width: 1536,
  },
  "nora-prescription-bag": {
    height: 1568,
    src: "/stories/landing/nora-prescription-bag-illustration.webp",
    width: 1003,
  },
  "devon-number-screen": {
    height: 1071,
    src: "/stories/landing/devon-number-screen-illustration.png",
    width: 1469,
  },
};

type PreviewState = {
  status: StoryPreviewStatus;
  scene: number;
  lastOpenedAt: number | null;
};

const defaultPreviewState: PreviewState = {
  status: "not-started",
  scene: 1,
  lastOpenedAt: null,
};

function loadPreviewState(slug: string): PreviewState {
  const progress = parseStoryProgress(safeGetLocalStorage(getStoryStorageKey(slug)));
  return {
    status: getStoryPreviewStatus(progress),
    scene: progress.currentScene + 1,
    lastOpenedAt: progress.lastOpenedAt,
  };
}

function StoryStatus({ progress, story }: { progress: PreviewState; story: InteractiveStory }) {
  if (progress.status === "completed") {
    return (
      <span className={styles.completedStatus}>
        <Check aria-hidden="true" size={16} />
        Completed
      </span>
    );
  }

  if (progress.status === "in-progress") {
    return (
      <span>
        Scene {progress.scene} of {story.scenes.length}
      </span>
    );
  }

  return <span>New</span>;
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
  const action = actionByStatus[progress.status];
  const storyHref =
    progress.status === "not-started" ? `/stories/${story.slug}?begin=1` : `/stories/${story.slug}`;
  const illustration = illustrationByStorySlug[story.slug];

  return (
    <article
      className={`${styles.preview} ${styles[variant]}`}
      data-story={story.slug}
      data-theme={story.visualTheme}
    >
      <div className={styles.illustration}>
        {illustration ? (
          <Image
            alt=""
            aria-hidden="true"
            className={styles.storyImage}
            height={illustration.height}
            sizes="(max-width: 960px) 90vw, 42vw"
            src={illustration.src}
            width={illustration.width}
          />
        ) : null}
      </div>

      <div className={styles.previewBody}>
        <div className={styles.previewMain}>
          <p className={styles.topic}>{story.topic}</p>
          <h3>{story.title}</h3>
          <p className={styles.previewIntroduction}>{story.introduction}</p>
        </div>

        <div className={styles.metadata}>
          <span>
            <Clock3 aria-hidden="true" size={16} />
            {timeLabel}
          </span>
          <span>{lessonLabel}</span>
          <StoryStatus progress={progress} story={story} />
        </div>

        <Link
          aria-label={`${action}: ${story.title}`}
          className={styles.storyAction}
          href={storyHref}
        >
          {action}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </article>
  );
}

export function StoryLanding() {
  const [progressByStory, setProgressByStory] = useState<Record<string, PreviewState>>({
    [marcusParkingLotStory.slug]: defaultPreviewState,
    [ashaRiceOnTheTableStory.slug]: defaultPreviewState,
    [noraPrescriptionBagStory.slug]: defaultPreviewState,
    [devonNumberScreenStory.slug]: defaultPreviewState,
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
        <div className={styles.introCopy}>
          <p className={styles.eyebrow}>Illustrated stories</p>
          <h1>Stories</h1>
          <p>Real-life moments with Type 2 diabetes.</p>
        </div>
        <div className={styles.heroIllustration}>
          <Image
            alt=""
            aria-hidden="true"
            className={styles.heroImage}
            height={809}
            priority
            sizes="(max-width: 672px) 100vw, 62vw"
            src="/stories/landing/stories-hero-illustration.webp"
            width={1942}
          />
        </div>
      </header>

      <div className={styles.journey}>
        <StoryJourneyPath className={styles.journeyPath} markerClassName={styles.journeyMarker} />

        {recommendedStory && recommendedProgress ? (
          <section
            aria-labelledby="recommended-story-heading"
            className={styles.featuredSection}
            id="recommended-story"
          >
            <header className={styles.sectionHeading}>
              <p>{recommendedProgress.status === "in-progress" ? "Continue" : "Recommended"}</p>
              <h2 id="recommended-story-heading">
                {recommendedProgress.status === "in-progress"
                  ? "Pick up where you left off"
                  : "A moment to begin with"}
              </h2>
            </header>
            <StoryPreview
              progress={recommendedProgress}
              story={recommendedStory}
              variant="featured"
            />
          </section>
        ) : null}

        <section aria-labelledby="more-stories-heading" className={styles.moreStories}>
          <header className={`${styles.sectionHeading} ${styles.moreHeading}`}>
            <p>More stories</p>
            <h2 id="more-stories-heading">More moments</h2>
          </header>
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
      </div>
    </main>
  );
}
