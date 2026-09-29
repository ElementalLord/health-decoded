"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  Clock3,
  FileText,
  Phone,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { recognizeMilestone } from "@/features/achievements/lib/recognize-milestone.client";
import { getStoryStorageKey, parseStoryProgress } from "@/features/stories/lib/story-progress";
import type { StoryProgress } from "@/features/stories/types/interactive-story";
import { readLocalStorage, safeSetLocalStorage } from "@/lib/storage/safe-local-storage";

import styles from "./nora-story-experience.module.css";

const STORY_SLUG = "nora-prescription-bag";
const STORAGE_KEY = getStoryStorageKey(STORY_SLUG);
const SCENE_COUNT = 8;

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function saveProgress(progress: StoryProgress) {
  safeSetLocalStorage(STORAGE_KEY, JSON.stringify(progress));
}

function StoryProgressHeader({ current }: { current: number }) {
  return (
    <header className={styles.readerHeader}>
      <div className={styles.readerIdentity}>
        <span>Nora&apos;s story</span>
        <span aria-label={`Part ${current + 1} of ${SCENE_COUNT}`}>
          {current + 1} / {SCENE_COUNT}
        </span>
      </div>
      <div
        aria-label={`Part ${current + 1} of ${SCENE_COUNT}`}
        aria-valuemax={SCENE_COUNT}
        aria-valuemin={1}
        aria-valuenow={current + 1}
        aria-valuetext={`Part ${current + 1} of ${SCENE_COUNT}`}
        className={styles.progress}
        role="progressbar"
      >
        {Array.from({ length: SCENE_COUNT }, (_, index) => (
          <span
            aria-hidden="true"
            className={index <= current ? styles.progressActive : undefined}
            key={index}
          />
        ))}
      </div>
    </header>
  );
}

function PrescriptionBag() {
  const [view, setView] = useState<"label" | "meaning">("label");

  return (
    <section className={styles.bagMoment} aria-labelledby="bag-heading">
      <div className={styles.pharmacyBag} aria-hidden="true">
        <span>Pharmacy</span>
        <strong>Prescription</strong>
        <small>Picked up today</small>
      </div>
      <div className={styles.bagDetails}>
        <div
          className={styles.smallTabs}
          role="tablist"
          aria-label="Compare the prescription and Nora's reaction"
        >
          <button
            aria-selected={view === "label"}
            onClick={() => setView("label")}
            role="tab"
            type="button"
          >
            What the bag says
          </button>
          <button
            aria-selected={view === "meaning"}
            onClick={() => setView("meaning")}
            role="tab"
            type="button"
          >
            What Nora hears
          </button>
        </div>
        <div aria-live="polite" className={styles.bagPanel} role="tabpanel">
          <h3 id="bag-heading">
            {view === "label" ? "A new prescription" : "I didn't do enough."}
          </h3>
          <p>
            {view === "label"
              ? "The label contains directions for one medication. It doesn't say anything about Nora's effort or character."
              : "That judgment came from Nora, not from the prescription or her healthcare team."}
          </p>
        </div>
      </div>
    </section>
  );
}

const paperworkDetails = {
  directions: {
    label: "Directions",
    title: "How to use this prescription",
    copy: "The label is the starting point for timing and use. Nora can ask the pharmacist to explain any wording she does not understand.",
  },
  safety: {
    label: "Written information",
    title: "What to watch for",
    copy: "The pharmacy information includes precautions and concerns to discuss. It is more specific to the prescription than a stranger's post.",
  },
  contact: {
    label: "Contact",
    title: "Where questions can go",
    copy: "The pharmacy phone number gives Nora somewhere to take a question before she guesses or changes anything on her own.",
  },
} as const;

