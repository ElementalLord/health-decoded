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
  "Act on tonight":
    "Put the visit papers somewhere easy to find and check whether any written instruction is time-sensitive.",
  "Ask at follow-up":
    "Which result led to this diagnosis, and what would the clinician like Marcus to understand about it first?",
  "Let wait":
    "Predicting every future treatment or rebuilding an entire routine before Marcus understands his own care plan.",
} as const;

const drafts = [
  "I do not need advice yet. Could you listen for five minutes?",
  "Could you sit with me while I read the visit summary once?",
  "Can you help me remember to call the clinic tomorrow?",
  "I want company while I settle down. We can talk about plans later.",
] as const;

const dialogue = [
  "Would listening, company, or practical help feel best right now?",
  "Listening. I need to say it out loud before we solve anything.",
  "Okay. I’m here. We can choose one task after you feel heard.",
] as const;

const browserTabs = [
  "After-visit instructions",
  "Clinic contact page",
  "National health organization",
  "Anonymous discussion thread",
  "Supplement advertisement",
  "Breaking-news headline",
] as const;

const decisionChoices = [
  {
    id: "visit-summary",
    label: "Use the after-visit instructions to check what the clinic actually asked him to do",
    consequence:
      "This source is connected to Marcus’s visit and can help separate an assigned next step from general information.",
  },
  {
    id: "health-organization",
    label: "Use a national health organization to learn one unfamiliar term",
    consequence:
      "A reputable explainer can add background, but it cannot interpret Marcus’s personal results or replace his clinician.",
  },
  {
    id: "discussion-thread",
    label: "Use an anonymous discussion thread to decide what treatment he will need",
    consequence:
      "Someone else’s experience may offer companionship, but it cannot determine which care plan applies to Marcus.",
  },
  {
    id: "product-ad",
    label: "Use a product advertisement that promises a fast solution",
    consequence:
      "A sales page has an interest in the decision. Strong promises are a reason to pause and check the claim with a qualified source.",
  },
] as const;

const questionCards = [
  {
    id: "bring",
    title: "Bring",
    detail: "A current medication and supplement list, the visit summary, and one main concern.",
  },
  {
    id: "during",
    title: "During the visit",
    detail:
      "Ask for the first instruction in plain language and write down who owns the next step.",
  },
  {
    id: "before-leaving",
    title: "Before leaving",
    detail:
      "Confirm who to contact if an instruction is unclear and when the next follow-up happens.",
  },
] as const;

const nextSteps = [
  "Write down one question",
  "Review my care instructions",
  "Contact my healthcare team",
  "Talk with someone I trust",
  "I am still figuring that out",
] as const;

const groceryItems = [
  {
    id: "serving-size",
    label: "Serving size",
    reaction: "The reference amount used for the numbers on the label.",
    perspective:
      "It is a comparison tool, not an instruction for how much one particular person must eat.",
  },
  {
    id: "total-carbohydrate",
    label: "Total carbohydrate",
    reaction: "A useful place to see the carbohydrate listed for one labeled serving.",
    perspective: "This number needs the serving size and the person’s usual amount for context.",
  },
  {
    id: "fiber-protein",
    label: "Fiber and protein",
    reaction: "More information about what the food contributes beyond one headline number.",
    perspective: "No single nutrient decides whether a food belongs in someone’s eating pattern.",
  },
  {
    id: "usual-amount",
    label: "Your usual amount",
    reaction:
      "The amount someone actually expects to eat, which may differ from the label reference.",
    perspective:
      "Comparing the usual amount with the serving size makes the printed numbers more meaningful.",
  },
  {
    id: "meal-context",
    label: "The rest of the meal",
    reaction: "The other foods, preparation, timing, and satisfaction that a package cannot show.",
    perspective:
      "A label describes a product. It cannot describe the full meal, culture, preferences, or personal response.",
  },
] as const;

