"use client";

import { useRef, useState, type CSSProperties } from "react";

import styles from "@/features/lessons/components/lesson-motion-figure.module.css";
import { cn } from "@/lib/utils";

export type LessonMotionVariant =
  | "calm-breath"
  | "comfort-hug"
  | "glucose-signal"
  | "insulin-response"
  | "reading-snapshot"
  | "a1c-window"
  | "digestion-journey"
  | "fiber-pace"
  | "muscle-fuel"
  | "circulation-rhythm"
  | "post-meal-window"
  | "sitting-interruption";

const motionCopy: Record<LessonMotionVariant, { label: string; caption: string }> = {
  "calm-breath": {
    label: "A person taking a slow breath while a cloud of worry softens",
    caption:
      "A slower breath cannot solve a diagnosis, but it can give a worried body one quieter moment to take in the next idea.",
  },
  "comfort-hug": {
    label: "Two people moving closer and sharing a reassuring embrace",
    caption:
      "Support can begin with something human and small: sitting close, listening, and reminding someone they do not have to carry every question alone.",
  },
  "glucose-signal": {
    label: "An insulin signal reaching a cell before glucose moves inside",
    caption:
      "The green signal represents insulin. It reaches the cell first; glucose can then move from the bloodstream into the cell.",
  },
  "insulin-response": {
    label: "A pancreas sending repeated insulin signals toward a cell",
    caption:
      "When cells respond less effectively, the pancreas may send more insulin signals to produce a similar response.",
  },
  "reading-snapshot": {
    label: "A glucose meter capturing one moving moment from a changing day",
    caption:
      "A meter reading is a snapshot. The day keeps moving around it, so timing and context belong beside the number.",
  },
  "a1c-window": {
    label: "Red blood cells circulating over time as glucose markers attach",
    caption:
      "A1C reflects glucose attached to hemoglobin across many circulating red blood cells—not one meal or one unusual day.",
  },
  "digestion-journey": {
    label: "A meal moving into digestion and separating into smaller nutrients",
    caption:
      "Digestion changes a mixed meal into smaller nutrients. Carbohydrate becomes glucose; protein and fat have other jobs too.",
  },
  "fiber-pace": {
    label: "Glucose moving quickly on one path and more gradually past fiber on another",
    caption:
      "Fiber can slow the pace of digestion. Both paths move forward, but the fiber-rich path releases glucose more gradually.",
  },
  "muscle-fuel": {
    label: "Working muscle fibers contracting as they take in glucose for fuel",
    caption:
      "Contracting muscles need fuel. As they work, they can take up glucose for energy through more than one pathway.",
  },
  "circulation-rhythm": {
    label: "A beating heart moving fuel through a vessel toward a working muscle",
    caption:
      "Movement asks the heart, blood vessels, and muscles to work together. The rhythm can begin with ordinary, comfortable motion.",
  },
  "post-meal-window": {
    label: "A person walking while a post-meal teaching curve rises and settles",
    caption:
      "A short, comfortable movement window after a meal can help working muscles use glucose. This is a teaching pattern, not a promised reading.",
  },
  "sitting-interruption": {
    label:
      "A seated person standing, stretching, and sitting again to interrupt a long still period",
    caption:
      "A brief interruption changes one long still period into shorter sections. The useful change is the break—not a perfect workout.",
  },
};

function LoopTransform({
  begin = "0s",
  dur,
  type = "translate",
  values,
}: {
  begin?: string;
  dur: string;
  type?: "rotate" | "scale" | "translate";
  values: string;
}) {
  return (
    <animateTransform
      attributeName="transform"
      begin={begin}
      calcMode="spline"
      dur={dur}
      keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
      keyTimes="0;0.38;0.72;1"
      repeatCount="indefinite"
      type={type}
      values={values}
    />
  );
}

