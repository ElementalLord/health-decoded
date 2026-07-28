"use client";

import styles from "./resources.module.css";

export type MotionVariant =
  "care" | "context" | "daily" | "medicine" | "safety" | "source" | "support";

const motionCopy: Record<
  MotionVariant,
  { label: string; note: string; sceneLabel: string; watch: string }
> = {
  care: {
    label: "Screening is a rotation, not a prediction.",
    note: "Eyes, kidneys, heart, feet, and mouth each get their own calm moment of attention.",
    sceneLabel:
      "A body is checked area by area while a calendar records each completed preventive visit",
    watch: "Watch each body area receive attention before the visit is added to the care record.",
  },
  context: {
    label: "A reading travels with the day that produced it.",
    note: "Timing, food, movement, sleep, and symptoms turn an isolated result into a useful question.",
    sceneLabel:
      "A reading moves along a timeline past a meal, movement, and sleep before becoming a question",
    watch: "Follow the amber reading from the meter through the day and into the question card.",
  },
  daily: {
    label: "Balance can be built by addition, then carried into motion.",
    note: "A familiar plate gains fiber and protein; afterward, ordinary movement gives working muscles another way to use glucose.",
    sceneLabel:
      "Food groups assemble on a familiar plate, then footsteps carry energy toward working muscles",
    watch: "Watch the plate come together first, then follow the energy into the moving legs.",
  },
  medicine: {
    label: "The useful medicine plan connects the right dose to the right time.",
    note: "A name, purpose, timing cue, and missed-dose instruction make a routine safer than memory alone.",
    sceneLabel:
      "A clock advances while a medicine moves from its bottle into the correct day and time compartment",
    watch:
      "Follow one dose from the bottle, past the timing cue, into the matching organizer space.",
  },
  safety: {
    label: "A sick-day plan responds to change before guessing.",
    note: "Symptoms prompt fluids, monitoring, written instructions, and a call when the personal plan says it is time.",
    sceneLabel:
      "A temperature rises, hydration is restored, a written plan opens, and a phone connects to support",
    watch:
      "See the sequence move from noticing a change to using the prepared plan and contacting help.",
  },
  source: {
    label: "Trusted guidance becomes useful when it reaches a real question.",
    note: "Official evidence is checked, translated into plain language, and carried into the next conversation.",
    sceneLabel:
      "Two official source pages pass through a verification mark and become a short question note",
    watch: "Watch the source pages move through verification before the useful note is written.",
  },
  support: {
    label: "A specific ask gives support somewhere useful to land.",
    note: "Listening, company, and one practical task arrive differently because the person—not the helper—chooses the need.",
    sceneLabel:
      "One person makes an ask, two people move closer, and a practical task and warm drink arrive",
    watch:
      "Follow the ask outward, then notice how people and practical help respond without taking over.",
  },
};

