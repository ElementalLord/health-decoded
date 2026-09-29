"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  Clock3,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { caregiverModule1 } from "../../../content/caregiver-module-1";
import { caregiverModuleRegistry } from "../../../content/caregiver-module-registry";
import { isCaregiverModuleComplete } from "../../../lib/caregiver-completion";
import { useCaregiverSession } from "../../../state/caregiver-session-provider";
import styles from "../../../styles/caregiver-module-1-story.module.css";

const SCENE_COUNT = 14;

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ModuleProgressHeader({ current }: { readonly current: number }) {
  return (
    <header className={styles.readerHeader}>
      <div className={styles.readerIdentity}>
        <span>Caregiver module 1</span>
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

function MessageThread() {
  const [called, setCalled] = useState(false);

  return (
    <section className={styles.phoneThread} aria-label="Messages between Jules and Mira">
      <div className={styles.messageOutgoing}>
        <span>Jules · 5:08 PM</span>
        <p>How are you feeling? Did you figure everything out?</p>
      </div>
      <div className={styles.messageIncoming}>
        <span>Mira · 8:17 PM</span>
        <p>Busy. Can we not do diabetes tonight?</p>
      </div>
      <button aria-pressed={called} onClick={() => setCalled(true)} type="button">
        {called ? "Call sent · no answer" : "See what Jules does next"}
      </button>
      {called ? (
        <p className={styles.threadNote} role="status">
          He calls. Mira does not answer.
        </p>
      ) : null}
    </section>
  );
}

const knownUnknown = {
  known: {
    label: "Known",
    heading: "What Jules can verify",
    items: ["Mira replied after three hours", "She said she was busy", "She said not tonight"],
  },
  unknown: {
    label: "Unknown",
    heading: "What the message cannot tell him",
    items: ["Why she replied late", "How she feels", "Whether she wants help later"],
  },
} as const;

function KnownUnknownDiagram() {
  const [view, setView] = useState<keyof typeof knownUnknown>("known");
  const detail = knownUnknown[view];

  return (
    <section className={styles.knownUnknown} aria-labelledby="known-unknown-heading">
      <div className={styles.switchTabs} role="tablist" aria-label="Compare known and unknown">
        {(Object.keys(knownUnknown) as Array<keyof typeof knownUnknown>).map((key) => (
          <button
            aria-selected={view === key}
            key={key}
            onClick={() => setView(key)}
            role="tab"
            type="button"
          >
            {knownUnknown[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.knownPanel} role="tabpanel">
        <h3 id="known-unknown-heading">{detail.heading}</h3>
        <ul>
          {detail.items.map((item) => (
            <li key={item}>
              <span aria-hidden="true">{view === "known" ? "✓" : "?"}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const thoughtSteps = {
  message: {
    label: "Message",
    title: "Not tonight",
    copy: "This is the last point the message confirms.",
  },
  guess: {
    label: "Guess",
    title: "She is scared or angry",
    copy: "Either could be true. Neither is confirmed.",
  },
  action: {
    label: "Action",
    title: "Call anyway",
    copy: "The guess now changes what Jules does.",
  },
} as const;

function ThoughtPath() {
  const [step, setStep] = useState<keyof typeof thoughtSteps>("message");
  const detail = thoughtSteps[step];

  return (
    <section className={styles.thoughtPath} aria-labelledby="thought-path-heading">
      <div className={styles.pathButtons} role="tablist" aria-label="Follow Jules's thought path">
        {(Object.keys(thoughtSteps) as Array<keyof typeof thoughtSteps>).map((key, index) => (
          <button
            aria-selected={step === key}
            key={key}
            onClick={() => setStep(key)}
            role="tab"
            type="button"
          >
            <span>{index + 1}</span>
            {thoughtSteps[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.thoughtPanel} role="tabpanel">
        <span>{detail.label}</span>
        <h3 id="thought-path-heading">{detail.title}</h3>
        <p>{detail.copy}</p>
      </div>
    </section>
  );
}

type ObservationGroup = (typeof caregiverModule1.interactions.observation.groups)[number];

function FactOrGuess({ onComplete }: { readonly onComplete: () => void }) {
  const statements = caregiverModule1.interactions.observation.statements;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ObservationGroup>>({});
  const statement = statements[index]!;
  const answer = answers[statement.id];
  const accurate = answer === statement.preferredGroup;
  const completed = Object.keys(answers).length === statements.length;

  function choose(group: ObservationGroup) {
    const next = { ...answers, [statement.id]: group };
    setAnswers(next);
    if (Object.keys(next).length === statements.length) onComplete();
  }

  return (
    <section className={styles.sorter} aria-labelledby="sorter-heading">
      <div className={styles.sorterTop}>
        <span>
          Statement {index + 1} of {statements.length}
        </span>
        <div aria-hidden="true">
          {statements.map((item) => (
            <i data-complete={answers[item.id] ? "true" : undefined} key={item.id} />
          ))}
        </div>
      </div>
      <h3 id="sorter-heading">{statement.copy}</h3>
      <div className={styles.sortChoices} role="radiogroup" aria-label="Classify this statement">
        {caregiverModule1.interactions.observation.groups.map((group) => (
          <button
            aria-checked={answer === group}
            className={answer === group ? styles.choiceSelected : undefined}
            key={group}
            onClick={() => choose(group)}
            role="radio"
            type="button"
          >
            <span>{group === "Observed" ? "Fact" : "Possible explanation"}</span>
            {answer === group ? <Check aria-hidden="true" size={18} /> : null}
          </button>
        ))}
      </div>
      {answer ? (
        <p aria-live="polite" className={styles.sortFeedback}>
          <strong>{accurate ? "Yes." : "Look again."}</strong>{" "}
          {statement.preferredGroup === "Observed"
            ? "This can be verified from the exchange."
            : "This assigns a reason the exchange does not confirm."}
        </p>
      ) : null}
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        {index < statements.length - 1 ? (
          <button disabled={!answer} onClick={() => setIndex(index + 1)} type="button">
            Next statement
          </button>
        ) : (
          <span>{completed ? "All six reviewed" : "Choose an answer"}</span>
        )}
      </div>
    </section>
  );
}

const reasons = {
  tired: { label: "Tired", copy: "She may not have energy for another health conversation." },
  normal: { label: "Normal evening", copy: "She may want one evening that is not about diabetes." },
  work: { label: "Work stress", copy: "The late reply may have nothing to do with health." },
  private: { label: "Privacy", copy: "She may want to decide when and how she shares." },
  unsure: { label: "Unsure", copy: "She may still be working out what she thinks." },
  other: { label: "Something else", copy: "The real reason may not be on this screen." },
} as const;

function ReasonMap() {
  const [reason, setReason] = useState<keyof typeof reasons>("normal");
  const detail = reasons[reason];

  return (
    <section className={styles.reasonMap} aria-labelledby="reason-heading">
      <div className={styles.reasonCloud} role="tablist" aria-label="Possible explanations">
        {(Object.keys(reasons) as Array<keyof typeof reasons>).map((key) => (
          <button
            aria-selected={reason === key}
            key={key}
            onClick={() => setReason(key)}
            role="tab"
            type="button"
          >
            {reasons[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.reasonPanel} role="tabpanel">
        <span>Possible, not proven</span>
        <h3 id="reason-heading">{detail.label}</h3>
        <p>{detail.copy}</p>
      </div>
    </section>
  );
}

function TimingDecision() {
  const moments = caregiverModule1.interactions.timing.moments;
  const [momentIndex, setMomentIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const moment = moments[momentIndex]!;
  const choice = moment.choices.find((item) => item.id === answer);

  function changeMoment(next: number) {
    setMomentIndex(next);
    setAnswer(null);
  }

  return (
    <section className={styles.timing} aria-labelledby="timing-heading">
      <div className={styles.timelineTabs} role="tablist" aria-label="Choose a moment">
        {moments.map((item, index) => (
          <button
            aria-selected={momentIndex === index}
            key={item.id}
            onClick={() => changeMoment(index)}
            role="tab"
            type="button"
          >
            <span>{index + 1}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.timingPanel} role="tabpanel">
        <h3 id="timing-heading">What should Jules do?</h3>
        <div className={styles.compactChoices} role="radiogroup" aria-label={moment.label}>
          {moment.choices.map((item) => (
            <button
              aria-checked={answer === item.id}
              key={item.id}
              onClick={() => setAnswer(item.id)}
              role="radio"
              type="button"
            >
              {item.copy}
            </button>
          ))}
        </div>
        {choice ? (
          <p aria-live="polite" className={styles.inlineFeedback}>
            <strong>
              {answer === moment.preferred ? "This leaves room." : "This adds pressure."}
            </strong>{" "}
            {choice.feedback}
          </p>
        ) : null}
      </div>
    </section>
  );
}

const readinessMoments = {
  morning: { label: "Morning", wants: "Talk for ten minutes", notNow: "Solve the whole problem" },
  workday: { label: "At work", wants: "Help with one task", notNow: "Discuss feelings" },
  weekend: { label: "Weekend", wants: "Ordinary company", notNow: "Health reminders" },
} as const;

function ReadinessView() {
  const [moment, setMoment] = useState<keyof typeof readinessMoments>("morning");
  const detail = readinessMoments[moment];

  return (
    <section className={styles.readiness} aria-labelledby="readiness-heading">
      <div className={styles.switchTabs} role="tablist" aria-label="Change the moment">
        {(Object.keys(readinessMoments) as Array<keyof typeof readinessMoments>).map((key) => (
          <button
            aria-selected={moment === key}
            key={key}
            onClick={() => setMoment(key)}
            role="tab"
            type="button"
          >
            {readinessMoments[key].label}
          </button>
        ))}
      </div>
      <div className={styles.readinessPair}>
        <div>
          <span>Could want</span>
          <strong id="readiness-heading">{detail.wants}</strong>
        </div>
        <div>
          <span>Could decline</span>
          <strong>{detail.notNow}</strong>
        </div>
      </div>
    </section>
  );
}

const supportModes = {
  listen: {
    label: "Listen",
    copy: "Stay with what they said before offering ideas.",
    phrase: "Do you want to keep talking?",
  },
  help: {
    label: "Help",
    copy: "Agree on one specific task instead of taking over.",
    phrase: "Would one call or errand help?",
  },
  pause: {
    label: "Pause",
    copy: "Accept the limit without asking for reassurance.",
    phrase: "Okay. I will leave it here.",
  },
} as const;

function SupportModePicker() {
  const [mode, setMode] = useState<keyof typeof supportModes>("listen");
  const detail = supportModes[mode];

  return (
    <section className={styles.modePicker} aria-labelledby="support-mode-heading">
      <div className={styles.modeButtons} role="tablist" aria-label="Choose a support mode">
        {(Object.keys(supportModes) as Array<keyof typeof supportModes>).map((key) => (
          <button
            aria-selected={mode === key}
            key={key}
            onClick={() => setMode(key)}
            role="tab"
            type="button"
          >
            {supportModes[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.modePanel} role="tabpanel">
        <h3 id="support-mode-heading">{detail.copy}</h3>
        <blockquote>“{detail.phrase}”</blockquote>
      </div>
    </section>
  );
}

function ReplyBuilder() {
  const interaction = caregiverModule1.interactions.response;
  const [opening, setOpening] = useState<(typeof interaction.openings)[number]["id"] | null>(null);
  const [followup, setFollowup] = useState<(typeof interaction.followups)[number]["id"] | null>(
    null,
  );
  const openingCopy = interaction.openings.find((item) => item.id === opening)?.copy;
  const followupCopy = interaction.followups.find((item) => item.id === followup)?.copy;
  const preferred =
    opening === interaction.preferred.opening && followup === interaction.preferred.followup;

  return (
    <section className={styles.replyBuilder} aria-labelledby="reply-heading">
      <blockquote className={styles.friendMessage}>
        “I spent my lunch break on insurance calls. I do not want advice.”
      </blockquote>
      <div className={styles.replyControls}>
        <fieldset>
          <legend>Start with</legend>
          {interaction.openings.map((item) => (
            <button
              aria-pressed={opening === item.id}
              key={item.id}
              onClick={() => setOpening(item.id)}
              type="button"
            >
              {item.copy}
            </button>
          ))}
        </fieldset>
        <fieldset>
          <legend>Then</legend>
          {interaction.followups.map((item) => (
            <button
              aria-pressed={followup === item.id}
              key={item.id}
              onClick={() => setFollowup(item.id)}
              type="button"
            >
              {item.copy}
            </button>
          ))}
        </fieldset>
      </div>
      <div aria-live="polite" className={styles.builtReply}>
        <span>Your reply</span>
        <h3 id="reply-heading">
          {openingCopy && followupCopy
            ? `“${openingCopy.replace(/[.!?]$/, "")}. ${followupCopy}”`
            : "Choose one opening and one follow-up."}
        </h3>
        {openingCopy && followupCopy ? (
          <p>
            {preferred
              ? "This listens and leaves a choice."
              : "This changes what the person asked for."}
          </p>
        ) : null}
      </div>
    </section>
  );
}

const returnSteps = [
  { label: "Talk normally", copy: "Let the relationship be about more than health." },
  { label: "Ask first", copy: "Would you rather leave it alone, or is there a better time?" },
  { label: "Accept no", copy: "Okay. I will not keep asking." },
] as const;

function ReturnLaterPath() {
  const [step, setStep] = useState(0);
  const detail = returnSteps[step]!;

  return (
    <section className={styles.returnPath} aria-labelledby="return-heading">
      <div className={styles.returnSteps} role="tablist" aria-label="Steps for returning later">
        {returnSteps.map((item, index) => (
          <button
            aria-selected={step === index}
            key={item.label}
            onClick={() => setStep(index)}
            role="tab"
            type="button"
          >
            <span>{index + 1}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.returnPanel} role="tabpanel">
        <span>Step {step + 1}</span>
        <h3 id="return-heading">{detail.label}</h3>
        <p>{detail.copy}</p>
      </div>
    </section>
  );
}

const steadyChoices = {
  call: {
    label: "Call again tonight",
    result: "This repeats the question after a clear no.",
    preferred: false,
  },
  relative: {
    label: "Ask a relative for an update",
    result: "This goes around the person instead of respecting their privacy.",
    preferred: false,
  },
  offer: {
    label: "Send one specific offer",
    result: "This keeps help available without requesting an update.",
    preferred: true,
  },
} as const;

function SteadySupportChoice() {
  const [choice, setChoice] = useState<keyof typeof steadyChoices | null>(null);
  const detail = choice ? steadyChoices[choice] : null;

  return (
    <section className={styles.steadySupport} aria-labelledby="steady-heading">
      <div className={styles.steadyChoices} role="radiogroup" aria-label="Choose the next action">
        {(Object.keys(steadyChoices) as Array<keyof typeof steadyChoices>).map((key) => (
          <button
            aria-checked={choice === key}
            key={key}
            onClick={() => setChoice(key)}
            role="radio"
            type="button"
          >
            {steadyChoices[key].label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.steadyPanel}>
        <span>What it communicates</span>
        <h3 id="steady-heading">
          {detail
            ? detail.preferred
              ? "Available, without pressure"
              : "Concern becomes pressure"
            : "Choose an action"}
        </h3>
        {detail ? <p>{detail.result}</p> : <p>Compare what each action asks from Mira.</p>}
      </div>
    </section>
  );
}

function QuickCheck() {
  const questions = caregiverModule1.questions;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { setKeyIdeaUnderstood } = useCaregiverSession();
  const question = questions[index]!;
  const answer = answers[question.id];

  function choose(choiceIndex: number) {
    const next = { ...answers, [question.id]: choiceIndex };
    setAnswers(next);
    if (Object.keys(next).length === questions.length) {
      setKeyIdeaUnderstood(questions.every((item) => next[item.id] === item.preferredIndex));
    }
  }

  return (
    <section className={styles.quickCheck} aria-labelledby="check-heading">
      <div className={styles.checkCount}>
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <div aria-hidden="true">
          {questions.map((item) => (
            <i data-complete={answers[item.id] !== undefined ? "true" : undefined} key={item.id} />
          ))}
        </div>
      </div>
      <h3 id="check-heading">{question.question}</h3>
      <div className={styles.checkChoices} role="radiogroup" aria-label="Choose an answer">
        {question.choices.map((choice, choiceIndex) => (
          <button
            aria-checked={answer === choiceIndex}
            key={choice}
            onClick={() => choose(choiceIndex)}
            role="radio"
            type="button"
          >
            {choice}
          </button>
        ))}
      </div>
      {answer !== undefined ? (
        <p aria-live="polite" className={styles.inlineFeedback}>
          <strong>
            {answer === question.preferredIndex ? "Yes." : "Try the option with fewer assumptions."}
          </strong>{" "}
          {question.explanation}
        </p>
      ) : null}
      <div className={styles.miniNavigation}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        {index < questions.length - 1 ? (
          <button disabled={answer === undefined} onClick={() => setIndex(index + 1)} type="button">
            Next question
          </button>
        ) : (
          <span>
            {Object.keys(answers).length === questions.length
              ? "Check complete"
              : "Choose an answer"}
          </span>
        )}
      </div>
    </section>
  );
}

function PhraseBrowser() {
  const [index, setIndex] = useState(0);
  const phrase = caregiverModule1.scripts[index]!;

  return (
    <section className={styles.phraseBrowser} aria-labelledby="phrase-heading">
      <div className={styles.phraseCard} aria-live="polite">
        <span>{phrase.label}</span>
        <h3 id="phrase-heading">{phrase.copy}</h3>
      </div>
      <div className={styles.phraseControls}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Previous
        </button>
        <span>
          {index + 1} of {caregiverModule1.scripts.length}
        </span>
        <button
          disabled={index === caregiverModule1.scripts.length - 1}
          onClick={() => setIndex(index + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
}

function TakeawayDiagram() {
  return (
    <ol className={styles.takeawayDiagram} aria-label="Three steps to remember">
      <li>
        <span>1</span>
        <div>
          <strong>Notice</strong>
          <small>What happened?</small>
        </div>
      </li>
      <li>
        <span>2</span>
        <div>
          <strong>Leave open</strong>
          <small>Why did it happen?</small>
        </div>
      </li>
      <li>
        <span>3</span>
        <div>
          <strong>Ask</strong>
          <small>What would help?</small>
        </div>
      </li>
    </ol>
  );
}

interface Scene {
  readonly id: string;
  readonly title: string;
  readonly moment: string;
  readonly body: ReactNode;
  readonly visual: ReactNode;
  readonly continueLabel: string;
}

export function Module1Experience() {
  const { progress, markCentralIdeaReached, markInteractionSubmitted, markTakeawayViewed } =
    useCaregiverSession();
  const [current, setCurrent] = useState(0);
  const [complete, setComplete] = useState(false);
  const [coreComplete, setCoreComplete] = useState(progress.coreApplicationCompleted);
  const articleRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const completed = isCaregiverModuleComplete(progress);

  useEffect(() => {
    if (current === 1) markCentralIdeaReached();
    if (current === SCENE_COUNT - 1) markTakeawayViewed();
  }, [current, markCentralIdeaReached, markTakeawayViewed]);

  function finishCorePractice() {
    setCoreComplete(true);
    markInteractionSubmitted(caregiverModule1.interactions.observation.id);
  }

  const scenes: readonly Scene[] = [
    {
      id: "not-tonight",
      moment: "Tuesday · 8:17 PM",
      title: "Mira says not tonight.",
      body: <p>Jules has checked in every evening since Mira mentioned a new medication.</p>,
      visual: <MessageThread />,
      continueLabel: "Separate facts from guesses",
    },
    {
      id: "known-unknown",
      moment: "Start with what is visible",
      title: "A message gives facts, not motives.",
      body: <p>Jules can notice the change without deciding what caused it.</p>,
      visual: <KnownUnknownDiagram />,
      continueLabel: "Follow Jules’s thought",
    },
    {
      id: "thought-path",
      moment: "Message → guess → action",
      title: "The guess changes his next move.",
      body: <p>Concern is real. The explanation is still uncertain.</p>,
      visual: <ThoughtPath />,
      continueLabel: "Practice the distinction",
    },
    {
      id: "fact-or-guess",
      moment: "Six quick statements",
      title: "Fact or possible explanation?",
      body: <p>Classify each statement before moving on.</p>,
      visual: <FactOrGuess onComplete={finishCorePractice} />,
      continueLabel: coreComplete ? "See other possibilities" : "Complete all six",
    },
    {
      id: "other-reasons",
      moment: "One reply · several possibilities",
      title: "More than one reason can fit.",
      body: <p>Tap each option. None of them is a diagnosis.</p>,
      visual: <ReasonMap />,
      continueLabel: "Check the timing",
    },
    {
      id: "timing",
      moment: "Tonight · workday · weekend",
      title: "Timing changes what helps.",
      body: <p>Choose an action for each moment.</p>,
      visual: <TimingDecision />,
      continueLabel: "Look at readiness",
    },
    {
      id: "readiness",
      moment: "Preferences can change",
      title: "Yes to support does not mean yes to everything.",
      body: <p>A person can want contact and still set a limit.</p>,
      visual: <ReadinessView />,
      continueLabel: "Choose a support mode",
    },
    {
      id: "support-mode",
      moment: "Listen · help · pause",
      title: "Ask what kind of support fits.",
      body: <p>The answer can be different each time.</p>,
      visual: <SupportModePicker />,
      continueLabel: "Build a reply",
    },
    {
      id: "reply",
      moment: "A friend asks for no advice",
      title: "Respond without taking over.",
      body: <p>Combine an opening and a follow-up.</p>,
      visual: <ReplyBuilder />,
      continueLabel: "Return to Mira and Jules",
    },
    {
      id: "return-later",
      moment: "After the pause",
      title: "Ask before bringing it back.",
      body: <p>A normal conversation can stay normal.</p>,
      visual: <ReturnLaterPath />,
      continueLabel: "Stay available",
    },
    {
      id: "steady-support",
      moment: "Care without another update",
      title: "Respecting no is still care.",
      body: <p>Choose the action that asks the least from Mira.</p>,
      visual: <SteadySupportChoice />,
      continueLabel: "Check your understanding",
    },
    {
      id: "quick-check",
      moment: "Three short situations",
      title: "Choose the careful first step.",
      body: <p>Look for the option with the fewest assumptions.</p>,
      visual: <QuickCheck />,
      continueLabel: "Browse useful phrases",
    },
    {
      id: "phrases",
      moment: "Language to borrow",
      title: "Use the sentence that fits.",
      body: <p>You do not need to memorize the wording.</p>,
      visual: <PhraseBrowser />,
      continueLabel: "See the takeaway",
    },
    {
      id: "takeaway",
      moment: "Before you decide what it means",
      title: "Notice. Leave open. Ask.",
      body: <p>If they say not now, stop and stay available.</p>,
      visual: <TakeawayDiagram />,
      continueLabel: "Finish module",
    },
  ];

  const scene = scenes[current]!;
  const nextDisabled = current === 3 && !coreComplete;

  function goTo(next: number) {
    if (next < 0 || next >= SCENE_COUNT) return;
    setCurrent(next);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function finish() {
    markTakeawayViewed();
    setComplete(true);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({
        behavior: shouldReduceMotion() ? "auto" : "smooth",
        block: "start",
      });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function restart() {
    setCurrent(0);
    setComplete(false);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function reviewPractice() {
    setCurrent(3);
    setComplete(false);
    window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  return (
    <main className={styles.page} data-caregiver-module={caregiverModule1.id}>
      <Link className={styles.backLink} href="/caregiver">
        <ArrowLeft aria-hidden="true" size={17} /> Caregiver modules
      </Link>
      {complete ? (
        <article className={styles.completion} ref={articleRef}>
          <p>Caregiver module 1</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Finished
          </h1>
          <p>A short reply can tell you what happened. It cannot tell you why.</p>
          <div className={styles.completionTakeaway}>
            <span>In short</span>
            <strong>
              Notice the fact, leave the reason open, and ask what kind of support fits.
            </strong>
          </div>
          {!completed ? (
            <div className={styles.incompleteNote} role="status">
              <strong>One practice is still open.</strong>
              <p>Complete all six fact-or-guess statements to finish the module.</p>
              <button onClick={reviewPractice} type="button">
                Review fact or guess
              </button>
            </div>
          ) : null}
          <div className={styles.completionActions}>
            <Link
              className={styles.primaryAction}
              href={caregiverModuleRegistry["support-without-taking-over"].route}
            >
              Continue to module 2
            </Link>
            <button className={styles.secondaryAction} onClick={restart} type="button">
              <RotateCcw aria-hidden="true" size={16} /> Review again
            </button>
            <Link className={styles.secondaryAction} href="/caregiver">
              Back to caregiver modules
            </Link>
          </div>
          <p className={styles.disclosure}>
            Mira and Jules are illustrative characters. This module supports communication skills;
            it does not explain another person’s feelings or replace medical guidance.
          </p>
        </article>
      ) : (
        <article className={styles.reader} ref={articleRef}>
          <ModuleProgressHeader current={current} />
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
          {nextDisabled ? (
            <p className={styles.gateNote} id="module-1-next-requirement" role="status">
              Complete all six statements above to continue.
            </p>
          ) : null}
          <nav aria-label="Module navigation" className={styles.navigation}>
            {current > 0 ? (
              <button className={styles.previous} onClick={() => goTo(current - 1)} type="button">
                <ChevronLeft aria-hidden="true" size={18} /> Back
              </button>
            ) : (
              <span />
            )}
            <button
              aria-describedby={nextDisabled ? "module-1-next-requirement" : undefined}
              className={styles.next}
              disabled={nextDisabled}
              onClick={() => (current === SCENE_COUNT - 1 ? finish() : goTo(current + 1))}
              type="button"
            >
              {scene.continueLabel}{" "}
              {nextDisabled ? (
                <LockKeyhole aria-hidden="true" size={17} />
              ) : (
                <ArrowRight aria-hidden="true" size={18} />
              )}
            </button>
          </nav>
        </article>
      )}
    </main>
  );
}