function MovingCircle({
  begin,
  className,
  dur,
  from,
  r = 10,
  to,
}: {
  begin: string;
  className: string | undefined;
  dur: string;
  from: [number, number];
  r?: number;
  to: [number, number];
}) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];

  return (
    <circle
      className={className}
      cx={from[0]}
      cy={from[1]}
      opacity="0"
      r={r}
      style={
        {
          "--motion-x": `${dx}px`,
          "--motion-y": `${dy}px`,
          animationDelay: begin,
          animationDuration: dur,
        } as CSSProperties
      }
    >
      <animate
        attributeName="opacity"
        begin={begin}
        dur={dur}
        keyTimes="0;0.12;0.8;1"
        repeatCount="indefinite"
        values="0;1;1;0"
      />
      <animateTransform
        attributeName="transform"
        begin={begin}
        dur={dur}
        keyTimes="0;0.18;0.82;1"
        repeatCount="indefinite"
        type="translate"
        values={`0 0;0 0;${dx} ${dy};${dx} ${dy}`}
      />
    </circle>
  );
}

function CalmBreathScene() {
  return (
    <>
      <ellipse className={styles.ground} cx="360" cy="258" rx="172" ry="15" />
      <circle className={styles.calmHalo} cx="286" cy="140" r="92">
        <animate attributeName="r" dur="5.2s" repeatCount="indefinite" values="78;104;104;78" />
        <animate
          attributeName="opacity"
          dur="5.2s"
          repeatCount="indefinite"
          values="0.2;0.52;0.52;0.2"
        />
      </circle>
      <g className={styles.warmPerson}>
        <LoopTransform dur="5.2s" values="0 7;0 -7;0 -7;0 7" />
        <circle cx="286" cy="91" r="31" />
        <path d="M236 234v-77c0-39 22-58 50-58s50 19 50 58v77z" />
        <path className={styles.smile} d="M268 84c10 8 26 8 36 0" />
        <path className={styles.chestLine} d="M252 165c22 15 46 15 68 0">
          <animate
            attributeName="d"
            dur="5.2s"
            repeatCount="indefinite"
            values="M252 169c22 8 46 8 68 0;M248 155c24 22 52 22 76 0;M248 155c24 22 52 22 76 0;M252 169c22 8 46 8 68 0"
          />
        </path>
      </g>
      <g className={styles.worryCloud}>
        <circle cx="500" cy="105" r="25">
          <animate attributeName="r" dur="5.2s" repeatCount="indefinite" values="25;18;18;25" />
        </circle>
        <circle cx="530" cy="96" r="32">
          <animate attributeName="r" dur="5.2s" repeatCount="indefinite" values="32;22;22;32" />
        </circle>
        <circle cx="561" cy="110" r="22">
          <animate attributeName="r" dur="5.2s" repeatCount="indefinite" values="22;15;15;22" />
        </circle>
        <animate
          attributeName="opacity"
          dur="5.2s"
          repeatCount="indefinite"
          values="0.52;0.16;0.16;0.52"
        />
      </g>
      {["-0.4s", "-1.6s", "-2.8s"].map((begin, index) => (
        <MovingCircle
          begin={begin}
          className={styles.breathBubble}
          dur="5.2s"
          from={[328, 115 + index * 10]}
          key={begin}
          r={8 - index}
          to={[520, 105 - index * 5]}
        />
      ))}
      <text className={styles.sceneLabel} x="360" y="286" textAnchor="middle">
        INHALE · SOFTEN · EXHALE
      </text>
    </>
  );
}

