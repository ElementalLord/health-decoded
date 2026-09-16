"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import styles from "../styles/explain-it-back.module.css";

const illustrationLoop = {
  transform: [
    "translate3d(0px, 0px, 0px) rotate(-0.3deg) scale(1)",
    "translate3d(0px, -6px, 0px) rotate(0.35deg) scale(1.008)",
    "translate3d(0px, 0px, 0px) rotate(-0.3deg) scale(1)",
  ],
};

export function TeachBackIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <figure className={styles.illustrationFigure}>
      <div className={styles.illustrationStage}>
        <motion.span
          aria-hidden="true"
          animate={
            reduceMotion
              ? {}
              : {
                  opacity: [0.28, 0.58, 0.28],
                  transform: [
                    "translate3d(0px, 0px, 0px) scale(0.96)",
                    "translate3d(8px, -10px, 0px) scale(1.08)",
                    "translate3d(0px, 0px, 0px) scale(0.96)",
                  ],
                }
          }
          className={`${styles.ambientMark} ${styles.ambientMarkWarm}`}
          transition={{ duration: 5.8, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.span
          aria-hidden="true"
          animate={
            reduceMotion
              ? {}
              : {
                  opacity: [0.22, 0.48, 0.22],
                  transform: [
                    "translate3d(0px, 0px, 0px) rotate(0deg)",
                    "translate3d(-9px, 7px, 0px) rotate(12deg)",
                    "translate3d(0px, 0px, 0px) rotate(0deg)",
                  ],
                }
          }
          className={`${styles.ambientMark} ${styles.ambientMarkGreen}`}
          transition={{ duration: 7.2, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          animate={reduceMotion ? {} : illustrationLoop}
          className={styles.notebookLayer}
          transition={{ duration: 6.6, ease: "easeInOut", repeat: Infinity }}
        >
          <Image
            alt="An illustrated open notebook filled with simple marks, surrounded by leaves and a fountain pen."
            draggable={false}
            height={1024}
            priority
            sizes="(max-width: 56rem) 92vw, 44vw"
            src="/explain-it-back/teach-back-notebook-v1.png"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 48% 45% at 50% 50%, black 70%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 48% 45% at 50% 50%, black 70%, transparent 100%)",
            }}
            width={1536}
          />
        </motion.div>
      </div>
      <figcaption className={styles.illustrationCaption}>
        <span aria-hidden="true" className={styles.captionStar}>
          ✦
        </span>
        <span>Ideas become clearer when you say them in your own words.</span>
      </figcaption>
    </figure>
  );
}
