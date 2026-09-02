"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { caregiverModule1 } from "../../../content/caregiver-module-1";
import styles from "../../../styles/caregiver-module-1.module.css";

export function Module1Orientation({ onBegin }: { readonly onBegin: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { opening } = caregiverModule1.sections;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className={styles.orientation} aria-labelledby="caregiver-module-1-heading">
      <div className={styles.orientationCopy}>
        <p className={styles.eyebrow}>{opening.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1} id="caregiver-module-1-heading">
          What might they be feeling?
        </h1>
        <p className={styles.openingThought}>
          You can notice a change without deciding what it means.
        </p>
        <p className={styles.openingContext}>
          This lesson is about staying curious when a short reply, silence, or changed subject feels
          loaded.
        </p>
        <Button className={styles.beginButton} fullWidth={false} onClick={onBegin} size="lg">
          Start lesson <span aria-hidden="true">→</span>
        </Button>
      </div>

      <figure className={styles.tableScene} aria-labelledby="opening-scene-caption">
        <Image
          className={styles.sceneImage}
          src="/caregiver/module-1/quiet-evening-observation.png"
          alt="A woman sits quietly with a mug while her phone rests beside an open book in the evening."
          width={1536}
          height={1024}
          sizes="(max-width: 48rem) 100vw, 34rem"
          priority
        />
        <figcaption id="opening-scene-caption">
          A phone rests between two ordinary parts of someone’s evening: a mug and an unfinished
          conversation.
        </figcaption>
      </figure>
    </section>
  );
}