function ContextScene() {
  return (
    <>
      <path
        d="M74 214 C170 112 264 272 356 158 S526 86 646 192"
        fill="none"
        stroke="#b4c5bd"
        strokeWidth="6"
      />
      <g transform="translate(74 214)">
        <rect
          fill="#fffaf2"
          height="82"
          rx="8"
          stroke="#567a6b"
          strokeWidth="5"
          width="94"
          x="-47"
          y="-41"
        />
        <path
          d="M-28 -18h56M-28 0h42M-28 18h50"
          stroke="#7d9b8e"
          strokeLinecap="round"
          strokeWidth="6"
        />
      </g>
      <g transform="translate(232 182)">
        <ellipse fill="#fffaf2" rx="49" ry="28" stroke="#bc755e" strokeWidth="5" />
        <path d="M-34 0h68M0-22v44" opacity=".7" stroke="#bc755e" strokeWidth="3" />
        <animateTransform
          attributeName="transform"
          dur="6s"
          repeatCount="indefinite"
          type="translate"
          values="232 182;232 170;232 182"
        />
      </g>
      <g fill="none" stroke="#587b6c" strokeLinecap="round" strokeWidth="7">
        <path d="M350 199l18-25 18 25M384 216l18-25 18 25" />
        <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values=".25;1;.25" />
      </g>
      <g transform="translate(494 122)">
        <g>
          <path d="M0-30a30 30 0 1 0 30 30A24 24 0 0 1 0-30Z" fill="#74899a" />
          <animateTransform
            attributeName="transform"
            dur="5s"
            repeatCount="indefinite"
            type="rotate"
            values="-5;5;-5"
          />
        </g>
      </g>
      <g transform="translate(632 190)">
        <rect
          fill="#fffaf2"
          height="98"
          rx="8"
          stroke="#567a6b"
          strokeWidth="5"
          width="110"
          x="-55"
          y="-49"
        />
        <path
          d="M-32-18h64M-32 4h45M-32 26h56"
          stroke="#cb8469"
          strokeLinecap="round"
          strokeWidth="6"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="5.6s"
            repeatCount="indefinite"
            values="0 90;90 0;90 0"
          />
        </path>
      </g>
      <circle fill="#dfa54d" r="12">
        <animateMotion
          dur="8s"
          path="M74 214 C170 112 264 272 356 158 S526 86 646 192"
          repeatCount="indefinite"
        />
        <animate attributeName="r" dur="2s" repeatCount="indefinite" values="9;14;9" />
      </circle>
    </>
  );
}

function SourceScene() {
  return (
    <>
      <g>
        <rect
          fill="#fffaf2"
          height="146"
          rx="8"
          stroke="#6e8c80"
          strokeWidth="5"
          width="116"
          x="70"
          y="72"
        />
        <rect
          fill="#f6eadf"
          height="146"
          rx="8"
          stroke="#b87760"
          strokeWidth="5"
          width="116"
          x="126"
          y="92"
        />
        <path
          d="M92 106h70M92 132h54M92 158h66M148 126h70M148 152h48M148 178h62"
          stroke="#8ba298"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <animateTransform
          attributeName="transform"
          dur="7s"
          repeatCount="indefinite"
          type="translate"
          values="0 0;42 0;42 0;0 0"
        />
      </g>
      <g transform="translate(354 156)">
        <path
          d="M0-72l58 22v44c0 52-34 76-58 88-24-12-58-36-58-88v-44Z"
          fill="#e7efe9"
          stroke="#567a6b"
          strokeWidth="6"
        />
        <path
          d="m-26 3 18 18 38-44"
          fill="none"
          stroke="#4f806b"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="9"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="4s"
            repeatCount="indefinite"
            values="0 100;100 0;100 0"
          />
        </path>
        <circle fill="none" r="88" stroke="#d9a36b" strokeWidth="4">
          <animate attributeName="r" dur="3.5s" repeatCount="indefinite" values="74;92;74" />
          <animate attributeName="opacity" dur="3.5s" repeatCount="indefinite" values=".7;0;.7" />
        </circle>
      </g>
      <g transform="translate(566 154)">
        <rect
          fill="#fffaf2"
          height="150"
          rx="9"
          stroke="#6e8c80"
          strokeWidth="5"
          width="132"
          x="-66"
          y="-75"
        />
        <path
          d="M-40-38h72M-40-8h50M-40 22h64"
          stroke="#b87760"
          strokeLinecap="round"
          strokeWidth="7"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="6s"
            repeatCount="indefinite"
            values="0 100;100 0;100 0"
          />
        </path>
        <circle cx="38" cy="46" fill="#e6b774" r="9">
          <animate attributeName="r" dur="2.4s" repeatCount="indefinite" values="7;12;7" />
        </circle>
      </g>
      <path
        d="M260 156h38M414 156h76"
        stroke="#78988a"
        strokeDasharray="10 12"
        strokeLinecap="round"
        strokeWidth="5"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="2s"
          repeatCount="indefinite"
          values="44;0"
        />
      </path>
    </>
  );
}

