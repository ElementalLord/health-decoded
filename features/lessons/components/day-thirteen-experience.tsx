"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  HeartHandshake,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  evaluateDayThirteenAction,
  type DayThirteenEvaluationFeedback,
} from "@/features/lessons/actions/day-thirteen.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import styles from "@/features/lessons/components/day-thirteen-experience.module.css";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 11;

const openingFeelings = [
  ["held", "I already have someone who listens"],
  ["careful", "I want support without being watched"],
  ["private", "I am not sure how much I want to share"],
  ["alone", "I have been carrying more of this alone than people know"],
] as const;

const identityIdeas = [
  "a parent or caregiver",
  "a loyal friend",
  "a maker or artist",
  "someone who loves food and culture",
  "a gardener or nature lover",
  "a learner with a future",
] as const;

const myths = [
  {
    id: "disclosure",
    myth: "You should explain your diabetes whenever someone asks.",
    reality:
      "Disclosure belongs to the person living with diabetes. A question does not create an obligation to share private health information.",
  },
  {
    id: "monitoring",
    myth: "Concern gives family permission to monitor food and numbers.",
    reality:
      "Concern still needs consent. Helpful involvement is invited, specific, and open to a no.",
  },
  {
    id: "independence",
    myth: "Asking for help means losing independence.",
    reality:
      "Chosen support can protect independence by reducing burden while leaving decisions with the person.",
  },
  {
    id: "impact",
    myth: "A joke is harmless if the speaker did not mean it badly.",
    reality:
      "Intent and impact are different. The person affected can name the impact and set a boundary.",
  },
] as const;
type MythId = (typeof myths)[number]["id"];

const supportExamples = [
  {
    id: "walk",
    kind: "support",
    statement: "Would you like company on a walk, or would you rather have quiet time?",
    why: "It offers help and leaves the choice with the person.",
  },
  {
    id: "snacks",
    kind: "control",
    statement: "I hid the snacks so you cannot make the wrong choice.",
    why: "It removes choice and turns concern into surveillance.",
  },
  {
    id: "appointment",
    kind: "support",
    statement: "How did the appointment feel? I can listen if you want to talk.",
    why: "It makes listening available without demanding disclosure.",
  },
  {
    id: "plate",
    kind: "control",
    statement: "I am going to check every plate because you cannot be trusted.",
    why: "It uses shame and monitoring instead of respect.",
  },
] as const;
type SupportExampleId = (typeof supportExamples)[number]["id"];
type SupportClassification = "support" | "control";

const supportKinds = [
  ["emotional", "Emotional", "Listen without fixing or judging"],
  ["practical", "Practical", "Join a walk, meal, errand, or appointment"],
  ["educational", "Educational", "Learn with me and ask before assuming"],
  ["medical", "Care team", "Help me prepare a question or remember guidance"],
] as const;
type SupportKindId = (typeof supportKinds)[number][0];

const supportPeople = [
  ["friend", "a trusted friend"],
  ["partner", "my partner or spouse"],
  ["family", "a family member"],
  ["care_team", "someone on my healthcare team"],
] as const;
type SupportPersonId = (typeof supportPeople)[number][0];

const requestActions: Record<SupportKindId, readonly string[]> = {
  emotional: [
    "listen for ten minutes without giving advice",
    "remind me that one hard day does not erase my progress",
  ],
  practical: [
    "join me for one comfortable walk this week",
    "help me try one dinner that works for both of us",
  ],
  educational: [
    "read one lesson with me and ask what I think",
    "bring questions to me instead of repeating assumptions",
  ],
  medical: [
    "help me write down one question before my next visit",
    "come to an appointment if I invite you and help me remember what was said",
  ],
};

const boundaryScenarios = [
  "A relative says, “Should you really eat that?”",
  "A coworker jokes that diabetes comes from eating sugar.",
  "A friend keeps asking for your glucose numbers.",
] as const;

const mapOptions = [
  ["close", "Partner or spouse"],
  ["close", "Trusted friend"],
  ["close", "Family member"],
  ["care", "Clinician"],
  ["care", "Pharmacist"],
  ["care", "Diabetes educator"],
  ["community", "Peer support group"],
  ["community", "Faith or neighborhood community"],
  ["community", "Trusted online community"],
] as const;
type MapRing = (typeof mapOptions)[number][0];

