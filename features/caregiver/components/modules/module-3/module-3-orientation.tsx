"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { caregiverModule3 } from "../../../content/caregiver-module-3";
import styles from "../../../styles/caregiver-module-3.module.css";

export function Module3Orientation({ onBegin }: { onBegin: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { opening } = caregiverModule3.sections;
  useEffect(() => { headingRef.current?.focus(); }, []);
  return (
    <section className={styles.orientation} aria-labelledby="caregiver-module-3-heading">
      <div className={styles.orientationCopy}>
        <p className={styles.eyebrow}>{opening.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1} id="caregiver-module-3-heading">{opening.title}</h1>
        <p className={styles.openingCopy}>{opening.opening}</p>
        <p className={styles.centralPromise}>{opening.centralIdea}</p>
        <Button className={styles.beginButton} fullWidth={false} onClick={onBegin} type="button">Begin with dinner at seven <span aria-hidden="true">→</span></Button>
      </div>
      <figure className={styles.orientationArt}>
        <Image src="/caregiver/module-3/shared-evening-plan.png" alt="Two roommates planning a shared evening at their kitchen table with groceries, dinner, and car keys." width={1536} height={1024} priority sizes="(max-width: 56rem) 100vw, 48vw" />
        <figcaption>Useful help answers the task that was actually named.</figcaption>
      </figure>
    </section>
  );
}