function DailyScene() {
  return (
    <>
      <ellipse cx="220" cy="168" fill="#fffaf2" rx="128" ry="92" stroke="#b87760" strokeWidth="6" />
      <path d="M220 78v180M92 168h256" opacity=".55" stroke="#b87760" strokeWidth="4" />
      <g>
        <path d="M126 124c28-28 66-30 94 0v44h-94Z" fill="#739783" />
        <animateTransform
          attributeName="transform"
          dur="5.8s"
          repeatCount="indefinite"
          type="translate"
          values="-90 -50;0 0;0 0;-90 -50"
        />
      </g>
      <g>
        <path d="M238 110h72v58h-72Z" fill="#e3b261" />
        <animateTransform
          attributeName="transform"
          dur="5.8s"
          repeatCount="indefinite"
          type="translate"
          values="85 -54;0 0;0 0;85 -54"
        />
      </g>
      <g>
        <ellipse cx="260" cy="212" fill="#cf8068" rx="48" ry="25" />
        <animateTransform
          attributeName="transform"
          dur="5.8s"
          repeatCount="indefinite"
          type="translate"
          values="0 90;0 0;0 0;0 90"
        />
      </g>
      <path
        d="M366 186 C430 126 472 220 532 158 S626 126 666 164"
        fill="none"
        stroke="#a8beb2"
        strokeDasharray="12 13"
        strokeLinecap="round"
        strokeWidth="6"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="2.5s"
          repeatCount="indefinite"
          values="50;0"
        />
      </path>
      <g fill="none" stroke="#527767" strokeLinecap="round" strokeWidth="10">
        <path d="M408 170l20 28M446 148l20 28M493 174l20 28M538 142l20 28" />
        <animate attributeName="opacity" dur="3.5s" repeatCount="indefinite" values=".2;1;.2" />
      </g>
      <g transform="translate(618 164)">
        <path d="M-34-54h68l20 108h-108Z" fill="#e9f0eb" stroke="#567a6b" strokeWidth="5" />
        <path
          d="M-18-30v60M0-34v68M18-30v60"
          stroke="#ce856b"
          strokeLinecap="round"
          strokeWidth="7"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="3s"
            repeatCount="indefinite"
            values="5 80;70 5;5 80"
          />
        </path>
      </g>
      <circle fill="#dfaa53" r="10">
        <animateMotion
          dur="5.2s"
          path="M360 182 C430 126 472 220 532 158 S626 126 666 164"
          repeatCount="indefinite"
        />
      </circle>
    </>
  );
}

function MedicineScene() {
  return (
    <>
      <g transform="translate(120 158)">
        <circle fill="#fffaf2" r="75" stroke="#607f72" strokeWidth="6" />
        <path d="M0 0V-43" stroke="#b87259" strokeLinecap="round" strokeWidth="8">
          <animateTransform
            attributeName="transform"
            dur="12s"
            repeatCount="indefinite"
            type="rotate"
            values="0;360"
          />
        </path>
        <path d="M0 0l38 22" stroke="#b87259" strokeLinecap="round" strokeWidth="8">
          <animateTransform
            attributeName="transform"
            dur="60s"
            repeatCount="indefinite"
            type="rotate"
            values="0;360"
          />
        </path>
        <path
          d="M0-62v10M62 0H52M0 62V52M-62 0h10"
          stroke="#607f72"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </g>
      <g transform="translate(302 156)">
        <g>
          <rect
            fill="#fffaf2"
            height="126"
            rx="11"
            stroke="#a86d52"
            strokeWidth="6"
            width="88"
            x="-44"
            y="-50"
          />
          <rect fill="#d89170" height="30" rx="6" width="96" x="-48" y="-76" />
          <path d="M-23-12h46M-23 12h34" stroke="#7b9287" strokeLinecap="round" strokeWidth="6" />
          <animateTransform
            attributeName="transform"
            dur="6s"
            repeatCount="indefinite"
            type="rotate"
            values="0;-8;0"
          />
        </g>
      </g>
      <path
        d="M354 154 C408 112 446 112 492 154"
        fill="none"
        stroke="#a9beb4"
        strokeDasharray="10 12"
        strokeWidth="5"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="1.8s"
          repeatCount="indefinite"
          values="44;0"
        />
      </path>
      <circle fill="#e5b45f" r="12">
        <animateMotion
          begin=".6s"
          dur="4.8s"
          path="M338 146 C410 96 454 104 504 158"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" dur="4.8s" repeatCount="indefinite" values="0;1;1;0" />
      </circle>
      <g transform="translate(574 164)">
        <rect
          fill="#fffaf2"
          height="150"
          rx="10"
          stroke="#607f72"
          strokeWidth="6"
          width="170"
          x="-85"
          y="-75"
        />
        <path d="M-85-28h170M-85 22h170M-30-75v150M27-75v150" stroke="#9db2a8" strokeWidth="4" />
        {[
          [-57, -51],
          [0, -51],
          [57, -51],
          [-57, 0],
          [0, 0],
          [57, 0],
          [-57, 49],
          [0, 49],
          [57, 49],
        ].map(([cx, cy], index) => (
          <circle
            cx={cx}
            cy={cy}
            fill={index === 5 ? "#d89170" : "#dce8e1"}
            key={`${cx}-${cy}`}
            r="10"
          >
            {index === 5 ? (
              <animate attributeName="r" dur="2.4s" repeatCount="indefinite" values="8;14;8" />
            ) : null}
          </circle>
        ))}
      </g>
    </>
  );
}