const wellbeingOptions = [
  "Talk with someone who can listen",
  "Take a quiet break without explaining",
  "Write down what feels heavy",
  "Move in a way that settles me",
  "Bring emotional health to my care team",
  "Connect with someone who has lived experience",
] as const;

const glossary = [
  {
    term: "Stigma",
    definition:
      "Negative assumptions or judgments attached to a condition. Stigma can come from other people or become a story someone turns against themselves.",
  },
  {
    term: "Diabetes distress",
    definition:
      "The emotional strain of managing diabetes over time. It is common, real, and worth discussing with a healthcare professional.",
  },
  {
    term: "Support system",
    definition:
      "The people, professionals, and communities a person chooses to involve in ways that make care more manageable.",
  },
  {
    term: "Boundary",
    definition:
      "A clear limit that protects privacy, choice, emotional safety, or the kind of help a person is willing to receive.",
  },
  {
    term: "Caregiver",
    definition:
      "A person who provides emotional or practical help. Their role should be invited, specific, and respectful of the learner's independence.",
  },
] as const;

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

function Feedback({ feedback }: { feedback: DayThirteenEvaluationFeedback }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        styles.feedback,
        feedback.accurate ? styles.feedbackAccurate : styles.feedbackTry,
      )}
      role="status"
    >
      <MessageCircleHeart aria-hidden="true" />
      <div>
        <p className="font-serif-display text-2xl italic">{feedback.heading}</p>
        <p className="mt-2 leading-7">{feedback.body}</p>
      </div>
    </div>
  );
}

function SharedLoadAnimation() {
  return (
    <figure
      aria-label="A looping scene in which one person asks before taking one grocery bag from another person, so the load becomes shared rather than controlled"
      className={styles.motionFigure}
      data-motion-loop="continuous"
      role="img"
    >
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">Watch the difference</p>
        <h2>Help can lighten one part without taking over the whole.</h2>
        <p>
          The second person asks first. One bag changes hands; the person keeps their direction.
        </p>
      </div>
      <div className={styles.loadScene}>
        <div className={cn(styles.scenePerson, styles.loadCarrier)}>
          <span className={styles.personHead} />
          <span className={styles.personBody} />
          <span className={styles.personArmFront} />
          <span className={styles.personArmBack} />
        </div>
        <div className={cn(styles.scenePerson, styles.loadHelper)}>
          <span className={styles.personHead} />
          <span className={styles.personBody} />
          <span className={styles.personArmFront} />
          <span className={styles.personArmBack} />
        </div>
        <span className={cn(styles.loadBag, styles.loadBagKept)}>MY PLAN</span>
        <span className={cn(styles.loadBag, styles.loadBagShared)}>ONE TASK</span>
        <span className={styles.askBubble}>Would one thing help?</span>
        <span className={styles.permissionBubble}>Yes, this one.</span>
        <div className={styles.sceneGround} />
      </div>
      <figcaption>
        <strong>What to notice:</strong> support asks, shares a chosen task, and leaves ownership
        where it belongs.
      </figcaption>
    </figure>
  );
}

function SupportConversationAnimation() {
  return (
    <figure
      aria-label="A continuously looping four-step support conversation: ask, listen, offer, and check"
      className={styles.motionFigure}
      data-motion-loop="continuous"
      role="img"
    >
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">A conversation you can reuse</p>
        <h2>Ask. Listen. Offer. Check.</h2>
        <p>Useful support is a loop, because needs can change from one day to the next.</p>
      </div>
      <div className={styles.conversationScene}>
        {[
          ["01", "Ask", "What would help today?"],
          ["02", "Listen", "Just listen for a minute."],
          ["03", "Offer", "I can do that."],
          ["04", "Check", "Does this still feel helpful?"],
        ].map(([number, title, line], index) => (
          <div
            className={styles.conversationStep}
            key={title}
            style={{ animationDelay: String(index * 2) + "s" }}
          >
            <span>{number}</span>
            <strong>{title}</strong>
            <p>{line}</p>
          </div>
        ))}
        <div className={styles.conversationLine} aria-hidden="true" />
      </div>
      <figcaption>
        <strong>What to notice:</strong> the helper never guesses. Permission and feedback keep the
        relationship collaborative.
      </figcaption>
    </figure>
  );
}

