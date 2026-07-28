"use client";

import { Check, ChevronRight, PhoneCall, Search, X } from "lucide-react";
import type { ReactNode } from "react";

import type { StoryInteractionType, StoryScene } from "@/features/stories/types/interactive-story";

import styles from "./story-player.module.css";

type InteractionValue = string | number | string[];

type StoryInteractionProps = {
  interactionStates: Record<string, InteractionValue>;
  meaningfulChoice: string | null;
  onMeaningfulChoice: (choice: string) => void;
  onStateChange: (key: string, value: InteractionValue) => void;
  scene: StoryScene;
};

const termExplanations = {
  Diabetes: "This was the only word that stayed with him.",
  A1C: "He heard the term, but did not yet understand it.",
  "Follow-up appointment": "This would later become his first clear next step.",
} as const;

const drafts = [
  "Everything is fine.",
  "The doctor found something.",
  "I have diabetes.",
  "",
] as const;

const dialogue = [
  "What did the doctor tell you to do tonight?",
  "Nothing tonight, really.",
  "Then come home. We’ll start there.",
] as const;

const browserTabs = [
  "Diabetes complications",
  "Foods to avoid",
  "Is Type 2 diabetes reversible?",
  "A1C 9.2",
  "Best diabetes diet",
  "What happens next?",
] as const;

const decisionChoices = [
  {
    id: "keep-searching",
    label: "Keep opening tabs until he understands every possible outcome",
    consequence:
      "More information appears, but Marcus still does not know which details apply to him.",
  },
  {
    id: "write-question",
    label: "Close the tabs and write down one question for his healthcare team",
    consequence:
      "The problem becomes smaller. Marcus now has one question he can bring to someone who understands his results.",
  },
  {
    id: "ignore",
    label: "Ignore the diagnosis completely until his next appointment",
    consequence: "The fear becomes quieter temporarily, but Marcus still lacks a clear next step.",
  },
  {
    id: "share-results",
    label: "Send the search results to everyone in his family",
    consequence:
      "Marcus receives several conflicting opinions, adding more noise before he understands his own care plan.",
  },
] as const;

const questionCards = [
  "What does this diagnosis mean for me?",
  "What should I do first?",
  "Can I still live a normal life?",
] as const;

const nextSteps = [
  "Write down one question",
  "Review my care instructions",
  "Contact my healthcare team",
  "Talk with someone I trust",
  "I am still figuring that out",
] as const;

