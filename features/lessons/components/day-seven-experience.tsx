"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  CircleHelp,
  MessageCircleHeart,
  Pill,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { daySevenGlossary } from "@/features/glossary/data/day-seven-glossary";
import {
  evaluateDaySevenAction,
  type DaySevenEvaluationFeedback,
} from "@/features/lessons/actions/day-seven.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import styles from "@/features/lessons/components/day-seven-experience.module.css";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 12;

const openingFeelings = [
  ["relieved", "Relieved that treatment has options"],
  ["worried", "Worried about what medicine means"],
  ["unsure", "Unsure why a medicine was suggested"],
  ["ready", "Ready to understand the tools"],
] as const;
type OpeningFeeling = (typeof openingFeelings)[number][0];

const fitFactors = [
  {
    body: "A1C and other glucose patterns help the clinician understand what support may be useful.",
    id: "glucose",
    label: "Glucose context",
  },
  {
    body: "Heart and kidney health can influence which benefits and risks matter most.",
    id: "organs",
    label: "Heart and kidneys",
  },
  {
    body: "Other medicines, side effects, cost, access, and daily routines all belong in the decision.",
    id: "life",
    label: "The rest of real life",
  },
  {
    body: "Preferences and goals matter. Person-centered care is a conversation, not a command.",
    id: "preferences",
    label: "What matters to you",
  },
] as const;
type FitFactorId = (typeof fitFactors)[number]["id"];

const mechanisms = [
  {
    body: "Some medicines help the liver release less stored glucose into the blood.",
    id: "liver",
    label: "Quiet the liver’s glucose release",
  },
  {
    body: "Some help cells respond more effectively to the insulin signal already present.",
    id: "response",
    label: "Improve the insulin response",
  },
  {
    body: "Some help the kidneys release some extra glucose through urine.",
    id: "kidney",
    label: "Use a kidney pathway",
  },
  {
    body: "Some work through digestion and incretin-related pathways, affecting glucose regulation, pace, and fullness.",
    id: "digestion",
    label: "Change the digestive signal",
  },
  {
    body: "Some increase insulin release; prescribed insulin replaces or adds the insulin the body needs.",
    id: "insulin",
    label: "Add insulin support",
  },
] as const;
type MechanismId = (typeof mechanisms)[number]["id"];

const medicineRoles = [
  {
    id: "metformin",
    label: "Metformin",
    role: "Often lowers liver glucose output and supports insulin response",
  },
  {
    id: "sglt2",
    label: "An SGLT2 medicine",
    role: "Uses a kidney pathway; may add heart or kidney benefits for some people",
  },
  {
    id: "glp1",
    label: "A GLP-1 medicine",
    role: "Uses incretin-related pathways; may add heart benefits for some people",
  },
] as const;
type MedicineRoleId = (typeof medicineRoles)[number]["id"];

const lowRiskCards = [
  {
    body: "Insulin and medicines that push the pancreas to release more insulin can raise low-glucose risk.",
    id: "higher",
    label: "Some tools need a low-glucose plan",
  },
  {
    body: "Many other diabetes medicines usually do not cause low glucose by themselves, though combinations and circumstances matter.",
    id: "lower",
    label: "Risk differs by medicine",
  },
  {
    body: "Your individual risk cannot be determined by a general lesson. Ask what symptoms, monitoring, and actions apply to you.",
    id: "personal",
    label: "Personal safety belongs with the care team",
  },
] as const;
type LowRiskId = (typeof lowRiskCards)[number]["id"];

const routineAnchors = [
  "The exact medicine name",
  "What it is meant to help with",
  "The label instructions",
] as const;
const routineSupports = [
  "The prescription label",
  "A pharmacist",
  "The prescribing care team",
] as const;

const clinicianQuestions = [
  "What is this medicine meant to help with?",
  "What side effects should I call you about?",
  "Can this medicine cause low glucose for me?",
  "Which written instructions should I keep with this medicine?",
  "How will we know whether it is helping?",
] as const;

const reflections = [
  "Medicine feels more like a tool and less like a judgment.",
  "I understand why different bodies may need different tools.",
  "I have one useful question for my care team.",
  "I am still processing, and I know where to begin.",
] as const;

function LessonHeading({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="space-y-3">
      {label ? <p className="editorial-eyebrow">{label}</p> : null}
      <h1 className="max-w-4xl font-serif-display text-[length:var(--text-page-title)] font-normal leading-[0.96] text-balance">
        {children}
      </h1>
    </div>
  );
}

function AnswerChoice({
  children,
  onClick,
  selected,
}: {
  children: ReactNode;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "motion-tactile flex min-h-16 w-full items-start gap-4 rounded-[10px] border bg-card px-5 py-4 text-left leading-7 shadow-card",
        selected && "border-accent-warm bg-accent-warm/8 ring-1 ring-accent-warm/15",
      )}
      onClick={onClick}
      type="button"
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-success bg-success text-white" : "border-border",
        )}
      >
        {selected ? <Check className="size-3.5" /> : null}
      </span>
      <span>{children}</span>
    </button>
  );
}

