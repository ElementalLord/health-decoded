"use client";

import {
  Activity,
  ArrowLeft,
  BookOpen,
  CalendarCheck2,
  Check,
  Footprints,
  HeartHandshake,
  Lightbulb,
  MessageCircleHeart,
  Pill,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
} from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

import styles from "./day-fourteen-experience.module.css";

const stageCount = 12;

const arrivalFeelings = [
  ["different", "Diabetes feels different than it did on Day 1"],
  ["steadier", "I feel steadier, even when I still have questions"],
  ["surprised", "I know more than I realized"],
  ["still_learning", "I am still finding my footing, and I kept showing up"],
] as const;

const toolkitItems = [
  {
    description: "Explain what is happening without blame.",
    foundation: "Understand your body",
    icon: Lightbulb,
    id: "understanding",
    label: "Understanding",
  },
  {
    description: "Make room for nourishment, culture, and balance.",
    foundation: "Make everyday decisions",
    icon: Utensils,
    id: "food",
    label: "Food",
  },
  {
    description: "Use activity as an approachable body tool.",
    foundation: "Make everyday decisions",
    icon: Footprints,
    id: "movement",
    label: "Movement",
  },
  {
    description: "Know why treatment can help and what to ask.",
    foundation: "Make everyday decisions",
    icon: Pill,
    id: "medication",
    label: "Medication",
  },
  {
    description: "Turn readings into context and useful questions.",
    foundation: "Understand your body",
    icon: Activity,
    id: "monitoring",
    label: "Monitoring",
  },
  {
    description: "Pause, understand, choose, and adjust.",
    foundation: "Make everyday decisions",
    icon: RefreshCcw,
    id: "problem_solving",
    label: "Problem solving",
  },
  {
    description: "Make one helpful action easier to repeat.",
    foundation: "Make everyday decisions",
    icon: CalendarCheck2,
    id: "routine",
    label: "Routine",
  },
  {
    description: "Ask for help without giving away your choices.",
    foundation: "Protect your future",
    icon: HeartHandshake,
    id: "support",
    label: "Support",
  },
  {
    description: "Bring questions, patterns, and decisions into partnership.",
    foundation: "Protect your future",
    icon: Stethoscope,
    id: "care_team",
    label: "Healthcare team",
  },
  {
    description: "Use screening and early action without fear.",
    foundation: "Protect your future",
    icon: ShieldCheck,
    id: "prevention",
    label: "Prevention",
  },
] as const;

type ToolId = (typeof toolkitItems)[number]["id"];

const foundations = [
  {
    id: "body",
    label: "01",
    points: [
      "Explain Type 2 diabetes without turning it into a character judgment.",
      "Read A1C and glucose information as different views, not grades.",
      "Notice context before deciding what one number means.",
    ],
    title: "Understanding your body",
  },
  {
    id: "decisions",
    label: "02",
    points: [
      "Use food, movement, medication, and monitoring as connected tools.",
      "Build routines that reduce decision fatigue.",
      "Adjust the next choice when a day does not go to plan.",
    ],
    title: "Making everyday decisions",
  },
  {
    id: "future",
    label: "03",
    points: [
      "Use prevention to find quiet changes early.",
      "Know when a situation needs routine care, a call, or urgent help.",
      "Work with a care team and chosen support without surrendering independence.",
    ],
    title: "Protecting your future",
  },
] as const;

type FoundationId = (typeof foundations)[number]["id"];

const growthShifts = [
  {
    after: "Food is one of many tools, and familiar food can stay.",
    before: "Food was the enemy.",
    id: "food",
  },
  {
    after: "Medication can be one useful part of an individualized plan.",
    before: "Medication meant I had failed.",
    id: "medicine",
  },
  {
    after: "One reading is information that needs context.",
    before: "A high reading meant I had failed.",
    id: "numbers",
  },
  {
    after: "Early care and daily habits can influence what happens next.",
    before: "Complications were inevitable.",
    id: "future",
  },
] as const;

const confidenceScenarios = [
  {
    id: "restaurant",
    prompt: "A restaurant menu has no nutrition information.",
    skill: "Use the plate idea, choose what fits, and let one meal be one meal.",
    title: "Eating out",
  },
  {
    id: "busy_day",
    prompt: "A busy workday disrupts the routine you planned.",
    skill: "Choose the best available next step instead of abandoning the day.",
    title: "A crowded day",
  },
  {
    id: "glucose",
    prompt: "A glucose reading is different from what you expected.",
    skill: "Add timing and context before turning the reading into a conclusion.",
    title: "A surprising number",
  },
  {
    id: "appointment",
    prompt: "You have ten minutes with a healthcare professional.",
    skill: "Bring one pattern, one question, and the exact issue you want help with.",
    title: "A short appointment",
  },
  {
    id: "missed_walk",
    prompt: "You miss the walk you hoped to take.",
    skill: "The next movement opportunity still counts; no punishment is required.",
    title: "A missed plan",
  },
] as const;

