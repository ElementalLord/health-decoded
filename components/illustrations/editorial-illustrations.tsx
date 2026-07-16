import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

import styles from "./editorial-illustrations.module.css";

type IllustrationProps = SVGProps<SVGSVGElement> & { title?: string };

function CompanionIllustration({
  className,
  title = "Two people standing together",
  ...props
}: IllustrationProps) {
  return (
    <svg
      aria-label={title}
      className={cn("h-auto w-full", className)}
      role="img"
      viewBox="0 0 560 430"
      {...props}
    >
      <ellipse cx="285" cy="382" fill="#e8e0d5" rx="191" ry="20" />
      <g className={styles.companionLeft}>
        <circle cx="222" cy="111" fill="#d8bda2" r="53" />
        <path
          d="M174 99c6-45 32-69 69-58 20 6 34 23 39 47-18-12-31-18-52-17-19 1-35 10-56 28Z"
          fill="#5a4034"
        />
        <path
          d="M207 117c8 7 20 7 29 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M189 101c5-4 11-4 16 0M241 101c5-4 11-4 16 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path d="M159 176c0-21 17-38 38-38h58c21 0 38 17 38 38l8 184H149l10-184Z" fill="#b96c55" />
      </g>
      <g className={styles.companionRight}>
        <circle cx="365" cy="132" fill="#cbb39c" r="48" />
        <path
          d="M323 121c5-40 31-60 65-50 18 5 30 20 35 41-17-9-29-14-47-13-18 1-33 8-53 22Z"
          fill="#6f5142"
        />
        <path
          d="M351 139c8 7 19 7 27 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M337 124c4-3 10-3 14 0M382 124c4-3 10-3 14 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path d="M313 190c0-20 16-36 36-36h48c20 0 36 16 36 36l9 170H304l9-170Z" fill="#6f947a" />
      </g>
      <g className={styles.embraceArm}>
        <path
          d="M274 207c43-25 80-23 105 9"
          fill="none"
          stroke="#b96c55"
          strokeLinecap="round"
          strokeWidth="35"
        />
        <path
          d="M366 215c18 8 23 21 17 39"
          fill="none"
          stroke="#d8bda2"
          strokeLinecap="round"
          strokeWidth="24"
        />
        <circle cx="382" cy="255" fill="#d8bda2" r="15" />
      </g>
    </svg>
  );
}

function KitchenLessonIllustration({
  className,
  title = "An adult learning at a kitchen table",
  ...props
}: IllustrationProps) {
  return (
    <svg
      aria-label={title}
      className={cn("h-auto w-full", className)}
      role="img"
      viewBox="0 0 720 430"
      {...props}
    >
      <rect fill="#efe7db" height="430" rx="26" width="720" />
      <rect fill="#f8f3eb" height="168" width="720" />
      <path d="M0 168h720" stroke="#d4c6b8" strokeWidth="3" />
      <path d="M42 38h145v108H42z" fill="#f6eee2" stroke="#c9b8a6" strokeWidth="3" />
      <path d="M114 38v108M42 92h145" stroke="#c9b8a6" strokeWidth="3" />
      <circle cx="153" cy="67" fill="#e9b36e" r="19" opacity=".72" />
      <path
        d="M236 45h113v93H236zM374 45h113v93H374zM512 45h160v93H512z"
        fill="#d6d4bd"
        stroke="#9f9886"
        strokeWidth="3"
      />
      <circle cx="329" cy="93" fill="#806a5b" r="4" />
      <circle cx="468" cy="93" fill="#806a5b" r="4" />
      <circle cx="530" cy="93" fill="#806a5b" r="4" />
      <path d="M42 184h630v47H42z" fill="#b56d50" />
      <path d="M54 195h603v20H54z" fill="#e5b27f" />
      <path
        d="M97 149v35M120 149v35M143 149v35"
        stroke="#786354"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        d="M587 164c0-21 17-38 38-38s38 17 38 38v20h-76v-20Z"
        fill="#7e9078"
        stroke="#5b6b57"
        strokeWidth="3"
      />
      <path d="M577 129h96" stroke="#5b6b57" strokeLinecap="round" strokeWidth="5" />
      <path d="M115 328h472" stroke="#735648" strokeLinecap="round" strokeWidth="20" />
      <path d="M154 330v82M547 330v82" stroke="#735648" strokeWidth="12" />
      <circle cx="405" cy="229" fill="#d2b398" r="42" />
      <path
        d="M366 220c5-39 29-59 62-50 19 5 32 20 38 41-21-10-34-14-50-13-17 1-31 8-50 22Z"
        fill="#60453a"
      />
      <path d="M366 271c10-14 28-23 48-23h17c31 0 57 25 57 57v81H342l24-115Z" fill="#b96c55" />
      <path
        d="M388 304c-31 17-67 22-104 14"
        fill="none"
        stroke="#b96c55"
        strokeLinecap="round"
        strokeWidth="25"
      />
      <circle cx="279" cy="317" fill="#d2b398" r="14" />
      <path d="M261 310h-61l-12 11h84z" fill="#f8f3eb" stroke="#9a806d" strokeWidth="3" />
      <path
        d="M423 261c7 6 17 6 24 0"
        fill="none"
        stroke="#755344"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M392 242c4-3 9-3 13 0M432 242c4-3 9-3 13 0"
        fill="none"
        stroke="#755344"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path d="M512 273v119M561 273v119M506 277h62" stroke="#786354" strokeWidth="10" />
    </svg>
  );
}

