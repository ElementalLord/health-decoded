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
  "With breakfast",
  "With an evening routine",
  "Beside a daily object",
] as const;
const routineSupports = [
  "A simple pill organizer",
  "A calendar check",
  "A refill reminder",
] as const;

const clinicianQuestions = [
  "What is this medicine meant to help with?",
  "What side effects should I call you about?",
  "Can this medicine cause low glucose for me?",
  "What should I do if I miss a dose?",
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
              —
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
        <strong>A tool changes what becomes possible—not your worth.</strong> Glasses support
        vision. Medication can support a body process. Neither is a moral grade.
      </figcaption>
    </figure>
  );
}

function BodyToolsAnimation() {
  const glucose = [0, 1, 2, 3];
  return (
    <figure className={styles.motionFigure}>
      <svg
        aria-labelledby="body-tools-title body-tools-desc"
        className={styles.motionCanvas}
        role="img"
        viewBox="0 0 920 470"
      >
        <title id="body-tools-title">
          Several diabetes medication pathways working around the body
        </title>
        <desc id="body-tools-desc">
          A looping visual shows the liver releasing less glucose, an insulin signal reaching a
          cell, digestion slowing, and a kidney route removing glucose.
        </desc>
        <rect className={styles.softRoom} height="470" rx="56" width="920" />
        <path className={styles.vessel} d="M92 232H814" />
        {glucose.map((item) => (
          <circle className={styles.glucose} cx="0" cy={220 + (item % 2) * 25} key={item} r="11">
            <animateMotion
              begin={`${item * 1.35}s`}
              dur="6.2s"
              path="M100 0H704"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              begin={`${item * 1.35}s`}
              dur="6.2s"
              keyTimes="0;0.08;0.9;1"
              repeatCount="indefinite"
              values="0;1;1;0"
            />
          </circle>
        ))}
        <g transform="translate(70 92)">
          <path
            className={styles.liver}
            d="M18 29c42-34 115-18 146 22-14 43-59 68-130 55C9 91-2 59 18 29z"
          />
          <path className={styles.signalPath} d="M145 69h73" />
          <circle className={styles.glucose} cx="151" cy="69" r="9">
            <animate
              attributeName="cx"
              dur="4.8s"
              keyTimes="0;0.42;0.68;1"
              repeatCount="indefinite"
              values="151;204;204;151"
            />
            <animate
              attributeName="opacity"
              dur="4.8s"
              keyTimes="0;0.42;0.68;1"
              repeatCount="indefinite"
              values="1;1;0.18;1"
            />
          </circle>
          <text className={styles.svgLabel} x="54" y="138">
            LIVER
          </text>
        </g>
        <g transform="translate(366 64)">
          <path className={styles.digestive} d="M26 14v42c0 34 63 31 63 70 0 31-34 38-62 38" />
          <circle className={styles.foodDot} cx="26" cy="14" r="10">
            <animateMotion
              dur="8s"
              path="M0 0v42c0 34 63 31 63 70 0 31-34 38-62 38"
              repeatCount="indefinite"
            />
          </circle>
          <text className={styles.svgLabel} x="-6" y="198">
            DIGESTION
          </text>
        </g>
        <g transform="translate(634 63)">
          <path
            className={styles.kidneyShape}
            d="M38 8c-39 4-42 63-15 85 19 16 33-2 39-23 4-17 1-38 13-51C66 11 54 6 38 8z"
          />
          <path className={styles.kidneyRoute} d="M54 75c17 29 15 55 2 86" />
          <circle className={styles.glucose} cx="54" cy="75" r="9">
            <animateMotion dur="5.5s" path="M0 0c17 29 15 55 2 86" repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              dur="5.5s"
              keyTimes="0;0.75;1"
              repeatCount="indefinite"
              values="1;1;0"
            />
          </circle>
          <text className={styles.svgLabel} x="-2" y="198">
            KIDNEY ROUTE
          </text>
        </g>
        <g transform="translate(774 175)">
          <circle className={styles.cell} cx="0" cy="50" r="70" />
          <rect className={styles.cellDoor} height="52" rx="15" width="22" x="-62" y="24">
            <animate
              attributeName="height"
              dur="5.2s"
              keyTimes="0;0.28;0.48;0.72;1"
              repeatCount="indefinite"
              values="52;52;76;76;52"
            />
            <animate
              attributeName="y"
              dur="5.2s"
              keyTimes="0;0.28;0.48;0.72;1"
              repeatCount="indefinite"
              values="24;24;12;12;24"
            />
          </rect>
          <circle className={styles.insulinSignal} cx="-150" cy="50" r="10">
            <animate
              attributeName="cx"
              dur="5.2s"
              keyTimes="0;0.3;0.44;0.72;1"
              repeatCount="indefinite"
              values="-150;-77;-77;-150;-150"
            />
          </circle>
          <text className={styles.svgLabel} textAnchor="middle" x="5" y="55">
            CELL
          </text>
        </g>
        <text className={styles.motionCaption} textAnchor="middle" x="460" y="428">
          DIFFERENT TOOLS · DIFFERENT BODY PATHWAYS
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>There is no single “diabetes pill.”</strong> Different medicine classes work through
        different pathways; a clinician fits the tool to the person.
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
        viewBox="0 0 820 410"
      >
        <title id="insulin-bridge-title">Insulin signals a cell to receive glucose</title>
        <desc id="insulin-bridge-desc">
          An endless loop shows an insulin signal arriving first, a cell response opening, and
          glucose moving inward.
        </desc>
        <rect className={styles.softRoom} height="410" rx="56" width="820" />
        <path className={styles.vessel} d="M74 207H642" />
        <g transform="translate(664 112)">
          <circle className={styles.cell} cx="0" cy="96" r="91" />
          <rect className={styles.cellDoor} height="68" rx="17" width="26" x="-88" y="62">
            <animate
              attributeName="height"
              dur="6.4s"
              keyTimes="0;0.32;0.48;0.78;1"
              repeatCount="indefinite"
              values="68;68;104;104;68"
            />
            <animate
              attributeName="y"
              dur="6.4s"
              keyTimes="0;0.32;0.48;0.78;1"
              repeatCount="indefinite"
              values="62;62;44;44;62"
            />
          </rect>
          <text className={styles.svgLabel} textAnchor="middle" x="7" y="102">
            CELL
          </text>
          <circle className={styles.cellPulse} cx="0" cy="96" fill="none" r="100">
            <animate
              attributeName="r"
              dur="6.4s"
              keyTimes="0;0.34;0.55;0.82;1"
              repeatCount="indefinite"
              values="100;100;125;125;100"
            />
            <animate
              attributeName="opacity"
              dur="6.4s"
              keyTimes="0;0.34;0.55;0.82;1"
              repeatCount="indefinite"
              values="0;0;0.45;0;0"
            />
          </circle>
        </g>
        <circle className={styles.insulinSignal} cx="110" cy="207" r="13">
          <animate
            attributeName="cx"
            dur="6.4s"
            keyTimes="0;0.32;0.48;0.78;1"
            repeatCount="indefinite"
            values="110;576;576;110;110"
          />
        </circle>
        {[0, 1, 2].map((item) => (
          <circle className={styles.glucose} cx="120" cy={180 + item * 29} key={item} r="12">
            <animate
              attributeName="cx"
              begin={`${item * 0.16}s`}
              dur="6.4s"
              keyTimes="0;0.46;0.78;0.9;1"
              repeatCount="indefinite"
              values="120;390;690;690;120"
            />
            <animate
              attributeName="opacity"
              begin={`${item * 0.16}s`}
              dur="6.4s"
              keyTimes="0;0.44;0.78;0.9;1"
              repeatCount="indefinite"
              values="1;1;1;0;0"
            />
          </circle>
        ))}
        <text className={styles.motionCaption} x="78" y="294">
          SIGNAL FIRST
        </text>
        <text className={styles.motionCaption} textAnchor="middle" x="410" y="360">
          INSULIN IS TREATMENT · NOT PUNISHMENT
        </text>
      </svg>
      <figcaption className={styles.figureCaption}>
        <strong>Insulin is a body signal and a treatment tool.</strong> Prescribed insulin can add
        the signal the body needs. It is not a last-place finish or a personal failure.
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
      "Choose at least three supports that can work together.",
      "Open all three low-glucose safety notes.",
      "Choose the accurate insulin statement.",
      "Choose the safe next step for a side-effect concern.",
      "Choose one routine anchor and one practical support.",
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
        "Build a support structure",
        "Understand low-glucose risk",
        "Reframe insulin",
        "Open the safety conversation",
        "Make support practical",
        "Carry one question forward",
        "See today’s takeaway",
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
      router.push(result.data.nextRoute ?? "/journey");
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
            <LessonHeading label="Not either-or">
              Build support around the person—not pressure around the pill.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Choose at least three pieces. The illustration becomes steadier as care works
              together.
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
                Medication can complement daily habits and clinical care. It does not erase them—and
                they do not erase the value of medicine.
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
                  ? "Yes. Insulin can be used at different times for different reasons. It is a treatment—not a consequence or moral verdict."
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
            <LessonHeading label="Consistency without surveillance">
              Let a routine carry some of the remembering.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              This is a memory practice—not a medication instruction. Follow the prescription label
              and care-team guidance.
            </p>
            <div className="grid gap-7 lg:grid-cols-2">
              <section>
                <h2 className="font-serif-display text-2xl">Choose an ordinary anchor</h2>
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
                <h2 className="font-serif-display text-2xl">Choose a practical support</h2>
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
                  <p className="editorial-eyebrow">A routine you can discuss</p>
                  <h2>
                    {routineAnchor} · {routineSupport}
                  </h2>
                  <p>
                    Use only if it matches the prescription instructions. If cost, access, memory,
                    or side effects get in the way, ask for problem-solving—not blame.
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
              <h2 className="font-serif-display text-3xl">Explain Day 7 in one sentence.</h2>
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
              <p className="editorial-eyebrow text-success">Three ideas worth carrying</p>
              <ol className="mt-6 space-y-6">
                {[
                  "Different medicines work through different body pathways, and the plan should be fitted to the person.",
                  "Metformin is common—not universal. Insulin is treatment—not failure.",
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
                  Learn how numbers can inform care without becoming grades.
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
              {experience.accessMode === "review" ? "Return to journey" : "Complete Day 7"}
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