function TermFocus({
  onStateChange,
  scene,
  selected,
}: {
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
  selected: string;
}) {
  return (
    <div className={styles.termFocus}>
      <div className={styles.resultHeader}>
        <span>Visit results</span>
        <span>Today</span>
      </div>
      <p>Select a term to focus the page.</p>
      <div aria-label="Terms Marcus heard" className={styles.termList}>
        {Object.keys(termExplanations).map((term) => (
          <button
            aria-pressed={selected === term}
            key={term}
            onClick={() => onStateChange(scene.id, term)}
            type="button"
          >
            <span>{term}</span>
            <ChevronRight aria-hidden="true" size={17} />
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.interactionReveal}>
        {selected ? (
          <>
            <strong>{selected}</strong>
            <span>{termExplanations[selected as keyof typeof termExplanations]}</span>
          </>
        ) : (
          <span>The words are still here when you are ready.</span>
        )}
      </div>
    </div>
  );
}

function PhoneDrafts({
  draftIndex,
  onStateChange,
  scene,
}: {
  draftIndex: number;
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
}) {
  const safeIndex = Math.max(0, Math.min(drafts.length - 1, draftIndex));
  return (
    <div className={styles.phoneDraft}>
      <div className={styles.phoneTop}>
        <span>Wife</span>
        <small>Message draft</small>
      </div>
      <p className={styles.incomingMessage}>How did the appointment go?</p>
      <div aria-live="polite" className={styles.draftField} key={safeIndex}>
        {drafts[safeIndex] || <span>Empty draft</span>}
      </div>
      <div className={styles.draftControls}>
        <button
          disabled={safeIndex === 0}
          onClick={() => onStateChange(scene.id, safeIndex - 1)}
          type="button"
        >
          Previous draft
        </button>
        <button
          disabled={safeIndex === drafts.length - 1}
          onClick={() => onStateChange(scene.id, safeIndex + 1)}
          type="button"
        >
          {safeIndex === drafts.length - 2 ? "Erase draft" : "Try another draft"}
        </button>
      </div>
    </div>
  );
}

function FactVersusStory({
  onStateChange,
  scene,
  selected,
}: {
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
  selected: string;
}) {
  return (
    <div className={styles.comparison}>
      <div aria-label="Compare what happened with Marcus's interpretation" role="group">
        <button
          aria-pressed={selected !== "story"}
          onClick={() => onStateChange(scene.id, "event")}
          type="button"
        >
          What happened
        </button>
        <button
          aria-pressed={selected === "story"}
          onClick={() => onStateChange(scene.id, "story")}
          type="button"
        >
          What Marcus told himself
        </button>
      </div>
      <div aria-live="polite" className={styles.comparisonText}>
        {selected === "story" ? (
          <>
            <X aria-hidden="true" />
            <p>Every meal, missed appointment, and decision had led to this moment.</p>
          </>
        ) : (
          <>
            <Check aria-hidden="true" />
            <p>Marcus received new information about his health.</p>
          </>
        )}
      </div>
      <small>
        An event and the self-blaming story attached to it are not the same thing. Type 2 diabetes
        is not caused by one meal or one decision.
      </small>
    </div>
  );
}

function PhoneDialogue({
  lineCount,
  onStateChange,
  scene,
}: {
  lineCount: number;
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
}) {
  const safeCount = Math.max(0, Math.min(dialogue.length, lineCount));
  return (
    <div className={styles.dialogue}>
      <div className={styles.callStatus}>
        <PhoneCall aria-hidden="true" size={18} />
        <span>Call connected</span>
      </div>
      <div aria-live="polite" className={styles.dialogueLines}>
        {dialogue.slice(0, safeCount).map((line, index) => (
          <p className={index === 1 ? styles.marcusLine : ""} key={line}>
            <small>{index === 1 ? "Marcus" : "His wife"}</small>
            {line}
          </p>
        ))}
        {safeCount === 0 ? <span>The line is quiet.</span> : null}
      </div>
      {safeCount < dialogue.length ? (
        <button onClick={() => onStateChange(scene.id, safeCount + 1)} type="button">
          Reveal the next line
        </button>
      ) : (
        <div className={styles.questionChanged}>
          <span>One question changed the size of the problem:</span>
          <strong>What needs to happen next?</strong>
        </div>
      )}
    </div>
  );
}

function MeaningfulChoice({
  meaningfulChoice,
  onMeaningfulChoice,
}: {
  meaningfulChoice: string | null;
  onMeaningfulChoice: (choice: string) => void;
}) {
  const selected = decisionChoices.find((choice) => choice.id === meaningfulChoice);
  return (
    <div className={styles.decision}>
      <div aria-label="Open browser tabs" className={styles.browserTabs}>
        <Search aria-hidden="true" size={18} />
        {browserTabs.map((tab) => (
          <span key={tab}>{tab}</span>
        ))}
      </div>
      <fieldset>
        <legend>
          Marcus feels more overwhelmed with every tab he opens. What could he do next?
        </legend>
        {decisionChoices.map((choice, index) => (
          <label key={choice.id}>
            <input
              checked={meaningfulChoice === choice.id}
              name="marcus-next-choice"
              onChange={() => onMeaningfulChoice(choice.id)}
              type="radio"
              value={choice.id}
            />
            <span>
              <small>{String.fromCharCode(65 + index)}</small>
              {choice.label}
            </span>
          </label>
        ))}
      </fieldset>
      {selected ? (
        <div aria-live="polite" className={styles.choiceConsequence}>
          <p>{selected.consequence}</p>
          <strong>Marcus chose to close the tabs and write down his questions.</strong>
          <span>
            Searching for health information is not wrong. Marcus needed information connected to
            his own results and professional guidance.
          </span>
        </div>
      ) : null}
    </div>
  );
}

function QuestionCards({
  interactionStates,
  onStateChange,
  scene,
}: {
  interactionStates: StoryInteractionProps["interactionStates"];
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
}) {
  const openKey = `${scene.id}:opened`;
  const nextKey = `${scene.id}:next`;
  const opened = Array.isArray(interactionStates[openKey])
    ? (interactionStates[openKey] as string[])
    : [];
  const selectedNext =
    typeof interactionStates[nextKey] === "string" ? interactionStates[nextKey] : "";

  const toggleQuestion = (question: string) => {
    const next = opened.includes(question)
      ? opened.filter((item) => item !== question)
      : [...opened, question];
    onStateChange(openKey, next);
  };

  return (
    <div className={styles.questionInteraction}>
      <div className={styles.foldedQuestions}>
        {questionCards.map((question, index) => (
          <button
            aria-expanded={opened.includes(question)}
            key={question}
            onClick={() => toggleQuestion(question)}
            type="button"
          >
            <span>Question {index + 1}</span>
            <strong>{opened.includes(question) ? question : "Open the folded note"}</strong>
          </button>
        ))}
      </div>
      {opened.length === questionCards.length ? (
        <p className={styles.allQuestionsOpen}>
          Marcus did not need a complete diabetes plan that night. He needed one clear next step and
          questions he could bring to someone qualified to help him.
        </p>
      ) : null}
      <fieldset className={styles.nextStepChoices}>
        <legend>What might your next manageable step be?</legend>
        {nextSteps.map((step) => (
          <label key={step}>
            <input
              checked={selectedNext === step}
              name="manageable-next-step"
              onChange={() => onStateChange(nextKey, step)}
              type="radio"
            />
            <span>{step}</span>
          </label>
        ))}
      </fieldset>
      <small>Your response is not scored or saved as medical data.</small>
    </div>
  );
}

export function StoryInteraction({
  interactionStates,
  meaningfulChoice,
  onMeaningfulChoice,
  onStateChange,
  scene,
}: StoryInteractionProps) {
  const value = interactionStates[scene.id];

  const renderers: Record<StoryInteractionType, () => ReactNode> = {
    "term-focus": () => (
      <TermFocus
        onStateChange={onStateChange}
        scene={scene}
        selected={typeof value === "string" ? value : ""}
      />
    ),
    "phone-drafts": () => (
      <PhoneDrafts
        draftIndex={typeof value === "number" ? value : 0}
        onStateChange={onStateChange}
        scene={scene}
      />
    ),
    "fact-vs-story": () => (
      <FactVersusStory
        onStateChange={onStateChange}
        scene={scene}
        selected={typeof value === "string" ? value : "event"}
      />
    ),
    "phone-dialogue": () => (
      <PhoneDialogue
        lineCount={typeof value === "number" ? value : 0}
        onStateChange={onStateChange}
        scene={scene}
      />
    ),
    "meaningful-choice": () => (
      <MeaningfulChoice
        meaningfulChoice={meaningfulChoice}
        onMeaningfulChoice={onMeaningfulChoice}
      />
    ),
    "question-cards": () => (
      <QuestionCards
        interactionStates={interactionStates}
        onStateChange={onStateChange}
        scene={scene}
      />
    ),
  };

  return renderers[scene.interactionType]();
}
