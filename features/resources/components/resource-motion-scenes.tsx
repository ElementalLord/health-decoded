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
    watch: "Watch the plate come together first, then follow the energy into the working muscle.",
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

const DAY_TRACK = "M150 182 Q214 150 278 172 Q342 194 406 172 Q470 150 534 172 Q574 184 588 182";

function ContextScene() {
  return (
    <>
      {/* the glucose meter that produced the reading */}
      <g transform="translate(96 176)">
        <rect
          fill="#fffaf2"
          height="88"
          rx="13"
          stroke="#567a6b"
          strokeWidth="5"
          width="94"
          x="-47"
          y="-44"
        />
        <rect
          fill="#e7efe9"
          height="36"
          rx="6"
          stroke="#8ea79b"
          strokeWidth="3"
          width="70"
          x="-35"
          y="-32"
        />
        <path d="M-6-20h22M-6-10h14" stroke="#8ea79b" strokeLinecap="round" strokeWidth="4" />
        <circle cx="-22" cy="-14" fill="#dfa54d" r="5">
          <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1;.35;1" />
        </circle>
        <path d="M-30 22h60" stroke="#cf9a6f" strokeLinecap="round" strokeWidth="7" />
      </g>

      {/* the day itself: one soft timeline the reading rides */}
      <path d={DAY_TRACK} fill="none" stroke="#b4c5bd" strokeLinecap="round" strokeWidth="6" />

      {/* meal station */}
      <g stroke="#9db3a8" strokeWidth="3">
        <path d="M278 172V143" strokeLinecap="round" />
        <circle cx="278" cy="128" fill="#fffaf2" r="6" stroke="#9db3a8" />
      </g>
      <circle cx="278" cy="128" fill="none" r="13" stroke="#bc755e" strokeWidth="4" />
      <path
        d="M272 121v14M278 121v14M284 121v14"
        stroke="#bc755e"
        strokeLinecap="round"
        strokeWidth="2.4"
      />

      {/* movement station */}
      <g stroke="#9db3a8" strokeWidth="3">
        <path d="M406 172V143" strokeLinecap="round" />
        <circle cx="406" cy="128" fill="#fffaf2" r="6" stroke="#9db3a8" />
      </g>
      <path
        d="M396 133l6-9 6 9M406 122l6-9 6 9"
        fill="none"
        stroke="#587b6c"
        strokeLinecap="round"
        strokeWidth="4"
      >
        <animate attributeName="opacity" dur="2.6s" repeatCount="indefinite" values=".4;1;.4" />
      </path>

      {/* sleep station */}
      <g stroke="#9db3a8" strokeWidth="3">
        <path d="M534 172V143" strokeLinecap="round" />
        <circle cx="534" cy="128" fill="#fffaf2" r="6" stroke="#9db3a8" />
      </g>
      <path
        d="M540 116a13 13 0 1 0 0 24 10 10 0 0 1 0-24Z"
        fill="#74899a"
        transform="translate(-6 0)"
      />

      {/* the question the reading becomes */}
      <g transform="translate(650 178)">
        <rect
          fill="#fffaf2"
          height="104"
          rx="12"
          stroke="#567a6b"
          strokeWidth="5"
          width="104"
          x="-52"
          y="-52"
        />
        <path
          d="M-30-24h60M-30-4h44M-30 16h54"
          stroke="#cb8469"
          strokeLinecap="round"
          strokeWidth="6"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="5.6s"
            repeatCount="indefinite"
            values="0 170;170 0;170 0"
          />
        </path>
        <circle cx="26" cy="34" fill="#cb8469" r="4" />
      </g>

      {/* the amber reading, riding the exact timeline it is drawn on */}
      <circle fill="#dfa54d" r="10">
        <animateMotion dur="7s" path={DAY_TRACK} repeatCount="indefinite" />
        <animate attributeName="r" dur="2s" repeatCount="indefinite" values="8;12;8" />
        <animate attributeName="opacity" dur="7s" repeatCount="indefinite" values="0;1;1;1;1;0" />
      </circle>
    </>
  );
}