function ComfortHugScene() {
  return (
    <>
      <ellipse className={styles.ground} cx="360" cy="260" rx="190" ry="15" />
      <g className={styles.hugPersonWarm}>
        <LoopTransform dur="6s" values="0 0;112 0;112 0;0 0" />
        <circle cx="188" cy="94" r="29" />
        <path d="M143 235v-78c0-34 19-52 45-52s45 18 45 52v78z" />
        <path className={styles.smile} d="M173 89c9 7 21 7 30 0" />
        <path className={styles.hugArmWarm} d="M215 150c35 8 62 27 82 58">
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="M215 150c20 0 36 9 48 24;M215 150c48 1 82 14 112 49;M215 150c48 1 82 14 112 49;M215 150c20 0 36 9 48 24"
          />
        </path>
      </g>
      <g className={styles.hugPersonGreen}>
        <LoopTransform dur="6s" values="0 0;-112 0;-112 0;0 0" />
        <circle cx="532" cy="94" r="29" />
        <path d="M487 235v-78c0-34 19-52 45-52s45 18 45 52v78z" />
        <path className={styles.smile} d="M517 89c9 7 21 7 30 0" />
        <path className={styles.hugArmGreen} d="M505 150c-35 8-62 27-82 58">
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="M505 150c-20 0-36 9-48 24;M505 150c-48 1-82 14-112 49;M505 150c-48 1-82 14-112 49;M505 150c-20 0-36 9-48 24"
          />
        </path>
      </g>
      <path
        className={styles.comfortHeart}
        d="M360 120c-18-27-59-9-48 22 8 22 48 46 48 46s40-24 48-46c11-31-30-49-48-22z"
      >
        <animate attributeName="stroke-width" dur="2s" repeatCount="indefinite" values="3;9;4;3" />
        <animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0;1;1;0" />
      </path>
      <text className={styles.sceneLabel} x="360" y="286" textAnchor="middle">
        LISTEN · STAY CLOSE · SHARE THE WEIGHT
      </text>
    </>
  );
}

function GlucoseSignalScene() {
  return (
    <>
      <rect className={styles.vessel} height="150" rx="75" width="602" x="54" y="72" />
      <circle className={styles.cell} cx="574" cy="147" r="64" />
      <rect className={styles.cellGate} height="50" rx="11" width="22" x="526" y="122">
        <animate
          attributeName="height"
          dur="5.8s"
          repeatCount="indefinite"
          values="26;26;58;58;26"
        />
        <animate
          attributeName="y"
          dur="5.8s"
          repeatCount="indefinite"
          values="134;134;118;118;134"
        />
      </rect>
      <path className={styles.signalTrail} d="M92 106C245 54 405 82 522 124" />
      <MovingCircle
        begin="-1.2s"
        className={styles.insulinDot}
        dur="5.8s"
        from={[94, 104]}
        to={[520, 132]}
      />
      {[
        {
          begin: "-0.2s",
          from: [112, 174] as [number, number],
          to: [584, 126] as [number, number],
        },
        {
          begin: "-1.1s",
          from: [190, 145] as [number, number],
          to: [600, 147] as [number, number],
        },
        { begin: "-2s", from: [268, 186] as [number, number], to: [584, 170] as [number, number] },
      ].map((dot) => (
        <MovingCircle
          begin={dot.begin}
          className={styles.glucoseDot}
          dur="5.8s"
          from={dot.from}
          key={dot.begin}
          r={12}
          to={dot.to}
        />
      ))}
      <circle className={styles.cellGlow} cx="574" cy="147" r="66">
        <animate attributeName="r" dur="5.8s" repeatCount="indefinite" values="66;66;78;66;66" />
        <animate
          attributeName="opacity"
          dur="5.8s"
          repeatCount="indefinite"
          values="0;0;0.55;0;0"
        />
      </circle>
      <text className={styles.vesselLabel} x="88" y="258">
        BLOODSTREAM
      </text>
      <text className={styles.cellLabel} x="594" y="152" textAnchor="middle">
        CELL
      </text>
      <text className={styles.sceneLabel} x="360" y="286" textAnchor="middle">
        SIGNAL FIRST · GLUCOSE FOLLOWS
      </text>
    </>
  );
}