function BoundaryConversationAnimation() {
  return (
    <figure
      aria-label="A looping conversation in which an intrusive food comment is met with a calm boundary and then replaced by respectful support"
      className={styles.motionFigure}
      data-motion-loop="continuous"
      role="img"
    >
      <div className={styles.motionIntro}>
        <p className="editorial-eyebrow">A boundary in motion</p>
        <h2>Concern can change shape when the limit is clear.</h2>
        <p>The boundary is brief. It does not turn into a debate or a medical lecture.</p>
      </div>
      <div className={styles.boundaryScene}>
        <div className={styles.boundaryComment}>
          <span>UNINVITED COMMENT</span>
          <p>“Should you really eat that?”</p>
        </div>
        <div className={styles.boundaryReply}>
          <span>CALM BOUNDARY</span>
          <p>“I’m following my care plan. Please don’t monitor my plate.”</p>
        </div>
        <div className={styles.boundaryRepair}>
          <span>RESPECTFUL NEXT MOVE</span>
          <p>“Understood. Would conversation or company help instead?”</p>
        </div>
        <div className={styles.boundarySpace} aria-hidden="true">
          <span />
        </div>
      </div>
      <figcaption>
        <strong>What to notice:</strong> a boundary closes the unwanted behavior while leaving a
        better way to connect.
      </figcaption>
    </figure>
  );
}