function SourceScene() {
  return (
    <>
      {/* two official source pages travel together toward verification */}
      <g>
        <g transform="translate(60 96)">
          <rect
            fill="#fffaf2"
            height="132"
            rx="10"
            stroke="#6e8c80"
            strokeWidth="5"
            width="104"
            x="0"
            y="0"
          />
          <path
            d="M20 26h64M20 50h48M20 74h60M20 98h40"
            stroke="#8ba298"
            strokeLinecap="round"
            strokeWidth="6"
          />
        </g>
        <g transform="translate(104 116)">
          <rect
            fill="#f6eadf"
            height="132"
            rx="10"
            stroke="#b87760"
            strokeWidth="5"
            width="104"
            x="0"
            y="0"
          />
          <path
            d="M20 26h64M20 50h44M20 74h58M20 98h38"
            stroke="#c08a76"
            strokeLinecap="round"
            strokeWidth="6"
          />
        </g>
        <animateTransform
          attributeName="transform"
          dur="7s"
          repeatCount="indefinite"
          type="translate"
          values="0 0;118 0;118 0;0 0"
        />
      </g>

      {/* the verification mark the guidance passes through */}
      <g transform="translate(400 160)">
        <path
          d="M0-74l52 19v42c0 48-32 70-52 82-20-12-52-34-52-82v-42Z"
          fill="#e7efe9"
          stroke="#567a6b"
          strokeWidth="6"
        />
        <path
          d="m-24 4 16 16 34-40"
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
        <circle fill="none" r="80" stroke="#d9a36b" strokeWidth="4">
          <animate attributeName="r" dur="3.6s" repeatCount="indefinite" values="66;86;66" />
          <animate attributeName="opacity" dur="3.6s" repeatCount="indefinite" values=".7;0;.7" />
        </circle>
      </g>

      {/* the short, plain-language question note it becomes */}
      <g transform="translate(600 160)">
        <rect
          fill="#fffaf2"
          height="140"
          rx="10"
          stroke="#6e8c80"
          strokeWidth="5"
          width="120"
          x="-60"
          y="-70"
        />
        <path
          d="M-36-34h64M-36-6h46M-36 22h58"
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
        <circle cx="30" cy="44" fill="#e6b774" r="7">
          <animate attributeName="r" dur="2.4s" repeatCount="indefinite" values="5;10;5" />
        </circle>
      </g>

      {/* verified guidance carried into the note */}
      <path
        d="M455 160H534"
        stroke="#78988a"
        strokeDasharray="9 11"
        strokeLinecap="round"
        strokeWidth="5"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="2s"
          repeatCount="indefinite"
          values="40;0"
        />
      </path>
      <circle fill="#dfa54d" r="7">
        <animateMotion begin=".4s" dur="3s" path="M455 160H534" repeatCount="indefinite" />
        <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0;1;1;0" />
      </circle>
    </>
  );
}

const ENERGY_TRACK = "M306 178 Q396 148 462 184 Q528 220 596 184";

