"use client";

import { ArrowRight, Check, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ashaRiceOnTheTableStory } from "@/features/stories/content/asha-rice-on-the-table";
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
  { label: "A worrying reading", available: false },
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
  compact,
  progress,
  story,
}: {
  compact?: boolean;
  progress: PreviewState;
  story: InteractiveStory;
}) {
  const timeLabel = story.estimatedTimeLabel ?? "5 to 7 minutes";
  const lessonLabel = story.relatedLessonLabel ?? "Lesson 1";
  const storyHref =
    progress.status === "completed" ? `/stories/${story.slug}?restart=1` : `/stories/${story.slug}`;

  return (
    <article className={`${styles.preview} ${compact ? styles.compactPreview : ""}`}>
      <div className={styles.cover}>
        <Image
          alt={story.imageAlt}
          height={900}
          priority
          sizes="(max-width: 76rem) 100vw, 1120px"
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
          <p>Why this story matters</p>
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
  });

  useEffect(() => {
    try {
      setProgressByStory({
        [marcusParkingLotStory.slug]: loadPreviewState(marcusParkingLotStory.slug),
        [ashaRiceOnTheTableStory.slug]: loadPreviewState(ashaRiceOnTheTableStory.slug),
        [noraPrescriptionBagStory.slug]: loadPreviewState(noraPrescriptionBagStory.slug),
      });
    } catch {
      // All stories remain available even if browser storage is blocked.
    }
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Stories</p>
        <h1>Sometimes an experience makes the lesson easier to hold.</h1>
        <p>
          These illustrative experiences explore emotions, decisions, and everyday challenges
          commonly reported by people living with Type 2 diabetes. Each story offers a practical
          lesson without representing one specific individual.
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

      <section aria-labelledby="just-diagnosed-heading" id="just-diagnosed-story">
        <div className={styles.sectionHeading}>
          <p>Available now</p>
          <h2 id="just-diagnosed-heading">Just diagnosed</h2>
        </div>
        <StoryPreview
          progress={progressByStory[marcusParkingLotStory.slug]!}
          story={marcusParkingLotStory}
        />
      </section>

      <section aria-labelledby="food-and-family-heading" id="food-and-family-story">
        <div className={styles.sectionHeading}>
          <p>Available now</p>
          <h2 id="food-and-family-heading">Food and family</h2>
        </div>
        <StoryPreview
          compact
          progress={progressByStory[ashaRiceOnTheTableStory.slug]!}
          story={ashaRiceOnTheTableStory}
        />
      </section>

      <section aria-labelledby="starting-medication-heading" id="starting-medication-story">
        <div className={styles.sectionHeading}>
          <p>Available now</p>
          <h2 id="starting-medication-heading">Starting medication</h2>
        </div>
        <StoryPreview
          progress={progressByStory[noraPrescriptionBagStory.slug]!}
          story={noraPrescriptionBagStory}
        />
      </section>

      <p className={styles.prototypeNote}>
        Three stories are available in this prototype. Future situations are labeled without
        creating empty story previews.
      </p>
    </main>
  );
}