function InsulinResponseScene() {
  return (
    <>
      <path
        className={styles.pancreas}
        d="M77 151c40-55 116-62 169-20 24 19 53 20 87 8-18 48-71 74-125 52-51-21-94-12-131 14-22-14-23-36 0-54z"
      >
        <animate
          attributeName="stroke-width"
          dur="3.4s"
          repeatCount="indefinite"
          values="4;9;5;4"
        />
        <animate
          attributeName="fill-opacity"
          dur="3.4s"
          repeatCount="indefinite"
          values="0.78;1;0.9;0.78"
        />
      </path>
      <circle className={styles.responseCell} cx="590" cy="151" r="65" />
      <rect className={styles.responseGate} height="44" rx="10" width="20" x="542" y="129" />
      <path className={styles.responsePath} d="M260 151H525" />
      {["-0.2s", "-1.25s", "-2.3s", "-3.35s"].map((begin) => (
        <MovingCircle
          begin={begin}
          className={styles.insulinDot}
          dur="4.2s"
          from={[258, 151]}
          key={begin}
          r={10}
          to={[540, 151]}
        />
      ))}
      {[0, 1].map((index) => (
        <circle className={styles.responseRing} cx="590" cy="151" key={index} r="66">
          <animate
            attributeName="r"
            begin={`${-index * 1.6}s`}
            dur="3.2s"
            repeatCount="indefinite"
            values="66;96;118"
          />
          <animate
            attributeName="opacity"
            begin={`${-index * 1.6}s`}
            dur="3.2s"
            repeatCount="indefinite"
            values="0.6;0.25;0"
          />
        </circle>
      ))}
      <text className={styles.sceneLabel} x="170" y="237" textAnchor="middle">
        PANCREAS
      </text>
      <text className={styles.cellLabel} x="608" y="156" textAnchor="middle">
        CELL
      </text>
      <text className={styles.sceneLabel} x="360" y="286" textAnchor="middle">
        MORE SIGNALS MAY BE NEEDED FOR A SIMILAR RESPONSE
      </text>
    </>
  );
}

function ReadingSnapshotScene() {
  return (
    <>
      <path
        className={styles.dayLine}
        d="M70 196C150 155 222 188 296 140C365 95 430 65 500 111C552 145 590 157 650 132"
      />
      <circle className={styles.dayTracer} cx="70" cy="196" r="10">
        <animateMotion
          dur="7s"
          path="M0 0C80-41 152-8 226-56C295-101 360-131 430-85C482-51 520-39 580-64"
          repeatCount="indefinite"
        />
      </circle>
      <g className={styles.snapshotMeter}>
        <rect height="112" rx="22" width="142" x="289" y="60" />
        <rect className={styles.snapshotScreen} height="42" rx="9" width="92" x="314" y="82" />
        <circle cx="360" cy="146" r="10" />
        <text className={styles.meterNumber} x="360" y="110" textAnchor="middle">
          128
        </text>
      </g>
      <rect className={styles.scanBand} height="180" width="12" x="90" y="46">
        <LoopTransform dur="5s" values="0 0;520 0;520 0;0 0" />
        <animate attributeName="opacity" dur="5s" repeatCount="indefinite" values="0;0.75;0;0" />
      </rect>
      <text className={styles.vesselLabel} x="74" y="241">
        MORNING
      </text>
      <text className={styles.vesselLabel} x="572" y="241">
        EVENING
      </text>
      <text className={styles.sceneLabel} x="360" y="278" textAnchor="middle">
        ONE READING CAPTURES ONE MOVING MOMENT
      </text>
    </>
  );
}

function CirculatingCell({ begin, markers = 2 }: { begin: string; markers?: number }) {
  return (
    <g
      className={styles.rbc}
      opacity="0"
      style={{ animationDelay: begin, animationDuration: "8s" }}
    >
      <circle className={styles.rbcOuter} cx="0" cy="0" r="38" />
      <circle className={styles.rbcInner} cx="0" cy="0" r="18" />
      {Array.from({ length: markers }).map((_, index) => (
        <circle
          className={styles.a1cMarker}
          cx={index % 2 === 0 ? -18 : 20}
          cy={index % 3 === 0 ? -20 : 15}
          key={index}
          r="6"
        >
          <animate
            attributeName="r"
            begin={`${-index * 0.7}s`}
            dur="2.6s"
            repeatCount="indefinite"
            values="4;8;6;4"
          />
        </circle>
      ))}
      <animate
        attributeName="opacity"
        begin={begin}
        dur="8s"
        keyTimes="0;0.08;0.92;1"
        repeatCount="indefinite"
        values="0;1;1;0"
      />
      <animateTransform
        attributeName="transform"
        begin={begin}
        dur="8s"
        repeatCount="indefinite"
        type="translate"
        values="-70 142;790 142"
      />
    </g>
  );
}