export function DayThirteenExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [openingFeeling, setOpeningFeeling] = useState<string | null>(null);
  const [identityIdea, setIdentityIdea] = useState<string | null>(null);
  const [identityNote, setIdentityNote] = useState("");
  const [openedMyths, setOpenedMyths] = useState<Set<MythId>>(() => new Set());
  const [supportClassifications, setSupportClassifications] = useState<
    Partial<Record<SupportExampleId, SupportClassification>>
  >({});
  const [supportKind, setSupportKind] = useState<SupportKindId | null>(null);
  const [supportPerson, setSupportPerson] = useState<SupportPersonId | null>(null);
  const [supportAction, setSupportAction] = useState<string | null>(null);
  const [boundaryScenario, setBoundaryScenario] = useState<string | null>(null);
  const [mapChoices, setMapChoices] = useState<Set<string>>(() => new Set());
  const [wellbeingChoice, setWellbeingChoice] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<
    Partial<
      Record<
        "myth" | "support" | "boundary" | "workplace" | "teachBack",
        DayThirteenEvaluationFeedback
      >
    >
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<"myth" | "support" | "boundary" | "workplace" | "teachBack", string>>
  >({});
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = "health-decoded:day-thirteen:" + experience.lessonProgressId;

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
    key: "myth" | "support" | "boundary" | "workplace" | "teachBack",
    answer: string,
  ) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDayThirteenAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function toggleMapChoice(label: string) {
    setMapChoices((current) => {
      const next = new Set(current);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  const selectedPerson = supportPeople.find(([id]) => id === supportPerson)?.[1];
  const supportRequest =
    selectedPerson && supportAction
      ? "Could you " + supportAction + "? That would help me feel supported without taking over."
      : null;

  function canContinue() {
    if (stage === 0) return openingFeeling !== null;
    if (stage === 1) return identityIdea !== null || identityNote.trim().length >= 3;
    if (stage === 2) return openedMyths.size === myths.length && Boolean(evaluations.myth);
    if (stage === 3) {
      return (
        Object.keys(supportClassifications).length === supportExamples.length &&
        Boolean(evaluations.support)
      );
    }
    if (stage === 4) return supportRequest !== null;
    if (stage === 5) return boundaryScenario !== null && Boolean(evaluations.boundary);
    if (stage === 6) return Boolean(evaluations.workplace);
    if (stage === 7) {
      const rings = new Set(
        mapOptions.filter(([, label]) => mapChoices.has(label)).map(([ring]) => ring),
      );
      return mapChoices.size >= 3 && rings.size >= 2;
    }
    if (stage === 8) return wellbeingChoice !== null;
    if (stage === 9) {
      return reflection.trim().length >= 4 && confidence !== null && Boolean(evaluations.teachBack);
    }
    return true;
  }

  function stageRequirement() {
    return [
      "Choose how support feels as you begin.",
      "Choose one identity or write a few words of your own.",
      "Decode all four social assumptions and complete the response check.",
      "Sort all four examples and answer the support question.",
      "Choose a kind of support, a person, and one specific request.",
      "Choose a situation and rehearse the respectful boundary.",
      "Choose the response that protects both the need and the person's privacy.",
      "Choose at least three supports across at least two circles.",
      "Choose one form of emotional support that could help today.",
      "Complete the reflection, confidence check, and support definition.",
    ][stage];
  }

  function continueLabel() {
    return (
      [
        "Remember the whole person",
        "Decode the social rules",
        "Compare support and control",
        "Build a useful request",
        "Practice a boundary",
        "Choose what to share",
        "Map your support system",
        "Include emotional health",
        "Put the lesson into words",
        "Review the relationship agreements",
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
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
              <LessonHeading label="Day 13 · Support, stigma, and the people around you">
                The right support makes room for you, not rules around you.
              </LessonHeading>
              <div className={styles.dayNote}>
                <p className="editorial-number">13</p>
                <p>
                  Today is about people: who listens, what helps, what hurts, and how to ask without
                  giving away your independence.
                </p>
              </div>
            </div>
            <LessonStoryImage
              alt="A woman speaks openly at her kitchen table while a close friend listens beside her with a gentle hand on her forearm"
              caption="Sometimes the most useful first response is presence: no lecture, no fixing, and no demand to make the moment easier for anyone else."
              emphasis="Listening can make the load feel lighter."
              priority
              src="/lessons/day-13/listening-without-fixing.jpg"
            />
            <div>
              <p className={styles.promptTitle}>
                When you picture asking for support, what feels closest?
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
            {openingFeeling ? (
              <p className={styles.reassurance}>
                There is no correct way to arrive here. Support can be strengthened, narrowed,
                rebuilt, or found one person at a time.
              </p>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="space-y-9">
            <LessonHeading label="A diagnosis is one chapter">
              Diabetes is something you manage. It is not the name of your whole life.
            </LessonHeading>
            <SharedLoadAnimation />
            <div className={styles.identityStudio}>
              <div>
                <p className="editorial-eyebrow">Finish the sentence</p>
                <h2>I am more than diabetes because I am…</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {identityIdeas.map((idea) => (
                    <AnswerChoice
                      key={idea}
                      onClick={() => setIdentityIdea(idea)}
                      selected={identityIdea === idea}
                    >
                      {idea}
                    </AnswerChoice>
                  ))}
                </div>
              </div>
              <label className={styles.writingField}>
                <span>Or use your own words</span>
                <textarea
                  maxLength={180}
                  onChange={(event) => setIdentityNote(event.target.value)}
                  placeholder="a person who…"
                  rows={3}
                  value={identityNote}
                />
                <small>This reflection stays on this page and is not saved.</small>
              </label>
            </div>
            {identityIdea || identityNote.trim() ? (
              <blockquote className={styles.identityStatement}>
                “I am {identityNote.trim() || identityIdea}. Diabetes is part of my story, not the
                whole book.”
              </blockquote>
            ) : null}
          </div>
        );
      case 2:
        return (
          <div className="space-y-9">
            <LessonHeading label="Stigma writes social rules">
              Spot the assumption hiding inside the comment.
            </LessonHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              These are not repeats of biology, food, or medication lessons. They are relationship
              claims about privacy, permission, independence, and impact.
            </p>
            <div className={styles.mythGrid}>
              {myths.map((item, index) => {
                const opened = openedMyths.has(item.id);
                return (
                  <button
                    aria-expanded={opened}
                    className={cn(styles.mythCard, opened && styles.mythCardOpened)}
                    key={item.id}
                    onClick={() => setOpenedMyths((current) => new Set(current).add(item.id))}
                    type="button"
                  >
                    <span>0{index + 1}</span>
                    <p className="editorial-eyebrow">
                      {opened ? "Who actually decides" : "Unspoken social rule"}
                    </p>
                    <h2>{opened ? item.reality : "“" + item.myth + "”"}</h2>
                    <small>{opened ? "Choice stays with the person" : "Reveal the right"}</small>
                  </button>
                );
              })}
            </div>
            <div className={styles.knowledgePanel}>
              <p className="editorial-eyebrow">Response check</p>
              <h2>What can someone do when a stigmatizing comment lands?</h2>
              <div className="mt-5 grid gap-3">
                {(
                  [
                    [
                      "name_impact",
                      "Name the impact, set a limit, and decide whether to continue the conversation.",
                    ],
                    [
                      "prove_worth",
                      "Explain every health decision until the other person approves.",
                    ],
                    ["stay_silent", "Stay silent because good intentions cancel the impact."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() => void evaluate({ answer, stage: "stigma_myth" }, "myth", answer)}
                    selected={selectedAnswers.myth === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.myth ? <Feedback feedback={evaluations.myth} /> : null}
          </div>
        );
      case 3:
        return (
          <div className="space-y-9">
            <LessonHeading label="Encouragement is not surveillance">
              Support offers a hand. Control grabs the steering wheel.
            </LessonHeading>
            <SupportConversationAnimation />
            <div className={styles.sortingBoard}>
              {supportExamples.map((item) => {
                const answer = supportClassifications[item.id];
                const accurate = answer === item.kind;
                return (
                  <article className={styles.sortingRow} key={item.id}>
                    <p>“{item.statement}”</p>
                    <div>
                      {(["support", "control"] as const).map((kind) => (
                        <button
                          aria-pressed={answer === kind}
                          className={cn(
                            styles.sortButton,
                            answer === kind && styles.sortButtonSelected,
                          )}
                          key={kind}
                          onClick={() =>
                            setSupportClassifications((current) => ({
                              ...current,
                              [item.id]: kind,
                            }))
                          }
                          type="button"
                        >
                          {kind === "support" ? "Support" : "Control"}
                        </button>
                      ))}
                    </div>
                    {answer ? (
                      <small className={accurate ? styles.sortAccurate : styles.sortTry}>
                        {accurate ? item.why : "Look again: " + item.why}
                      </small>
                    ) : null}
                  </article>
                );
              })}
            </div>
            <div className={styles.knowledgePanel}>
              <h2>A family member wants to help with meals. What is the strongest first move?</h2>
              <div className="mt-5 grid gap-3">
                {(
                  [
                    ["ask_first", "Ask what kind of help would feel useful, then listen."],
                    ["monitor_choices", "Comment on every choice so nothing gets missed."],
                    ["take_over", "Make the decisions before the person can choose."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() =>
                      void evaluate({ answer, stage: "support_or_control" }, "support", answer)
                    }
                    selected={selectedAnswers.support === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.support ? <Feedback feedback={evaluations.support} /> : null}
          </div>
        );
      case 4:
        return (
          <div className="space-y-9">
            <LessonHeading label="Make the help specific">
              People often want to help. A clear request gives care somewhere useful to land.
            </LessonHeading>
            <div className={styles.requestStudio}>
              <section>
                <p className="editorial-eyebrow">1 · What kind of support?</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {supportKinds.map(([id, label, description]) => (
                    <button
                      aria-pressed={supportKind === id}
                      className={cn(
                        styles.requestOption,
                        supportKind === id && styles.requestOptionSelected,
                      )}
                      key={id}
                      onClick={() => {
                        setSupportKind(id);
                        setSupportAction(null);
                      }}
                      type="button"
                    >
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <p className="editorial-eyebrow">2 · Who could you ask?</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {supportPeople.map(([id, label]) => (
                    <AnswerChoice
                      key={id}
                      onClick={() => setSupportPerson(id)}
                      selected={supportPerson === id}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </section>
              {supportKind ? (
                <section className="animate-slide-up">
                  <p className="editorial-eyebrow">3 · Name one concrete action</p>
                  <div className="mt-4 grid gap-3">
                    {requestActions[supportKind].map((action) => (
                      <AnswerChoice
                        key={action}
                        onClick={() => setSupportAction(action)}
                        selected={supportAction === action}
                      >
                        {action}
                      </AnswerChoice>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
            {supportRequest ? (
              <div className={styles.requestDraft}>
                <HeartHandshake aria-hidden="true" />
                <div>
                  <p className="editorial-eyebrow">Your request draft for {selectedPerson}</p>
                  <blockquote>“{supportRequest}”</blockquote>
                  <p>Specific enough to act on. Respectful enough to leave both people a choice.</p>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <LessonHeading label="A boundary is not a punishment">
              You can appreciate concern and still say what needs to stop.
            </LessonHeading>
            <BoundaryConversationAnimation />
            <div>
              <p className={styles.promptTitle}>Choose a moment to rehearse.</p>
              <div className="mt-5 grid gap-3">
                {boundaryScenarios.map((scenario) => (
                  <AnswerChoice
                    key={scenario}
                    onClick={() => setBoundaryScenario(scenario)}
                    selected={boundaryScenario === scenario}
                  >
                    {scenario}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {boundaryScenario ? (
              <div className={styles.knowledgePanel}>
                <p className="editorial-eyebrow">Choose the response that protects your peace</p>
                <h2>{boundaryScenario}</h2>
                <div className="mt-5 grid gap-3">
                  {(
                    [
                      [
                        "clear_boundary",
                        "“I appreciate your concern, but I’m following my care plan. Please don’t monitor my choices.”",
                      ],
                      [
                        "full_defense",
                        "Explain every medical detail until the other person agrees with every choice.",
                      ],
                      [
                        "accept_commentary",
                        "Stay in the conversation even when the comments feel controlling.",
                      ],
                    ] as const
                  ).map(([answer, label]) => (
                    <AnswerChoice
                      key={answer}
                      onClick={() =>
                        void evaluate({ answer, stage: "boundary" }, "boundary", answer)
                      }
                      selected={selectedAnswers.boundary === answer}
                    >
                      {label}
                    </AnswerChoice>
                  ))}
                </div>
              </div>
            ) : null}
            {evaluations.boundary ? <Feedback feedback={evaluations.boundary} /> : null}
          </div>
        );
      case 6:
        return (
          <div className="space-y-9">
            <LessonHeading label="Disclosure belongs to you">
              Share enough to support the need, not more than you want to give.
            </LessonHeading>
            <div className={styles.disclosureScene}>
              <div>
                <p className="editorial-eyebrow">The situation</p>
                <h2>A manager schedules a meeting through your usual lunch break.</h2>
                <p>
                  You want to protect the timing that helps your routine. You do not want to give a
                  detailed medical history.
                </p>
              </div>
              <ShieldCheck aria-hidden="true" />
            </div>
            <div className="grid gap-3">
              {(
                [
                  [
                    "simple_request",
                    "“Eating near my usual time supports a health need. Could we meet before lunch or afterward?”",
                  ],
                  ["skip_silently", "Skip lunch and say nothing, even if the timing matters."],
                  [
                    "share_everything",
                    "Share every diagnosis and treatment detail to justify the request.",
                  ],
                ] as const
              ).map(([answer, label]) => (
                <AnswerChoice
                  key={answer}
                  onClick={() =>
                    void evaluate({ answer, stage: "workplace_request" }, "workplace", answer)
                  }
                  selected={selectedAnswers.workplace === answer}
                >
                  {label}
                </AnswerChoice>
              ))}
            </div>
            {evaluations.workplace ? <Feedback feedback={evaluations.workplace} /> : null}
            <p className={styles.privacyNote}>
              You do not owe everyone an explanation. A short request, a fuller conversation, or no
              disclosure at all can each be valid depending on the relationship, setting, and what
              you want.
            </p>
          </div>
        );
      case 7: {
        const selectedByRing = (ring: MapRing) =>
          mapOptions.filter(([itemRing, label]) => itemRing === ring && mapChoices.has(label));
        return (
          <div className="space-y-9">
            <LessonHeading label="Build a support system that fits">
              One person can help. Different circles can carry different needs.
            </LessonHeading>
            <LessonStoryImage
              alt="Adults across generations relax together in a garden courtyard, with two women hugging, friends sharing tea, and another pair beginning a walk"
              caption="Peer support can bring practical ideas, relief, laughter, and the recognition that many difficult moments are shared."
              emphasis="Community can turn isolation into belonging."
              src="/lessons/day-13/community-belonging.jpg"
            />
            <div className={styles.mapLayout}>
              <div
                aria-label="A support map with the learner at the center, surrounded by chosen close people, care professionals, and community"
                className={styles.supportMap}
                role="img"
              >
                <div
                  className={cn(
                    styles.mapRing,
                    styles.mapCommunity,
                    selectedByRing("community").length > 0 && styles.mapRingActive,
                  )}
                >
                  <span>COMMUNITY</span>
                  <div
                    className={cn(
                      styles.mapRing,
                      styles.mapCare,
                      selectedByRing("care").length > 0 && styles.mapRingActive,
                    )}
                  >
                    <span>CARE TEAM</span>
                    <div
                      className={cn(
                        styles.mapRing,
                        styles.mapClose,
                        selectedByRing("close").length > 0 && styles.mapRingActive,
                      )}
                    >
                      <span>PEOPLE I CHOOSE</span>
                      <strong>ME</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.mapChoices}>
                {(["close", "care", "community"] as const).map((ring) => (
                  <section key={ring}>
                    <p className="editorial-eyebrow">
                      {ring === "close"
                        ? "People I choose"
                        : ring === "care"
                          ? "Care team"
                          : "Community"}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {mapOptions
                        .filter(([itemRing]) => itemRing === ring)
                        .map(([, label]) => (
                          <AnswerChoice
                            key={label}
                            onClick={() => toggleMapChoice(label)}
                            selected={mapChoices.has(label)}
                          >
                            {label}
                          </AnswerChoice>
                        ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
            <p aria-live="polite" className={styles.mapSummary}>
              {mapChoices.size
                ? String(mapChoices.size) +
                  " possible supports selected. Choosing someone here does not create an obligation to share."
                : "Start with one person, professional, or community that feels possible."}
            </p>
          </div>
        );
      }
      case 8:
        return (
          <div className="space-y-9">
            <LessonHeading label="Emotional health is health">
              You do not have to pretend that every day feels easy.
            </LessonHeading>
            <div className={styles.emotionalPanel}>
              <div>
                <Sparkles aria-hidden="true" />
                <p className="editorial-eyebrow">A gentle check-in</p>
                <h2>What might help you feel less alone or overloaded today?</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {wellbeingOptions.map((option) => (
                  <AnswerChoice
                    key={option}
                    onClick={() => setWellbeingChoice(option)}
                    selected={wellbeingChoice === option}
                  >
                    {option}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {wellbeingChoice ? (
              <p className={styles.reassurance}>
                “{wellbeingChoice}” is a valid form of care. You can choose something different
                tomorrow.
              </p>
            ) : null}
            <div className={styles.careNote}>
              <MessageCircleHeart aria-hidden="true" />
              <p>
                If sadness, anxiety, hopelessness, or diabetes distress persists or begins
                interfering with daily life, tell a healthcare professional. Emotional support is
                part of diabetes care, and help is available.
              </p>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-9">
            <LessonHeading label="Bring it into one real conversation">
              The strongest support request is small enough to say out loud.
            </LessonHeading>
            {supportRequest ? (
              <div className={styles.finalRequest}>
                <p className="editorial-eyebrow">The request you built</p>
                <blockquote>“{supportRequest}”</blockquote>
              </div>
            ) : null}
            <label className={styles.writingField}>
              <span>What would feel encouraging rather than controlling?</span>
              <textarea
                maxLength={260}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="Support would feel encouraging if…"
                rows={4}
                value={reflection}
              />
              <small>
                This reflection stays on this page and is not saved as health information.
              </small>
            </label>
            <div>
              <p className={styles.promptTitle}>
                How ready do you feel to name one specific way someone can help?
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["not_yet", "Not yet; I may need more time"],
                    ["with_words", "I could do it with a script"],
                    ["mostly", "Mostly ready"],
                    ["ready", "Ready to try"],
                  ] as const
                ).map(([id, label]) => (
                  <AnswerChoice
                    key={id}
                    onClick={() => setConfidence(id)}
                    selected={confidence === id}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            <div className={styles.knowledgePanel}>
              <p className="editorial-eyebrow">Define support without control</p>
              <h2>What makes support helpful?</h2>
              <div className="mt-5 grid gap-3">
                {(
                  [
                    [
                      "respects_choice",
                      "It asks, listens, respects choice, and offers specific help without blame.",
                    ],
                    ["controls_choices", "It takes control so the person cannot make a mistake."],
                    [
                      "avoids_topic",
                      "It never acknowledges diabetes, even when help is requested.",
                    ],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() =>
                      void evaluate({ answer, stage: "teach_back" }, "teachBack", answer)
                    }
                    selected={selectedAnswers.teachBack === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.teachBack ? <Feedback feedback={evaluations.teachBack} /> : null}
          </div>
        );
      default:
        return (
          <div className="space-y-12 text-center">
            <p className="editorial-eyebrow">Day 13 complete</p>
            <LessonHeading centered>Care can be shared without giving yourself away.</LessonHeading>
            <div className={styles.completionMark}>
              <UsersRound aria-hidden="true" />
              <p>You are still the author of your care.</p>
              <span>Ask · Listen · Offer · Check</span>
            </div>
            <div className="mx-auto max-w-3xl border-y border-border py-9 text-left">
              <p className="editorial-eyebrow">Relationship agreements</p>
              <ol className={styles.takeawayList}>
                {[
                  "Diabetes is a condition you manage, not an identity or a verdict about your character.",
                  "Helpful support asks permission, respects choice, and reduces burden. Concern does not excuse control.",
                  "A clear request and a calm boundary can protect both your health and your relationships.",
                ].map((item, index) => (
                  <li key={item}>
                    <span>0{index + 1}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </div>
            {supportRequest ? (
              <div className={styles.finalRequest}>
                <p className="editorial-eyebrow">One conversation you can carry</p>
                <blockquote>“{supportRequest}”</blockquote>
              </div>
            ) : null}
            <div className="mx-auto grid max-w-3xl gap-6 text-left md:grid-cols-2">
              <div>
                <p className="editorial-eyebrow">Tomorrow · The final lesson</p>
                <h2 className="mt-3 font-serif-display text-3xl">Putting It All Together</h2>
                <p className="mt-2 leading-7">
                  Gather what you have learned into a realistic month-one care map and decide what
                  matters next.
                </p>
              </div>
              <div>
                <p className="editorial-eyebrow">The skill you built</p>
                <p className="mt-3 font-serif-display text-2xl">
                  Asking for help without surrendering choice, privacy, or self-respect.
                </p>
              </div>
            </div>
            <Button disabled={isPending} fullWidth={false} onClick={finishExperience}>
              {isPending
                ? "Saving your progress…"
                : experience.accessMode === "review"
                  ? "Return to journey"
                  : "Complete Day 13"}
            </Button>
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
            <p className={styles.dayLabel}>Day 13</p>
            <p className="hidden text-xs sm:block">Support, Stigma, and the People Around You</p>
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
          <div className="flex justify-between text-xs">
            <span>Chapter {stage + 1}</span>
            <span>{stageCount} chapters</span>
          </div>
          <div
            aria-label={"Day 13 chapter " + String(stage + 1) + " of " + String(stageCount)}
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
        description="Your chapter will be saved. Practice choices and written reflections stay on this page and are not saved as health information."
        onOpenChange={setExitOpen}
        open={exitOpen}
        title="Leave Day 13 for now?"
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
        title="Day 13 glossary"
      >
        <dl className="max-h-[56dvh] space-y-5 overflow-y-auto pr-2">
          {glossary.map((item) => (
            <div className="border-b border-border pb-4 last:border-0" key={item.term}>
              <dt className="font-serif-display text-xl">{item.term}</dt>
              <dd className="mt-1 leading-7">{item.definition}</dd>
            </div>
          ))}
        </dl>
      </Modal>
    </section>
  );
}