function DailyScene() {
  return (
    <>
      {/* a familiar plate, filled by addition and kept inside its rim */}
      <circle cx="210" cy="168" fill="#fffaf2" r="84" />
      <g>
        <path d="M210 168 L210 84 A84 84 0 0 0 210 252 Z" fill="#739783" />
        <animateTransform
          attributeName="transform"
          dur="6s"
          repeatCount="indefinite"
          type="translate"
          values="-130 0;0 0;0 0;-130 0"
        />
      </g>
      <g>
        <path d="M210 168 L210 84 A84 84 0 0 1 294 168 Z" fill="#e3b261" />
        <animateTransform
          attributeName="transform"
          dur="6s"
          repeatCount="indefinite"
          type="translate"
          values="80 -70;0 0;0 0;80 -70"
        />
      </g>
      <g>
        <path d="M210 168 L294 168 A84 84 0 0 1 210 252 Z" fill="#cf8068" />
        <animateTransform
          attributeName="transform"
          dur="6s"
          repeatCount="indefinite"
          type="translate"
          values="0 96;0 0;0 0;0 96"
        />
      </g>
      <path d="M210 84v168M210 168h84" opacity=".5" stroke="#fffaf2" strokeWidth="4" />
      <circle cx="210" cy="168" fill="none" r="92" stroke="#b87760" strokeWidth="6" />

      {/* footsteps carrying energy toward a working muscle */}
      <path
        d={ENERGY_TRACK}
        fill="none"
        stroke="#a8beb2"
        strokeDasharray="12 13"
        strokeLinecap="round"
        strokeWidth="6"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="2.6s"
          repeatCount="indefinite"
          values="50;0"
        />
      </path>
      <g fill="none" stroke="#527767" strokeLinecap="round" strokeWidth="9">
        <path d="M356 160l16 22M420 196l16 22M498 176l16 22" />
        <animate attributeName="opacity" dur="3.2s" repeatCount="indefinite" values=".25;1;.25" />
      </g>

      {/* the muscle that puts the energy to use */}
      <g transform="translate(612 178)">
        <rect fill="#cf8f6f" height="26" rx="13" width="54" x="-42" y="6" />
        <rect fill="#cf8f6f" height="54" rx="13" width="26" x="-4" y="-42" />
        <circle cx="9" cy="-42" fill="#cf8f6f" r="15" />
        <ellipse cx="-10" cy="8" fill="#b87760" rx="18" ry="15" />
        <ellipse cx="-10" cy="6" fill="#f0c98f" rx="10" ry="8">
          <animate attributeName="opacity" dur="2.2s" repeatCount="indefinite" values=".2;.95;.2" />
        </ellipse>
        <animateTransform
          attributeName="transform"
          additive="sum"
          dur="2.2s"
          repeatCount="indefinite"
          type="rotate"
          values="0 0 0;-4 0 0;0 0 0"
        />
      </g>

      {/* the glucose energy following the footsteps into the muscle */}
      <circle fill="#dfaa53" r="9">
        <animateMotion dur="4.4s" path={ENERGY_TRACK} repeatCount="indefinite" />
        <animate attributeName="opacity" dur="4.4s" repeatCount="indefinite" values="0;1;1;1;0" />
      </circle>
    </>
  );
}

const DOSE_ARC = "M330 150 C432 92 536 96 632 158";

function MedicineScene() {
  return (
    <>
      {/* the timing cue: a clock that advances */}
      <g transform="translate(112 158)">
        <circle fill="#fffaf2" r="66" stroke="#607f72" strokeWidth="6" />
        <path
          d="M0-56v10M56 0H46M0 56V46M-56 0h10"
          stroke="#607f72"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path d="M0 0V-38" stroke="#b87259" strokeLinecap="round" strokeWidth="7">
          <animateTransform
            attributeName="transform"
            dur="12s"
            repeatCount="indefinite"
            type="rotate"
            values="0;360"
          />
        </path>
        <path d="M0 0l30 18" stroke="#b87259" strokeLinecap="round" strokeWidth="7">
          <animateTransform
            attributeName="transform"
            dur="60s"
            repeatCount="indefinite"
            type="rotate"
            values="0;360"
          />
        </path>
        <circle fill="#607f72" r="5" />
      </g>

      {/* one dose leaves the bottle */}
      <g transform="translate(300 158)">
        <g>
          <rect
            fill="#fffaf2"
            height="120"
            rx="11"
            stroke="#a86d52"
            strokeWidth="6"
            width="84"
            x="-42"
            y="-46"
          />
          <rect fill="#d89170" height="28" rx="6" width="92" x="-46" y="-70" />
          <path d="M-22-10h44M-22 14h32" stroke="#7b9287" strokeLinecap="round" strokeWidth="6" />
          <animateTransform
            attributeName="transform"
            dur="6s"
            repeatCount="indefinite"
            type="rotate"
            values="0;-7;0"
          />
        </g>
      </g>

      {/* the exact arc the dose follows into its compartment */}
      <path
        d={DOSE_ARC}
        fill="none"
        stroke="#a9beb4"
        strokeDasharray="10 12"
        strokeLinecap="round"
        strokeWidth="5"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="1.9s"
          repeatCount="indefinite"
          values="44;0"
        />
      </path>

      {/* the day-and-time organizer */}
      <g transform="translate(575 164)">
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
              <animate attributeName="r" dur="1.9s" repeatCount="indefinite" values="9;14;9" />
            ) : null}
          </circle>
        ))}
      </g>

      {/* the single dose, riding the arc into the matching space */}
      <circle fill="#e5b45f" r="11">
        <animateMotion dur="4.4s" path={DOSE_ARC} repeatCount="indefinite" />
        <animate attributeName="opacity" dur="4.4s" repeatCount="indefinite" values="0;1;1;1;0" />
      </circle>
    </>
  );
}

