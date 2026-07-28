"use client";

import { ArrowRight, Check, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { marcusParkingLotStory } from "@/features/stories/content/marcus-parking-lot";
import {
  getStoryPreviewStatus,
  MARCUS_STORY_STORAGE_KEY,
  parseStoryProgress,
} from "@/features/stories/lib/story-progress";
import type { StoryPreviewStatus } from "@/features/stories/types/interactive-story";

import styles from "./story-landing.module.css";

const situations = [
  { label: "Just diagnosed", available: true },
  { label: "Food and family", available: false },
  { label: "Starting medication", available: false },
  { label: "A worrying reading", available: false },
  { label: "Support and boundaries", available: false },
] as const;

const actionByStatus: Record<StoryPreviewStatus, string> = {
  "not-started": "Begin Story",
  "in-progress": "Resume Story",
  completed: "Read Again",
};

export function StoryLanding() {
  const [status, setStatus] = useState<StoryPreviewStatus>("not-started");
  const [scene, setScene] = useState(1);

  useEffect(() => {
    try {
      const progress = parseStoryProgress(window.localStorage.getItem(MARCUS_STORY_STORAGE_KEY));
      setStatus(getStoryPreviewStatus(progress));
      setScene(progress.currentScene + 1);
    } catch {
      setStatus("not-started");
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
                <a aria-current="page" href="#just-diagnosed-story">
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

      <section aria-labelledby="available-story-heading" id="just-diagnosed-story">
        <div className={styles.sectionHeading}>
          <p>Available now</p>
          <h2 id="available-story-heading">Just diagnosed</h2>
        </div>

        <article className={styles.preview}>
          <div className={styles.cover}>
            <Image
              alt={marcusParkingLotStory.imageAlt}
              height={900}
              priority
              sizes="(max-width: 76rem) 100vw, 1120px"
              src={marcusParkingLotStory.imagePath}
              width={1600}
            />
          </div>
          <div className={styles.previewBody}>
            <div className={styles.previewMain}>
              <div className={styles.labels}>
                <span>Illustrative story</span>
                <span>{marcusParkingLotStory.topic}</span>
              </div>
              <h3>{marcusParkingLotStory.title}</h3>
              <p className={styles.previewIntroduction}>{marcusParkingLotStory.introduction}</p>
            </div>
            <aside className={styles.whyItMatters}>
              <p>Why this story matters</p>
              <span>{marcusParkingLotStory.whyItMatters}</span>
            </aside>
            <footer className={styles.previewFooter}>
              <div className={styles.metadata}>
                <span>
                  <Clock3 aria-hidden="true" size={17} />5 to 7 minutes
                </span>
                <span>Connected to Lesson 1</span>
                {status === "completed" ? (
                  <span className={styles.completedStatus}>
                    <Check aria-hidden="true" size={17} />
                    Completed
                  </span>
                ) : status === "in-progress" ? (
                  <span>Scene {scene} of 6</span>
                ) : (
                  <span>Not started</span>
                )}
              </div>
              <Link className={styles.storyAction} href="/stories/marcus-parking-lot">
                {actionByStatus[status]}
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </footer>
          </div>
        </article>
      </section>

      <p className={styles.prototypeNote}>
        One story is available in this prototype. Future situations are labeled without creating
        empty story previews.
      </p>
    </main>
  );
}