function SafetyScene() {
  return (
    <>
      <g transform="translate(105 160)">
        <circle cy="-38" fill="#e7b184" r="34" />
        <path d="M-55 80V10c0-35 110-35 110 0v70Z" fill="#d27f66" />
        <path d="M-5-70v78" stroke="#fffaf2" strokeLinecap="round" strokeWidth="15" />
        <circle cy="8" fill="#c65f4a" r="13">
          <animate attributeName="cy" dur="4s" repeatCount="indefinite" values="8;-24;8" />
        </circle>
      </g>
      <g transform="translate(274 162)">
        <path d="M0-70C-36-28-50 0-50 26a50 50 0 0 0 100 0C50 0 36-28 0-70Z" fill="#7fabb7" />
        <path d="M-28 26h56" stroke="#d9eef2" strokeLinecap="round" strokeWidth="10">
          <animate
            attributeName="stroke-dasharray"
            dur="4s"
            repeatCount="indefinite"
            values="0 60;60 0;60 0"
          />
        </path>
        <animateTransform
          attributeName="transform"
          dur="4s"
          repeatCount="indefinite"
          type="translate"
          values="274 172;274 154;274 172"
        />
      </g>
      <g transform="translate(426 160)">
        <rect
          fill="#fffaf2"
          height="150"
          rx="8"
          stroke="#607f72"
          strokeWidth="6"
          width="120"
          x="-60"
          y="-75"
        />
        <path
          d="M-35-40h70M-35-12h54M-35 16h66M-35 44h42"
          stroke="#8fa69a"
          strokeLinecap="round"
          strokeWidth="6"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="6s"
            repeatCount="indefinite"
            values="0 80;80 0;80 0"
          />
        </path>
        <path
          d="m18 44 12 12 25-30"
          fill="none"
          stroke="#c6775e"
          strokeLinecap="round"
          strokeWidth="7"
        >
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values=".15;1;1;.15" />
        </path>
      </g>
      <g transform="translate(610 162)">
        <rect
          fill="#eef4ef"
          height="144"
          rx="18"
          stroke="#607f72"
          strokeWidth="7"
          width="82"
          x="-41"
          y="-72"
        />
        <circle cy="48" fill="#b9cabf" r="8" />
        <path
          d="M-20-26c16-18 24-18 40 0M-12-8c9-10 15-10 24 0"
          fill="none"
          stroke="#c6775e"
          strokeLinecap="round"
          strokeWidth="6"
        >
          <animate attributeName="opacity" dur="2.2s" repeatCount="indefinite" values=".2;1;.2" />
        </path>
      </g>
      <path
        d="M166 160h54M326 160h40M488 160h76"
        stroke="#a9beb4"
        strokeDasharray="10 11"
        strokeWidth="5"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="2s"
          repeatCount="indefinite"
          values="42;0"
        />
      </path>
    </>
  );
}

