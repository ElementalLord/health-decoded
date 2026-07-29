"use client";

import { Check, PhoneCall, Search } from "lucide-react";
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

const thoughtCategories = [
  { id: "knows", label: "What Marcus knows" },
  { id: "self-blame", label: "What Marcus is blaming himself for" },
] as const;

const thoughtCategoryById: Record<string, (typeof thoughtCategories)[number]["id"]> = {
  "new-information": "knows",
  prevented: "self-blame",
  results: "knows",
  takeout: "self-blame",
  "first-step": "knows",
  failed: "self-blame",
};

const usefulQuestionChoices = [
  {
    id: "generic-plan",
    label: "What is the best diabetes plan?",
    useful: false,
  },
  {
    id: "personal-context",
    label:
      "What does my A1C result mean, and what did my healthcare professional ask me to do next?",
    useful: true,
  },
  {
    id: "future-certainty",
    label: "Can someone tell me exactly what will happen years from now?",
    useful: false,
  },
] as const;

const priorityBuckets = [
  { id: "first", label: "Ask first" },
  { id: "follow-up", label: "Discuss during follow-up" },
  { id: "over-time", label: "Keep exploring over time" },
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

function AttentionOverload({
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
  const options = scene.interaction.options ?? [];

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : selected.length < 2
        ? [...selected, id]
        : selected;
    onStateChange(scene.id, next);
    onStateChange(`${scene.id}:submitted`, "");
  };

  return (
    <div className={styles.termFocus}>
      <div className={styles.resultHeader}>
        <span>Appointment summary</span>
        <span>{selected.length} of 2 selected</span>
      </div>
      <h3>{scene.interaction.prompt}</h3>
      <p>{scene.interaction.instructions}</p>
      <div aria-label="Appointment summary information" className={styles.termList}>
        {options.map((option) => (
          <button
            aria-pressed={selected.includes(option.id)}
            disabled={selected.length === 2 && !selected.includes(option.id)}
            key={option.id}
            onClick={() => toggle(option.id)}
            type="button"
          >
            <span>{option.label}</span>
            {selected.includes(option.id) ? <Check aria-hidden="true" size={17} /> : null}
          </button>
        ))}
      </div>
      <button
        className={styles.interactionAction}
        disabled={selected.length === 0}
        onClick={() => onStateChange(`${scene.id}:submitted`, "submitted")}
        type="button"
      >
        Consider my selections
      </button>
      {submitted ? (
        <div aria-live="polite" className={styles.interactionReveal}>
          <strong>Stress can narrow attention.</strong>
          <span>
            People under stress often remember the most emotionally charged information while
            practical details become harder to retain. This does not mean they were not listening or
            do not care.
          </span>
          <p>
            <b>What felt urgent:</b> the diagnosis itself.
          </p>
          <p>
            <b>What could help later:</b> written instructions, the follow-up appointment, and
            questions for the healthcare team.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function EmotionalInterpretation({
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
  const options = scene.interaction.options ?? [];
  const toggle = (id: string) => {
    onStateChange(
      scene.id,
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );
    onStateChange(`${scene.id}:submitted`, "");
  };

  return (
    <div className={styles.phoneDraft}>
      <div className={styles.phoneTop}>
        <span>
          <PhoneCall aria-hidden="true" size={17} /> Message not sent
        </span>
        <small>Interpret the pause</small>
      </div>
      <h3>{scene.interaction.prompt}</h3>
      <p>{scene.interaction.instructions}</p>
      <fieldset className={styles.nextStepChoices}>
        <legend className="sr-only">Possible reasons the message feels difficult</legend>
        {options.map((option) => (
          <label key={option.id}>
            <input
              checked={selected.includes(option.id)}
              onChange={() => toggle(option.id)}
              type="checkbox"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
      <button
        className={styles.interactionAction}
        disabled={selected.length === 0}
        onClick={() => onStateChange(`${scene.id}:submitted`, "submitted")}
        type="button"
      >
        Reflect on these reasons
      </button>
      {submitted ? (
        <p aria-live="polite" className={styles.draftField}>
          Marcus’s silence was not proof that he was ignoring the diagnosis. He was still trying to
          find language for it. More than one reaction may be understandable here.
        </p>
      ) : null}
    </div>
  );
}

function ThoughtSort({
  interactionStates,
  onStateChange,
  scene,
}: {
  interactionStates: StoryInteractionProps["interactionStates"];
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
}) {
  const options = scene.interaction.options ?? [];
  const assignments = Object.fromEntries(
    options.map((option) => {
      const value = interactionStates[`${scene.id}:${option.id}`];
      return [option.id, typeof value === "string" ? value : ""];
    }),
  );
  const current = options.find((option) => !assignments[option.id]);
  const sortedCount = options.filter((option) => assignments[option.id]).length;
  const lastFeedback =
    typeof interactionStates[`${scene.id}:feedback`] === "string"
      ? String(interactionStates[`${scene.id}:feedback`])
      : "";

  const sortThought = (category: string) => {
    if (!current) return;
    onStateChange(`${scene.id}:${current.id}`, category);
    const matches = thoughtCategoryById[current.id] === category;
    onStateChange(
      `${scene.id}:feedback`,
      matches
        ? "That distinction fits: this separates available information from the meaning shame adds."
        : "This thought may feel factual to Marcus, but look again at whether the medical result itself actually says it.",
    );
  };

  return (
    <div className={styles.comparison}>
      <div className={styles.resultHeader}>
        <span>
          Thought {Math.min(sortedCount + 1, options.length)} of {options.length}
        </span>
        <span>{sortedCount} sorted</span>
      </div>
      <h3>{scene.interaction.prompt}</h3>
      <p>{scene.interaction.instructions}</p>
      {current ? (
        <>
          <div className={styles.comparisonText}>
            <p>{current.label}</p>
          </div>
          <div aria-label="Sort this thought" className={styles.sortChoices} role="group">
            {thoughtCategories.map((category) => (
              <button key={category.id} onClick={() => sortThought(category.id)} type="button">
                {category.label}
              </button>
            ))}
          </div>
          {lastFeedback ? (
            <small aria-live="polite">{lastFeedback}</small>
          ) : (
            <small>Choose the category that best describes what this sentence is doing.</small>
          )}
        </>
      ) : (
        <div aria-live="polite" className={styles.comparisonText}>
          <Check aria-hidden="true" />
          <p>
            A diagnosis provides health information. Shame often adds a much harsher story that the
            medical results themselves do not say. Lifestyle can matter without one behavior—or one
            person’s character—being the whole explanation.
          </p>
        </div>
      )}
    </div>
  );
}

function ResponsePrediction({
  interactionStates,
  onStateChange,
  scene,
}: {
  interactionStates: StoryInteractionProps["interactionStates"];
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
}) {
  const selected =
    typeof interactionStates[scene.id] === "string" ? interactionStates[scene.id] : "";
  const option = scene.interaction.options?.find((candidate) => candidate.id === selected);

  const choose = (id: string) => {
    onStateChange(scene.id, id);
    onStateChange(`${scene.id}:complete`, "complete");
  };

  return (
    <div className={styles.dialogue}>
      <div className={styles.callStatus}>
        <PhoneCall aria-hidden="true" size={18} />
        <span>Prediction point</span>
      </div>
      <fieldset className={styles.nextStepChoices}>
        <legend>{scene.interaction.prompt}</legend>
        <p>{scene.interaction.instructions}</p>
        {(scene.interaction.options ?? []).map((choice, index) => (
          <label key={choice.id}>
            <input
              checked={selected === choice.id}
              name={`${scene.id}-prediction`}
              onChange={() => choose(choice.id)}
              type="radio"
            />
            <span>
              <small>{String.fromCharCode(65 + index)}</small>
              {choice.label}
            </span>
          </label>
        ))}
      </fieldset>
      {option ? (
        <div aria-live="polite" className={styles.questionChanged}>
          <strong>{option.feedback}</strong>
          <span>
            Marcus’s wife brings him back from an imagined future to the next clear action. Her
            response now continues in the story.
          </span>
        </div>
      ) : null}
    </div>
  );
}

function InformationFilter({
  interactionStates,
  meaningfulChoice,
  onMeaningfulChoice,
  onStateChange,
  scene,
}: {
  interactionStates: StoryInteractionProps["interactionStates"];
  meaningfulChoice: string | null;
  onMeaningfulChoice: (choice: string) => void;
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
}) {
  const selected = scene.interaction.options?.find((choice) => choice.id === meaningfulChoice);
  const questionKey = `${scene.id}:question`;
  const selectedQuestion =
    typeof interactionStates[questionKey] === "string" ? interactionStates[questionKey] : "";
  const question = usefulQuestionChoices.find((choice) => choice.id === selectedQuestion);

  const chooseQuestion = (id: string) => {
    onStateChange(questionKey, id);
    onStateChange(`${scene.id}:complete`, "complete");
  };

  return (
    <div className={styles.decision}>
      <div aria-label="Open browser tabs" className={styles.browserTabs}>
        <Search aria-hidden="true" size={18} />
        <span>12 tabs open</span>
        <span>More opinions</span>
        <span>Another long-term outcome</span>
      </div>
      <fieldset>
        <legend>{scene.interaction.prompt}</legend>
        <p>{scene.interaction.instructions}</p>
        {(scene.interaction.options ?? []).map((choice, index) => (
          <label key={choice.id}>
            <input
              checked={meaningfulChoice === choice.id}
              name={`${scene.id}-information-use`}
              onChange={() => {
                onMeaningfulChoice(choice.id);
                onStateChange(questionKey, "");
                onStateChange(`${scene.id}:complete`, "");
              }}
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
          <p>{selected.feedback}</p>
          <strong>Turn the broad search into a question Marcus can use.</strong>
          <span>Broad search: “What happens to people with diabetes?”</span>
          <fieldset className={styles.nextStepChoices}>
            <legend>Which version adds Marcus’s actual context?</legend>
            {usefulQuestionChoices.map((choice) => (
              <label key={choice.id}>
                <input
                  checked={selectedQuestion === choice.id}
                  name={`${scene.id}-useful-question`}
                  onChange={() => chooseQuestion(choice.id)}
                  type="radio"
                />
                <span>{choice.label}</span>
              </label>
            ))}
          </fieldset>
          {question ? (
            <p aria-live="polite">
              {question.useful
                ? "This question connects general information to Marcus’s result and the next action his healthcare professional gave him."
                : "That question is understandable, but it is still too broad to answer Marcus’s immediate need. Add his result, his instructions, or the decision in front of him."}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function QuestionPrioritization({
  interactionStates,
  onStateChange,
  scene,
}: {
  interactionStates: StoryInteractionProps["interactionStates"];
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
}) {
  const nextKey = `${scene.id}:next`;
  const options = scene.interaction.options ?? [];
  const selectedNext =
    typeof interactionStates[nextKey] === "string" ? interactionStates[nextKey] : "";
  const assignedCount = options.filter(
    (question) => typeof interactionStates[`${scene.id}:${question.id}`] === "string",
  ).length;

  return (
    <div className={styles.questionInteraction}>
      <div className={styles.resultHeader}>
        <span>Appointment questions</span>
        <span>
          {assignedCount} of {options.length} placed
        </span>
      </div>
      <h3>{scene.interaction.prompt}</h3>
      <p>{scene.interaction.instructions}</p>
      <div className={styles.foldedQuestions}>
        {options.map((question) => {
          const assignment = interactionStates[`${scene.id}:${question.id}`];
          return (
            <fieldset key={question.id}>
              <legend>{question.label}</legend>
              <div aria-label={`Priority for: ${question.label}`} role="group">
                {priorityBuckets.map((bucket) => (
                  <button
                    aria-pressed={assignment === bucket.id}
                    key={bucket.id}
                    onClick={() => onStateChange(`${scene.id}:${question.id}`, bucket.id)}
                    type="button"
                  >
                    {bucket.label}
                  </button>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>
      {assignedCount === options.length ? (
        <p aria-live="polite" className={styles.allQuestionsOpen}>
          There is no perfect order. “Ask first” can hold what changes the next action; follow-up
          can hold what needs more conversation; some questions become clearer with experience over
          time.
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
        <h3>{scene.interaction.prompt}</h3>
        <p>{scene.interaction.instructions}</p>
      </div>
      <div aria-label="Explore nutrition label clues" className={styles.groceryShelf}>
        {scene.interaction.options.map((option) => (
          <button
            aria-pressed={selected === option.id}
            key={option.id}
            onClick={() => onStateChange(scene.id, option.id)}
            type="button"
          >
            <span aria-hidden="true" className={styles.foodMark} data-food={option.id} />
            {option.label}
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
      <h3>{scene.interaction.prompt}</h3>
      <p>{scene.interaction.instructions}</p>
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
        <legend>{scene.interaction.prompt}</legend>
        <p>{scene.interaction.instructions}</p>
        {scene.interaction.options.map((option, index) => (
          <label key={option.id}>
            <input
              checked={selected === option.id}
              name={`${scene.id}-support-response`}
              onChange={() => onStateChange(scene.id, option.id)}
              type="radio"
            />
            <span>
              <small>{String.fromCharCode(65 + index)}</small>
              {option.label}
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
        <h3>{scene.interaction.prompt}</h3>
        <p>{scene.interaction.instructions}</p>
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
        {scene.interaction.options.map((food) => (
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
  onStateChange,
  scene,
}: {
  meaningfulChoice: string | null;
  onMeaningfulChoice: (choice: string) => void;
  onStateChange: StoryInteractionProps["onStateChange"];
  scene: StoryScene;
}) {
  const selected = scene.interaction.options.find((choice) => choice.id === meaningfulChoice);
  const choose = (id: string) => {
    onMeaningfulChoice(id);
    onStateChange(`${scene.id}:complete`, "complete");
  };

  return (
    <div className={styles.foodChoicePath}>
      <fieldset>
        <legend>{scene.interaction.prompt}</legend>
        <p>{scene.interaction.instructions}</p>
        {scene.interaction.options.map((choice, index) => (
          <label key={choice.id}>
            <input
              checked={meaningfulChoice === choice.id}
              name="asha-sunday-dinner-choice"
              onChange={() => choose(choice.id)}
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
          <p>{selected.feedback}</p>
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
        <legend>{scene.interaction.prompt}</legend>
        <p>{scene.interaction.instructions}</p>
        {scene.interaction.options.map((option) => (
          <label key={option.id}>
            <input
              checked={selected.includes(option.id)}
              onChange={() => toggle(option.id)}
              type="checkbox"
            />
            <span>{option.label}</span>
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
              const option = scene.interaction.options.find((item) => item.id === id);
              if (!choice) return null;
              return (
                <li key={id}>
                  <span>{option?.label ?? choice.label}</span>
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
    "attention-overload": () => (
      <AttentionOverload
        interactionStates={interactionStates}
        onStateChange={onStateChange}
        scene={scene}
      />
    ),
    "emotional-interpretation": () => (
      <EmotionalInterpretation
        interactionStates={interactionStates}
        onStateChange={onStateChange}
        scene={scene}
      />
    ),
    "thought-sort": () => (
      <ThoughtSort
        interactionStates={interactionStates}
        onStateChange={onStateChange}
        scene={scene}
      />
    ),
    "response-prediction": () => (
      <ResponsePrediction
        interactionStates={interactionStates}
        onStateChange={onStateChange}
        scene={scene}
      />
    ),
    "information-filter": () => (
      <InformationFilter
        interactionStates={interactionStates}
        meaningfulChoice={meaningfulChoice}
        onMeaningfulChoice={onMeaningfulChoice}
        onStateChange={onStateChange}
        scene={scene}
      />
    ),
    "question-prioritization": () => (
      <QuestionPrioritization
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
      <FoodChoicePath
        meaningfulChoice={meaningfulChoice}
        onMeaningfulChoice={onMeaningfulChoice}
        onStateChange={onStateChange}
        scene={scene}
      />
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
