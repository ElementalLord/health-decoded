import { cn } from "@/lib/utils";

import styles from "./day-one-interactions.module.css";

export function FirstDayBag({ packedCount }: { packedCount: number }) {
  return (
    <svg
      aria-label={`${packedCount} of 3 useful first-day ideas have been placed in the bag`}
      className={cn("h-auto w-full", styles.scene)}
      role="img"
      viewBox="0 0 620 390"
    >
      <ellipse cx="310" cy="354" fill="#e9e1d7" rx="180" ry="16" />
      <g className={cn(styles.bagNote, packedCount >= 1 && styles.bagNotePacked)}>
        <rect x="207" y="94" width="112" height="150" rx="8" fill="#d9e4d9" />
        <path d="M229 126h68M229 148h51" stroke="#6f947a" strokeLinecap="round" strokeWidth="7" />
      </g>
      <g className={cn(styles.bagNote, styles.noteTwo, packedCount >= 2 && styles.bagNotePacked)}>
        <rect x="287" y="75" width="112" height="164" rx="8" fill="#f1ddd2" />
        <path d="M309 111h68M309 134h56" stroke="#b96c55" strokeLinecap="round" strokeWidth="7" />
      </g>
      <g className={cn(styles.bagNote, styles.noteThree, packedCount >= 3 && styles.bagNotePacked)}>
        <rect x="365" y="105" width="96" height="139" rx="8" fill="#eee7d9" />
        <path d="M386 138h53M386 160h43" stroke="#a38a6d" strokeLinecap="round" strokeWidth="7" />
      </g>
      <g className={styles.bag}>
        <path
          d="M184 201c0-16 13-29 29-29h194c16 0 29 13 29 29l23 137H161l23-137Z"
          fill="#c7755d"
        />
        <path
          d="M245 183v-23c0-34 27-61 61-61h8c34 0 61 27 61 61v23"
          fill="none"
          stroke="#806654"
          strokeLinecap="round"
          strokeWidth="16"
        />
        <path d="M161 258h298" stroke="#a95f49" strokeWidth="5" />
        <circle cx="207" cy="219" fill="#f4d8ca" r="8" />
        <circle cx="413" cy="219" fill="#f4d8ca" r="8" />
      </g>
    </svg>
  );
}

export function SupportUmbrella({ openedCount }: { openedCount: number }) {
  const scale = 0.38 + Math.min(openedCount, 3) * 0.205;

  return (
    <svg
      aria-label={`${openedCount} of 3 sources of support are helping open the umbrella`}
      className={cn("h-auto w-full", styles.scene)}
      role="img"
      viewBox="0 0 680 430"
    >
      <ellipse cx="340" cy="394" fill="#e9e1d7" rx="160" ry="15" />
      <g fill="none" stroke="#9eb2a3" strokeLinecap="round" strokeWidth="8">
        <path
          className={cn(styles.rainDrop, openedCount >= 1 && styles.rainSheltered)}
          d="M155 68v34"
        />
        <path
          className={cn(styles.rainDrop, openedCount >= 2 && styles.rainSheltered)}
          d="M520 74v34"
        />
        <path
          className={cn(styles.rainDrop, openedCount >= 3 && styles.rainSheltered)}
          d="M583 135v34"
        />
      </g>
      <g>
        <path
          className={styles.umbrellaCanopy}
          d="M105 214c26-101 115-158 235-158s209 57 235 158c-43-22-81-19-117 6-38-29-78-29-118 0-40-29-80-29-118 0-36-25-74-28-117-6Z"
          fill="#c7755d"
          style={{ transform: `scaleX(${scale})` }}
        />
        <g
          className={cn(styles.umbrellaRibs, openedCount > 0 && styles.umbrellaRibsVisible)}
          fill="none"
          stroke="#8f5847"
          strokeWidth="3"
        >
          <path d="M340 63v157M340 63 222 220M340 63l118 157" />
        </g>
        <path
          d="M340 211v123c0 37 54 37 54 0"
          fill="none"
          stroke="#806654"
          strokeLinecap="round"
          strokeWidth="9"
        />
      </g>
      <g>
        <circle cx="296" cy="286" fill="#d2b399" r="31" />
        <path
          d="M265 282c4-28 22-42 46-36 14 4 23 14 27 29-14-6-24-8-34-7-13 1-23 5-39 14Z"
          fill="#5c4439"
        />
        <path d="M254 344c0-18 14-32 32-32h20c18 0 32 14 32 32l4 42h-92l4-42Z" fill="#6f947a" />
        <path
          d="M286 293c6 5 14 5 20 0"
          fill="none"
          stroke="#755344"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </g>
    </svg>
  );
}

export function QuestionEnvelope({ hasQuestion }: { hasQuestion: boolean }) {
  return (
    <svg
      aria-label={
        hasQuestion
          ? "A question has been placed safely inside an envelope"
          : "An open envelope is ready for one question"
      }
      className={cn("h-auto w-full", styles.scene)}
      role="img"
      viewBox="0 0 640 390"
    >
      <ellipse cx="320" cy="349" fill="#e9e1d7" rx="180" ry="15" />
      <path
        className={cn(styles.envelopeOpenFlap, hasQuestion && styles.envelopeOpenFlapHidden)}
        d="m145 184 175-108 175 108-175 116-175-116Z"
        fill="#f0e4da"
        stroke="#806654"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      {!hasQuestion ? (
        <g className={styles.envelopePaper}>
          <rect
            x="198"
            y="53"
            width="244"
            height="214"
            rx="8"
            fill="#fbf7f1"
            stroke="#cdbfb2"
            strokeWidth="4"
          />
          <path
            d="M232 103h176M232 132h139M232 161h158"
            stroke="#b96c55"
            strokeLinecap="round"
            strokeWidth="7"
          />
          <circle cx="320" cy="213" fill="#d9e4d9" r="18" />
          <path
            d="m312 213 6 6 12-15"
            fill="none"
            stroke="#6f947a"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
          />
        </g>
      ) : null}
      <g>
        <rect
          x="142"
          y="181"
          width="356"
          height="159"
          rx="10"
          fill="#ead8cb"
          stroke="#806654"
          strokeWidth="5"
        />
        <path
          d="m145 189 175 116 175-116"
          fill="#f3e7df"
          stroke="#806654"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <path d="m145 333 137-104M495 333 358 229" fill="none" stroke="#806654" strokeWidth="5" />
        <path
          className={cn(styles.envelopeClosedFlap, hasQuestion && styles.envelopeClosedFlapVisible)}
          d="m145 184 175 119 175-119Z"
          fill="#f0e4da"
          stroke="#806654"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <circle
          className={cn(styles.envelopeSeal, hasQuestion && styles.envelopeSealVisible)}
          cx="320"
          cy="274"
          fill="#c7755d"
          r="26"
        />
      </g>
    </svg>
  );
}

export function DayOneRecapPages() {
  const pages = [
    ["01", "This diagnosis is not a judgment."],
    ["02", "You do not need to master everything today."],
    ["03", "Questions, support, and one next step are enough."],
  ] as const;

  return (
    <figure className={styles.recapScene}>
      {pages.map(([number, idea]) => (
        <div className={styles.recapPage} key={number}>
          <p className="editorial-eyebrow text-accent-warm">Truth {number}</p>
          <p className="mt-8 font-serif-display text-3xl font-normal leading-tight sm:text-4xl">
            {idea}
          </p>
        </div>
      ))}
    </figure>
  );
}
