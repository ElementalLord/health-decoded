"use client";

import { ArrowLeft, ArrowRight, Check, ChevronLeft, Clock3, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { recognizeMilestone } from "@/features/achievements/lib/recognize-milestone.client";
import { getStoryStorageKey, parseStoryProgress } from "@/features/stories/lib/story-progress";
import type { StoryProgress } from "@/features/stories/types/interactive-story";
import { readLocalStorage, safeSetLocalStorage } from "@/lib/storage/safe-local-storage";

import styles from "./marcus-story-experience.module.css";

const STORY_SLUG = "marcus-parking-lot";
const STORAGE_KEY = getStoryStorageKey(STORY_SLUG);
const SCENE_COUNT = 8;

type Choice = "reading" | "blame" | "future";
type Reply = "solve" | "listen" | "dismiss";

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
        <span>Marcus&apos;s story</span>
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

function AppointmentSummary() {
  return (
    <div className={styles.paper} aria-label="Marcus's appointment summary">
      <div className={styles.paperTop}>
        <span>Visit summary</span>
        <span>Today · 4:18 PM</span>
      </div>
      <div className={styles.paperDiagnosis}>
        <span>New diagnosis</span>
        <strong>Type 2 diabetes</strong>
      </div>
      <div className={styles.paperLines} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

const visitDetails = {
  prescription: {
    label: "Prescription",
    title: "Pick it up tomorrow",
    copy: "The visit summary names the prescription and where it was sent. Questions about how to use it belong with the pharmacist or prescriber.",
  },
  followUp: {
    label: "Follow-up",
    title: "Call to schedule",
    copy: "The date is not on the page yet. Marcus only needs to make the call and ask when his doctor wants to see him again.",
  },
  questions: {
    label: "Questions",
    title: "Bring a short list",
    copy: "He does not have to remember everything tonight. He can write down what is unclear and take it to the next conversation.",
  },
} as const;

function VisitSummaryDetails() {
  const [detail, setDetail] = useState<keyof typeof visitDetails>("prescription");
  const selected = visitDetails[detail];

  return (
    <section className={styles.summaryReview} aria-labelledby="summary-review-heading">
      <div className={styles.summaryButtons} role="tablist" aria-label="Read the useful parts">
        {(Object.keys(visitDetails) as Array<keyof typeof visitDetails>).map((key) => (
          <button
            aria-selected={detail === key}
            key={key}
            onClick={() => setDetail(key)}
            role="tab"
            type="button"
          >
            {visitDetails[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.summaryPanel} role="tabpanel">
        <span>{selected.label}</span>
        <h3 id="summary-review-heading">{selected.title}</h3>
        <p>{selected.copy}</p>
      </div>
    </section>
  );
}

function PhoneDraft() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.phoneMoment}>
      <div className={styles.phoneHeader}>
        <span>Messages</span>
        <span>4:31 PM</span>
      </div>
      <div className={styles.incomingMessage}>How did the appointment go?</div>
      <div className={styles.draftLine}>
        <span>{open ? "I have diabetes." : "Message"}</span>
        <button aria-expanded={open} onClick={() => setOpen((value) => !value)} type="button">
          {open ? "Clear draft" : "See what he typed"}
        </button>
      </div>
      {open ? (
        <p aria-live="polite" className={styles.revealCopy}>
          Marcus typed the sentence, read it twice, then deleted it. He wasn&apos;t hiding the
          appointment. He didn&apos;t know how to explain it yet.
        </p>
      ) : null}
    </div>
  );
}

function ReadingChoice() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const options: { id: Choice; label: string }[] = [
    { id: "reading", label: "Marcus received a new diagnosis today." },
    { id: "blame", label: "Marcus should have prevented this." },
    { id: "future", label: "Marcus now knows exactly what his future will look like." },
  ];

  return (
    <section className={styles.questionBlock} aria-labelledby="diagnosis-question">
      <h3 id="diagnosis-question">What does the appointment actually tell Marcus?</h3>
      <div className={styles.choices} role="radiogroup" aria-label="Choose one answer">
        {options.map((option) => (
          <button
            aria-checked={choice === option.id}
            className={choice === option.id ? styles.choiceSelected : undefined}
            key={option.id}
            onClick={() => setChoice(option.id)}
            role="radio"
            type="button"
          >
            <span>{option.label}</span>
            {choice === option.id ? <Check aria-hidden="true" size={18} /> : null}
          </button>
        ))}
      </div>
      {choice ? (
        <div aria-live="polite" className={styles.feedback}>
          <strong>
            {choice === "reading"
              ? "That is what Marcus knows from the appointment."
              : "The appointment does not tell him that."}
          </strong>
          <p>
            The diagnosis is important health information. It doesn&apos;t measure Marcus&apos;s
            effort, identify one cause, or predict every part of his future.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function ConversationChoice() {
  const [reply, setReply] = useState<Reply | null>(null);
  const replies: { id: Reply; label: string }[] = [
    { id: "solve", label: "We need to change everything tonight." },
    { id: "listen", label: "What did the doctor ask you to do first?" },
    { id: "dismiss", label: "It's probably nothing. Don't worry." },
  ];

  return (
    <section className={styles.conversation} aria-labelledby="reply-question">
      <div className={styles.speechMarcus}>
        <span>Marcus</span>
        <p>“They said I have diabetes. I don&apos;t really know what happens now.”</p>
      </div>
      <h3 id="reply-question">What would help right now?</h3>
      <div className={styles.replyList}>
        {replies.map((option) => (
          <button
            aria-pressed={reply === option.id}
            className={reply === option.id ? styles.replySelected : undefined}
            key={option.id}
            onClick={() => setReply(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {reply ? (
        <div aria-live="polite" className={styles.replyResult}>
          <span>His wife</span>
          <p>
            {reply === "listen"
              ? "“Okay. What did the doctor ask you to do first?”"
              : "Marcus needs help finding the next step. He does not need a bigger plan or a reason to ignore the diagnosis."}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function InformationFilter() {
  const [view, setView] = useState<"tabs" | "plan">("tabs");

  return (
    <section className={styles.filter} aria-labelledby="filter-heading">
      <div className={styles.filterTabs} role="tablist" aria-label="Compare the information">
        <button
          aria-selected={view === "tabs"}
          onClick={() => setView("tabs")}
          role="tab"
          type="button"
        >
          Open tabs
        </button>
        <button
          aria-selected={view === "plan"}
          onClick={() => setView("plan")}
          role="tab"
          type="button"
        >
          Marcus&apos;s plan
        </button>
      </div>
      <div className={styles.filterPanel} role="tabpanel">
        {view === "tabs" ? (
          <>
            <h3 id="filter-heading">Information everywhere</h3>
            <ul>
              <li>Possible complications</li>
              <li>Conflicting food rules</li>
              <li>Medication lists</li>
              <li>Other people&apos;s results</li>
            </ul>
            <p>
              Some of it may be accurate. It still doesn&apos;t tell Marcus what applies to him.
            </p>
          </>
        ) : (
          <>
            <h3 id="filter-heading">What he knows tonight</h3>
            <ul>
              <li>Pick up the prescribed medication tomorrow</li>
              <li>Schedule the follow-up appointment</li>
              <li>Bring questions about his results and care plan</li>
            </ul>
            <p>Three specific next steps are more useful tonight than twenty open tabs.</p>
          </>
        )}
      </div>
    </section>
  );
}

function TomorrowNote() {
  return (
    <div className={styles.note} aria-label="Marcus's note for tomorrow">
      <div className={styles.noteHeading}>
        <span>Tomorrow</span>
        <span>On the kitchen table</span>
      </div>
      <ul>
        <li>
          <span aria-hidden="true" /> Pick up prescription
        </li>
        <li>
          <span aria-hidden="true" /> Call to schedule follow-up
        </li>
        <li>
          <span aria-hidden="true" /> Bring my three questions
        </li>
      </ul>
      <p>
        What do my results mean? What should I do first? What can stay normal in my day-to-day life?
      </p>
    </div>
  );
}

const morningSteps = {
  pharmacy: {
    label: "Pharmacy",
    time: "8:36 AM",
    title: "The prescription is ready",
    copy: "Marcus asks the pharmacist to go over the label once more before he leaves.",
  },
  call: {
    label: "Doctor's office",
    time: "9:12 AM",
    title: "The follow-up is booked",
    copy: "He writes the appointment date beside the questions from the kitchen table.",
  },
  work: {
    label: "Work",
    time: "9:41 AM",
    title: "Ready for work",
    copy: "Marcus puts the visit summary in his bag. He still has questions, but he is not trying to answer all of them before the day begins.",
  },
} as const;

function NextMorning() {
  const [step, setStep] = useState<keyof typeof morningSteps>("pharmacy");
  const selected = morningSteps[step];

  return (
    <section className={styles.morning} aria-labelledby="morning-heading">
      <div className={styles.morningSteps} role="tablist" aria-label="Follow Marcus's morning">
        {(Object.keys(morningSteps) as Array<keyof typeof morningSteps>).map((key, index) => (
          <button
            aria-selected={step === key}
            key={key}
            onClick={() => setStep(key)}
            role="tab"
            type="button"
          >
            <span>{index + 1}</span>
            {morningSteps[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.morningPanel} role="tabpanel">
        <span>{selected.time}</span>
        <h3 id="morning-heading">{selected.title}</h3>
        <p>{selected.copy}</p>
      </div>
    </section>
  );
}

const scenes = [
  {
    id: "appointment",
    title: "The appointment",
    moment: "Tuesday · 4:18 PM",
    body: (
      <>
        <p>
          The doctor turned her monitor toward Marcus. There were several results on the screen, but
          he stopped listening after two words: Type 2 diabetes.
        </p>
        <p>
          She explained his A1C, a prescription, and when to come back. Marcus nodded. By the time
          he reached the hallway, most of the details were gone.
        </p>
      </>
    ),
    visual: <AppointmentSummary />,
    continueLabel: "Read the handout",
  },
  {
    id: "summary",
    title: "The visit summary",
    moment: "Hallway · 4:24 PM",
    body: (
      <>
        <p>
          A nurse handed Marcus two pages on his way out. He folded them before reaching the
          elevator without reading them. He had already heard more than he could keep track of.
        </p>
        <p>
          In the lobby, he opened them again. Three parts could help without requiring him to
          understand the whole diagnosis at once.
        </p>
      </>
    ),
    visual: <VisitSummaryDetails />,
    continueLabel: "Step outside",
  },
  {
    id: "car",
    title: "In the car",
    moment: "Medical office parking lot · 4:31 PM",
    body: (
      <>
        <p>
          Marcus sat in the driver&apos;s seat with the visit summary folded on his lap. He
          didn&apos;t start the car.
        </p>
        <p>
          His wife texted to ask how the appointment went. He started an answer, deleted it, and put
          the phone down. Cars came and went. He stayed there for forty minutes.
        </p>
      </>
    ),
    visual: <PhoneDraft />,
    continueLabel: "Keep reading",
  },
  {
    id: "thought",
    title: "His first thought",
    moment: "Still in the car",
    body: (
      <>
        <p>
          Marcus thought about missed appointments and the takeout he ordered when work ran late. He
          thought about his dad&apos;s pill organizer on the kitchen counter.
        </p>
        <blockquote>“I should have stopped this from happening.”</blockquote>
        <p>The doctor hadn&apos;t said that. Marcus had filled in the blame on his own.</p>
      </>
    ),
    visual: <ReadingChoice />,
    continueLabel: "See who he called",
  },
  {
    id: "call",
    title: "The call",
    moment: "5:09 PM",
    body: (
      <>
        <p>
          Marcus finally called his wife. He expected a dozen questions. Instead, she waited while
          he tried to repeat what he remembered.
        </p>
        <p>He got through the diagnosis, then stopped. “That&apos;s about all I heard,” he said.</p>
      </>
    ),
    visual: <ConversationChoice />,
    continueLabel: "Later that evening",
  },
  {
    id: "search",
    title: "Too many tabs",
    moment: "At home · 8:26 PM",
    body: (
      <>
        <p>
          After dinner, Marcus searched for Type 2 diabetes. Ten minutes later, he had tabs open
          about food, kidneys, eyesight, medications, and things that might happen years from now.
        </p>
        <p>
          The information wasn&apos;t helping him understand his own appointment. He closed the
          laptop and unfolded the visit summary again.
        </p>
      </>
    ),
    visual: <InformationFilter />,
    continueLabel: "See what he kept",
  },
  {
    id: "tomorrow",
    title: "For tomorrow",
    moment: "Kitchen table · 9:04 PM",
    body: (
      <>
        <p>
          Marcus and his wife wrote down what the doctor had asked him to do next. Then they added
          three questions for the follow-up appointment.
        </p>
        <p>
          He still felt unsettled when he went to bed. But he knew what he needed to do in the
          morning, so he stopped searching for the night.
        </p>
      </>
    ),
    visual: <TomorrowNote />,
    continueLabel: "Go to the next morning",
  },
  {
    id: "morning",
    title: "The next morning",
    moment: "Wednesday · 8:36 AM",
    body: (
      <>
        <p>
          Marcus took the note from the kitchen table when he left home. The diagnosis had not
          become simple overnight. He started with the first task on the note.
        </p>
        <p>He handled the first two tasks, then went to work with the remaining questions saved.</p>
      </>
    ),
    visual: <NextMorning />,
    continueLabel: "Finish story",
  },
] as const;

export function MarcusStoryExperience() {
  const [hydrated, setHydrated] = useState(false);
  const [current, setCurrent] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [complete, setComplete] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.body.classList.add("story-reader-active");
    const stored = readLocalStorage(STORAGE_KEY);
    const saved = parseStoryProgress(stored.value);
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
          <p>Marcus&apos;s story</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Finished
          </h1>
          <p>
            By bedtime, Marcus had found the instructions from his appointment and written down
            three questions. He could handle the prescription pickup and follow-up call the next
            morning.
          </p>
          <div className={styles.completionTakeaway}>
            <span>In short</span>
            <strong>Marcus could start with his instructions and save the other questions.</strong>
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
            Marcus is a placeholder name. This is an illustrative scenario, not one person&apos;s
            medical history or personal medical advice.
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