function Feedback({ feedback }: { feedback: DaySevenEvaluationFeedback }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "animate-slide-up rounded-2xl border p-5 sm:p-7",
        feedback.accurate ? "border-success/30 bg-info" : "border-warning/35 bg-warning/10",
      )}
      role="status"
    >
      <p className={cn("font-serif-display text-2xl italic", feedback.accurate && "text-success")}>
        {feedback.heading}
      </p>
      <p className="mt-2 leading-7 text-foreground/85">{feedback.body}</p>
      <ul className="mt-5 space-y-2 border-t border-current/10 pt-4 text-sm leading-6 text-foreground/75">
        {feedback.details.map((detail) => (
          <li className="flex gap-2" key={detail}>
            <span aria-hidden="true" className="text-accent-warm">
              •{" "}
            </span>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SupportLensAnimation() {
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="support-lens-title support-lens-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 760 400"
      >
        <title id="support-lens-title">
          Glasses bring a page into focus while a person relaxes
        </title>
        <desc id="support-lens-desc">
          A looping analogy showing that accepting a helpful tool is support, not failure.
        </desc>
        <rect className={styles.softRoom} height="400" rx="56" width="760" />
        <g className={styles.person} transform="translate(132 92)">
          <circle cx="82" cy="54" r="48" />
          <path d="M28 112c0-31 24-56 54-56s54 25 54 56v116H28z" />
          <path d="M51 74q31 24 62 0" />
          <g className={styles.glasses}>
            <circle cx="61" cy="52" r="20" />
            <circle cx="103" cy="52" r="20" />
            <path d="M81 52h3" />
            <animateTransform
              attributeName="transform"
              dur="7s"
              keyTimes="0;0.18;0.35;0.82;1"
              repeatCount="indefinite"
              type="translate"
              values="80 -42;80 -42;0 0;0 0;80 -42"
            />
            <animate
              attributeName="opacity"
              dur="7s"
              keyTimes="0;0.14;0.28;0.9;1"
              repeatCount="indefinite"
              values="0;1;1;1;0"
            />
          </g>
          <animateTransform
            attributeName="transform"
            additive="sum"
            dur="7s"
            keyTimes="0;0.35;0.62;1"
            repeatCount="indefinite"
            type="translate"
            values="0 3;0 3;0 -4;0 3"
          />
        </g>
        <g transform="translate(365 86)">
          <rect className={styles.page} height="214" rx="18" width="300" />
          {[0, 1, 2, 3].map((line) => (
            <rect
              className={styles.pageLine}
              height="13"
              key={line}
              rx="6"
              width={230 - line * 18}
              x="35"
              y={42 + line * 38}
            >
              <animate
                attributeName="opacity"
                dur="7s"
                keyTimes="0;0.26;0.45;0.82;1"
                repeatCount="indefinite"
                values="0.22;0.22;1;1;0.22"
              />
            </rect>
          ))}
          <circle className={styles.focusGlow} cx="253" cy="178" r="14">
            <animate
              attributeName="r"
              dur="7s"
              keyTimes="0;0.3;0.48;0.82;1"
              repeatCount="indefinite"
              values="14;14;34;34;14"
            />
            <animate
              attributeName="opacity"
              dur="7s"
              keyTimes="0;0.3;0.48;0.82;1"
              repeatCount="indefinite"
              values="0;0;0.28;0.28;0"
            />
          </circle>
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="380" y="356">
          SUPPORT CAN MAKE THE NEXT STEP CLEARER
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>A tool changes what becomes possible, not your worth.</strong> Glasses support
        vision. Medication can support a body process. Neither is a moral grade.
      </figcaption>
    </figure>
  );
}

function BodyToolsAnimation() {
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="body-tools-title body-tools-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 920 600"
      >
        <title id="body-tools-title">
          Four distinct workshops represent different medication pathways
        </title>
        <desc id="body-tools-desc">
          Four separate looping scenes show a liver loading dock releasing less glucose, an
          hourglass slowing digestion, a kidney filter directing glucose outward, and radio waves
          supporting a cell response.
        </desc>
        <rect className={styles.softRoom} height="600" rx="56" width="920" />
        <defs>
          <clipPath clipPathUnits="userSpaceOnUse" id="day-seven-hourglass-interior">
            <path d="M611 113H690c-2 18-19 25-29 35 10 11 27 18 29 36h-79c2-18 19-25 29-36-10-10-27-17-29-35z" />
          </clipPath>
        </defs>

        <g aria-label="Liver loading dock releasing less glucose">
          <rect className={styles.pathwayPanel} height="224" rx="28" width="400" x="40" y="38" />
          <text className={styles.pathwayTitle} x="70" y="76">
            LIVER LOADING DOCK
          </text>
          <path
            className={styles.liver}
            d="M74 126c37-30 100-16 127 19-13 38-51 59-112 48-23-13-32-40-15-67z"
          />
          <rect className={styles.loadingDock} height="72" rx="8" width="96" x="290" y="121" />
          <g className={styles.glucoseCrate}>
            <rect height="30" rx="6" width="34" x="219" y="143" />
            <text x="236" y="164">
              G
            </text>
            <animateTransform
              attributeName="transform"
              dur="7s"
              keyTimes="0;0.22;0.48;0.7;1"
              repeatCount="indefinite"
              type="translate"
              values="-28 0;0 0;43 0;43 0;-28 0"
            />
            <animate
              attributeName="opacity"
              dur="7s"
              keyTimes="0;0.12;0.56;0.72;1"
              repeatCount="indefinite"
              values="0;1;1;0;0"
            />
          </g>
          <rect className={styles.loadingShutter} height="10" rx="5" width="76" x="300" y="126">
            <animate
              attributeName="height"
              dur="7s"
              keyTimes="0;0.38;0.58;0.84;1"
              repeatCount="indefinite"
              values="10;10;58;58;10"
            />
          </rect>
          <text className={styles.pathwayAction} textAnchor="middle" x="240" y="231">
            RELEASE LESS
          </text>
        </g>

        <g aria-label="Digestion hourglass slowing the pace">
          <rect className={styles.pathwayPanel} height="224" rx="28" width="400" x="480" y="38" />
          <text className={styles.pathwayTitle} x="510" y="76">
            DIGESTION HOURGLASS
          </text>
          <path
            className={styles.hourglassFrame}
            d="M593 107h115M593 190h115M608 107c0 36 28 31 28 42s-28 8-28 41M693 107c0 36-28 31-28 42s28 8 28 41"
          />
          <g clipPath="url(#day-seven-hourglass-interior)">
            {[
              "M628 120Q638 136 648 148Q640 161 631 177",
              "M650 119V177",
              "M672 120Q662 136 652 148Q660 161 669 177",
            ].map((path, item) => (
              <circle className={styles.foodDot} cx="0" cy="0" key={path} r="7">
                <animateMotion
                  begin={`${item * 0.8}s`}
                  dur="6.6s"
                  keyTimes="0;0.28;0.58;0.8;1"
                  path={path}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  begin={`${item * 0.8}s`}
                  dur="6.6s"
                  keyTimes="0;0.12;0.78;0.9;1"
                  repeatCount="indefinite"
                  values="0;1;1;0;0"
                />
              </circle>
            ))}
          </g>
          <g transform="translate(770 148)">
            <g>
              <path className={styles.pendulumStem} d="M0-42V0" />
              <circle className={styles.pendulumWeight} cx="0" cy="18" r="17" />
              <animateTransform
                attributeName="transform"
                dur="3.6s"
                keyTimes="0;0.5;1"
                repeatCount="indefinite"
                type="rotate"
                values="-25 0 -42;25 0 -42;-25 0 -42"
              />
            </g>
          </g>
          <text className={styles.pathwayAction} textAnchor="middle" x="680" y="231">
            SLOW THE PACE
          </text>
        </g>

        <g aria-label="Kidney filter directing glucose outward">
          <rect className={styles.pathwayPanel} height="224" rx="28" width="400" x="40" y="286" />
          <text className={styles.pathwayTitle} x="70" y="324">
            KIDNEY FILTER
          </text>
          <path
            className={styles.kidneyShape}
            d="M105 351c-51 5-54 82-19 110 25 20 43-3 51-31 5-22 1-49 17-66-12-11-28-16-49-13z"
          />
          <path className={styles.filterChute} d="M188 375h128l-19 40v43" />
          <g className={styles.filterMesh}>
            <path d="M198 388h111M210 400h93M225 412h73" />
            <animate
              attributeName="opacity"
              dur="5.8s"
              keyTimes="0;0.25;0.55;0.8;1"
              repeatCount="indefinite"
              values="0.35;1;1;0.35;0.35"
            />
          </g>
          <g className={styles.glucoseCrate}>
            <rect height="28" rx="6" width="32" x="-16" y="-14" />
            <text x="0" y="6">
              G
            </text>
            <animateMotion
              dur="5.8s"
              keyTimes="0;0.42;0.72;1"
              path="M188 375H316L297 415V458"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              dur="5.8s"
              keyTimes="0;0.12;0.78;1"
              repeatCount="indefinite"
              values="0;1;1;0"
            />
          </g>
          <text className={styles.pathwayAction} textAnchor="middle" x="240" y="481">
            DIRECT OUTWARD
          </text>
        </g>

        <g aria-label="Cell receiving a medicine-supported signal">
          <rect className={styles.pathwayPanel} height="224" rx="28" width="400" x="480" y="286" />
          <text className={styles.pathwayTitle} x="510" y="324">
            CELL RADIO
          </text>
          <rect className={styles.signalRadio} height="80" rx="18" width="112" x="520" y="358" />
          <line className={styles.radioAntenna} x1="576" x2="601" y1="358" y2="337" />
          {[0, 1, 2].map((wave) => (
            <path
              className={styles.radioWave}
              d={`M${646 + wave * 16} ${370 - wave * 8}q${30 + wave * 9} 28 0 ${56 + wave * 16}`}
              key={wave}
            >
              <animate
                attributeName="opacity"
                begin={`${wave * 0.45}s`}
                dur="4.8s"
                keyTimes="0;0.2;0.48;0.72;1"
                repeatCount="indefinite"
                values="0;1;1;0;0"
              />
            </path>
          ))}
          <circle className={styles.cell} cx="804" cy="398" r="55">
            <animate
              attributeName="r"
              dur="4.8s"
              keyTimes="0;0.34;0.55;0.74;1"
              repeatCount="indefinite"
              values="55;55;61;55;55"
            />
          </circle>
          <text className={styles.pathwayAction} textAnchor="middle" x="680" y="481">
            SUPPORT THE RESPONSE
          </text>
        </g>

        <text className={styles.motionCaption} textAnchor="middle" x="460" y="560">
          FOUR TOOLS · FOUR DIFFERENT JOBS
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>There is no single “diabetes pill.”</strong> Different medicine classes work through
        different pathways. These are simplified teaching scenes, not a claim that every medicine
        performs every job, and a clinician fits the tool to the person.
      </figcaption>
    </figure>
  );
}

function InsulinBridgeAnimation() {
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="insulin-bridge-title insulin-bridge-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 820 440"
      >
        <title id="insulin-bridge-title">An insulin lighthouse signals a cell harbor</title>
        <desc id="insulin-bridge-desc">
          A looping lighthouse metaphor shows an insulin beam reaching a cell harbor, a dock gate
          opening, and glucose cargo boats entering.
        </desc>
        <rect className={styles.softRoom} height="440" rx="56" width="820" />
        <path className={styles.harborWater} d="M46 287q90-24 180 0t180 0 180 0 188 0" />

        <g aria-label="Insulin signal lighthouse" transform="translate(92 99)">
          <path className={styles.lighthouseTower} d="M35 70h76l-11 130H46z" />
          <rect className={styles.lighthouseLamp} height="45" rx="12" width="90" x="28" y="28" />
          <path className={styles.lighthouseRoof} d="M20 28h106L74 0z" />
          <polygon className={styles.lighthouseBeam} points="116,45 520,4 520,126">
            <animate
              attributeName="points"
              dur="12s"
              keyTimes="0;0.12;0.24;0.82;0.92;1"
              repeatCount="indefinite"
              values="116,45 360,18 360,88;116,45 360,18 360,88;116,45 520,4 520,126;116,45 520,4 520,126;116,45 360,18 360,88;116,45 360,18 360,88"
            />
            <animate
              attributeName="opacity"
              dur="12s"
              keyTimes="0;0.12;0.24;0.82;0.92;1"
              repeatCount="indefinite"
              values="0.12;0.12;0.42;0.42;0.12;0.12"
            />
          </polygon>
          <text className={styles.lighthouseLabel} textAnchor="middle" x="73" y="226">
            INSULIN SIGNAL
          </text>
        </g>

        <g aria-label="Cell harbor" transform="translate(662 112)">
          <circle className={styles.cellHarbor} cx="0" cy="104" r="94" />
          <rect className={styles.harborOpening} height="66" width="25" x="-105" y="71" />
          <g transform="translate(-84 104)">
            <g>
              <rect className={styles.harborGate} height="62" rx="3" width="13" x="-7" y="-31" />
              <animateTransform
                attributeName="transform"
                dur="12s"
                keyTimes="0;0.22;0.3;0.78;0.86;0.94;1"
                repeatCount="indefinite"
                type="rotate"
                values="0;0;-90;-90;-180;-180;0"
              />
            </g>
          </g>
          <text className={styles.svgLabel} textAnchor="middle" x="18" y="110">
            CELL HARBOR
          </text>
          <circle className={styles.cellPulse} cx="0" cy="104" fill="none" r="102">
            <animate
              attributeName="r"
              dur="12s"
              keyTimes="0;0.22;0.3;0.82;0.9;1"
              repeatCount="indefinite"
              values="102;102;118;118;102;102"
            />
            <animate
              attributeName="opacity"
              dur="12s"
              keyTimes="0;0.22;0.3;0.82;0.9;1"
              repeatCount="indefinite"
              values="0;0;0.42;0.42;0;0"
            />
          </circle>
        </g>

        {[
          {
            keyPoints: "0;0;0;1;1;1",
            keyTimes: "0;0.2;0.32;0.5;0.56;1",
            opacityTimes: "0;0.14;0.32;0.5;0.58;1",
          },
          {
            keyPoints: "0;0;0;1;1;1",
            keyTimes: "0;0.32;0.44;0.62;0.68;1",
            opacityTimes: "0;0.26;0.44;0.62;0.7;1",
          },
          {
            keyPoints: "0;0;0;1;1;1",
            keyTimes: "0;0.44;0.56;0.74;0.8;1",
            opacityTimes: "0;0.38;0.56;0.74;0.82;1",
          },
        ].map(({ keyPoints, keyTimes, opacityTimes }) => (
          <g className={styles.glucoseBoat} key={keyTimes} transform="translate(248 260)">
            <path d="M0 0h54l-10 20H10z" />
            <rect height="18" rx="5" width="24" x="15" y="-17" />
            <text x="27" y="-4">
              G
            </text>
            <animateMotion
              calcMode="linear"
              dur="12s"
              keyPoints={keyPoints}
              keyTimes={keyTimes}
              path="M0 0C140 10 260 -20 390 -44"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              dur="12s"
              keyTimes={opacityTimes}
              repeatCount="indefinite"
              values="0;1;1;1;0;0"
            />
          </g>
        ))}
        <text className={styles.motionCaption} textAnchor="middle" x="410" y="392">
          THE SIGNAL OPENS A RESPONSE · GLUCOSE CAN FOLLOW
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Insulin is a body signal and a treatment tool.</strong> The lighthouse is a teaching
        metaphor: insulin does not carry glucose like cargo. Prescribed insulin can add the signal
        the body needs; it is not a last-place finish or a personal failure.
      </figcaption>
    </figure>
  );
}

