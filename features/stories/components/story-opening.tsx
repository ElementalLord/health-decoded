"use client";

import { ArrowRight, Clock3 } from "lucide-react";
import Image from "next/image";

import type { InteractiveStory } from "@/features/stories/types/interactive-story";

import styles from "./story-player.module.css";

type StoryOpeningProps = {
  onBegin: () => void;
  story: InteractiveStory;
};

export function StoryOpening({ onBegin, story }: StoryOpeningProps) {
  const timeLabel = story.estimatedTimeLabel ?? `${story.estimatedMinutes} minutes`;
  const lessonLabel = story.relatedLessonLabel ?? story.relatedLessonId.replace("-", " ");

  return (
    <header className={styles.storyOpening} data-theme={story.visualTheme}>
      <div className={styles.openingCover}>
        <Image
          alt={story.imageAlt}
          height={900}
          priority
          sizes="(max-width: 70rem) 100vw, 1120px"
          src={story.imagePath}
          width={1600}
        />
      </div>
      <div className={styles.openingCopy}>
        <div className={styles.openingLabels}>
          <span>Illustrative story</span>
          <span>{story.topic}</span>
        </div>
        <h1>{story.title}</h1>
        <p className={styles.openingPremise}>{story.introduction}</p>
        <dl className={styles.openingMetadata}>
          <div>
            <dt>Character</dt>
            <dd>{story.characterName} · placeholder name</dd>
          </div>
          <div>
            <dt>
              <Clock3 aria-hidden="true" size={16} />
              Time
            </dt>
            <dd>{timeLabel}</dd>
          </div>
          <div>
            <dt>Related lesson</dt>
            <dd>{lessonLabel}</dd>
          </div>
        </dl>
        {story.contentWarning ? (
          <p className={styles.openingContextNote}>
            <strong>Quiet context note</strong>
            {story.contentWarning}
          </p>
        ) : null}
        <p className={styles.openingDisclosure}>{story.disclosure}</p>
        <button className={styles.openingAction} onClick={onBegin} type="button">
          Begin Story
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>
    </header>
  );
}
