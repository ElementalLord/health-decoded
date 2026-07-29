"use client";

import styles from "./resources.module.css";

export type MotionVariant =
  "care" | "context" | "daily" | "medicine" | "safety" | "source" | "support";

const motionCopy: Record<MotionVariant, { sceneLabel: string }> = {
  care: {
    sceneLabel:
      "A person receives calm preventive attention for their eyes, heart, kidneys, feet, and mouth while a calendar records each visit",
  },
  context: {
    sceneLabel:
      "A reading moves along a clear timeline past separate meal, movement, and sleep stations before becoming a question",
  },
  daily: {
    sceneLabel:
      "Food groups assemble on a familiar plate before energy travels toward a person taking an ordinary walk",
  },
  medicine: {
    sceneLabel:
      "A clock advances while a medicine moves from its bottle into the correct day and time compartment",
  },
  safety: {
    sceneLabel:
      "A temperature rises, hydration is restored, a written plan opens, and a phone connects to support",
  },
  source: {
    sceneLabel:
      "Two official source pages pass through a verification mark and become a short question note",
  },
  support: {
    sceneLabel:
      "One person makes an ask, two people move closer, and a practical task and warm drink arrive",
  },
};

const DAY_TRACK = "M142 224 H574";

function ContextScene() {
  return (
    <>
      <g transform="translate(82 218)">
        <rect
          fill="#fffaf2"
          height="78"
          rx="11"
          stroke="#567a6b"
          strokeWidth="5"
          width="82"
          x="-41"
          y="-39"
        />
        <rect
          fill="#e7efe9"
          height="31"
          rx="6"
          stroke="#8ea79b"
          strokeWidth="3"
          width="60"
          x="-30"
          y="-29"
        />
        <path d="M-3-19h19M-3-10h12" stroke="#8ea79b" strokeLinecap="round" strokeWidth="4" />
        <circle cx="-19" cy="-14" fill="#dfa54d" r="5">
          <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1;.35;1" />
        </circle>
        <path d="M-26 20h52" stroke="#cf9a6f" strokeLinecap="round" strokeWidth="7" />
      </g>

      <path d={DAY_TRACK} fill="none" stroke="#b4c5bd" strokeLinecap="round" strokeWidth="6" />

      {/* Three independent context stations never cross the reading path. */}
      <g transform="translate(238 128)">
        <circle fill="#fffaf2" r="42" stroke="#9db3a8" strokeWidth="4" />
        <circle fill="#e5b35e" r="21" />
        <path d="M-17 0h34M0-17v34" stroke="#fffaf2" strokeWidth="3" />
        <path d="M0 42v54" stroke="#9db3a8" strokeLinecap="round" strokeWidth="4" />
      </g>

      <g transform="translate(376 128)">
        <circle fill="#fffaf2" r="42" stroke="#9db3a8" strokeWidth="4" />
        <circle cy="-13" fill="#dfa77d" r="9" />
        <path
          d="M0-3v14M0 3l-12 11M0 3l12 11M0 11l-10 18M0 11l10 18"
          fill="none"
          stroke="#587b6c"
          strokeLinecap="round"
          strokeWidth="5"
        >
          <animateTransform
            attributeName="transform"
            dur="2.4s"
            repeatCount="indefinite"
            type="rotate"
            values="-3 0 4;3 0 4;-3 0 4"
          />
        </path>
        <path d="M0 42v54" stroke="#9db3a8" strokeLinecap="round" strokeWidth="4" />
      </g>

      <g transform="translate(514 128)">
        <circle fill="#fffaf2" r="42" stroke="#9db3a8" strokeWidth="4" />
        <path
          d="M8-23a25 25 0 1 0 0 46 19 19 0 0 1 0-46Z"
          fill="#74899a"
          transform="translate(-8 0)"
        />
        <path d="M0 42v54" stroke="#9db3a8" strokeLinecap="round" strokeWidth="4" />
      </g>

      <g transform="translate(650 218)">
        <rect
          fill="#fffaf2"
          height="92"
          rx="12"
          stroke="#567a6b"
          strokeWidth="5"
          width="100"
          x="-50"
          y="-46"
        />
        <path
          d="M-28-22h56M-28-2h40M-28 18h50"
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
        <circle cx="26" cy="31" fill="#cb8469" r="4" />
      </g>

      <circle fill="#dfa54d" r="10">
        <animateMotion dur="7s" path={DAY_TRACK} repeatCount="indefinite" />
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

const ENERGY_TRACK = "M302 188 C370 136 442 136 510 176";

function DailyScene() {
  return (
    <>
      <circle cx="190" cy="174" fill="#fffaf2" r="78" />
      <g>
        <path d="M190 174 L190 96 A78 78 0 0 0 190 252 Z" fill="#739783" />
        <animateTransform
          attributeName="transform"
          dur="6s"
          repeatCount="indefinite"
          type="translate"
          values="-130 0;0 0;0 0;-130 0"
        />
      </g>
      <g>
        <path d="M190 174 L190 96 A78 78 0 0 1 268 174 Z" fill="#e3b261" />
        <animateTransform
          attributeName="transform"
          dur="6s"
          repeatCount="indefinite"
          type="translate"
          values="80 -70;0 0;0 0;80 -70"
        />
      </g>
      <g>
        <path d="M190 174 L268 174 A78 78 0 0 1 190 252 Z" fill="#cf8068" />
        <animateTransform
          attributeName="transform"
          dur="6s"
          repeatCount="indefinite"
          type="translate"
          values="0 96;0 0;0 0;0 96"
        />
      </g>
      <path d="M190 96v156M190 174h78" opacity=".5" stroke="#fffaf2" strokeWidth="4" />
      <circle cx="190" cy="174" fill="none" r="86" stroke="#b87760" strokeWidth="6" />

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
      {/* A recognizable walking person replaces the abstract muscle shape. */}
      <g transform="translate(625 86)">
        <circle cx="0" cy="28" fill="#dfa77d" r="25" />
        <path d="M-22 18c8-22 36-22 44 0" fill="#6f5a4d" />
        <path d="M-34 70c0-26 68-26 68 0v69h-68Z" fill="#739783" />
        <g transform="translate(0 70)">
          <path d="M-26 6l-34 42" stroke="#587b6c" strokeLinecap="round" strokeWidth="10">
            <animateTransform
              attributeName="transform"
              dur="1.8s"
              repeatCount="indefinite"
              type="rotate"
              values="-12 -26 6;12 -26 6;-12 -26 6"
            />
          </path>
          <path d="M26 6l34 42" stroke="#587b6c" strokeLinecap="round" strokeWidth="10">
            <animateTransform
              attributeName="transform"
              dur="1.8s"
              repeatCount="indefinite"
              type="rotate"
              values="12 26 6;-12 26 6;12 26 6"
            />
          </path>
        </g>
        <g transform="translate(0 136)">
          <path d="M-17 0l-20 72" stroke="#536f63" strokeLinecap="round" strokeWidth="12">
            <animateTransform
              attributeName="transform"
              dur="1.8s"
              repeatCount="indefinite"
              type="rotate"
              values="12 -17 0;-12 -17 0;12 -17 0"
            />
          </path>
          <path d="M17 0l20 72" stroke="#536f63" strokeLinecap="round" strokeWidth="12">
            <animateTransform
              attributeName="transform"
              dur="1.8s"
              repeatCount="indefinite"
              type="rotate"
              values="-12 17 0;12 17 0;-12 17 0"
            />
          </path>
        </g>
      </g>

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
      {/* A recognizably human figure: head, hair, face, clothing, arms, trousers, and shoes. */}
      <g transform="translate(10 2)">
        <circle cx="225" cy="76" fill="#dfa77d" r="35" stroke="#617f72" strokeWidth="5" />
        <path d="M191 70c4-42 64-43 69 0-18-11-51-11-69 0Z" fill="#65574d" />
        <circle cx="214" cy="80" fill="#5d6f67" r="3" />
        <circle cx="236" cy="80" fill="#5d6f67" r="3" />
        <path
          d="M216 95c6 4 12 4 18 0"
          fill="none"
          stroke="#9c6958"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path d="M216 110h18v17h-18Z" fill="#dfa77d" stroke="#617f72" strokeWidth="4" />
        <path
          d="M173 222c0-69 5-99 52-99s52 30 52 99Z"
          fill="#789b89"
          stroke="#617f72"
          strokeWidth="5"
        />
        <path
          d="M178 142l-34 73M272 142l34 73"
          stroke="#617f72"
          strokeLinecap="round"
          strokeWidth="14"
        />
        <circle cx="142" cy="218" fill="#dfa77d" r="9" />
        <circle cx="308" cy="218" fill="#dfa77d" r="9" />
        <path d="M188 218h74v34h-74Z" fill="#758b98" stroke="#617f72" strokeWidth="5" />
        <path
          d="M207 251l-4 39M243 251l4 39"
          stroke="#617f72"
          strokeLinecap="round"
          strokeWidth="14"
        />
        <path d="M181 290h26M243 290h26" stroke="#4e665d" strokeLinecap="round" strokeWidth="13" />

        <g fill="#c97962">
          <g>
            <path d="M208 80h12M230 80h12" stroke="#c97962" strokeLinecap="round" strokeWidth="5" />
            <animate
              attributeName="opacity"
              dur="10s"
              repeatCount="indefinite"
              values="1;.28;.28;.28;.28;1"
            />
          </g>
          <g>
            <path
              d="M216 95c6 4 12 4 18 0"
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
          <g>
            <path d="M213 160c-5-9-18-6-18 5 0 9 18 19 18 19s18-10 18-19c0-11-13-14-18-5Z" />
            <animate
              attributeName="opacity"
              dur="10s"
              repeatCount="indefinite"
              values=".28;.28;1;.28;.28;.28"
            />
          </g>
          <g>
            <path d="M200 190c-12 0-15 20-3 26 10 5 14-8 14-17 0-5-3-9-11-9ZM250 190c12 0 15 20 3 26-10 5-14-8-14-17 0-5 3-9 11-9Z" />
            <animate
              attributeName="opacity"
              dur="10s"
              repeatCount="indefinite"
              values=".28;1;.28;.28;.28;.28"
            />
          </g>
          <g>
            <path
              d="M181 290h26M243 290h26"
              fill="none"
              stroke="#c97962"
              strokeLinecap="round"
              strokeWidth="9"
            />
            <animate
              attributeName="opacity"
              dur="10s"
              repeatCount="indefinite"
              values=".28;.28;.28;1;.28;.28"
            />
          </g>
        </g>
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
    </figure>
  );
}