function A1cWindowScene() {
  return (
    <>
      <rect className={styles.a1cVessel} height="164" rx="82" width="640" x="40" y="58" />
      <path className={styles.flowLine} d="M70 140H650" />
      <CirculatingCell begin="-0.5s" markers={1} />
      <CirculatingCell begin="-2.3s" markers={2} />
      <CirculatingCell begin="-4.1s" markers={3} />
      <CirculatingCell begin="-5.9s" markers={2} />
      <CirculatingCell begin="-7.7s" markers={3} />
      <path className={styles.timeArrow} d="M118 252H602" />
      <path className={styles.arrowHead} d="m602 252-18-11m18 11-18 11" />
      <text className={styles.vesselLabel} x="102" y="282">
        WEEKS AGO
      </text>
      <text className={styles.vesselLabel} x="558" y="282">
        TODAY
      </text>
      <text className={styles.sceneLabel} x="360" y="246" textAnchor="middle">
        MANY CIRCULATING CELLS CREATE THE LONGER VIEW
      </text>
    </>
  );
}

function DigestionJourneyScene() {
  return (
    <>
      <g className={styles.mealPlate}>
        <circle cx="108" cy="138" r="54" />
        <circle cx="108" cy="138" r="35" />
        <path d="M92 132c13-17 32-12 36 5-8 16-27 21-36-5z" />
      </g>
      <path className={styles.digestiveTube} d="M176 138H282" />
      <g className={styles.stomach}>
        <path d="M300 86v58c0 46 29 67 66 67 47 0 80-27 80-65 0-30-20-45-49-48-31-3-37-17-37-40">
          <animate
            attributeName="stroke-width"
            dur="3.6s"
            repeatCount="indefinite"
            values="22;30;22;22"
          />
        </path>
      </g>
      <path className={styles.digestiveTube} d="M446 151H630" />
      {["-0.2s", "-1.5s", "-2.8s"].map((begin, index) => (
        <MovingCircle
          begin={begin}
          className={styles.foodChunk}
          dur="4.2s"
          from={[164, 138 + (index - 1) * 15]}
          key={begin}
          r={11 - index}
          to={[345, 145 + (index - 1) * 12]}
        />
      ))}
      {["-0.3s", "-1.15s", "-2s", "-2.85s"].map((begin, index) => (
        <MovingCircle
          begin={begin}
          className={
            index % 3 === 0
              ? styles.glucoseDot
              : index % 3 === 1
                ? styles.proteinDot
                : styles.fatDot
          }
          dur="4.4s"
          from={[418, 145]}
          key={begin}
          r={9}
          to={[628, 100 + (index % 3) * 46]}
        />
      ))}
      <text className={styles.sceneLabel} x="108" y="230" textAnchor="middle">
        MEAL
      </text>
      <text className={styles.sceneLabel} x="365" y="242" textAnchor="middle">
        DIGESTION
      </text>
      <text className={styles.sceneLabel} x="602" y="230" textAnchor="middle">
        SMALLER NUTRIENTS
      </text>
      <text className={styles.vesselLabel} x="360" y="281" textAnchor="middle">
        FOOD MOVES FORWARD · THE BODY SORTS WHAT IT CAN USE
      </text>
    </>
  );
}

