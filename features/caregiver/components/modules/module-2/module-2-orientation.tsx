"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { caregiverModule2 } from "../../../content/caregiver-module-2";
import styles from "../../../styles/caregiver-module-2.module.css";

export function Module2Orientation({ onBegin }: { readonly onBegin: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { opening } = caregiverModule2.sections;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className={styles.orientation} aria-labelledby="caregiver-module-2-heading">
      <div className={styles.orientationCopy}>
        <p className={styles.eyebrow}>{opening.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1} id="caregiver-module-2-heading">
          {opening.title}
        </h1>
        <p className={styles.openingThought}>Support can be close without taking control.</p>
        <p className={styles.openingContext}>{opening.opening}</p>
        <Button className={styles.beginButton} fullWidth={false} onClick={onBegin} size="lg">
          Begin <span aria-hidden="true">→</span>
        </Button>
      </div>

      <figure className={styles.boundaryScene} aria-labelledby="module-2-opening-caption">
        <Image
          className={styles.sceneImage}
          src="/caregiver/module-2/shared-space-kitchen.png"
          alt="Two adults share a calm kitchen, one seated with a mug and one putting away groceries."
          width={1536}
          height={1024}
          sizes="(max-width: 48rem) 100vw, 33rem"
          priority
        />
        <figcaption id="module-2-opening-caption">
          Two people share a table. Care can cross the space between them without crossing a
          personal boundary.
        </figcaption>
      </figure>

      <p className={styles.centralPromise}>{opening.centralIdea}</p>
    </section>
  );
}