function WrittenDirections() {
  const [section, setSection] = useState<keyof typeof paperworkDetails>("directions");
  const detail = paperworkDetails[section];

  return (
    <section className={styles.paperwork} aria-labelledby="paperwork-heading">
      <div className={styles.paperworkTabs} role="tablist" aria-label="Read the pharmacy paperwork">
        {(Object.keys(paperworkDetails) as Array<keyof typeof paperworkDetails>).map((key) => (
          <button
            aria-selected={section === key}
            key={key}
            onClick={() => setSection(key)}
            role="tab"
            type="button"
          >
            {paperworkDetails[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.paperworkPanel} role="tabpanel">
        <span>{detail.label}</span>
        <h3 id="paperwork-heading">{detail.title}</h3>
        <p>{detail.copy}</p>
      </div>
    </section>
  );
}

const sourceDetails = {
  posts: {
    title: "Other people's posts",
    copy: "They can make an experience feel less lonely. They can't explain why this medication was prescribed for Nora or how her directions apply.",
  },
  paperwork: {
    title: "Label and written information",
    copy: "These give Nora the directions and safety information connected to the prescription she received.",
  },
  people: {
    title: "Pharmacist or prescriber",
    copy: "They can answer questions about the prescription, clarify the directions, and tell Nora what to do when something is unclear.",
  },
} as const;

function InformationSources() {
  const [source, setSource] = useState<keyof typeof sourceDetails>("posts");
  const detail = sourceDetails[source];

  return (
    <section className={styles.sources} aria-labelledby="source-heading">
      <div className={styles.sourceRail} role="tablist" aria-label="Compare information sources">
        <button
          aria-selected={source === "posts"}
          onClick={() => setSource("posts")}
          role="tab"
          type="button"
        >
          Online posts
        </button>
        <button
          aria-selected={source === "paperwork"}
          onClick={() => setSource("paperwork")}
          role="tab"
          type="button"
        >
          Written information
        </button>
        <button
          aria-selected={source === "people"}
          onClick={() => setSource("people")}
          role="tab"
          type="button"
        >
          Ask a professional
        </button>
      </div>
      <div aria-live="polite" className={styles.sourcePanel} role="tabpanel">
        {source === "paperwork" ? <FileText aria-hidden="true" size={22} /> : null}
        {source === "people" ? <Phone aria-hidden="true" size={22} /> : null}
        <h3 id="source-heading">{detail.title}</h3>
        <p>{detail.copy}</p>
      </div>
    </section>
  );
}

type SupportReply = "need" | "feel" | "try";

function SisterConversation() {
  const [reply, setReply] = useState<SupportReply | null>(null);
  const replies: { id: SupportReply; label: string }[] = [
    { id: "need", label: "Are you sure you need it?" },
    { id: "feel", label: "How are you feeling about the new prescription?" },
    { id: "try", label: "Maybe you should try harder first." },
  ];

  return (
    <section className={styles.conversation} aria-labelledby="sister-question">
      <div className={styles.speechSister}>
        <span>Her sister</span>
        <p>“They put you on medication already?”</p>
      </div>
      <div className={styles.speechNora}>
        <span>Nora</span>
        <p>“I don&apos;t really want to get into it.”</p>
      </div>
      <h3 id="sister-question">What could her sister ask instead?</h3>
      <div className={styles.replyChoices} role="radiogroup" aria-label="Choose a response">
        {replies.map((option) => (
          <button
            aria-checked={reply === option.id}
            className={reply === option.id ? styles.selectedChoice : undefined}
            key={option.id}
            onClick={() => setReply(option.id)}
            role="radio"
            type="button"
          >
            <span>{option.label}</span>
            {reply === option.id ? <Check aria-hidden="true" size={18} /> : null}
          </button>
        ))}
      </div>
      {reply ? (
        <div aria-live="polite" className={styles.feedback}>
          <strong>
            {reply === "feel"
              ? "That lets Nora decide how much to share."
              : "That may sound like blame."}
          </strong>
          <p>
            {reply === "feel"
              ? "Nora can say as much or as little as she wants, and her sister can listen before offering help."
              : "Concern can be real without questioning whether Nora deserves or needs the prescription."}
          </p>
        </div>
      ) : null}
    </section>
  );
}

const callQuestions = [
  "What is this medication intended to help with?",
  "How should I follow the directions on my label?",
  "Which side effects or concerns should I discuss with you?",
  "What should I do if an instruction is unclear?",
] as const;

function PharmacyCall() {
  const [saved, setSaved] = useState<number[]>([0]);

  const toggle = (index: number) => {
    setSaved((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <section className={styles.callSheet} aria-labelledby="call-heading">
      <div className={styles.callTop}>
        <span>Questions for the pharmacy</span>
        <span>{saved.length} saved</span>
      </div>
      <h3 id="call-heading">Nora&apos;s list</h3>
      <div className={styles.questionList}>
        {callQuestions.map((question, index) => (
          <button
            aria-pressed={saved.includes(index)}
            className={saved.includes(index) ? styles.questionSaved : undefined}
            key={question}
            onClick={() => toggle(index)}
            type="button"
          >
            <span>{question}</span>
            <Check aria-hidden="true" size={17} />
          </button>
        ))}
      </div>
      <p>Questions about changing or stopping medication belong with a pharmacist or prescriber.</p>
    </section>
  );
}

type Routine = "teeth" | "coffee" | "alarm";

function RoutineAnchor() {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const options: { id: Routine; label: string }[] = [
    { id: "teeth", label: "Brushing her teeth" },
    { id: "coffee", label: "Making morning coffee" },
    { id: "alarm", label: "A phone reminder" },
  ];

  return (
    <section className={styles.routine} aria-labelledby="routine-heading">
      <div className={styles.routineIntro}>
        <span>First</span>
        <h3 id="routine-heading">Check the prescription directions.</h3>
        <p>A reminder only works if it fits the timing and instructions Nora was given.</p>
      </div>
      <div
        className={styles.routineOptions}
        role="radiogroup"
        aria-label="Choose a possible reminder"
      >
        {options.map((option) => (
          <button
            aria-checked={routine === option.id}
            className={routine === option.id ? styles.routineSelected : undefined}
            key={option.id}
            onClick={() => setRoutine(option.id)}
            role="radio"
            type="button"
          >
            <span aria-hidden="true">
              {option.id === "teeth" ? "01" : option.id === "coffee" ? "02" : "03"}
            </span>
            {option.label}
          </button>
        ))}
      </div>
      {routine ? (
        <p aria-live="polite" className={styles.routineResult}>
          Nora can use {options.find((option) => option.id === routine)?.label.toLowerCase()} if it
          matches her label and the guidance she received.
        </p>
      ) : null}
    </section>
  );
}

const checkInDetails = {
  routine: {
    label: "The routine",
    title: "The reminder is doing its job",
    copy: "It brings Nora back to the directions she was given. It does not decide how the medication should be used.",
  },
  question: {
    label: "One question",
    title: "Something is still unclear",
    copy: "Nora writes the question down instead of changing the prescription herself. She can bring it to the pharmacist or prescriber.",
  },
  appointment: {
    label: "The next visit",
    title: "A short note is enough",
    copy: "She records what she wants to discuss. She does not need to turn every day into a detailed report.",
  },
} as const;

function FirstWeekCheckIn() {
  const [detail, setDetail] = useState<keyof typeof checkInDetails>("routine");
  const selected = checkInDetails[detail];

  return (
    <section className={styles.checkIn} aria-labelledby="check-in-heading">
      <div className={styles.checkInTabs} role="tablist" aria-label="Review Nora's check-in">
        {(Object.keys(checkInDetails) as Array<keyof typeof checkInDetails>).map((key, index) => (
          <button
            aria-selected={detail === key}
            key={key}
            onClick={() => setDetail(key)}
            role="tab"
            type="button"
          >
            <span>{index + 1}</span>
            {checkInDetails[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.checkInPanel} role="tabpanel">
        <span>Wednesday evening</span>
        <h3 id="check-in-heading">{selected.title}</h3>
        <p>{selected.copy}</p>
      </div>
    </section>
  );
}

function CarePlan() {
  const [view, setView] = useState<"prescription" | "plan">("plan");

  return (
    <section className={styles.carePlan} aria-labelledby="plan-heading">
      <div
        className={styles.smallTabs}
        role="tablist"
        aria-label="Compare one prescription with the full care plan"
      >
        <button
          aria-selected={view === "prescription"}
          onClick={() => setView("prescription")}
          role="tab"
          type="button"
        >
          The prescription
        </button>
        <button
          aria-selected={view === "plan"}
          onClick={() => setView("plan")}
          role="tab"
          type="button"
        >
          Nora&apos;s care plan
        </button>
      </div>
      {view === "prescription" ? (
        <div className={styles.singleTool} role="tabpanel">
          <span>The prescription</span>
          <h3 id="plan-heading">Medication used as prescribed</h3>
          <p>It is one part of Nora&apos;s care, not a judgment about her effort.</p>
        </div>
      ) : (
        <div className={styles.planGrid} role="tabpanel">
          <h3 id="plan-heading">How it fits with the rest of her care</h3>
          <ul>
            <li>Medication used as prescribed</li>
            <li>Questions for her care team</li>
            <li>Meals and movement that fit her life</li>
            <li>Appointments, rest, and support</li>
          </ul>
        </div>
      )}
    </section>
  );
}

const scenes = [
  {
    id: "pharmacy",
    title: "At the pharmacy",
    moment: "Thursday · 5:18 PM",
    body: (
      <>
        <p>
          Nora nodded while the pharmacist reviewed the label and written instructions. She put the
          bag on the passenger seat and drove home.
        </p>
        <p>
          She had always thought medication came after someone failed to make enough changes. Nobody
          at the appointment had said that. She still heard it when she looked at the bag.
        </p>
      </>
    ),
    visual: <PrescriptionBag />,
    continueLabel: "Read the paperwork",
  },
  {
    id: "paperwork",
    title: "In the parked car",
    moment: "Pharmacy parking lot · 5:27 PM",
    body: (
      <>
        <p>
          Before driving home, Nora opened the bag again. The label, printed information, and
          pharmacy number were all there. She had been looking at the bag as a judgment instead of
          information she could use.
        </p>
        <p>She read enough to circle two lines she wanted someone to explain.</p>
      </>
    ),
    visual: <WrittenDirections />,
    continueLabel: "Go to the next morning",
  },
  {
    id: "counter",
    title: "Still on the counter",
    moment: "Friday · 7:10 AM",
    body: (
      <>
        <p>
          Nora saw the unopened bag while she made coffee. She wasn&apos;t forgetting it. She was
          waiting to feel certain.
        </p>
        <p>
          That evening she searched the medication name. One person felt better. Another described a
          side effect. Someone else said medication meant a person hadn&apos;t tried hard enough.
          Nora closed the browser with more questions than she started with.
        </p>
      </>
    ),
    visual: <InformationSources />,
    continueLabel: "Continue to the weekend",
  },
  {
    id: "sister",
    title: "Her sister noticed",
    moment: "Saturday afternoon",
    body: (
      <>
        <p>
          Nora&apos;s sister noticed the pharmacy bag during a visit and asked why medication was
          starting “already.”
        </p>
        <p>
          She may have meant concern. Nora heard blame. She folded the top of the bag closed and
          changed the subject.
        </p>
      </>
    ),
    visual: <SisterConversation />,
    continueLabel: "Go to Monday's call",
  },
  {
    id: "call",
    title: "The pharmacy call",
    moment: "Monday · 9:22 AM",
    body: (
      <>
        <p>
          Nora called with a question about the directions. Before hanging up, she asked the
          question she had avoided.
        </p>
        <blockquote>“Does needing this mean I failed?”</blockquote>
        <p>
          The pharmacist said the prescription was based on her health needs, not a grade on her
          effort. Then they worked through the rest of her questions.
        </p>
      </>
    ),
    visual: <PharmacyCall />,
    continueLabel: "See what Nora did next",
  },
  {
    id: "routine",
    title: "A reminder that fits",
    moment: "Monday evening",
    body: (
      <>
        <p>
          After the call, Nora read the label and written instructions again. She decided to follow
          the directions she had been given.
        </p>
        <p>
          Now she needed a reminder that could fit into an ordinary day. It had to work with the
          prescription. The reminder could not replace its instructions.
        </p>
      </>
    ),
    visual: <RoutineAnchor />,
    continueLabel: "Check in a few days later",
  },
  {
    id: "check-in",
    title: "A few days in",
    moment: "Wednesday · 7:40 PM",
    body: (
      <>
        <p>
          Nora checked the note beside her reminder. The routine was working, and one question was
          still unresolved. That did not mean the whole plan was wrong.
        </p>
        <p>She added the question to a short note for the next conversation with her care team.</p>
      </>
    ),
    visual: <FirstWeekCheckIn />,
    continueLabel: "See the full plan",
  },
  {
    id: "plan",
    title: "Part of the plan",
    moment: "Thursday morning",
    body: (
      <>
        <p>
          The pharmacy bag was gone from the counter. Nora still had questions, so she kept a note
          for her next appointment.
        </p>
        <p>
          Medication became one part of her care plan, along with meals, movement, rest,
          appointments, and support.
        </p>
      </>
    ),
    visual: <CarePlan />,
    continueLabel: "Finish story",
  },
] as const;

export function NoraStoryExperience() {
  const [hydrated, setHydrated] = useState(false);
  const [current, setCurrent] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [complete, setComplete] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.body.classList.add("story-reader-active");
    const saved = parseStoryProgress(readLocalStorage(STORAGE_KEY).value);
    const query = new URLSearchParams(window.location.search);
    const shouldBegin = query.get("begin") === "1";
    const savedScene = Math.min(saved.currentScene, SCENE_COUNT - 1);

    if (shouldBegin) {
      setCurrent(0);
      setFurthest(0);
    } else if (saved.storyCompleted) {
      setComplete(true);
    } else if (saved.stage !== "intro") {
      setCurrent(savedScene);
      setFurthest(Math.max(saved.furthestSceneReached, savedScene));
    }
    setHydrated(true);

    return () => document.body.classList.remove("story-reader-active");
  }, []);

  const persist = useCallback((scene: number, reached: number, storyCompleted = false) => {
    const stored = parseStoryProgress(readLocalStorage(STORAGE_KEY).value);
    saveProgress({
      ...stored,
      currentScene: scene,
      furthestSceneReached: reached,
      lastOpenedAt: Date.now(),
      completionDate: storyCompleted ? (stored.completionDate ?? new Date().toISOString()) : null,
      storyCompleted,
      versionCompleted: storyCompleted ? "2.1" : null,
      stage: storyCompleted ? "complete" : "story",
    });
  }, []);

  useEffect(() => {
    if (!hydrated || complete) return;
    persist(current, furthest);
  }, [complete, current, furthest, hydrated, persist]);

  const goTo = (next: number) => {
    if (next < 0 || next >= SCENE_COUNT) return;
    setCurrent(next);
    setFurthest((value) => Math.max(value, next));
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  const finish = () => {
    persist(SCENE_COUNT - 1, SCENE_COUNT - 1, true);
    setComplete(true);
    void recognizeMilestone({ event: "interactive_story_completed", storyId: STORY_SLUG });
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({
        behavior: shouldReduceMotion() ? "auto" : "smooth",
        block: "start",
      });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  const restart = () => {
    setCurrent(0);
    setFurthest(0);
    setComplete(false);
    persist(0, 0);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({
        behavior: shouldReduceMotion() ? "auto" : "smooth",
        block: "start",
      });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  const scene = scenes[current]!;

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/stories">
        <ArrowLeft aria-hidden="true" size={17} /> Stories
      </Link>

      {!hydrated ? (
        <div aria-live="polite" className={styles.loading} role="status">
          <span aria-hidden="true" className={styles.loadingMark}>
            <span />
            <span />
            <span />
          </span>
          <span>Loading story</span>
        </div>
      ) : complete ? (
        <article className={styles.completion} ref={articleRef}>
          <p>Nora&apos;s story</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Finished
          </h1>
          <p>
            Nora still had questions about the medication. She called the pharmacy, followed the
            written directions, and chose a reminder that fit them.
          </p>
          <div className={styles.completionTakeaway}>
            <span>In short</span>
            <strong>Medication can be part of care without being a judgment about effort.</strong>
          </div>
          <div className={styles.completionActions}>
            <Link className={styles.primaryAction} href="/stories">
              Back to stories
            </Link>
            <button className={styles.secondaryAction} onClick={restart} type="button">
              <RotateCcw aria-hidden="true" size={16} /> Read again
            </button>
          </div>
          <p className={styles.disclosure}>
            Nora is a placeholder name. This is an illustrative scenario, not one person&apos;s
            medical history or personal medication advice.
          </p>
        </article>
      ) : (
        <article className={styles.reader} ref={articleRef}>
          <StoryProgressHeader current={current} />
          <div className={styles.scene} key={scene.id}>
            <header className={styles.sceneHeading}>
              <p>
                <Clock3 aria-hidden="true" size={15} /> {scene.moment}
              </p>
              <h1 ref={headingRef} tabIndex={-1}>
                {scene.title}
              </h1>
            </header>
            <div className={styles.storyCopy}>{scene.body}</div>
            <div className={styles.sceneVisual}>{scene.visual}</div>
          </div>

          <nav aria-label="Story navigation" className={styles.navigation}>
            {current > 0 ? (
              <button className={styles.previous} onClick={() => goTo(current - 1)} type="button">
                <ChevronLeft aria-hidden="true" size={18} /> Back
              </button>
            ) : (
              <span />
            )}
            <button
              className={styles.next}
              onClick={() => (current === SCENE_COUNT - 1 ? finish() : goTo(current + 1))}
              type="button"
            >
              {scene.continueLabel} <ArrowRight aria-hidden="true" size={18} />
            </button>
          </nav>
        </article>
      )}
    </main>
  );
}