function CareScene() {
  return (
    <>
      <g transform="translate(270 160)" fill="#fdf9f1" stroke="#617f72" strokeWidth="6">
        <circle cy="-92" r="38" />
        <path d="M-72 12c0-70 144-70 144 0v114H20L0 60l-20 66h-52Z" />
      </g>
      <g fill="#c97962" stroke="#a95f4d" strokeWidth="3">
        <path d="M245 134c-24-28-55 10 25 62 80-52 49-90 25-62-14-18-36-18-50 0Z">
          <animate
            attributeName="opacity"
            dur="8s"
            repeatCount="indefinite"
            values="1;.25;.25;.25;1"
          />
        </path>
        <ellipse cx="238" cy="210" rx="18" ry="31">
          <animate
            attributeName="opacity"
            dur="8s"
            repeatCount="indefinite"
            values=".25;1;.25;.25;.25"
          />
        </ellipse>
        <ellipse cx="302" cy="210" rx="18" ry="31">
          <animate
            attributeName="opacity"
            dur="8s"
            repeatCount="indefinite"
            values=".25;1;.25;.25;.25"
          />
        </ellipse>
        <circle cx="270" cy="64" r="15">
          <animate
            attributeName="opacity"
            dur="8s"
            repeatCount="indefinite"
            values=".25;.25;1;.25;.25"
          />
        </circle>
        <ellipse cx="245" cy="278" rx="30" ry="12">
          <animate
            attributeName="opacity"
            dur="8s"
            repeatCount="indefinite"
            values=".25;.25;.25;1;.25"
          />
        </ellipse>
        <ellipse cx="305" cy="278" rx="30" ry="12">
          <animate
            attributeName="opacity"
            dur="8s"
            repeatCount="indefinite"
            values=".25;.25;.25;1;.25"
          />
        </ellipse>
      </g>
      <g transform="translate(530 160)">
        <rect
          fill="#fffaf2"
          height="166"
          rx="10"
          stroke="#617f72"
          strokeWidth="6"
          width="174"
          x="-87"
          y="-83"
        />
        <path d="M-87-38h174M-35-83v166M20-83v166M-87 16h174" stroke="#9fb4aa" strokeWidth="4" />
        <g
          fill="none"
          stroke="#c97962"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="7"
        >
          <path d="m-70-60 10 10 18-22">
            <animate
              attributeName="stroke-dasharray"
              dur="8s"
              repeatCount="indefinite"
              values="0 50;50 0;50 0;0 50"
            />
          </path>
          <path d="m-15-60 10 10 18-22">
            <animate
              attributeName="stroke-dasharray"
              begin="1.5s"
              dur="8s"
              repeatCount="indefinite"
              values="0 50;50 0;50 0;0 50"
            />
          </path>
          <path d="m40-60 10 10 18-22">
            <animate
              attributeName="stroke-dasharray"
              begin="3s"
              dur="8s"
              repeatCount="indefinite"
              values="0 50;50 0;50 0;0 50"
            />
          </path>
          <path d="m-70-5 10 10 18-22">
            <animate
              attributeName="stroke-dasharray"
              begin="4.5s"
              dur="8s"
              repeatCount="indefinite"
              values="0 50;50 0;50 0;0 50"
            />
          </path>
        </g>
      </g>
      <path d="M358 160h74" stroke="#a9beb4" strokeDasharray="10 11" strokeWidth="5">
        <animate
          attributeName="stroke-dashoffset"
          dur="2s"
          repeatCount="indefinite"
          values="42;0"
        />
      </path>
    </>
  );
}

