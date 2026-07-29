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
import type {
  InteractiveStory,
  StoryPreviewStatus,
} from "@/features/stories/types/interactive-story";

import styles from "./story-landing.module.css";

const situations = [
  { label: "Just diagnosed", available: true, href: "#just-diagnosed-story" },
  { label: "Food and family", available: true, href: "#food-and-family-story" },
  { label: "Starting medication", available: true, href: "#starting-medication-story" },
  { label: "A worrying reading", available: true, href: "#worrying-reading-story" },
  { label: "Support and boundaries", available: false },
] as const;

const actionByStatus: Record<StoryPreviewStatus, string> = {
  "not-started": "Begin Story",
  "in-progress": "Resume Story",
  completed: "Read Again",
};

type PreviewState = {
  status: StoryPreviewStatus;
  scene: number;
};

function loadPreviewState(slug: string): PreviewState {
  const progress = parseStoryProgress(window.localStorage.getItem(getStoryStorageKey(slug)));
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
  const timeLabel = story.estimatedTimeLabel ?? "5 to 7 minutes";
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
            <span>Illustrative story</span>
            <span>{story.topic}</span>
          </div>
          <h3>{story.title}</h3>
          <p className={styles.previewIntroduction}>{story.introduction}</p>
        </div>
        <aside className={styles.whyItMatters}>
          <p>Why it may stay with you</p>
          <span>{story.whyItMatters}</span>
        </aside>
        <footer className={styles.previewFooter}>
          <div className={styles.metadata}>
            <span>
              <Clock3 aria-hidden="true" size={17} />
              {timeLabel}
            </span>
            <span>Connected to {lessonLabel}</span>
            {progress.status === "completed" ? (
              <span className={styles.completedStatus}>
                <Check aria-hidden="true" size={17} />
                Completed
              </span>
            ) : progress.status === "in-progress" ? (
              <span>Scene {progress.scene} of 6</span>
            ) : (
              <span>Not started</span>
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

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Stories</p>
        <h1>Stories</h1>
        <p>
          Illustrative experiences that explore the emotions, decisions, and everyday challenges
          that can come with Type 2 diabetes.
        </p>
      </header>

      <nav aria-label="Browse stories by situation" className={styles.topicNav}>
        <p>Browse by situation</p>
        <ul>
          {situations.map((situation) => (
            <li key={situation.label}>
              {situation.available ? (
                <a href={situation.href}>
                  {situation.label}
                  <span>1 story</span>
                </a>
              ) : (
                <span className={styles.upcomingTopic}>
                  {situation.label}
                  <small>Planned</small>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <section
        aria-labelledby="just-diagnosed-heading"
        className={styles.featuredSection}
        id="just-diagnosed-story"
      >
        <div className={styles.sectionHeading}>
          <p>Recommended place to begin</p>
          <h2 id="just-diagnosed-heading">A first evening after diagnosis</h2>
        </div>
        <StoryPreview
          progress={progressByStory[marcusParkingLotStory.slug]!}
          story={marcusParkingLotStory}
          variant="featured"
        />
      </section>

      <section aria-labelledby="more-stories-heading" className={styles.moreStories}>
        <div className={styles.sectionHeading}>
          <p>More situations</p>
          <h2 id="more-stories-heading">Different moments, different questions</h2>
        </div>
        <div className={styles.storyRows}>
          <div id="food-and-family-story">
            <h3 className="sr-only" id="food-and-family-heading">
              Food and family
            </h3>
            <StoryPreview
              progress={progressByStory[ashaRiceOnTheTableStory.slug]!}
              story={ashaRiceOnTheTableStory}
              variant="row"
            />
          </div>
          <div id="starting-medication-story">
            <h3 className="sr-only" id="starting-medication-heading">
              Starting medication
            </h3>
            <StoryPreview
              progress={progressByStory[noraPrescriptionBagStory.slug]!}
              story={noraPrescriptionBagStory}
              variant="row-reverse"
            />
          </div>
          <div id="worrying-reading-story">
            <h3 className="sr-only" id="worrying-reading-heading">
              A worrying reading
            </h3>
            <StoryPreview
              progress={progressByStory[devonNumberScreenStory.slug]!}
              story={devonNumberScreenStory}
              variant="row"
            />
          </div>
        </div>
      </section>

      <aside className={styles.storyNote}>
        <p>These are illustrative, not biographical.</p>
        <span>
          Each story is an original composite designed to make an everyday question easier to
          explore. It does not describe one specific person or replace individualized care.
        </span>
      </aside>
    </main>
  );
}