const familyDialogueChoices = [
  {
    id: "plate-agency",
    label: "“Please let me decide what goes on my plate. Ask before offering advice.”",
    explanation:
      "This names a clear boundary while leaving room for family support that Asha actually requests.",
  },
  {
    id: "planning-help",
    label:
      "“Invite me to plan the meal with you, but please do not create a separate menu for me.”",
    explanation:
      "This makes collaboration possible without turning Asha into a guest at her own table.",
  },
  {
    id: "normal-conversation",
    label: "“Keep dinner conversation ordinary unless I choose to talk about diabetes.”",
    explanation:
      "Asha can protect a familiar family ritual while choosing when health talk feels useful.",
  },
  {
    id: "question-list",
    label:
      "“If you notice a concern, help me save it for my next appointment instead of correcting me.”",
    explanation:
      "This redirects uncertainty toward a qualified conversation without making every meal an evaluation.",
  },
] as const;

const mealComponents = [
  { id: "rice", label: "Rice" },
  { id: "dal", label: "Dal" },
  { id: "vegetables", label: "Vegetables" },
  { id: "protein", label: "Chicken" },
  { id: "flatbread", label: "Flatbread" },
  { id: "yogurt", label: "Plain yogurt" },
  { id: "water", label: "Water" },
  { id: "dessert", label: "Dessert" },
] as const;

const foodDecisionChoices = [
  {
    id: "serve-self",
    label: "Keep the dishes family-style and let Asha serve her own plate",
    consequence:
      "Asha keeps agency over her plate while the meal remains a shared family experience.",
  },
  {
    id: "one-experiment",
    label: "Choose one small meal experiment instead of creating a permanent food rule",
    consequence:
      "A small experiment can create useful experience without asking one dinner to solve everything.",
  },
  {
    id: "satisfaction-note",
    label: "Notice what feels satisfying and bring that observation to the dietitian",
    consequence:
      "Satisfaction and sustainability become information Asha can use in a qualified conversation.",
  },
  {
    id: "pause-experiment",
    label: "Keep tonight familiar and choose a lower-pressure meal for the first experiment",
    consequence:
      "Asha can choose timing as well as food. Waiting for a calmer moment is different from abandoning the question.",
  },
] as const;

