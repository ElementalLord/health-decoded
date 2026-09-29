"use client";

import { ArrowLeft, ArrowRight, Check, ChevronLeft, Clock3, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { recognizeMilestone } from "@/features/achievements/lib/recognize-milestone.client";
import { getStoryStorageKey, parseStoryProgress } from "@/features/stories/lib/story-progress";
import type { StoryProgress } from "@/features/stories/types/interactive-story";
import { readLocalStorage, safeSetLocalStorage } from "@/lib/storage/safe-local-storage";

import styles from "./asha-story-experience.module.css";

const STORY_SLUG = "asha-rice-on-the-table";
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
        <span>Asha&apos;s story</span>
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

const labelDetails = {
  serving: {
    title: "Serving size",
    copy: "The reference amount used for the numbers on the package. It is not a required portion.",
  },
  carbohydrate: {
    title: "Total carbohydrate",
    copy: "The amount listed for one labeled serving. Asha still needs her usual amount and the rest of the meal for context.",
  },
  fiber: {
    title: "Fiber and protein",
    copy: "Useful details about what the food contributes beyond one headline number.",
  },
} as const;

function GroceryLabel() {
  const [selected, setSelected] = useState<keyof typeof labelDetails>("carbohydrate");
  const detail = labelDetails[selected];

  return (
    <section className={styles.labelMoment} aria-labelledby="label-title">
      <div className={styles.packageLabel}>
        <div className={styles.labelTop}>
          <span>Pantry staple</span>
          <span>Nutrition facts</span>
        </div>
        <div className={styles.labelRows} role="tablist" aria-label="Inspect the package label">
          <button
            aria-selected={selected === "serving"}
            onClick={() => setSelected("serving")}
            role="tab"
            type="button"
          >
            <span>Serving size</span>
            <strong>1/4 cup dry</strong>
          </button>
          <button
            aria-selected={selected === "carbohydrate"}
            onClick={() => setSelected("carbohydrate")}
            role="tab"
            type="button"
          >
            <span>Total carbohydrate</span>
            <strong>36 g</strong>
          </button>
          <button
            aria-selected={selected === "fiber"}
            onClick={() => setSelected("fiber")}
            role="tab"
            type="button"
          >
            <span>Fiber · Protein</span>
            <strong>1 g · 3 g</strong>
          </button>
        </div>
      </div>
      <div aria-live="polite" className={styles.labelExplanation} role="tabpanel">
        <h3 id="label-title">{detail.title}</h3>
        <p>{detail.copy}</p>
        <span>A label describes the package. It doesn&apos;t decide whether the food belongs.</span>
      </div>
    </section>
  );
}

const cartDetails = {
  bread: {
    title: "Bread",
    copy: "Asha saw carbohydrate on the label and treated the number like a stop sign. The label did not tell her what amount she usually eats or what else is in the meal.",
  },
  yogurt: {
    title: "Yogurt",
    copy: "Different products can have different ingredients and nutrition. A category name alone does not answer which option fits Asha's preferences and care plan.",
  },
  fruit: {
    title: "Fruit",
    copy: "The presence of carbohydrate does not make a food automatically off-limits. Asha needs context, not a single-number rule.",
  },
  beans: {
    title: "Beans",
    copy: "Beans can contribute carbohydrate, fiber, and protein. Looking at one line can hide the rest of what a food offers.",
  },
} as const;

function CartReview() {
  const [item, setItem] = useState<keyof typeof cartDetails>("bread");
  const detail = cartDetails[item];

  return (
    <section className={styles.cartReview} aria-labelledby="cart-heading">
      <div className={styles.cartItems} role="tablist" aria-label="Review what Asha put back">
        {(Object.keys(cartDetails) as Array<keyof typeof cartDetails>).map((key) => (
          <button
            aria-selected={item === key}
            key={key}
            onClick={() => setItem(key)}
            role="tab"
            type="button"
          >
            {cartDetails[key].title}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.cartPanel} role="tabpanel">
        <span>Left on the shelf</span>
        <h3 id="cart-heading">{detail.title}</h3>
        <p>{detail.copy}</p>
      </div>
    </section>
  );
}

function DinnerTableComparison() {
  const [view, setView] = useState<"plate" | "table">("plate");

  return (
    <section className={styles.tableComparison} aria-labelledby="table-view-heading">
      <div className={styles.tableTabs} role="tablist" aria-label="Compare Asha's plate and table">
        <button
          aria-selected={view === "plate"}
          onClick={() => setView("plate")}
          role="tab"
          type="button"
        >
          Asha&apos;s plate
        </button>
        <button
          aria-selected={view === "table"}
          onClick={() => setView("table")}
          role="tab"
          type="button"
        >
          The shared table
        </button>
      </div>
      <div className={styles.tableView} role="tabpanel">
        {view === "plate" ? (
          <>
            <div className={styles.plate} aria-hidden="true">
              <span className={styles.plateProtein}>Protein</span>
              <span className={styles.plateGreens}>Greens</span>
            </div>
            <div>
              <h3 id="table-view-heading">A separate meal</h3>
              <p>Protein and greens. None of the dishes everyone else was passing around.</p>
            </div>
          </>
        ) : (
          <>
            <div className={styles.servingDishes} aria-hidden="true">
              <span>Grain</span>
              <span>Beans</span>
              <span>Vegetables</span>
              <span>Protein</span>
            </div>
            <div>
              <h3 id="table-view-heading">A familiar routine</h3>
              <p>The same conversation, shared dishes, and people Asha ate with every Sunday.</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

type BoundaryChoice = "monitor" | "ask" | "remove";

function FamilyConversation() {
  const [choice, setChoice] = useState<BoundaryChoice | null>(null);
  const responses: { id: BoundaryChoice; label: string }[] = [
    { id: "monitor", label: "Remind me what I should and shouldn’t eat." },
    { id: "ask", label: "Ask before giving advice about my plate." },
    { id: "remove", label: "Stop serving that food for everyone." },
  ];

  return (
    <section className={styles.conversation} aria-labelledby="family-question">
      <div className={styles.speechDaughter}>
        <span>Her daughter</span>
        <p>“Are you not eating with us?”</p>
      </div>
      <div className={styles.speechAsha}>
        <span>Asha</span>
        <p>“I am. I&apos;m just trying to work out what I&apos;m supposed to eat.”</p>
      </div>
      <h3 id="family-question">What could Asha ask from her family?</h3>
      <div className={styles.boundaryChoices} role="radiogroup" aria-label="Choose one response">
        {responses.map((response) => (
          <button
            aria-checked={choice === response.id}
            className={choice === response.id ? styles.boundarySelected : undefined}
            key={response.id}
            onClick={() => setChoice(response.id)}
            role="radio"
            type="button"
          >
            <span>{response.label}</span>
            {choice === response.id ? <Check aria-hidden="true" size={18} /> : null}
          </button>
        ))}
      </div>
      {choice ? (
        <div aria-live="polite" className={styles.feedback}>
          <strong>
            {choice === "ask"
              ? "That keeps the decision with Asha."
              : "That gives the family control of Asha’s plate."}
          </strong>
          <p>Her family can help without banning a shared food or commenting on every serving.</p>
        </div>
      ) : null}
    </section>
  );
}

const appointmentQuestions = [
  "What should I look at besides total carbohydrate?",
  "How can familiar foods fit into a meal that works for me?",
  "What would be useful to notice before our next appointment?",
] as const;

function AppointmentQuestions() {
  const [saved, setSaved] = useState<number[]>([0]);

  const toggle = (index: number) => {
    setSaved((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <section className={styles.questionNote} aria-labelledby="appointment-heading">
      <div className={styles.questionTop}>
        <span>Questions for Thursday</span>
        <span>{saved.length} saved</span>
      </div>
      <h3 id="appointment-heading">Asha makes the problem specific.</h3>
      <div className={styles.appointmentQuestions}>
        {appointmentQuestions.map((question, index) => (
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
      <p>The questions ask for context without asking for a universal list of allowed foods.</p>
    </section>
  );
}

function WholeMealView() {
  const [selected, setSelected] = useState<"grain" | "beans" | "vegetables" | "protein">("grain");
  const notes = {
    grain: "Contains carbohydrate. The amount and the foods eaten with it add context.",
    beans: "Can contribute carbohydrate, fiber, and protein.",
    vegetables: "Add fiber, variety, and volume to the meal.",
    protein: "Adds protein to this version of the family meal.",
  } as const;

  return (
    <section className={styles.mealView} aria-labelledby="meal-heading">
      <div className={styles.mealDiagram} role="tablist" aria-label="Inspect the whole meal">
        {Object.keys(notes).map((food) => (
          <button
            aria-selected={selected === food}
            key={food}
            onClick={() => setSelected(food as keyof typeof notes)}
            role="tab"
            type="button"
          >
            {food[0]!.toUpperCase() + food.slice(1)}
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.mealNote} role="tabpanel">
        <span>The whole meal</span>
        <h3 id="meal-heading">{selected[0]!.toUpperCase() + selected.slice(1)}</h3>
        <p>{notes[selected]}</p>
        <small>This is context for the story, not a portion guide or personalized meal plan.</small>
      </div>
    </section>
  );
}

type SupportChoice = "serve" | "watch" | "ban";

function SundayDecision() {
  const [choice, setChoice] = useState<SupportChoice | null>(null);
  const choices: { id: SupportChoice; label: string }[] = [
    { id: "serve", label: "Keep the dishes family-style and let Asha serve herself." },
    { id: "watch", label: "Have someone watch Asha’s portions." },
    { id: "ban", label: "Remove the familiar dish so nobody has to discuss it." },
  ];

  return (
    <section className={styles.decision} aria-labelledby="support-question">
      <h3 id="support-question">Which setup gives Asha useful support?</h3>
      <div className={styles.decisionChoices}>
        {choices.map((option) => (
          <button
            aria-pressed={choice === option.id}
            className={choice === option.id ? styles.decisionSelected : undefined}
            key={option.id}
            onClick={() => setChoice(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {choice ? (
        <div aria-live="polite" className={styles.decisionResult}>
          <span>
            {choice === "serve" ? "Asha chooses for herself" : "Someone else is choosing for Asha"}
          </span>
          <p>
            {choice === "serve"
              ? "The meal stays shared, and Asha can make her own choice without turning one dinner into a permanent rule."
              : "Support works better when it makes room for Asha’s choices instead of monitoring or removing them."}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function FamilyTableNote() {
  return (
    <div className={styles.tableNote} aria-label="What Asha asked from her family">
      <div className={styles.noteHeading}>
        <span>For family dinner</span>
        <span>Sunday</span>
      </div>
      <ul>
        <li>
          <Check aria-hidden="true" size={17} /> Keep familiar dishes on the table
        </li>
        <li>
          <Check aria-hidden="true" size={17} /> Let each person serve themselves
        </li>
        <li>
          <Check aria-hidden="true" size={17} /> Ask before offering food advice
        </li>
      </ul>
      <p>
        Dinner conversation can still be about school, work, and whether the recipe needs more
        seasoning.
      </p>
    </div>
  );
}

const scenes = [
  {
    id: "grocery-store",
    title: "At the grocery store",
    moment: "Saturday · 11:20 AM",
    body: (
      <>
        <p>
          Asha picked up a familiar pantry staple, read the nutrition label, and put it back. She
          did the same with bread, yogurt, fruit, and beans.
        </p>
        <p>
          Nearly every familiar food seemed to contain a number she didn&apos;t understand. After an
          hour, her cart held leafy greens, eggs, a protein option, and water.
        </p>
      </>
    ),
    visual: <GroceryLabel />,
    continueLabel: "Look at the cart",
  },
  {
    id: "cart",
    title: "What she put back",
    moment: "Grocery store · 11:46 AM",
    body: (
      <>
        <p>
          Asha looked into the cart and realized most of the foods she had removed were foods she
          regularly ate. She had been making a yes-or-no decision from one line on each label.
        </p>
        <p>Before checking out, she took a photo of a few labels to ask about later.</p>
      </>
    ),
    visual: <CartReview />,
    continueLabel: "Go to Sunday dinner",
  },
  {
    id: "separate-plate",
    title: "A separate plate",
    moment: "Sunday · 6:14 PM",
    body: (
      <>
        <p>
          The table held a grain dish, beans, vegetables, bread, yogurt, and a protein dish. Asha
          had made herself a different dinner: plain protein and leafy greens.
        </p>
        <p>
          Everyone talked about the week and passed dishes across the table. Asha was sitting with
          them, but the meal no longer felt shared.
        </p>
      </>
    ),
    visual: <DinnerTableComparison />,
    continueLabel: "Keep reading",
  },
  {
    id: "daughter",
    title: "Her daughter noticed",
    moment: "A few minutes later",
    body: (
      <>
        <p>
          Asha&apos;s daughter looked at the separate plate. Her husband offered to stop serving one
          of their familiar dishes so Asha wouldn&apos;t have to worry about it.
        </p>
        <p>
          He meant to help. Asha didn&apos;t want the family to change every meal for her, and she
          didn&apos;t want anyone monitoring her plate. She wasn&apos;t sure how to say that yet.
        </p>
      </>
    ),
    visual: <FamilyConversation />,
    continueLabel: "Write down the questions",
  },
  {
    id: "questions",
    title: "Questions for Thursday",
    moment: "Sunday · 8:05 PM",
    body: (
      <>
        <p>
          After dinner, Asha wrote down what had actually been difficult: reading labels without
          context, making a separate plate, and not knowing how to ask her family for space.
        </p>
        <p>That gave her something more useful to bring to the dietitian than “What can I eat?”</p>
      </>
    ),
    visual: <AppointmentQuestions />,
    continueLabel: "Go to the appointment",
  },
  {
    id: "dietitian",
    title: "Looking at the whole meal",
    moment: "Dietitian appointment · Thursday",
    body: (
      <>
        <p>
          Asha described the grocery trip and the separate plate. The dietitian asked what her
          family usually ate, then looked at the whole dinner with her.
        </p>
        <p>
          The grain dish wasn&apos;t the only part of the meal. There were beans, vegetables,
          protein, side dishes, the amount of each food, and what Asha could realistically keep
          doing.
        </p>
      </>
    ),
    visual: <WholeMealView />,
    continueLabel: "Return to Sunday dinner",
  },
  {
    id: "next-sunday",
    title: "The next Sunday",
    moment: "One week later · 6:11 PM",
    body: (
      <>
        <p>
          The same dishes came back to the table. Asha still felt nervous. One appointment
          hadn&apos;t removed every worry she had attached to the meal.
        </p>
        <p>
          This time, nobody made her a separate plate. The serving spoons stayed with the shared
          dishes, and her family let her choose.
        </p>
      </>
    ),
    visual: <SundayDecision />,
    continueLabel: "See how dinner went",
  },
  {
    id: "same-table",
    title: "Dinner continued",
    moment: "Sunday · 6:32 PM",
    body: (
      <>
        <p>
          Asha served herself from the shared dishes. When her daughter asked about one of her
          choices, Asha said, “I&apos;m learning how it fits with the rest of my meal.”
        </p>
        <p>
          Her husband asked if he should remind her about portions. “No,” Asha said. “Just ask
          before giving advice.” Then the conversation moved on.
        </p>
      </>
    ),
    visual: <FamilyTableNote />,
    continueLabel: "Finish story",
  },
] as const;

export function AshaStoryExperience() {
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
          <p>Asha&apos;s story</p>
          <h1 ref={headingRef} tabIndex={-1}>
            Finished
          </h1>
          <p>
            Asha did not need a separate plate or someone watching what she served. She needed
            clearer information and the chance to choose for herself.
          </p>
          <div className={styles.completionTakeaway}>
            <span>In short</span>
            <strong>
              Familiar foods can stay part of a meal. Personal needs, portions, preparation, and the
              rest of the meal provide context.
            </strong>
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
            Asha is a placeholder name. This is an illustrative scenario, not one person&apos;s
            medical history or a personalized eating plan.
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