type ScenarioId = (typeof confidenceScenarios)[number]["id"];
type ConfidenceLevel = "practice" | "prompt" | "ready";

const checklistSkills = [
  ["body", "I can explain what happens inside the body in plain language."],
  ["a1c", "I understand what A1C can and cannot tell me."],
  ["food", "I can identify the carbohydrate part of a meal without banning it."],
  ["movement", "I know why movement helps and how to choose a safe starting point."],
  ["medication", "I understand why medication may be useful in a care plan."],
  ["patterns", "I can look for context and patterns instead of grading one reading."],
  ["safety", "I know when to follow my plan, call for help, or seek urgent care."],
  ["prevention", "I understand why screening matters even when I feel well."],
  ["setbacks", "I can recover from a disrupted day without starting over."],
  ["support", "I can name one person or professional I could ask for help."],
] as const;

type SkillId = (typeof checklistSkills)[number][0];
type SkillComfort = "comfortable" | "practice";

const planAreas = [
  {
    id: "food",
    label: "Food rhythm",
    options: [
      "Add one balanced breakfast I can repeat.",
      "Keep water available with lunch.",
      "Use the plate idea for one dinner each week.",
    ],
  },
  {
    id: "movement",
    label: "Movement",
    options: [
      "Take a 10-minute walk after one meal.",
      "Break up one long sitting stretch.",
      "Choose one enjoyable strength activity.",
    ],
  },
  {
    id: "care",
    label: "Healthcare",
    options: [
      "Write down one question before my next visit.",
      "Schedule one recommended follow-up.",
      "Review my exact medicine instructions.",
    ],
  },
  {
    id: "mindset",
    label: "Mindset",
    options: [
      "Call a reading information, not judgment.",
      "Let the next choice be a fresh choice.",
      "Notice one thing I handled well each week.",
    ],
  },
  {
    id: "support",
    label: "Support",
    options: [
      "Make one small, specific request.",
      "Tell one person what encouragement looks like.",
      "Bring one concern to my care team.",
    ],
  },
] as const;

type PlanAreaId = (typeof planAreas)[number]["id"];

const futureFeelings = [
  "More confident",
  "Less overwhelmed",
  "More energetic",
  "Less worried",
  "More independent",
  "Hopeful",
] as const;

type MilestoneDraft = {
  arrivalFeeling: string | null;
  checklist: Partial<Record<SkillId, SkillComfort>>;
  confidence: Partial<Record<ScenarioId, ConfidenceLevel>>;
  futureFeeling: string | null;
  futureWords: string;
  nextStep: string;
  openedFoundations: FoundationId[];
  plan: Partial<Record<PlanAreaId, string>>;
  promise: string;
  reflection: string;
  selectedShift: string | null;
  stepCue: string;
  toolkit: ToolId[];
};

const initialDraft: MilestoneDraft = {
  arrivalFeeling: null,
  checklist: {},
  confidence: {},
  futureFeeling: null,
  futureWords: "",
  nextStep: "",
  openedFoundations: [],
  plan: {},
  promise: "",
  reflection: "",
  selectedShift: null,
  stepCue: "",
  toolkit: [],
};

function LessonHeading({
  centered = false,
  children,
  label,
}: {
  centered?: boolean;
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className={cn("space-y-3", centered && "mx-auto max-w-4xl text-center")}>
      {label ? <p className="editorial-eyebrow">{label}</p> : null}
      <h1 className={cn(styles.lessonTitle, centered && "mx-auto")}>{children}</h1>
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
      className={cn(styles.answerChoice, selected && styles.answerChoiceSelected)}
      onClick={onClick}
      type="button"
    >
      <span className={styles.choiceMark}>{selected ? <Check aria-hidden="true" /> : null}</span>
      <span>{children}</span>
    </button>
  );
}

function FoundationHomeAnimation() {
  const rooms: Array<{ icon: LucideIcon; label: string; note: string }> = [
    { icon: Lightbulb, label: "Understand", note: "Make sense of the body" },
    { icon: CalendarCheck2, label: "Decide", note: "Use one tool in real life" },
    { icon: ShieldCheck, label: "Protect", note: "Notice and act early" },
  ];

  return (
    <figure
      aria-label="A continuously looping cutaway home where three rooms light in sequence for understanding, everyday decisions, and protecting the future"
      className={styles.motionFigure}
      data-motion-loop="continuous"
      role="img"
    >
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">One life · three foundations</p>
        <h2>The knowledge belongs in ordinary rooms.</h2>
        <p>Understanding, decisions, and future care support one another through the same day.</p>
      </div>
      <div className={styles.homeScene}>
        <div aria-hidden="true" className={styles.homeRoof} />
        <div className={styles.homeRooms}>
          {rooms.map(({ icon: Icon, label, note }, index) => (
            <section
              className={styles.homeRoom}
              key={label}
              style={{ "--room": index } as CSSProperties}
            >
              <span className={styles.roomWindow} />
              <Icon aria-hidden="true" />
              <strong>{label}</strong>
              <small>{note}</small>
              <span aria-hidden="true" className={styles.roomPerson}>
                <span />
                <i />
              </span>
              <span aria-hidden="true" className={styles.roomPulse} />
            </section>
          ))}
        </div>
        <div aria-hidden="true" className={styles.homeFoundation}>
          <span />
        </div>
      </div>
      <figcaption>
        <strong>What to notice:</strong> no room carries the whole house. Diabetes care works the
        same way: several small skills share the load.
      </figcaption>
    </figure>
  );
}