function FiberPaceScene() {
  return (
    <>
      <text className={styles.sceneLabel} x="68" y="58">
        WITHOUT FIBER · FASTER RELEASE
      </text>
      <path className={styles.fastLane} d="M70 98H650" />
      {["-0.2s", "-1.1s", "-2s", "-2.9s"].map((begin) => (
        <MovingCircle
          begin={begin}
          className={styles.glucoseDot}
          dur="3.4s"
          from={[82, 98]}
          key={begin}
          r={10}
          to={[640, 98]}
        />
      ))}
      <text className={styles.sceneLabel} x="68" y="172">
        WITH FIBER · MORE GRADUAL RELEASE
      </text>
      <path className={styles.slowLane} d="M70 214H650" />
      <g className={styles.fiberGates}>
        {[260, 340, 420, 500].map((x, index) => (
          <path d={`M${x} 190v48`} key={x}>
            <animateTransform
              attributeName="transform"
              begin={`${-index * 0.35}s`}
              dur="2.6s"
              repeatCount="indefinite"
              type="rotate"
              values={`-6 ${x} 214;6 ${x} 214;-6 ${x} 214`}
            />
          </path>
        ))}
      </g>
      {["-0.2s", "-1.9s", "-3.6s"].map((begin) => (
        <MovingCircle
          begin={begin}
          className={styles.glucoseDot}
          dur="6.8s"
          from={[82, 214]}
          key={begin}
          r={10}
          to={[640, 214]}
        />
      ))}
      <text className={styles.vesselLabel} x="360" y="277" textAnchor="middle">
        BOTH MOVE FORWARD · FIBER CHANGES THE PACE
      </text>
    </>
  );
}

function MuscleFuelScene() {
  return (
    <>
      <rect className={styles.muscleVessel} height="168" rx="84" width="630" x="45" y="62" />
      <path className={styles.muscleGate} d="M370 94c38 28 38 88 0 112" />
      <g className={styles.muscleFibers}>
        {[96, 139, 182].map((y, index) => (
          <rect height="24" key={y} rx="12" width={210 - index * 18} x={425 + index * 12} y={y}>
            <animate
              attributeName="width"
              begin={`${-index * 0.35}s`}
              dur="2.2s"
              repeatCount="indefinite"
              values={`${210 - index * 18};${170 - index * 12};${210 - index * 18}`}
            />
            <animate
              attributeName="x"
              begin={`${-index * 0.35}s`}
              dur="2.2s"
              repeatCount="indefinite"
              values={`${425 + index * 12};${445 + index * 12};${425 + index * 12}`}
            />
          </rect>
        ))}
      </g>
      {[
        { begin: "-0.2s", from: [92, 105] as [number, number], to: [472, 107] as [number, number] },
        { begin: "-1.5s", from: [92, 147] as [number, number], to: [492, 150] as [number, number] },
        { begin: "-2.8s", from: [92, 190] as [number, number], to: [468, 193] as [number, number] },
      ].map((dot) => (
        <MovingCircle
          begin={dot.begin}
          className={styles.glucoseDot}
          dur="4.2s"
          from={dot.from}
          key={dot.begin}
          r={11}
          to={dot.to}
        />
      ))}
      <text className={styles.vesselLabel} x="76" y="270">
        GLUCOSE IN BLOOD
      </text>
      <text className={styles.vesselLabel} x="474" y="270">
        WORKING MUSCLE
      </text>
      <text className={styles.sceneLabel} x="360" y="292" textAnchor="middle">
        CONTRACT · TAKE IN FUEL · RELEASE
      </text>
    </>
  );
}