function SupportScene() {
  return (
    <>
      <path
        d="M48 258c182-8 430-8 624 0"
        fill="none"
        stroke="#a9bdb3"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <g transform="translate(360 252)">
        <circle cy="-142" fill="#e4ad82" r="34" />
        <path d="M-50-102c0-38 100-38 100 0v96H-50Z" fill="#cd7b62" />
        <path
          d="M-38-70c-44-4-72-22-94-52"
          fill="none"
          stroke="#cd7b62"
          strokeLinecap="round"
          strokeWidth="15"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="4s"
            repeatCount="indefinite"
            values="0 120;120 0;120 0"
          />
        </path>
      </g>
      <g transform="translate(124 252)">
        <circle cy="-130" fill="#d7a47c" r="31" />
        <path d="M-44-94c0-34 88-34 88 0v88h-88Z" fill="#719583" />
        <animateTransform
          attributeName="transform"
          dur="5.5s"
          repeatCount="indefinite"
          type="translate"
          values="-60 252;124 252;124 252;-60 252"
        />
      </g>
      <g transform="translate(596 252)">
        <circle cy="-130" fill="#e5bb91" r="31" />
        <path d="M-44-94c0-34 88-34 88 0v88h-88Z" fill="#7d99a2" />
        <animateTransform
          attributeName="transform"
          dur="5.5s"
          repeatCount="indefinite"
          type="translate"
          values="780 252;596 252;596 252;780 252"
        />
      </g>
      <g transform="translate(216 218)">
        <path d="M-36-32h72l12 58h-96Z" fill="#edc687" stroke="#a86c4b" strokeWidth="5" />
        <path d="M-20-32c0-30 40-30 40 0" fill="none" stroke="#a86c4b" strokeWidth="5" />
        <animateTransform
          attributeName="transform"
          dur="5.5s"
          repeatCount="indefinite"
          type="translate"
          values="-120 218;216 218;216 218;-120 218"
        />
      </g>
      <g transform="translate(505 218)">
        <path d="M-28-35h50l-6 56h-38Z" fill="#fffaf2" stroke="#6e8d80" strokeWidth="5" />
        <path
          d="M-12-49c-9-14 10-18 1-32M5-49c-9-14 10-18 1-32"
          fill="none"
          stroke="#91aa9f"
          strokeLinecap="round"
          strokeWidth="4"
        >
          <animateTransform
            attributeName="transform"
            dur="2.8s"
            repeatCount="indefinite"
            type="translate"
            values="0 7;0 -8;0 7"
          />
          <animate
            attributeName="opacity"
            dur="2.8s"
            repeatCount="indefinite"
            values=".15;.9;.15"
          />
        </path>
        <animateTransform
          attributeName="transform"
          dur="5.5s"
          repeatCount="indefinite"
          type="translate"
          values="820 218;505 218;505 218;820 218"
        />
      </g>
      <path
        d="M212 92c52-44 96-44 142 0M508 92c-52-44-96-44-142 0"
        fill="none"
        stroke="#c97a62"
        strokeDasharray="9 11"
        strokeWidth="5"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="2s"
          repeatCount="indefinite"
          values="40;0"
        />
      </path>
    </>
  );
}

function Scene({ variant }: { variant: MotionVariant }) {
  switch (variant) {
    case "context":
      return <ContextScene />;
    case "source":
      return <SourceScene />;
    case "daily":
      return <DailyScene />;
    case "medicine":
      return <MedicineScene />;
    case "safety":
      return <SafetyScene />;
    case "care":
      return <CareScene />;
    case "support":
      return <SupportScene />;
  }
}

export function EditorialMotion({ variant }: { variant: MotionVariant }) {
  const copy = motionCopy[variant];

  return (
    <figure className={styles.motionFigure} data-motion-scene={variant}>
      <div className={styles.motionStage}>
        <svg
          aria-label={copy.sceneLabel}
          className={styles.motionArt}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          viewBox="0 0 720 320"
        >
          <rect fill="#edf3ef" height="320" width="720" />
          <circle cx="650" cy="52" fill="#f0cf92" opacity=".72" r="30">
            <animate attributeName="r" dur="5s" repeatCount="indefinite" values="27;34;27" />
          </circle>
          <Scene variant={variant} />
        </svg>
      </div>
      <figcaption>
        <p>{copy.watch}</p>
        <strong>{copy.label}</strong>
        <span>{copy.note}</span>
      </figcaption>
    </figure>
  );
}