function PracticeLoopAnimation() {
  const stations: Array<{ icon: LucideIcon; label: string; note: string }> = [
    { icon: Utensils, label: "Know", note: "A balanced meal can include familiar food." },
    { icon: Footprints, label: "Try", note: "Choose one movement moment that fits." },
    { icon: RefreshCcw, label: "Adjust", note: "Use what happened to shape the next choice." },
  ];

  return (
    <figure
      aria-label="A continuously looping practice sequence that moves from knowing an idea to trying it and adjusting the next choice"
      className={styles.motionFigure}
      data-motion-loop="continuous"
      role="img"
    >
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">The next 76 days</p>
        <h2>Confidence grows in a practice loop.</h2>
        <p>Knowing matters. Trying, noticing, and adjusting are what make the knowledge usable.</p>
      </div>
      <div className={styles.practiceScene}>
        {stations.map(({ icon: Icon, label, note }) => (
          <section className={styles.practiceStation} key={label}>
            <span>
              <Icon aria-hidden="true" />
            </span>
            <strong>{label}</strong>
            <small>{note}</small>
          </section>
        ))}
        <span aria-hidden="true" className={styles.practiceTrack}>
          <i />
        </span>
      </div>
      <figcaption>
        <strong>What to notice:</strong> the loop returns to the beginning without erasing what you
        learned. Repetition is not starting over.
      </figcaption>
    </figure>
  );
}