function SteadyingHandIllustration({
  className,
  title = "Two people holding hands",
  ...props
}: IllustrationProps) {
  return (
    <svg
      aria-label={title}
      className={cn("h-auto w-full", className)}
      role="img"
      viewBox="0 0 520 420"
      {...props}
    >
      <ellipse cx="255" cy="376" fill="#e8e0d5" rx="181" ry="18" />
      <g className={styles.steadyPerson}>
        <circle cx="170" cy="101" fill="#cdb094" r="47" />
        <path
          d="M128 88c7-40 31-58 60-49 17 5 29 19 34 39-16-10-29-13-43-12-17 1-31 8-51 22Z"
          fill="#584137"
        />
        <path
          d="M153 109c9 8 21 8 30 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path d="M112 163c0-20 16-36 36-36h44c20 0 36 16 36 36l11 193H101l11-193Z" fill="#b96c55" />
      </g>
      <g className={styles.risingPerson}>
        <circle cx="342" cy="128" fill="#c7b098" r="44" />
        <path
          d="M301 119c4-37 28-56 58-49 17 4 30 18 35 39-16-8-29-11-44-10-17 1-31 7-49 20Z"
          fill="#9d8874"
        />
        <path d="M303 116c3 30 25 47 63 49" fill="none" stroke="#9d8874" strokeWidth="14" />
        <path d="M293 187c0-19 15-34 34-34h39c19 0 34 15 34 34l10 169H282l11-169Z" fill="#6f947a" />
      </g>
      <g className={styles.helpingHands}>
        <path
          d="M211 219c37 64 57 82 91 101"
          fill="none"
          stroke="#b96c55"
          strokeLinecap="round"
          strokeWidth="25"
        />
        <path
          d="M309 223c-23 50-41 76-70 97"
          fill="none"
          stroke="#6f947a"
          strokeLinecap="round"
          strokeWidth="25"
        />
        <circle cx="270" cy="314" fill="#d1b59a" r="18" />
      </g>
    </svg>
  );
}

function CompletionIllustration({
  className,
  title = "A supportive moment after completing a lesson",
  ...props
}: IllustrationProps) {
  return (
    <svg
      aria-label={title}
      className={cn("h-auto w-full", styles.completionScene, className)}
      role="img"
      viewBox="0 0 420 250"
      {...props}
    >
      <ellipse cx="210" cy="229" fill="#e8e0d5" rx="128" ry="12" />
      <circle cx="167" cy="76" fill="#d3b49a" r="39" />
      <path
        d="M132 69c5-32 26-49 52-42 16 4 27 16 31 33-17-7-28-9-39-8-15 1-27 6-44 17Z"
        fill="#a95f49"
      />
      <path d="M139 125c0-17 14-31 31-31h23c17 0 31 14 31 31l7 95H132l7-95Z" fill="#b96c55" />
      <circle cx="253" cy="91" fill="#d0b59b" r="35" />
      <path
        d="M221 84c5-29 24-43 48-37 14 4 24 15 28 30-15-6-25-8-35-7-13 1-24 5-41 14Z"
        fill="#684b3f"
      />
      <path d="M229 132c0-16 13-29 29-29h19c16 0 29 13 29 29l7 88h-92l8-88Z" fill="#78947b" />
      <path
        d="M207 125c26 1 47 17 56 38"
        fill="none"
        stroke="#b96c55"
        strokeLinecap="round"
        strokeWidth="20"
      />
      <path
        d="M153 84c7 6 16 6 23 0M242 99c6 5 14 5 20 0"
        fill="none"
        stroke="#755344"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

function SunCupIllustration({
  className,
  title = "Morning sun rising over a warm cup",
  ...props
}: IllustrationProps) {
  return (
    <svg
      aria-label={title}
      className={cn("h-auto w-full", className)}
      role="img"
      viewBox="0 0 960 520"
      {...props}
    >
      <ellipse cx="480" cy="245" fill="#f1e9df" rx="376" ry="222" />
      <g className={styles.sunScene}>
        <circle cx="480" cy="218" fill="#c7755d" r="91" />
        <g fill="none" stroke="#e6b4a3" strokeLinecap="round" strokeWidth="8">
          <path d="M480 83v-42" />
          <path d="m368 135-42-17" />
          <path d="m592 135 42-17" />
          <path d="m411 326-27 36" />
          <path d="m549 326 27 36" />
        </g>
      </g>
      <path
        d="M78 433c248-34 526-34 804 0"
        fill="none"
        stroke="#b9cdbb"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <g className={styles.cupScene}>
        <path
          d="M442 366h76l-8 58c-2 17-13 26-30 26s-28-9-30-26l-8-58Z"
          fill="#fbf7f1"
          stroke="#806654"
          strokeWidth="5"
        />
        <path
          className={styles.steamOne}
          d="M472 349c-10-16 10-21 1-39"
          fill="none"
          stroke="#e9c4b5"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          className={styles.steamTwo}
          d="M490 348c9-14-7-20 2-36"
          fill="none"
          stroke="#e9c4b5"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </g>
    </svg>
  );
}

export {
  CompanionIllustration,
  CompletionIllustration,
  KitchenLessonIllustration,
  SteadyingHandIllustration,
  SunCupIllustration,
};