function SafetyScene() {
  return (
    <>
      {/* notice a change: a thermometer whose reading rises */}
      <g transform="translate(110 166)">
        <rect
          fill="#fffaf2"
          height="98"
          rx="12"
          stroke="#c07a5f"
          strokeWidth="5"
          width="24"
          x="-12"
          y="-72"
        />
        <circle cy="42" fill="#c65f4a" r="21" stroke="#a94f3d" strokeWidth="4" />
        <path d="M0 40V-56" stroke="#c65f4a" strokeLinecap="round" strokeWidth="9">
          <animate
            attributeName="stroke-dasharray"
            dur="3.6s"
            repeatCount="indefinite"
            values="0 120;78 42;0 120"
          />
        </path>
        <path d="M15-50h9M15-30h9M15-10h9" stroke="#c07a5f" strokeLinecap="round" strokeWidth="3" />
      </g>

      {/* restore hydration */}
      <g transform="translate(285 166)">
        <path d="M0-62C-33-22-45 3-45 25a45 45 0 0 0 90 0C45 3 33-22 0-62Z" fill="#7fabb7" />
        <path d="M-25 24h50" stroke="#d9eef2" strokeLinecap="round" strokeWidth="10">
          <animate
            attributeName="stroke-dasharray"
            dur="3.4s"
            repeatCount="indefinite"
            values="0 60;60 0;60 0"
          />
        </path>
        <animateTransform
          attributeName="transform"
          dur="3.4s"
          repeatCount="indefinite"
          type="translate"
          values="285 174;285 158;285 174"
        />
      </g>

      {/* open the written plan */}
      <g transform="translate(448 166)">
        <rect
          fill="#fffaf2"
          height="146"
          rx="10"
          stroke="#607f72"
          strokeWidth="6"
          width="118"
          x="-59"
          y="-73"
        />
        <path
          d="M-34-40h68M-34-12h52M-34 16h64"
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
          d="m14 42 12 12 26-30"
          fill="none"
          stroke="#c6775e"
          strokeLinecap="round"
          strokeWidth="7"
        >
          <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values=".15;1;1;.15" />
        </path>
      </g>

      {/* connect to help when the plan says it is time */}
      <g transform="translate(610 166)">
        <rect
          fill="#eef4ef"
          height="140"
          rx="16"
          stroke="#607f72"
          strokeWidth="7"
          width="80"
          x="-40"
          y="-70"
        />
        <circle cy="46" fill="#b9cabf" r="7" />
        <path
          d="M-20-24c15-17 25-17 40 0M-12-6c9-10 15-10 24 0"
          fill="none"
          stroke="#c6775e"
          strokeLinecap="round"
          strokeWidth="6"
        >
          <animate attributeName="opacity" dur="2.2s" repeatCount="indefinite" values=".2;1;.2" />
        </path>
      </g>

      {/* one clean baseline joining the sequence */}
      <path
        d="M146 166H240M336 166H384M514 166H566"
        stroke="#a9beb4"
        strokeDasharray="10 11"
        strokeLinecap="round"
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
      {/* a calm standing body, checked area by area, breathing as one */}
      <g>
        <g fill="#fdf9f1" stroke="#617f72" strokeWidth="6">
          <circle cx="235" cy="102" r="33" />
          <path d="M226 134h18v22h-18Z" />
          <path d="M180 254C176 188 186 158 235 158C284 158 294 188 290 254Z" />
          <path d="M214 254v12M256 254v12" fill="none" strokeLinecap="round" />
          <ellipse cx="211" cy="268" rx="17" ry="9" />
          <ellipse cx="259" cy="268" rx="17" ry="9" />
        </g>

        {/* five areas, each lit in its own moment */}
        <g fill="#c97962">
          {/* eyes */}
          <g>
            <circle cx="226" cy="98" r="4.5" />
            <circle cx="244" cy="98" r="4.5" />
            <animate
              attributeName="opacity"
              dur="10s"
              repeatCount="indefinite"
              values="1;.28;.28;.28;.28;1"
            />
          </g>
          {/* mouth */}
          <g>
            <path
              d="M226 114c5 6 13 6 18 0"
              fill="none"
              stroke="#c97962"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <animate
              attributeName="opacity"
              dur="10s"
              repeatCount="indefinite"
              values=".28;.28;.28;.28;1;.28"
            />
          </g>
          {/* heart */}
          <g>
            <path d="M222 182c-5-9-18-6-18 5 0 9 18 19 18 19s18-10 18-19c0-11-13-14-18-5Z" />
            <animate
              attributeName="opacity"
              dur="10s"
              repeatCount="indefinite"
              values=".28;.28;1;.28;.28;.28"
            />
          </g>
          {/* kidneys */}
          <g>
            <ellipse cx="215" cy="222" rx="10" ry="15" />
            <ellipse cx="255" cy="222" rx="10" ry="15" />
            <animate
              attributeName="opacity"
              dur="10s"
              repeatCount="indefinite"
              values=".28;1;.28;.28;.28;.28"
            />
          </g>
          {/* feet */}
          <g>
            <ellipse cx="211" cy="268" rx="15" ry="8" />
            <ellipse cx="259" cy="268" rx="15" ry="8" />
            <animate
              attributeName="opacity"
              dur="10s"
              repeatCount="indefinite"
              values=".28;.28;.28;1;.28;.28"
            />
          </g>
        </g>

        <animateTransform
          attributeName="transform"
          dur="6s"
          repeatCount="indefinite"
          type="translate"
          values="0 0;0 -3;0 0"
        />
      </g>

      {/* the care record filling one visit at a time */}
      <g transform="translate(540 160)">
        <rect
          fill="#fffaf2"
          height="166"
          rx="10"
          stroke="#617f72"
          strokeWidth="6"
          width="170"
          x="-85"
          y="-83"
        />
        <path d="M-85-52h170M-26-52v112M26-52v112M-85 4h170" stroke="#9fb4aa" strokeWidth="4" />
        <path d="M-70-72h44" stroke="#c6a08f" strokeLinecap="round" strokeWidth="6" />
        <g
          fill="none"
          stroke="#c97962"
          strokeDasharray="40"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="7"
        >
          <path d="m-64-30 8 9 15-18">
            <animate
              attributeName="stroke-dashoffset"
              dur="10s"
              repeatCount="indefinite"
              values="40;0;0;0;0;0"
            />
          </path>
          <path d="m-8-30 8 9 15-18">
            <animate
              attributeName="stroke-dashoffset"
              dur="10s"
              repeatCount="indefinite"
              values="40;40;0;0;0;0"
            />
          </path>
          <path d="m48-30 8 9 15-18">
            <animate
              attributeName="stroke-dashoffset"
              dur="10s"
              repeatCount="indefinite"
              values="40;40;40;0;0;0"
            />
          </path>
          <path d="m-64 26 8 9 15-18">
            <animate
              attributeName="stroke-dashoffset"
              dur="10s"
              repeatCount="indefinite"
              values="40;40;40;40;0;0"
            />
          </path>
          <path d="m-8 26 8 9 15-18">
            <animate
              attributeName="stroke-dashoffset"
              dur="10s"
              repeatCount="indefinite"
              values="40;40;40;40;40;0"
            />
          </path>
        </g>
      </g>

      {/* the visit joins the record */}
      <path
        d="M300 160H452"
        stroke="#a9beb4"
        strokeDasharray="10 11"
        strokeLinecap="round"
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

function SupportScene() {
  return (
    <>
      {/* the ground everyone shares */}
      <path
        d="M60 262c180-8 420-8 600 0"
        fill="none"
        stroke="#a9bdb3"
        strokeLinecap="round"
        strokeWidth="6"
      />

      {/* the person who makes the ask */}
      <g transform="translate(360 256)">
        <circle cy="-118" fill="#e4ad82" r="32" />
        <path d="M-46-84c0-36 92-36 92 0v86H-46Z" fill="#cd7b62" />
        {/* the ask itself, rising and opening outward */}
        <circle cy="-92" fill="none" r="14" stroke="#c97a62" strokeWidth="4">
          <animate attributeName="r" dur="3.4s" repeatCount="indefinite" values="10;40;10" />
          <animate attributeName="opacity" dur="3.4s" repeatCount="indefinite" values=".85;0;.85" />
        </circle>
        <path d="M-9-96c0-7 9-5 9 1 0-6 9-8 9-1 0 7-9 13-9 13s-9-6-9-13Z" fill="#c97a62">
          <animateTransform
            attributeName="transform"
            dur="3.4s"
            repeatCount="indefinite"
            type="translate"
            values="0 6;0 -10;0 6"
          />
        </path>
      </g>

      {/* a companion arriving from the left with a warm drink */}
      <g>
        <g transform="translate(150 256)">
          <circle cy="-108" fill="#d7a47c" r="30" />
          <path d="M-42-76c0-32 84-32 84 0v78h-84Z" fill="#719583" />
        </g>
        <g transform="translate(214 224)">
          <path
            d="M-24-24h48v30a24 24 0 0 1-48 0Z"
            fill="#edc687"
            stroke="#a86c4b"
            strokeWidth="5"
          />
          <path d="M24-16c18 0 18 24 0 24" fill="none" stroke="#a86c4b" strokeWidth="5" />
          <g stroke="#c9a06f" strokeLinecap="round" strokeWidth="4">
            <path d="M-8-32c-6-8 6-12 0-20M8-32c-6-8 6-12 0-20">
              <animateTransform
                attributeName="transform"
                dur="2.8s"
                repeatCount="indefinite"
                type="translate"
                values="0 6;0 -8;0 6"
              />
              <animate
                attributeName="opacity"
                dur="2.8s"
                repeatCount="indefinite"
                values=".15;.9;.15"
              />
            </path>
          </g>
        </g>
        <animateTransform
          attributeName="transform"
          dur="5.5s"
          repeatCount="indefinite"
          type="translate"
          values="-150 0;0 0;0 0;-150 0"
        />
      </g>

      {/* a companion arriving from the right with a practical task */}
      <g>
        <g transform="translate(570 256)">
          <circle cy="-108" fill="#e5bb91" r="30" />
          <path d="M-42-76c0-32 84-32 84 0v78h-84Z" fill="#7d99a2" />
        </g>
        <g transform="translate(506 226)">
          <ellipse cx="0" cy="8" fill="#e7efe9" rx="34" ry="9" stroke="#6e8d80" strokeWidth="4" />
          <path d="M-30 8c0-24 60-24 60 0Z" fill="#fffaf2" stroke="#6e8d80" strokeWidth="5" />
          <circle cy="-18" fill="#6e8d80" r="4" />
          <path d="M0-18v6" stroke="#6e8d80" strokeLinecap="round" strokeWidth="4" />
        </g>
        <animateTransform
          attributeName="transform"
          dur="5.5s"
          repeatCount="indefinite"
          type="translate"
          values="150 0;0 0;0 0;150 0"
        />
      </g>
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
