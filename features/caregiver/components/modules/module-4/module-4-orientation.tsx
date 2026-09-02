"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { caregiverModule4 } from "../../../content/caregiver-module-4";
import styles from "../../../styles/caregiver-module-4.module.css";

const layerDescriptions = [
  "Understand the framework.",
  "Find individualized instructions and the agreed supporter role.",
  "Bring qualified human judgment when the situation is concerning, unclear, or urgent.",
] as const;

export function Module4Orientation({ onBegin }: { onBegin: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const opening = caregiverModule4.sections.opening;
  useEffect(() => headingRef.current?.focus(), []);
  return (
    <section className={styles.orientation} aria-labelledby="caregiver-module-4-heading">
      <div className={styles.orientationCopy}>
        <p className={styles.eyebrow}>{opening.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1} id="caregiver-module-4-heading">{opening.title}</h1>
        <p className={styles.openingCopy}>{opening.opening}</p>
        <p className={styles.productLimit}>{caregiverModule4.safety.productLimit}</p>
        <Button className={styles.beginButton} fullWidth={false} onClick={onBegin} type="button">Begin with Omar and Celeste <span aria-hidden="true">→</span></Button>
      </div>
      <div className={styles.orientationVisual}>
        <figure className={styles.orientationArt}>
          <Image src="/caregiver/module-4/plan-and-handoff.png" alt="A folded plan is taken from a grocery bag while another person holds a phone ready to contact human help." width={1536} height={1024} priority sizes="(max-width: 56rem) 100vw, 48vw" />
        </figure>
        <ol className={styles.sourceLayers} aria-label="Three guidance layers">
          {opening.layers.map((layer, index) => <li key={layer}><span>{index + 1}</span><div><strong>{layer}</strong><p>{layerDescriptions[index]}</p></div></li>)}
        </ol>
        <p className={styles.layerNote}>These sources answer different questions. They are not steps that must always happen in order.</p>
      </div>
    </section>
  );
}