function NextStepCalendarAnimation() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <figure
      aria-label="A continuously looping weekly paper calendar where small check marks continue after one open day"
      className={styles.motionFigure}
      data-motion-loop="continuous"
      role="img"
    >
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">Consistency without perfection</p>
        <h2>One open square does not cancel the week.</h2>
        <p>A routine becomes durable when it knows how to continue after life interrupts.</p>
      </div>
      <div className={styles.calendarDesk}>
        <div className={styles.weekSheet}>
          <div className={styles.weekHeader}>
            <CalendarCheck2 aria-hidden="true" />
            <span>One small step this week</span>
          </div>
          <div className={styles.weekGrid}>
            {days.map((day, index) => (
              <div className={styles.daySquare} key={day}>
                <span>{day}</span>
                {index === 3 ? (
                  <i className={styles.openDay}>Rest</i>
                ) : (
                  <Check aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
          <Footprints aria-hidden="true" className={styles.calendarWalker} />
        </div>
      </div>
      <figcaption>
        <strong>What to notice:</strong> Thursday stays open, and Friday still receives a mark. The
        useful skill is returning, not producing a flawless row.
      </figcaption>
    </figure>
  );
}

export function DayFourteenExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [draft, setDraft] = useState<MilestoneDraft>(initialDraft);
  const [hydrated, setHydrated] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const positionKey = "health-decoded:day-fourteen-position:" + experience.lessonProgressId;
  const draftKey = "health-decoded:day-fourteen-foundation:" + experience.lessonProgressId;

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(draftKey);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as Partial<MilestoneDraft>;
        setDraft({
          ...initialDraft,
          ...parsed,
          checklist: parsed.checklist ?? {},
          confidence: parsed.confidence ?? {},
          openedFoundations: Array.isArray(parsed.openedFoundations)
            ? parsed.openedFoundations
            : [],
          plan: parsed.plan ?? {},
          toolkit: Array.isArray(parsed.toolkit) ? parsed.toolkit : [],
        });
      }

      if (experience.accessMode !== "review") {
        const storedStage = Number(window.localStorage.getItem(positionKey));
        if (Number.isInteger(storedStage) && storedStage >= 0 && storedStage < stageCount) {
          setStage(storedStage);
        }
      }
    } catch {
      setMessage("Your private milestone draft could not be restored in this browser.");
    } finally {
      setHydrated(true);
    }
  }, [draftKey, experience.accessMode, positionKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {
      setMessage("Your private milestone draft could not be saved in this browser.");
    }
  }, [draft, draftKey, hydrated]);

  useEffect(() => {
    if (stage > 0) stageRef.current?.focus();
  }, [stage]);

  function updateDraft(patch: Partial<MilestoneDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function saveStage(nextStage: number) {
    if (experience.accessMode === "review") return;
    window.localStorage.setItem(positionKey, String(nextStage));
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

  function addTool(id: ToolId) {
    if (draft.toolkit.includes(id)) return;
    updateDraft({ toolkit: [...draft.toolkit, id] });
  }

  function removeTool(id: ToolId) {
    updateDraft({ toolkit: draft.toolkit.filter((item) => item !== id) });
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>, id: ToolId) {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleToolDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain") as ToolId;
    if (toolkitItems.some((tool) => tool.id === id)) addTool(id);
  }

  function toggleFoundation(id: FoundationId) {
    const opened = draft.openedFoundations.includes(id);
    updateDraft({
      openedFoundations: opened
        ? draft.openedFoundations.filter((item) => item !== id)
        : [...draft.openedFoundations, id],
    });
  }

  function canContinue() {
    if (stage === 0) return draft.arrivalFeeling !== null;
    if (stage === 1) return true;
    if (stage === 2) return draft.toolkit.length === toolkitItems.length;
    if (stage === 3) return draft.openedFoundations.length === foundations.length;
    if (stage === 4) return draft.selectedShift !== null && draft.reflection.trim().length >= 4;
    if (stage === 5) return Object.keys(draft.confidence).length === confidenceScenarios.length;
    if (stage === 6) return true;
    if (stage === 7) return Object.keys(draft.checklist).length === checklistSkills.length;
    if (stage === 8) return Object.keys(draft.plan).length === planAreas.length;
    if (stage === 9) return draft.nextStep.trim().length >= 4 && draft.stepCue !== "";
    if (stage === 10) {
      return (
        (draft.futureFeeling !== null || draft.futureWords.trim().length >= 3) &&
        draft.promise.trim().length >= 4
      );
    }
    return true;
  }

  function stageRequirement() {
    return [
      "Choose the sentence that feels closest today.",
      "",
      "Move all ten tools into your toolkit. You can drag or select each one.",
      "Open all three foundations.",
      "Choose one shift and write a few honest words about what changed.",
      "Answer all five confidence check-ins. Nothing here is graded.",
      "",
      "Mark every skill as comfortable or something you want to practice.",
      "Choose one small support in each area.",
      "Choose one priority and when it could begin.",
      "Name how you hope to feel and write one promise to your future self.",
    ][stage];
  }

  function continueLabel() {
    return (
      [
        "See how the learning connects",
        "Build my diabetes toolkit",
        "See the three foundations",
        "Notice what changed",
        "Try real-life confidence",
        "Look toward the next 76 days",
        "Check my foundation",
        "Build my month-one plan",
        "Choose my next small step",
        "Write to my future self",
        "See the milestone",
      ][stage] ?? "Continue"
    );
  }

  function finishExperience() {
    if (experience.accessMode === "review") {
      router.push("/progress");
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
      window.localStorage.removeItem(positionKey);
      router.push(`/journey?completed=${experience.dayNumber}`);
    });
  }

  function clearPrivateDraft() {
    window.localStorage.removeItem(draftKey);
    setDraft(initialDraft);
    setMessage("Your private Day 14 draft was cleared from this browser.");
  }

  const confidentCount = Object.values(draft.confidence).filter(
    (value) => value === "ready",
  ).length;
  const promptCount = Object.values(draft.confidence).filter((value) => value === "prompt").length;
  const practiceCount = Object.values(draft.confidence).filter(
    (value) => value === "practice",
  ).length;
  const comfortableCount = Object.values(draft.checklist).filter(
    (value) => value === "comfortable",
  ).length;
  const selectedShift = growthShifts.find((shift) => shift.id === draft.selectedShift);

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
              <LessonHeading label="Day 14 · Your foundation is built">
                This is not the finish line. It is the moment you notice what you can carry.
              </LessonHeading>
              <div className={styles.dayNote}>
                <p className="editorial-number">14</p>
                <p>
                  Today introduces no major medical idea. It gathers what you already know and
                  points it toward real life.
                </p>
              </div>
            </div>
            <LessonStoryImage
              alt="Two sisters sit at a warm dining table, quietly looking back through a learning notebook and weekly calendar"
              caption="Recognition can be quiet: a question that now has words, a decision that no longer feels impossible, a little less fear around what comes next."
              emphasis="Fourteen days can change the shape of uncertainty."
              height={941}
              priority
              src="/lessons/day-14/quiet-recognition.jpg"
              width={1672}
            />
            <div>
              <p className={styles.promptTitle}>What feels closest as you arrive today?</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {arrivalFeelings.map(([id, label]) => (
                  <AnswerChoice
                    key={id}
                    onClick={() => updateDraft({ arrivalFeeling: id })}
                    selected={draft.arrivalFeeling === id}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {draft.arrivalFeeling ? (
              <p className={styles.reassurance}>
                Whatever you chose belongs here. Readiness is not the absence of questions. It is
                knowing that you have ways to meet the next one.
              </p>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <LessonHeading label="The first fortnight had a shape">
              First came meaning. Then choices. Then a future you could influence.
            </LessonHeading>
            <FoundationHomeAnimation />
            <div className={styles.journeySequence}>
              {[
                ["01", "Diagnosis", "What is happening to me?"],
                ["02", "Body & numbers", "How do I understand the signals?"],
                ["03", "Daily tools", "What can I do in ordinary life?"],
                ["04", "Safety & prevention", "How do I respond without fear?"],
                ["05", "Adaptation & support", "How do I keep care workable?"],
              ].map(([number, title, question]) => (
                <div key={number}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <p>{question}</p>
                </div>
              ))}
            </div>
            <p className={styles.reassurance}>
              The lessons did not ask you to memorize fourteen separate subjects. They built one
              system: understand, decide, notice, adjust, and ask for help when you need it.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <LessonHeading label="Build your diabetes toolkit">
              No single tool manages diabetes. Confidence comes from knowing how they work together.
            </LessonHeading>
            <div className={styles.toolkitStudio}>
              <section>
                <div className={styles.studioHeading}>
                  <p className="editorial-eyebrow">Tools you have practiced</p>
                  <span>
                    {draft.toolkit.length} of {toolkitItems.length} packed
                  </span>
                </div>
                <div className={styles.toolGrid}>
                  {toolkitItems.map(({ description, icon: Icon, id, label }) => {
                    const selected = draft.toolkit.includes(id);
                    return (
                      <button
                        aria-pressed={selected}
                        className={cn(styles.toolCard, selected && styles.toolCardPacked)}
                        draggable={!selected}
                        key={id}
                        onClick={() => (selected ? removeTool(id) : addTool(id))}
                        onDragStart={(event) => handleDragStart(event, id)}
                        type="button"
                      >
                        <Icon aria-hidden="true" />
                        <strong>{label}</strong>
                        <span>{description}</span>
                        <small>
                          {selected ? "In your toolkit · select to remove" : "Drag or select"}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </section>
              <div
                aria-label="Your personal diabetes toolkit drop area"
                className={cn(
                  styles.toolkitBag,
                  draft.toolkit.length === toolkitItems.length && styles.toolkitBagComplete,
                )}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleToolDrop}
                role="region"
              >
                <span aria-hidden="true" className={styles.bagHandle} />
                <div className={styles.bagLabel}>
                  <p className="editorial-eyebrow">My toolkit</p>
                  <strong>
                    {draft.toolkit.length
                      ? toolkitItems
                          .filter((tool) => draft.toolkit.includes(tool.id))
                          .map((tool) => tool.label)
                          .join(" · ")
                      : "Place the first tool here"}
                  </strong>
                </div>
                <div className={styles.bagSlots}>
                  {toolkitItems.map((tool) => (
                    <span
                      className={cn(
                        styles.bagSlot,
                        draft.toolkit.includes(tool.id) && styles.bagSlotFilled,
                      )}
                      key={tool.id}
                      title={tool.label}
                    >
                      {draft.toolkit.includes(tool.id) ? <Check aria-hidden="true" /> : null}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {draft.toolkit.length === toolkitItems.length ? (
              <p className={styles.reassurance}>
                Your toolkit is full, but it is not heavy. You will rarely need every tool at once.
                The skill is knowing that another one is available.
              </p>
            ) : null}
          </div>
        );
      case 3:
        return (
          <div className="space-y-9">
            <LessonHeading label="Three foundations">
              Fourteen days can fit inside three ideas you can remember.
            </LessonHeading>
            <div className={styles.foundationGrid}>
              {foundations.map((foundation) => {
                const opened = draft.openedFoundations.includes(foundation.id);
                return (
                  <article
                    className={cn(styles.foundationCard, opened && styles.foundationCardOpen)}
                    key={foundation.id}
                  >
                    <button
                      aria-expanded={opened}
                      onClick={() => toggleFoundation(foundation.id)}
                      type="button"
                    >
                      <span>{foundation.label}</span>
                      <h2>{foundation.title}</h2>
                      <small>{opened ? "Close this foundation" : "Open this foundation"}</small>
                    </button>
                    {opened ? (
                      <ul className="animate-slide-up">
                        {foundation.points.map((point) => (
                          <li key={point}>
                            <Check aria-hidden="true" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                );
              })}
            </div>
            {draft.openedFoundations.length === foundations.length ? (
              <div className={styles.foundationEquation}>
                <span>Understand</span>
                <i>+</i>
                <span>Decide</span>
                <i>+</i>
                <span>Protect</span>
                <strong>Confidence through practice</strong>
              </div>
            ) : null}
          </div>
        );
      case 4:
        return (
          <div className="space-y-9">
            <LessonHeading label="What changed?">
              Growth often sounds like a kinder, more accurate sentence.
            </LessonHeading>
            <div className={styles.shiftGrid}>
              {growthShifts.map((shift) => {
                const selected = draft.selectedShift === shift.id;
                return (
                  <button
                    aria-pressed={selected}
                    className={cn(styles.shiftCard, selected && styles.shiftCardSelected)}
                    key={shift.id}
                    onClick={() => updateDraft({ selectedShift: shift.id })}
                    type="button"
                  >
                    <span>Before</span>
                    <p>“{shift.before}”</p>
                    <ArrowLeft aria-hidden="true" />
                    <span>Now</span>
                    <strong>“{shift.after}”</strong>
                    <small>{selected ? "This shift feels closest" : "Choose this shift"}</small>
                  </button>
                );
              })}
            </div>
            {selectedShift ? (
              <div className={styles.selectedShift}>
                <p className="editorial-eyebrow">The shift you noticed</p>
                <blockquote>“{selectedShift.after}”</blockquote>
              </div>
            ) : null}
            <label className={styles.writingField}>
              <span>
                What is the biggest thing you understand today that you did not understand two weeks
                ago?
              </span>
              <textarea
                maxLength={320}
                onChange={(event) => updateDraft({ reflection: event.target.value })}
                placeholder="Today I understand…"
                rows={4}
                value={draft.reflection}
              />
              <small>There is no ideal answer. Recognition is the work here.</small>
            </label>
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <LessonHeading label="Real-life confidence check">
              You do not need a perfect answer. Notice whether you have a way to begin.
            </LessonHeading>
            <div className={styles.scenarioList}>
              {confidenceScenarios.map((scenario, index) => (
                <article className={styles.scenarioRow} key={scenario.id}>
                  <div className={styles.scenarioCopy}>
                    <span>0{index + 1}</span>
                    <div>
                      <p className="editorial-eyebrow">{scenario.title}</p>
                      <h2>{scenario.prompt}</h2>
                      <small>{scenario.skill}</small>
                    </div>
                  </div>
                  <div
                    aria-label={`Confidence for ${scenario.title}`}
                    className={styles.confidenceScale}
                  >
                    {(
                      [
                        ["practice", "I want more practice"],
                        ["prompt", "I could begin with a prompt"],
                        ["ready", "I feel ready to handle this"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        aria-pressed={draft.confidence[scenario.id] === value}
                        className={cn(
                          styles.scaleButton,
                          draft.confidence[scenario.id] === value && styles.scaleButtonSelected,
                        )}
                        key={value}
                        onClick={() =>
                          updateDraft({
                            confidence: { ...draft.confidence, [scenario.id]: value },
                          })
                        }
                        type="button"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            {Object.keys(draft.confidence).length === confidenceScenarios.length ? (
              <div aria-live="polite" className={styles.confidenceSummary}>
                <Sparkles aria-hidden="true" />
                <div>
                  <p className="editorial-eyebrow">Your honest readiness map</p>
                  <h2>
                    {confidentCount} ready · {promptCount} with a prompt · {practiceCount} to
                    practice
                  </h2>
                  <p>
                    Every result is useful. Confidence can mean “I know what to do” or “I know where
                    to look and who to ask.”
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 6:
        return (
          <div className="space-y-10">
            <LessonHeading label="Your journey is just beginning">
              The next chapter turns knowledge into something that feels natural.
            </LessonHeading>
            <LessonStoryImage
              alt="A grandfather and his teenage granddaughter laugh together while planting herbs in a community garden"
              caption="The purpose of diabetes knowledge is not to make every day about diabetes. It is to support energy, connection, plans, and a life that stays larger than care."
              emphasis="Health skills make more living possible."
              height={941}
              src="/lessons/day-14/life-keeps-growing.jpg"
              width={1672}
            />
            <PracticeLoopAnimation />
            <div className={styles.nextPhaseNote}>
              <p className="editorial-eyebrow">What the next 76 days will strengthen</p>
              <div>
                {[
                  "Routines that can bend with real life",
                  "Deeper questions without information overload",
                  "Confidence in more complicated situations",
                  "Habits that feel increasingly ordinary and independent",
                ].map((item) => (
                  <span key={item}>
                    <Check aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
              <p>
                You are not expected to know everything before that phase begins. Practice is the
                next teacher.
              </p>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-9">
            <LessonHeading label="My foundation checklist">
              Mark what feels comfortable and what you would like to practice next.
            </LessonHeading>
            <p className={styles.reassurance}>
              “Practice next” is not a wrong answer. It is a useful direction for the weeks ahead.
            </p>
            <div className={styles.checklistBoard}>
              {checklistSkills.map(([id, label], index) => (
                <div className={styles.checklistRow} key={id}>
                  <span>0{index + 1}</span>
                  <p>{label}</p>
                  <div>
                    {(
                      [
                        ["comfortable", "Comfortable"],
                        ["practice", "Practice next"],
                      ] as const
                    ).map(([value, buttonLabel]) => (
                      <button
                        aria-pressed={draft.checklist[id] === value}
                        className={cn(
                          styles.checkButton,
                          draft.checklist[id] === value && styles.checkButtonSelected,
                        )}
                        key={value}
                        onClick={() =>
                          updateDraft({
                            checklist: { ...draft.checklist, [id]: value },
                          })
                        }
                        type="button"
                      >
                        {draft.checklist[id] === value ? <Check aria-hidden="true" /> : null}
                        {buttonLabel}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {Object.keys(draft.checklist).length === checklistSkills.length ? (
              <div className={styles.checklistSummary}>
                <p className="editorial-number">{comfortableCount}</p>
                <div>
                  <h2>skills feel comfortable today</h2>
                  <p>
                    The others are not gaps in your worth. They are places the next phase can
                    strengthen through repetition and support.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 8:
        return (
          <div className="space-y-9">
            <LessonHeading label="Your personal foundation plan">
              Five small supports are stronger than one dramatic promise.
            </LessonHeading>
            <p className={styles.reassurance}>
              Choose one option in each area. These are flexible supports, not contracts. Change
              them when your life or care plan changes.
            </p>
            <div className={styles.planGrid}>
              {planAreas.map((area, index) => (
                <section className={styles.planArea} key={area.id}>
                  <div>
                    <span>0{index + 1}</span>
                    <h2>{area.label}</h2>
                  </div>
                  <div className="grid gap-2">
                    {area.options.map((option) => (
                      <AnswerChoice
                        key={option}
                        onClick={() => updateDraft({ plan: { ...draft.plan, [area.id]: option } })}
                        selected={draft.plan[area.id] === option}
                      >
                        {option}
                      </AnswerChoice>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            {Object.keys(draft.plan).length === planAreas.length ? (
              <div className={styles.planSummary}>
                <p className="editorial-eyebrow">Your next-month foundation</p>
                <ol>
                  {planAreas.map((area) => (
                    <li key={area.id}>
                      <span>{area.label}</span>
                      <p>{draft.plan[area.id]}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        );
      case 9:
        return (
          <div className="space-y-9">
            <LessonHeading label="My next small step">
              Give one action the first turn. The others can wait.
            </LessonHeading>
            <NextStepCalendarAnimation />
            <div className={styles.priorityStudio}>
              <section>
                <p className={styles.promptTitle}>Which plan item gets the first turn?</p>
                <div className="mt-5 grid gap-3">
                  {planAreas.flatMap((area) => {
                    const option = draft.plan[area.id];

                    return option
                      ? [
                          <AnswerChoice
                            key={area.id}
                            onClick={() => updateDraft({ nextStep: option })}
                            selected={draft.nextStep === option}
                          >
                            <span>
                              <strong>{area.label}:</strong> {option}
                            </span>
                          </AnswerChoice>,
                        ]
                      : [];
                  })}
                </div>
              </section>
              <section>
                <p className={styles.promptTitle}>When could it begin?</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "After breakfast",
                    "At lunch",
                    "After dinner",
                    "Before bed",
                    "Before my next appointment",
                    "At the next useful opening",
                  ].map((cue) => (
                    <AnswerChoice
                      key={cue}
                      onClick={() => updateDraft({ stepCue: cue })}
                      selected={draft.stepCue === cue}
                    >
                      {cue}
                    </AnswerChoice>
                  ))}
                </div>
              </section>
            </div>
            {draft.nextStep && draft.stepCue ? (
              <div className={styles.nextStepCard}>
                <Footprints aria-hidden="true" />
                <div>
                  <p className="editorial-eyebrow">Your first step</p>
                  <blockquote>{draft.nextStep}</blockquote>
                  <span>{draft.stepCue}</span>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 10:
        return (
          <div className="space-y-10">
            <LessonHeading label="A note to the person you are becoming">
              Look forward without asking your future self to be perfect.
            </LessonHeading>
            <div>
              <p className={styles.promptTitle}>
                When you think about living with diabetes one year from today, how do you hope to
                feel?
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {futureFeelings.map((feeling) => (
                  <AnswerChoice
                    key={feeling}
                    onClick={() => updateDraft({ futureFeeling: feeling })}
                    selected={draft.futureFeeling === feeling}
                  >
                    {feeling}
                  </AnswerChoice>
                ))}
              </div>
              <label className={styles.shortField}>
                <span>Or add your own words</span>
                <input
                  maxLength={100}
                  onChange={(event) => updateDraft({ futureWords: event.target.value })}
                  placeholder="I hope to feel…"
                  type="text"
                  value={draft.futureWords}
                />
              </label>
            </div>
            <label className={styles.writingField}>
              <span>What is one promise you would like to make to your future self?</span>
              <textarea
                maxLength={280}
                onChange={(event) => updateDraft({ promise: event.target.value })}
                placeholder="I will keep…"
                rows={4}
                value={draft.promise}
              />
              <small>
                Your plan and reflections are saved only in this browser so you can revisit Day 14.
                They are not sent to Health Decoded as health information.
              </small>
            </label>
            {draft.promise.trim().length >= 4 ? (
              <div className={styles.promiseCard}>
                <MessageCircleHeart aria-hidden="true" />
                <p className="editorial-eyebrow">A promise worth returning to</p>
                <blockquote>“{draft.promise.trim()}”</blockquote>
                <span>Signed by the person who kept learning through the first fourteen days.</span>
              </div>
            ) : null}
          </div>
        );
      default:
        return (
          <div className="space-y-12">
            <div className={styles.milestoneCard}>
              <div>
                <p className="editorial-eyebrow">Foundation complete · Days 1–14</p>
                <LessonHeading>Your foundation is built.</LessonHeading>
                <p>
                  You now have the knowledge to understand your diagnosis, make informed daily
                  decisions, notice when something needs attention, and ask for useful help.
                </p>
              </div>
              <div className={styles.milestoneCount}>
                <span>14</span>
                <p>days of foundation</p>
                <small>76 days of practice ahead</small>
              </div>
              <div className={styles.milestoneLine}>
                <span />
              </div>
            </div>

            <div className={styles.successDefinition}>
              <div>
                <p className="editorial-eyebrow">Success is not</p>
                <p>
                  Perfect blood sugar · perfect meals · perfect exercise · never missing a routine
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow">Success can look like</p>
                <p>
                  Understanding · choosing · adjusting · asking · returning · staying patient with
                  yourself
                </p>
              </div>
            </div>

            {draft.promise ? (
              <div className={styles.finalPromise}>
                <p className="editorial-eyebrow">Your promise for the next chapter</p>
                <blockquote>“{draft.promise}”</blockquote>
              </div>
            ) : null}

            <div className={styles.closingReflection}>
              <p>
                You do not need to know everything today. You do not need to be perfect tomorrow.
                The foundation has done its job when it helps you recognize the next useful step—and
                trust yourself enough to take it.
              </p>
              <span>Day 15 begins with understanding behind you and practice in front of you.</span>
            </div>

            <div className="flex flex-col items-center gap-3 text-center">
              <Button disabled={isPending} fullWidth={false} onClick={finishExperience}>
                {isPending
                  ? "Saving your progress…"
                  : experience.accessMode === "review"
                    ? "Return to learning record"
                    : "Complete the Foundation Phase"}
              </Button>
              <button className={styles.clearDraft} onClick={clearPrivateDraft} type="button">
                Clear my private Day 14 draft from this browser
              </button>
            </div>
          </div>
        );
    }
  }

  const progressValue = ((stage + 1) / stageCount) * 100;

  return (
    <section
      className={cn(
        styles.experience,
        "mx-auto flex min-h-[calc(100dvh-10rem)] max-w-[1020px] flex-col py-1 sm:py-4",
      )}
    >
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
            <p className={styles.dayLabel}>Day 14 · Foundation milestone</p>
            <p className="hidden text-xs sm:block">Your Foundation Is Built</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Open lesson map"
              fullWidth={false}
              onClick={() => setMapOpen(true)}
              variant="text"
            >
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Lesson map</span>
            </Button>
            <Button fullWidth={false} onClick={() => setExitOpen(true)} variant="text">
              Save &amp; exit
            </Button>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span>Chapter {stage + 1}</span>
            <span>{stageCount} chapters</span>
          </div>
          <div
            aria-label={"Day 14 chapter " + String(stage + 1) + " of " + String(stageCount)}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progressValue}
            className={styles.progressTrack}
            role="progressbar"
          >
            <span className={styles.progressFill} style={{ width: String(progressValue) + "%" }} />
          </div>
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
            <p aria-live="polite" className="mt-3 text-sm" role="status">
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
        description="Your chapter is saved to your learning record. Your plan and written reflections stay privately in this browser."
        onOpenChange={setExitOpen}
        open={exitOpen}
        title="Leave Day 14 for now?"
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
        description="The emotional path and three ideas that organize this milestone."
        onOpenChange={setMapOpen}
        open={mapOpen}
        title="Day 14 lesson map"
      >
        <div className="max-h-[58dvh] space-y-6 overflow-y-auto pr-2">
          <ol className={styles.lessonMap}>
            {["Reflection", "Recognition", "Confidence", "Readiness", "Optimism"].map(
              (item, index) => (
                <li key={item}>
                  <span>0{index + 1}</span>
                  <p>{item}</p>
                </li>
              ),
            )}
          </ol>
          <div className={styles.mapFoundation}>
            <p className="editorial-eyebrow">Three foundations</p>
            <p>Understand your body · Make everyday decisions · Protect your future</p>
          </div>
        </div>
      </Modal>
    </section>
  );
}