function CirculationRhythmScene() {
  return (
    <>
      <path
        className={styles.heartShape}
        d="M116 104c-26-39-84-13-68 32 11 31 68 69 68 69s57-38 68-69c16-45-42-71-68-32z"
      >
        <animate
          attributeName="stroke-width"
          dur="1.45s"
          repeatCount="indefinite"
          values="4;11;5;4"
        />
        <animate
          attributeName="fill-opacity"
          dur="1.45s"
          repeatCount="indefinite"
          values="0.72;1;0.82;0.72"
        />
      </path>
      <path className={styles.circulationVessel} d="M185 153C292 87 397 88 500 147" />
      <path className={styles.circulationVessel} d="M185 173C302 237 414 225 508 167" />
      <g className={styles.circulationMuscle}>
        <rect height="30" rx="15" width="135" x="514" y="101">
          <animate
            attributeName="width"
            dur="2.4s"
            repeatCount="indefinite"
            values="135;105;135;135"
          />
          <animate attributeName="x" dur="2.4s" repeatCount="indefinite" values="514;529;514;514" />
        </rect>
        <rect height="30" rx="15" width="120" x="529" y="145">
          <animate
            attributeName="width"
            begin="-0.35s"
            dur="2.4s"
            repeatCount="indefinite"
            values="120;94;120;120"
          />
          <animate
            attributeName="x"
            begin="-0.35s"
            dur="2.4s"
            repeatCount="indefinite"
            values="529;542;529;529"
          />
        </rect>
        <rect height="30" rx="15" width="135" x="514" y="189">
          <animate
            attributeName="width"
            begin="-0.7s"
            dur="2.4s"
            repeatCount="indefinite"
            values="135;105;135;135"
          />
          <animate
            attributeName="x"
            begin="-0.7s"
            dur="2.4s"
            repeatCount="indefinite"
            values="514;529;514;514"
          />
        </rect>
      </g>
      {["-0.2s", "-1.55s", "-2.9s"].map((begin, index) => (
        <MovingCircle
          begin={begin}
          className={index === 1 ? styles.glucoseDot : styles.bloodDot}
          dur="4.2s"
          from={[184, 153 + index * 8]}
          key={begin}
          r={9 + index}
          to={[525, 126 + index * 31]}
        />
      ))}
      <text className={styles.sceneLabel} x="116" y="246" textAnchor="middle">
        HEART PUMPS
      </text>
      <text className={styles.sceneLabel} x="350" y="246" textAnchor="middle">
        VESSELS DELIVER
      </text>
      <text className={styles.sceneLabel} x="582" y="246" textAnchor="middle">
        MUSCLES USE FUEL
      </text>
      <text className={styles.vesselLabel} x="360" y="282" textAnchor="middle">
        ONE COORDINATED RHYTHM
      </text>
    </>
  );
}

function PostMealWindowScene() {
  return (
    <>
      <path className={styles.postMealAxis} d="M72 231H650M72 231V62" />
      <path
        className={styles.postMealCurve}
        d="M80 211C145 208 180 178 224 102C259 42 320 68 361 132C410 209 501 210 638 171"
      />
      <path
        className={styles.postMealGuide}
        d="M80 211C155 209 196 189 238 133C282 75 328 94 369 148C421 215 512 212 638 181"
      />
      <circle className={styles.curveTracer} cx="0" cy="0" r="10">
        <animateMotion
          dur="6.4s"
          path="M80 211C145 208 180 178 224 102C259 42 320 68 361 132C410 209 501 210 638 171"
          repeatCount="indefinite"
        />
      </circle>
      <g className={styles.postMealWalker}>
        <circle cx="0" cy="0" r="17" />
        <path d="M0 18v48M0 32l-22 18M0 32l23 16M0 66l-20 35M0 66l24 34" />
        <animateTransform
          attributeName="transform"
          dur="5.4s"
          repeatCount="indefinite"
          type="translate"
          values="395 95;565 95;395 95"
        />
      </g>
      <text className={styles.vesselLabel} x="80" y="264">
        MEAL
      </text>
      <text className={styles.vesselLabel} x="578" y="264">
        LATER
      </text>
      <text className={styles.sceneLabel} x="360" y="288" textAnchor="middle">
        THE CURVE RISES · WORKING MUSCLES USE FUEL · THE CURVE SETTLES
      </text>
    </>
  );
}