const supportChoices = [
  {
    id: "neutral-language",
    label: "Use neutral words for food instead of “good” or “bad”",
    helpful: true,
  },
  { id: "rotate-planning", label: "Keep rotating who helps choose the family menu", helpful: true },
  {
    id: "agreed-check-in",
    label: "Save health questions for an agreed check-in time",
    helpful: true,
  },
  {
    id: "public-praise",
    label: "Praise or correct Asha’s plate in front of everyone",
    helpful: false,
  },
  { id: "self-service", label: "Let each person serve themselves when practical", helpful: true },
  {
    id: "secret-substitutions",
    label: "Change Asha’s ingredients without telling her",
    helpful: false,
  },
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
        <span>Information sorter</span>
        <span>One layer at a time</span>
      </div>
      <p>Choose where a thought belongs instead of asking it to become an answer tonight.</p>
      <div aria-label="Sort what needs attention now" className={styles.termList}>
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
          <span>Not every important question belongs to the same moment.</span>
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
        <span>A specific support request</span>
        <small>Practice language</small>
      </div>
      <p className={styles.incomingMessage}>
        What kind of help would make the next ten minutes easier?
      </p>
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
          Try another kind of support
        </button>
      </div>
      <small>A request can be specific without explaining the whole diagnosis.</small>
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
      <div aria-label="Compare what a diagnosis can and cannot measure" role="group">
        <button
          aria-pressed={selected !== "story"}
          onClick={() => onStateChange(scene.id, "event")}
          type="button"
        >
          What it can tell him
        </button>
        <button
          aria-pressed={selected === "story"}
          onClick={() => onStateChange(scene.id, "story")}
          type="button"
        >
          What it cannot measure
        </button>
      </div>
      <div aria-live="polite" className={styles.comparisonText}>
        {selected === "story" ? (
          <>
            <X aria-hidden="true" />
            <p>Character, effort, love for family, or whether Marcus deserves compassion.</p>
          </>
        ) : (
          <>
            <Check aria-hidden="true" />
            <p>
              A health condition may reflect biology, genetics, environment, access, time, and other
              influences worth understanding with his care team.
            </p>
          </>
        )}
      </div>
      <small>
        A diagnosis can guide care. It is not a character score and cannot summarize a person’s
        history.
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
        <span>Practice a support check-in</span>
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
          Reveal the next listening move
        </button>
      ) : (
        <div className={styles.questionChanged}>
          <span>The helper asks before solving:</span>
          <strong>Listen first. Clarify the need. Then choose one task.</strong>
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
        <legend>One question, one source: where should Marcus look first?</legend>
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
          <strong>Match the source to the job.</strong>
          <span>
            Personal instructions belong with the clinic. General education belongs with a credible
            health source. Neither advertisements nor another person’s treatment story can interpret
            Marcus’s results.
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

  const toggleQuestion = (questionId: string) => {
    const next = opened.includes(questionId)
      ? opened.filter((item) => item !== questionId)
      : [...opened, questionId];
    onStateChange(openKey, next);
  };

  return (
    <div className={styles.questionInteraction}>
      <div className={styles.foldedQuestions}>
        {questionCards.map((question, index) => (
          <button
            aria-expanded={opened.includes(question.id)}
            key={question.id}
            onClick={() => toggleQuestion(question.id)}
            type="button"
          >
            <span>
              Pocket {index + 1} · {question.title}
            </span>
            <strong>
              {opened.includes(question.id) ? question.detail : "Open the appointment pocket"}
            </strong>
          </button>
        ))}
      </div>
      {opened.length === questionCards.length ? (
        <p className={styles.allQuestionsOpen}>
          A useful appointment kit reduces the amount memory has to carry and makes the next
          conversation easier to use.
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

function GroceryFearExplorer({
  onStateChange,
  scene,
  selected,
}: {
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
  selected: string;
}) {
  const item = groceryItems.find((candidate) => candidate.id === selected);

  return (
    <div className={styles.groceryExplorer}>
      <div>
        <p className={styles.interactionKicker}>A calmer label-reading order</p>
        <h3>Choose one clue and learn what job it can—and cannot—do.</h3>
      </div>
      <div aria-label="Explore nutrition label clues" className={styles.groceryShelf}>
        {groceryItems.map((food) => (
          <button
            aria-pressed={selected === food.id}
            key={food.id}
            onClick={() => onStateChange(scene.id, food.id)}
            type="button"
          >
            <span aria-hidden="true" className={styles.foodMark} data-food={food.id} />
            {food.label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.groceryPerspective}>
        {item ? (
          <>
            <p>
              <strong>What it tells you</strong>
              {item.reaction}
            </p>
            <p>
              <strong>What it cannot decide alone</strong>
              {item.perspective}
            </p>
          </>
        ) : (
          <p>
            <strong>Start with context</strong>A package label is a tool for comparison, not a
            verdict about the person holding it.
          </p>
        )}
      </div>
    </div>
  );
}

function SeparatePlateComparison({
  onStateChange,
  scene,
  selected,
}: {
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
  selected: string;
}) {
  const state = selected === "identical" ? "identical" : "connected";

  return (
    <div className={styles.plateComparison}>
      <div className={styles.tableComparisonVisual}>
        <section>
          <p>What can stay shared</p>
          <div aria-label="Meal time, conversation, cooking, and family dishes">
            {["meal time", "conversation", "cooking", "family dishes"].map((item) => (
              <span className={styles.tableDish} key={item}>
                {item}
              </span>
            ))}
          </div>
        </section>
        <div
          aria-hidden="true"
          className={styles.tableDivider}
          data-position={state === "identical" ? "separately" : "differently"}
        />
        <section>
          <p>What can stay personal</p>
          <div aria-label="Portions, pairings, pace, and care plan">
            {["portions", "pairings", "pace", "care plan"].map((item) => (
              <span className={styles.tableDish} key={item}>
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
      <label className={styles.dividerRange}>
        Explore the difference
        <input
          aria-label="Compare identical plates with a shared meal and individual choices"
          max="1"
          min="0"
          onChange={(event) =>
            onStateChange(scene.id, event.target.value === "1" ? "identical" : "connected")
          }
          step="1"
          type="range"
          value={state === "identical" ? "1" : "0"}
        />
      </label>
      <div aria-label="Choose comparison view" className={styles.segmentedChoice} role="group">
        <button
          aria-pressed={state === "connected"}
          onClick={() => onStateChange(scene.id, "connected")}
          type="button"
        >
          Shared meal, individual choices
        </button>
        <button
          aria-pressed={state === "identical"}
          onClick={() => onStateChange(scene.id, "identical")}
          type="button"
        >
          Everyone needs the same plate
        </button>
      </div>
      <div aria-live="polite" className={styles.comparisonDefinition}>
        <strong>
          {state === "connected"
            ? "Connection does not require identical plates"
            : "Identical is not the same as together"}
        </strong>
        <p>
          {state === "connected"
            ? "People can share the ritual, food, and conversation while keeping portions, pace, and care decisions personal."
            : "Matching every portion can ignore appetite, preference, medications, and individual guidance."}
        </p>
      </div>
      <small>
        The goal is participation with agency—not a single plate copied around the table.
      </small>
    </div>
  );
}

function FamilySupportDialogue({
  onStateChange,
  scene,
  selected,
}: {
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
  selected: string;
}) {
  const response = familyDialogueChoices.find((choice) => choice.id === selected);

  return (
    <div className={styles.familyDialogue}>
      <fieldset>
        <legend>Which boundary could Asha borrow for a future family meal?</legend>
        {familyDialogueChoices.map((choice, index) => (
          <label key={choice.id}>
            <input
              checked={selected === choice.id}
              name={`${scene.id}-support-response`}
              onChange={() => onStateChange(scene.id, choice.id)}
              type="radio"
            />
            <span>
              <small>{String.fromCharCode(65 + index)}</small>
              {choice.label}
            </span>
          </label>
        ))}
      </fieldset>
      {response ? (
        <div aria-live="polite" className={styles.dialogueFeedback}>
          <p>{response.explanation}</p>
          <small>
            A boundary can protect connection and independence at the same time. It does not need to
            blame anyone to be clear.
          </small>
        </div>
      ) : (
        <p className={styles.optionalHint}>
          Choose a sentence to see what kind of boundary it creates.
        </p>
      )}
    </div>
  );
}

function mealFeedback(selected: string[], portions: Record<string, string>): string {
  const hasOnlyProteinAndVegetables =
    selected.length > 0 && selected.every((food) => food === "protein" || food === "vegetables");

  if (
    selected.includes("rice") &&
    selected.includes("flatbread") &&
    portions.rice === "large" &&
    portions.flatbread === "large"
  ) {
    return "This meal contains several substantial carbohydrate sources. Asha might consider the amounts, what leaves her satisfied, and guidance from her healthcare team. The foods themselves do not need to be treated as forbidden.";
  }
  if (["rice", "dal", "vegetables", "protein"].every((food) => selected.includes(food))) {
    return "Familiar: yes. Filling: this includes several meal roles. Feasible: the ingredients already belong to Asha’s family routine.";
  }
  if (hasOnlyProteinAndVegetables) {
    return "This may be one possible meal, but diabetes care does not require removing every carbohydrate-containing food.";
  }
  if (selected.includes("dessert")) {
    return "Dessert does not erase the rest of the meal. The amount, frequency, and overall pattern matter more than labeling one choice as failure.";
  }
  if (selected.length === 0) {
    return "Add any foods that could make one possible dinner. There is no single universally perfect plate.";
  }
  return "This is one possible meal. Consider what feels familiar, what leaves Asha satisfied, and how the foods work together rather than looking for a perfect plate.";
}

function CulturalMealBuilder({
  interactionStates,
  onStateChange,
  scene,
}: {
  interactionStates: StoryInteractionProps["interactionStates"];
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
}) {
  const selected = Array.isArray(interactionStates[scene.id])
    ? (interactionStates[scene.id] as string[])
    : [];
  const adjustable = ["rice", "flatbread", "vegetables", "protein"];
  const portions = Object.fromEntries(
    adjustable.map((food) => {
      const value = interactionStates[`${scene.id}:portion:${food}`];
      return [food, typeof value === "string" ? value : "moderate"];
    }),
  );

  const toggleFood = (food: string) => {
    onStateChange(
      scene.id,
      selected.includes(food) ? selected.filter((item) => item !== food) : [...selected, food],
    );
  };

  return (
    <div className={styles.mealBuilder}>
      <div className={styles.mealBuilderHeading}>
        <p className={styles.interactionKicker}>Try the three-F check</p>
        <h3>Build one dinner that feels familiar, filling, and feasible.</h3>
      </div>
      <div className={styles.mealCanvas}>
        <div aria-label="Selected meal components" className={styles.dinnerPlate}>
          {selected.length ? (
            selected
              .filter((food) => food !== "water")
              .map((food) => (
                <span
                  className={styles.plateFood}
                  data-food={food}
                  data-portion={portions[food] ?? "moderate"}
                  key={food}
                >
                  {mealComponents.find((item) => item.id === food)?.label}
                </span>
              ))
          ) : (
            <span className={styles.emptyPlate}>Your plate can begin anywhere.</span>
          )}
        </div>
        {selected.includes("water") ? (
          <div aria-label="Water selected" className={styles.waterGlass}>
            <span aria-hidden="true" />
            Water
          </div>
        ) : null}
      </div>
      <div aria-label="Shared food area" className={styles.foodTray}>
        {mealComponents.map((food) => (
          <button
            aria-pressed={selected.includes(food.id)}
            key={food.id}
            onClick={() => toggleFood(food.id)}
            type="button"
          >
            <span aria-hidden="true" className={styles.foodMark} data-food={food.id} />
            {selected.includes(food.id) ? `Remove ${food.label}` : `Add ${food.label}`}
          </button>
        ))}
      </div>
      {adjustable.some((food) => selected.includes(food)) ? (
        <div className={styles.portionControls}>
          <p>Adjust broad visible amounts</p>
          {adjustable
            .filter((food) => selected.includes(food))
            .map((food) => (
              <fieldset key={food}>
                <legend>{mealComponents.find((item) => item.id === food)?.label ?? food}</legend>
                {["small", "moderate", "large"].map((portion) => (
                  <label key={portion}>
                    <input
                      checked={portions[food] === portion}
                      name={`${scene.id}-${food}-portion`}
                      onChange={() => onStateChange(`${scene.id}:portion:${food}`, portion)}
                      type="radio"
                    />
                    <span>{portion}</span>
                  </label>
                ))}
              </fieldset>
            ))}
        </div>
      ) : null}
      <p aria-live="polite" className={styles.mealFeedback}>
        {mealFeedback(selected, portions)}
      </p>
      <p className={styles.mealSafety}>
        “Familiar, filling, feasible” is a sustainability check—not a personalized meal plan.
        Individual needs can vary based on medications, glucose patterns, preferences, and
        healthcare guidance.
      </p>
    </div>
  );
}

function FoodChoicePath({
  meaningfulChoice,
  onMeaningfulChoice,
}: {
  meaningfulChoice: string | null;
  onMeaningfulChoice: (choice: string) => void;
}) {
  const selected = foodDecisionChoices.find((choice) => choice.id === meaningfulChoice);

  return (
    <div className={styles.foodChoicePath}>
      <fieldset>
        <legend>Which small experiment could Asha choose without making a permanent rule?</legend>
        {foodDecisionChoices.map((choice, index) => (
          <label key={choice.id}>
            <input
              checked={meaningfulChoice === choice.id}
              name="asha-sunday-dinner-choice"
              onChange={() => onMeaningfulChoice(choice.id)}
              type="radio"
            />
            <span>
              <small>{String.fromCharCode(65 + index)}</small>
              {choice.label}
            </span>
          </label>
        ))}
      </fieldset>
      {selected ? (
        <div aria-live="polite" className={styles.foodChoiceConsequence}>
          <p>{selected.consequence}</p>
          <div>
            <strong>One experiment, not a verdict</strong>
            <p>
              The useful result is not whether one dinner was perfect. It is what Asha learns about
              familiarity, satisfaction, and what she wants to ask next.
            </p>
          </div>
        </div>
      ) : (
        <p className={styles.optionalHint}>
          This choice is not scored. Each path reveals a different immediate consequence.
        </p>
      )}
    </div>
  );
}

function SharedMealSupportSelector({
  interactionStates,
  onStateChange,
  scene,
}: {
  interactionStates: StoryInteractionProps["interactionStates"];
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
}) {
  const selected = Array.isArray(interactionStates[scene.id])
    ? (interactionStates[scene.id] as string[])
    : [];
  const submitted = interactionStates[`${scene.id}:submitted`] === "submitted";
  const toggle = (id: string) => {
    onStateChange(
      scene.id,
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );
  };

  return (
    <div className={styles.supportAgreement}>
      <div className={styles.sharedTableIllustration} aria-hidden="true">
        <span data-person="family" />
        <div>
          <span data-dish="vegetables" />
          <span data-dish="rice" />
          <span data-dish="protein" />
        </div>
        <span data-person="asha" />
      </div>
      <fieldset>
        <legend>Which agreements could make future meals calmer for everyone?</legend>
        {supportChoices.map((choice) => (
          <label key={choice.id}>
            <input
              checked={selected.includes(choice.id)}
              onChange={() => toggle(choice.id)}
              type="checkbox"
            />
            <span>{choice.label}</span>
          </label>
        ))}
      </fieldset>
      <button
        className={styles.submitSupport}
        disabled={selected.length === 0}
        onClick={() => onStateChange(`${scene.id}:submitted`, "submitted")}
        type="button"
      >
        Build the family agreement
      </button>
      {submitted ? (
        <div aria-live="polite" className={styles.supportFeedback}>
          <strong>
            A family agreement can reduce pressure before anyone needs to correct a plate.
          </strong>
          <ul>
            {selected.map((id) => {
              const choice = supportChoices.find((item) => item.id === id);
              if (!choice) return null;
              return (
                <li key={id}>
                  <span>{choice.label}</span>
                  <small>
                    {choice.helpful
                      ? "This protects routine, consent, or personal agency."
                      : "This can turn concern into surveillance or remove Asha’s control."}
                  </small>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
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
    "grocery-fear": () => (
      <GroceryFearExplorer
        onStateChange={onStateChange}
        scene={scene}
        selected={typeof value === "string" ? value : ""}
      />
    ),
    "separate-plate": () => (
      <SeparatePlateComparison
        onStateChange={onStateChange}
        scene={scene}
        selected={typeof value === "string" ? value : "differently"}
      />
    ),
    "family-dialogue": () => (
      <FamilySupportDialogue
        onStateChange={onStateChange}
        scene={scene}
        selected={typeof value === "string" ? value : ""}
      />
    ),
    "meal-builder": () => (
      <CulturalMealBuilder
        interactionStates={interactionStates}
        onStateChange={onStateChange}
        scene={scene}
      />
    ),
    "meaningful-food-choice": () => (
      <FoodChoicePath meaningfulChoice={meaningfulChoice} onMeaningfulChoice={onMeaningfulChoice} />
    ),
    "shared-table": () => (
      <SharedMealSupportSelector
        interactionStates={interactionStates}
        onStateChange={onStateChange}
        scene={scene}
      />
    ),
  };

  return renderers[scene.interactionType]();
}