export function DaySevenExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [openingFeeling, setOpeningFeeling] = useState<OpeningFeeling | null>(null);
  const [analogyChoice, setAnalogyChoice] = useState<string | null>(null);
  const [fitOpened, setFitOpened] = useState<Set<FitFactorId>>(() => new Set());
  const [activeFit, setActiveFit] = useState<FitFactorId | null>(null);
  const [mechanismsOpened, setMechanismsOpened] = useState<Set<MechanismId>>(() => new Set());
  const [activeMechanism, setActiveMechanism] = useState<MechanismId | null>(null);
  const [medicineRolesOpened, setMedicineRolesOpened] = useState<Set<MedicineRoleId>>(
    () => new Set(),
  );
  const [supports, setSupports] = useState<Set<string>>(() => new Set());
  const [lowRiskOpened, setLowRiskOpened] = useState<Set<LowRiskId>>(() => new Set());
  const [insulinTruth, setInsulinTruth] = useState<string | null>(null);
  const [routineAnchor, setRoutineAnchor] = useState<(typeof routineAnchors)[number] | null>(null);
  const [routineSupport, setRoutineSupport] = useState<(typeof routineSupports)[number] | null>(
    null,
  );
  const [question, setQuestion] = useState<(typeof clinicianQuestions)[number] | null>(null);
  const [reflection, setReflection] = useState<(typeof reflections)[number] | null>(null);
  const [evaluations, setEvaluations] = useState<
    Partial<Record<"personalization" | "sideEffect" | "teachBack", DaySevenEvaluationFeedback>>
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<"personalization" | "sideEffect" | "teachBack", string>>
  >({});
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = `health-decoded:day-seven:${experience.lessonProgressId}`;

  useEffect(() => {
    if (experience.accessMode === "review") return;
    const stored = Number(window.localStorage.getItem(storageKey));
    if (Number.isInteger(stored) && stored >= 0 && stored < stageCount) setStage(stored);
  }, [experience.accessMode, storageKey]);

  useEffect(() => {
    if (stage > 0) stageRef.current?.focus();
  }, [stage]);

  function saveStage(nextStage: number) {
    if (experience.accessMode === "review") return;
    window.localStorage.setItem(storageKey, String(nextStage));
    const maximumBlock = Math.max(experience.blocks.length - 1, 0);
    const blockIndex = Math.min(
      maximumBlock,
      Math.floor((nextStage / (stageCount - 1)) * maximumBlock),
    );
    startTransition(async () => {
      const result = await saveLessonPositionAction({
        blockIndex,
        lessonProgressId: experience.lessonProgressId,
      });
      setMessage(result.ok ? null : result.message);
    });
  }

  function goToStage(nextStage: number) {
    const normalized = Math.max(0, Math.min(stageCount - 1, nextStage));
    setStage(normalized);
    saveStage(normalized);
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.querySelector('[data-reduced-motion="true"]') !== null;
    window.scrollTo({ behavior: reduced ? "auto" : "smooth", top: 0 });
  }

  async function evaluate(
    input: unknown,
    key: "personalization" | "sideEffect" | "teachBack",
    answer: string,
  ) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDaySevenAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function toggleSupport(id: string) {
    setSupports((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function canContinue() {
    if (stage === 0) return openingFeeling !== null;
    if (stage === 1) return analogyChoice !== null;
    if (stage === 2)
      return fitOpened.size === fitFactors.length && Boolean(evaluations.personalization);
    if (stage === 3) return mechanismsOpened.size === mechanisms.length;
    if (stage === 4) return medicineRolesOpened.size === medicineRoles.length;
    if (stage === 5) return supports.size >= 3;
    if (stage === 6) return lowRiskOpened.size === lowRiskCards.length;
    if (stage === 7) return insulinTruth !== null;
    if (stage === 8) return Boolean(evaluations.sideEffect);
    if (stage === 9) return routineAnchor !== null && routineSupport !== null;
    if (stage === 10)
      return question !== null && reflection !== null && Boolean(evaluations.teachBack);
    return true;
  }

  function stageRequirement() {
    return [
      "Choose how medicine feels to you today.",
      "Choose what the glasses analogy means.",
      "Open all four fit factors and answer the personalization check.",
      "Open all five body pathways.",
      "Open each medicine example.",
      "Choose at least three parts of the care system.",
      "Open all three low-glucose safety notes.",
      "Choose the accurate insulin statement.",
      "Choose the safe next step for a side-effect concern.",
      "Choose one fact to verify and one reliable source.",
      "Choose one clinician question, one reflection, and the Day 7 explanation.",
    ][stage];
  }

  function continueLabel() {
    return (
      [
        "Release the judgment",
        "Fit the plan to the person",
        "See where tools can work",
        "Meet three examples",
        "Assemble the care system",
        "Understand low-glucose risk",
        "Reframe insulin",
        "Open the safety conversation",
        "Build a medication fact card",
        "Carry one question forward",
        "Open the medicine literacy card",
      ][stage] ?? "Continue"
    );
  }

  function finishExperience() {
    if (experience.accessMode === "review") {
      router.push("/journey");
      return;
    }
    startTransition(async () => {
      const blockIndex = Math.max(experience.blocks.length - 1, 0);
      const positionResult = await saveLessonPositionAction({
        blockIndex,
        lessonProgressId: experience.lessonProgressId,
      });
      if (!positionResult.ok) {
        setMessage(positionResult.message);
        return;
      }
      const result = await completeLessonAction({ lessonProgressId: experience.lessonProgressId });
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      window.localStorage.removeItem(storageKey);
      router.push(`/journey?completed=${experience.dayNumber}`);
    });
  }

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_17rem] lg:items-end">
              <LessonHeading label="Day 07 · Medicines are tools, not judgments">
                A prescription cannot measure your worth.
              </LessonHeading>
              <div className="border-l-2 border-accent-warm pl-6">
                <p className="editorial-number text-accent-warm">07</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Today is not a list of pills. It is a calmer way to understand why treatment can
                  include medicine.
                </p>
              </div>
            </div>
            <LessonStoryImage
              alt="A patient asks a pharmacist a question while they review a medicine bottle and instruction card together"
              caption="Knowing what a medicine is for, how to use it, and what concerns to report is part of safe care. Questions are welcome."
              emphasis="Medicine should come with a conversation."
              priority
              src="/lessons/day-07/pharmacist-conversation.jpg"
            />
            <div className="grid gap-7 border-y border-border py-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
              <div
                className={styles.comfortPortrait}
                aria-label="Two people sitting together in a calm conversation"
                role="img"
              >
                <div className={styles.comfortPeople}>
                  <span />
                  <span />
                  <i />
                </div>
                <p>Care can add support without adding blame.</p>
              </div>
              <div>
                <p className="font-serif-display text-3xl">
                  When you hear “medicine,” what arrives first?
                </p>
                <div className="mt-5 grid gap-3">
                  {openingFeelings.map(([id, label]) => (
                    <AnswerChoice
                      key={id}
                      onClick={() => setOpeningFeeling(id)}
                      selected={openingFeeling === id}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </div>
            </div>
            {openingFeeling ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-5 text-lg leading-8">
                Whatever arrived is allowed here. This lesson will explain tools without diagnosing
                you, choosing a medicine for you, or asking you to defend the care you need.
              </p>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <LessonHeading label="A familiar kind of support">
              Glasses do not mean your eyes failed.
            </LessonHeading>
            <SupportLensAnimation />
            <div className="grid gap-3 md:grid-cols-3">
              {(
                [
                  ["support", "A tool can support a body process."],
                  ["failure", "A tool proves someone failed."],
                  ["replace", "A tool replaces every other kind of care."],
                ] as const
              ).map(([id, label]) => (
                <AnswerChoice
                  key={id}
                  onClick={() => setAnalogyChoice(id)}
                  selected={analogyChoice === id}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {analogyChoice ? (
              <p
                className={cn(
                  "border-l-2 p-5 leading-7",
                  analogyChoice === "support"
                    ? "border-success bg-info"
                    : "border-warning bg-warning/10",
                )}
              >
                {analogyChoice === "support"
                  ? "Exactly. Medication can support a body process without becoming a verdict about effort, character, or value."
                  : "The analogy keeps the support and releases the judgment: a useful tool neither proves failure nor replaces every other part of care."}
              </p>
            ) : null}
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <LessonHeading label="Person-centered care">
              The right tool depends on the whole person.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Open each part of the fitting conversation. No single number makes this decision by
              itself.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {fitFactors.map((factor, index) => {
                const opened = fitOpened.has(factor.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(styles.factorCard, opened && styles.factorCardOpen)}
                    key={factor.id}
                    onClick={() => {
                      setFitOpened((current) => new Set([...current, factor.id]));
                      setActiveFit(factor.id);
                    }}
                    type="button"
                  >
                    <span>0{index + 1}</span>
                    <strong>{factor.label}</strong>
                    <small>{opened ? factor.body : "Open this part of the plan"}</small>
                  </button>
                );
              })}
            </div>
            {activeFit ? (
              <p className="border-l-2 border-success bg-info p-5 leading-7">
                {fitFactors.find((item) => item.id === activeFit)?.body}
              </p>
            ) : null}
            <div className="grid gap-3 md:grid-cols-3">
              {(
                [
                  ["individual_fit", "A clinician fits the tool to the person."],
                  ["same_for_everyone", "Everyone should start with the same medicine."],
                  ["replace_habits", "Medicine replaces healthy habits."],
                ] as const
              ).map(([answer, label]) => (
                <AnswerChoice
                  key={answer}
                  onClick={() =>
                    evaluate({ answer, stage: "personalization" }, "personalization", answer)
                  }
                  selected={selectedAnswers.personalization === answer}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {evaluations.personalization ? (
              <Feedback feedback={evaluations.personalization} />
            ) : null}
          </div>
        );
      case 3:
        return (
          <div className="space-y-9">
            <LessonHeading label="A body workshop">
              Different tools can work in different places.
            </LessonHeading>
            <BodyToolsAnimation />
            <div className="grid gap-3 sm:grid-cols-2">
              {mechanisms.map((mechanism) => {
                const opened = mechanismsOpened.has(mechanism.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(styles.mechanismButton, opened && styles.mechanismButtonOpen)}
                    key={mechanism.id}
                    onClick={() => {
                      setMechanismsOpened((current) => new Set([...current, mechanism.id]));
                      setActiveMechanism(mechanism.id);
                    }}
                    type="button"
                  >
                    <Pill aria-hidden="true" className="size-5" />
                    <span>
                      <strong>{mechanism.label}</strong>
                      <small>{opened ? mechanism.body : "Tap to trace this pathway"}</small>
                    </span>
                  </button>
                );
              })}
            </div>
            {activeMechanism ? (
              <p className="border-l-2 border-accent-warm bg-accent-warm/8 p-5 leading-7">
                {mechanisms.find((item) => item.id === activeMechanism)?.body}
              </p>
            ) : null}
          </div>
        );
      case 4:
        return (
          <div className="space-y-9">
            <LessonHeading label="Examples, not a prescription">
              Common does not mean universal.
            </LessonHeading>
            <div className="border-y border-border py-8">
              <p className="max-w-3xl text-xl leading-9">
                Metformin is a common early medicine. It often helps the liver release less glucose
                and can improve insulin response. But “common” is not the same as “right for
                everyone.”
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {medicineRoles.map((item, index) => {
                const opened = medicineRolesOpened.has(item.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(styles.medicineCard, opened && styles.medicineCardOpen)}
                    key={item.id}
                    onClick={() =>
                      setMedicineRolesOpened((current) => new Set([...current, item.id]))
                    }
                    type="button"
                  >
                    <span>0{index + 1}</span>
                    <Pill aria-hidden="true" />
                    <h2>{item.label}</h2>
                    <p>{opened ? item.role : "Open the high-level body job"}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              These examples do not compare brands, doses, or personal suitability. Those decisions
              belong with a prescribing clinician.
            </p>
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <LessonHeading label="Treatment works in a system">
              Medicine can have one job without replacing the rest of care.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Choose at least three parts. The model shows parallel roles, not a contest over which
              one proves the person is trying hard enough.
            </p>
            <div className={styles.supportStructure}>
              <div className={styles.supportPerson}>
                <span />
                <i />
              </div>
              <div className={styles.supportGround}>
                {["medicine", "food", "movement", "sleep", "care-team"].map((id) => (
                  <span className={cn(supports.has(id) && styles.supportActive)} key={id} />
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {(
                [
                  ["medicine", "Medicine"],
                  ["food", "Food"],
                  ["movement", "Movement"],
                  ["sleep", "Rest"],
                  ["care-team", "Care team"],
                ] as const
              ).map(([id, label]) => (
                <AnswerChoice
                  key={id}
                  onClick={() => toggleSupport(id)}
                  selected={supports.has(id)}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {supports.size >= 3 ? (
              <p className="border-l-2 border-success bg-info p-5 leading-7">
                Medication, food, movement, rest, and clinical follow-up can do different jobs in
                the same care system. None is a moral substitute for another.
              </p>
            ) : null}
          </div>
        );
      case 6:
        return (
          <div className="space-y-9">
            <LessonHeading label="Safety without alarm">
              Low-glucose risk is not the same for every medicine.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Open all three notes. You do not need to memorize a class chart today; you need to
              know what to ask.
            </p>
            <div className="grid gap-5 md:grid-cols-3">
              {lowRiskCards.map((item, index) => {
                const opened = lowRiskOpened.has(item.id);
                return (
                  <button
                    aria-pressed={opened}
                    className={cn(styles.riskCard, opened && styles.riskCardOpen)}
                    key={item.id}
                    onClick={() => setLowRiskOpened((current) => new Set([...current, item.id]))}
                    type="button"
                  >
                    <ShieldCheck aria-hidden="true" />
                    <span>0{index + 1}</span>
                    <h2>{item.label}</h2>
                    <p>{opened ? item.body : "Open the safety note"}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-9">
            <LessonHeading label="Insulin without stigma">
              A body tool is never a punishment.
            </LessonHeading>
            <InsulinBridgeAnimation />
            <div className="grid gap-3 md:grid-cols-3">
              {(
                [
                  ["treatment", "Insulin is treatment that adds a signal the body needs."],
                  ["failure", "Insulin proves a person failed."],
                  ["final", "Insulin is always the final stage."],
                ] as const
              ).map(([id, label]) => (
                <AnswerChoice
                  key={id}
                  onClick={() => setInsulinTruth(id)}
                  selected={insulinTruth === id}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {insulinTruth ? (
              <p
                className={cn(
                  "border-l-2 p-5 leading-7",
                  insulinTruth === "treatment"
                    ? "border-success bg-info"
                    : "border-warning bg-warning/10",
                )}
              >
                {insulinTruth === "treatment"
                  ? "Yes. Insulin can be used at different times for different reasons. It is a treatment, not a consequence or moral verdict."
                  : "Release the failure story. Insulin is a treatment tool, and when it is used depends on the body and clinical situation."}
              </p>
            ) : null}
          </div>
        );
      case 8:
        return (
          <div className="space-y-9">
            <LessonHeading label="Side effects are conversations">
              A concern deserves a safe next step.
            </LessonHeading>
            <div className="grid gap-7 border-y border-border py-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
              <div className={styles.conversationIllustration}>
                <MessageCircleHeart aria-hidden="true" />
                <span />
                <i />
              </div>
              <div>
                <p className="font-serif-display text-3xl">
                  A new symptom begins after starting a prescription. What is the safest next step?
                </p>
                <div className="mt-5 grid gap-3">
                  {(
                    [
                      [
                        "contact_care_team",
                        "Contact the prescribing care team and describe what is happening.",
                      ],
                      ["stop_immediately", "Stop the medicine immediately without guidance."],
                      ["double_next_dose", "Double the next dose to make up for uncertainty."],
                    ] as const
                  ).map(([answer, label]) => (
                    <AnswerChoice
                      key={answer}
                      onClick={() =>
                        evaluate({ answer, stage: "side_effect" }, "sideEffect", answer)
                      }
                      selected={selectedAnswers.sideEffect === answer}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </div>
            </div>
            {evaluations.sideEffect ? <Feedback feedback={evaluations.sideEffect} /> : null}
          </div>
        );
      case 9:
        return (
          <div className="space-y-9">
            <LessonHeading label="Medication literacy">
              Build a fact card before you build assumptions.
            </LessonHeading>
            <LessonStoryImage
              alt="A man reads his prescription label with water nearby while his partner pours tea"
              caption="The medicine name, purpose, and exact instructions belong together. A pharmacist or prescribing team can clarify anything the label leaves uncertain."
              emphasis="Verify the plan you actually have."
              src="/lessons/day-07/everyday-medicine-routine.jpg"
            />
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              This activity does not interpret a personal prescription. It practices identifying
              which fact needs checking and where a trustworthy answer can come from.
            </p>
            <div className="grid gap-7 lg:grid-cols-2">
              <section>
                <h2 className="font-serif-display text-2xl">Choose a fact to verify</h2>
                <div className="mt-4 grid gap-3">
                  {routineAnchors.map((item) => (
                    <AnswerChoice
                      key={item}
                      onClick={() => setRoutineAnchor(item)}
                      selected={routineAnchor === item}
                    >
                      {item}
                    </AnswerChoice>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="font-serif-display text-2xl">Choose a reliable source</h2>
                <div className="mt-4 grid gap-3">
                  {routineSupports.map((item) => (
                    <AnswerChoice
                      key={item}
                      onClick={() => setRoutineSupport(item)}
                      selected={routineSupport === item}
                    >
                      {item}
                    </AnswerChoice>
                  ))}
                </div>
              </section>
            </div>
            {routineAnchor && routineSupport ? (
              <div className={styles.routineTicket}>
                <Pill aria-hidden="true" />
                <div>
                  <p className="editorial-eyebrow">Medication fact card</p>
                  <h2>
                    {routineAnchor} · {routineSupport}
                  </h2>
                  <p>
                    Verify the exact answer for this prescription. Do not infer dose, timing, or
                    missed-dose instructions from a general lesson or from someone else’s medicine.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 10:
        return (
          <div className="space-y-10">
            <LessonHeading label="One question is enough">
              Carry one useful conversation starter.
            </LessonHeading>
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div className={styles.questionPocket}>
                <CircleHelp aria-hidden="true" />
                <p>Your question stays on this page and is not saved to your profile.</p>
              </div>
              <div className="grid gap-3">
                {clinicianQuestions.map((item) => (
                  <AnswerChoice
                    key={item}
                    onClick={() => setQuestion(item)}
                    selected={question === item}
                  >
                    {item}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {question ? (
              <blockquote className="border-l-2 border-accent-warm bg-card p-6 font-serif-display text-3xl leading-tight">
                “{question}”
              </blockquote>
            ) : null}
            <div>
              <h2 className="font-serif-display text-3xl">What are you carrying forward?</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {reflections.map((item) => (
                  <AnswerChoice
                    key={item}
                    onClick={() => setReflection(item)}
                    selected={reflection === item}
                  >
                    {item}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-serif-display text-3xl">Medication literacy checkpoint</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {(
                  [
                    ["tool_not_judgment", "Medication is a tool, not a judgment."],
                    ["proof_of_failure", "Medicine proves habits failed."],
                    ["final_stage", "Insulin means the final stage."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => evaluate({ answer, stage: "teach_back" }, "teachBack", answer)}
                    selected={selectedAnswers.teachBack === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
              {evaluations.teachBack ? (
                <div className="mt-5">
                  <Feedback feedback={evaluations.teachBack} />
                </div>
              ) : null}
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-12 text-center">
            <p className="editorial-eyebrow">Day 7 complete</p>
            <LessonHeading>Medication is not a judgment. It is a tool.</LessonHeading>
            <div className="mx-auto max-w-3xl border-y border-border py-9 text-left">
              <p className="editorial-eyebrow text-success">Medicine literacy card</p>
              <ol className="mt-6 space-y-6">
                {[
                  "Different medicines work through different body pathways, and the plan should be fitted to the person.",
                  "Metformin is common, not universal. Insulin is treatment, not failure.",
                  "Know the name, purpose, and safety questions for your medicine; concerns belong with the care team.",
                ].map((item, index) => (
                  <li className="grid grid-cols-[3rem_1fr] gap-4 text-lg leading-8" key={item}>
                    <span className="font-serif-display text-4xl text-accent-warm">
                      0{index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mx-auto grid max-w-3xl gap-6 text-left md:grid-cols-2">
              <div>
                <p className="editorial-eyebrow">Tomorrow</p>
                <h2 className="mt-3 font-serif-display text-3xl">Monitoring and data</h2>
                <p className="mt-2 leading-7 text-muted-foreground">
                  Learn which question each monitoring tool can answer and how context turns a
                  reading into a useful care conversation.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow text-success">Your question</p>
                <p className="mt-3 font-serif-display text-2xl">
                  {question ?? "You can choose one whenever you are ready."}
                </p>
              </div>
            </div>
            <Button disabled={isPending} fullWidth={false} onClick={finishExperience}>
              {isPending
                ? "Saving your progress…"
                : experience.accessMode === "review"
                  ? "Return to journey"
                  : "Complete Day 7"}
            </Button>
          </div>
        );
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[980px] flex-col py-1 sm:py-4">
      <header className="border-b border-border pb-5">
        <div className="flex items-center justify-between gap-3">
          {stage > 0 ? (
            <Button fullWidth={false} onClick={() => goToStage(stage - 1)} variant="text">
              <ArrowLeft className="size-4" /> Back
            </Button>
          ) : (
            <Link
              className={cn(buttonVariants({ fullWidth: false, variant: "text" }), "gap-2")}
              href="/journey"
            >
              <ArrowLeft className="size-4" /> Back
            </Link>
          )}
          <div className="text-center">
            <p className="text-sm font-semibold text-accent-warm">Day 7</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Medicines Are Tools, Not Judgments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Open glossary"
              fullWidth={false}
              onClick={() => setGlossaryOpen(true)}
              variant="text"
            >
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Glossary</span>
            </Button>
            <Button fullWidth={false} onClick={() => setExitOpen(true)} variant="text">
              Save &amp; exit
            </Button>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Chapter {stage + 1}</span>
            <span>{stageCount} chapters</span>
          </div>
          <ProgressBar
            label={`Day 7 chapter ${stage + 1} of ${stageCount}`}
            value={((stage + 1) / stageCount) * 100}
          />
        </div>
      </header>
      <div className="flex-1 py-8 sm:py-12" ref={stageRef} tabIndex={-1}>
        <div className="animate-fade-in" key={stage}>
          {renderStage()}
        </div>
      </div>
      {stage < stageCount - 1 ? (
        <footer className="border-t border-border pt-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              disabled={stage === 0 || isPending}
              onClick={() => goToStage(stage - 1)}
              variant="secondary"
            >
              Previous
            </Button>
            <Button disabled={!canContinue() || isPending} onClick={() => goToStage(stage + 1)}>
              {continueLabel()}
            </Button>
          </div>
          {!canContinue() ? (
            <p aria-live="polite" className="mt-3 text-sm text-muted-foreground" role="status">
              To continue: {stageRequirement()}
            </p>
          ) : null}
        </footer>
      ) : null}
      <p
        aria-live="polite"
        className={cn("mt-3 min-h-6 text-sm text-destructive", !message && "invisible")}
        role={message ? "alert" : undefined}
      >
        {message ?? ""}
      </p>
      <Modal
        description="Your chapter will be saved. Practice choices and reflections stay in this browser and are not saved as health information."
        onOpenChange={setExitOpen}
        open={exitOpen}
        title="Leave Day 7 for now?"
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button fullWidth={false} onClick={() => setExitOpen(false)} variant="secondary">
            Keep exploring
          </Button>
          <Link className={buttonVariants({ fullWidth: false })} href="/journey">
            Save and exit
          </Link>
        </div>
      </Modal>
      <Modal
        description="Plain-language definitions used in this lesson."
        onOpenChange={setGlossaryOpen}
        open={glossaryOpen}
        title="Day 7 glossary"
      >
        <div className="max-h-[60dvh] space-y-5 overflow-y-auto pr-2">
          {daySevenGlossary.map((entry) => (
            <section key={entry.id}>
              <h2 className="font-serif-display text-xl font-semibold">{entry.term}</h2>
              <p className="mt-1 text-sm leading-6">{entry.definition}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {entry.simpleExplanation}
              </p>
            </section>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button fullWidth={false} onClick={() => setGlossaryOpen(false)} variant="secondary">
            Close
          </Button>
        </div>
      </Modal>
    </section>
  );
}