function SittingInterruptionScene() {
  return (
    <>
      <g className={styles.chairShape}>
        <rect height="86" rx="16" width="104" x="118" y="125" />
        <path d="M136 211v35M204 211v35M108 163h121" />
      </g>
      <g className={styles.sittingPerson}>
        <circle cx="0" cy="0" r="22" />
        <path d="M0 24v55M0 45l34 25M0 79h48M48 79v48M0 79l-20 46" />
        <animateTransform
          attributeName="transform"
          dur="6s"
          keyTimes="0;0.23;0.45;0.75;1"
          repeatCount="indefinite"
          type="translate"
          values="170 102;170 102;345 82;345 82;170 102"
        />
      </g>
      <g className={styles.stretchArms}>
        <path d="M345 130l-37-35M345 130l37-35" />
        <animate
          attributeName="opacity"
          dur="6s"
          keyTimes="0;0.35;0.5;0.76;1"
          repeatCount="indefinite"
          values="0;0;1;1;0"
        />
      </g>
      <path className={styles.stillTimeline} d="M275 210H635" />
      <path className={styles.breakTimeline} d="M275 210H405M455 210H635">
        <animate
          attributeName="opacity"
          dur="6s"
          keyTimes="0;0.32;0.48;0.82;1"
          repeatCount="indefinite"
          values="0;0;1;1;0"
        />
      </path>
      <circle className={styles.breakMarker} cx="430" cy="210" r="22">
        <animate
          attributeName="opacity"
          dur="6s"
          keyTimes="0;0.32;0.48;0.82;1"
          repeatCount="indefinite"
          values="0;0;1;1;0"
        />
        <animate
          attributeName="r"
          dur="6s"
          keyTimes="0;0.32;0.5;0.82;1"
          repeatCount="indefinite"
          values="8;8;24;24;8"
        />
      </circle>
      <text className={styles.sceneLabel} x="455" y="260" textAnchor="middle">
        SIT · RISE · STRETCH · RETURN
      </text>
      <text className={styles.vesselLabel} x="455" y="286" textAnchor="middle">
        ONE BREAK TURNS A LONG STILL PERIOD INTO SHORTER SECTIONS
      </text>
    </>
  );
}

function Scene({ variant }: { variant: LessonMotionVariant }) {
  if (variant === "calm-breath") return <CalmBreathScene />;
  if (variant === "comfort-hug") return <ComfortHugScene />;
  if (variant === "glucose-signal") return <GlucoseSignalScene />;
  if (variant === "insulin-response") return <InsulinResponseScene />;
  if (variant === "reading-snapshot") return <ReadingSnapshotScene />;
  if (variant === "a1c-window") return <A1cWindowScene />;
  if (variant === "digestion-journey") return <DigestionJourneyScene />;
  if (variant === "fiber-pace") return <FiberPaceScene />;
  if (variant === "muscle-fuel") return <MuscleFuelScene />;
  if (variant === "circulation-rhythm") return <CirculationRhythmScene />;
  if (variant === "post-meal-window") return <PostMealWindowScene />;
  if (variant === "sitting-interruption") return <SittingInterruptionScene />;
  return null;
}

export function LessonMotionFigure({
  variant,
  className,
}: {
  variant: LessonMotionVariant;
  className?: string;
}) {
  const copy = motionCopy[variant];
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayback = () => {
    const svg = svgRef.current;
    if (isPlaying) svg?.pauseAnimations?.();
    else svg?.unpauseAnimations?.();
    setIsPlaying((playing) => !playing);
  };

  return (
    <figure
      className={cn(styles.figure, className)}
      data-motion-playing={isPlaying ? "true" : "false"}
    >
      <div className={styles.viewport} role="img" aria-label={copy.label}>
        <svg
          ref={svgRef}
          className={styles.art}
          viewBox="0 0 720 300"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          data-variant={variant}
          focusable="false"
        >
          <Scene variant={variant} />
        </svg>
        <button
          type="button"
          className={styles.motionControl}
          aria-label={isPlaying ? "Pause this animation" : "Play this animation"}
          aria-pressed={!isPlaying}
          onClick={togglePlayback}
        >
          <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <figcaption className={styles.caption}>{copy.caption}</figcaption>
    </figure>
  );
}
