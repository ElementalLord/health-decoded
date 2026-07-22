"use client";

import {
  Apple,
  ArrowLeft,
  BookOpen,
  CakeSlice,
  Carrot,
  Check,
  ChefHat,
  CupSoda,
  GlassWater,
  Heart,
  Milk,
  Pizza,
  Soup,
  Wheat,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { dayFourGlossary } from "@/features/glossary/data/day-four-glossary";
import {
  evaluateDayFourAction,
  type DayFourEvaluationFeedback,
} from "@/features/lessons/actions/day-four.actions";
import { completeLessonAction } from "@/features/lessons/actions/lesson-completion.actions";
import { saveLessonPositionAction } from "@/features/lessons/actions/lesson-progress.actions";
import styles from "@/features/lessons/components/day-four-experience.module.css";
import { LessonMotionFigure } from "@/features/lessons/components/lesson-motion-figure";
import { LessonStoryImage } from "@/features/lessons/components/lesson-story-image";
import type { LessonPlayerViewModel } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

const stageCount = 16;

type EvaluationKey =
  "digestion" | "nutrient" | "fiber" | "plate" | "drink" | "restaurant" | "teachBack";

const foodFears = [
  ["rules", "I expected a long list of food rules."],
  ["favorites", "I worried my favorite foods were gone."],
  ["carbs", "I started feeling afraid of carbohydrates."],
  ["unsure", "I still do not know what a meal should look like."],
] as const;

type FoodFear = (typeof foodFears)[number][0];

const fearResponses: Record<FoodFear, string> = {
  rules:
    "Today is not a rulebook. It is a way to see what food does, what balance can add, and where flexibility still belongs.",
  favorites:
    "Your memories, culture, and celebrations do not disappear after diagnosis. We will practice adding context without removing joy.",
  carbs:
    "Carbohydrates affect blood glucose, but that does not make them forbidden. Amount, type, fiber, and meal balance all add context.",
  unsure:
    "That is exactly the practical question this lesson answers. You will build a plate before the lesson ends.",
};

const tableMeanings = [
  {
    body: "Food supplies the energy and nutrients that help the body work.",
    id: "fuel",
    label: "Fuel",
  },
  {
    body: "Recipes can carry family history, migration, place, and identity.",
    id: "culture",
    label: "Culture",
  },
  {
    body: "Meals create reasons to gather, share, listen, and care for one another.",
    id: "connection",
    label: "Connection",
  },
  {
    body: "Birthdays, holidays, and ordinary joys often arrive at the table.",
    id: "celebration",
    label: "Celebration",
  },
] as const;

type TableMeaningId = (typeof tableMeanings)[number]["id"];

const nutrients = [
  {
    body: "Many carbohydrates are broken down into glucose, a readily available source of energy.",
    color: "bg-[#d7a04b]",
    id: "carbohydrate",
    label: "Carbohydrate",
    role: "Ready energy",
  },
  {
    body: "Protein helps build and repair muscles, skin, organs, and other tissues and can support satisfaction.",
    color: "bg-[#6f947a]",
    id: "protein",
    label: "Protein",
    role: "Build and repair",
  },
  {
    body: "Fat supplies energy, supports cell function, and helps the body absorb certain vitamins.",
    color: "bg-[#bd7158]",
    id: "fat",
    label: "Fat",
    role: "Support and absorb",
  },
] as const;

type NutrientId = (typeof nutrients)[number]["id"];

const pantryFoods = [
  { carb: true, id: "bread", label: "Bread", tone: "bg-[#e9c792]" },
  { carb: true, id: "rice", label: "Rice", tone: "bg-[#eee2c9]" },
  { carb: true, id: "fruit", label: "Fruit", tone: "bg-[#d88970]" },
  { carb: true, id: "milk", label: "Milk", tone: "bg-[#dfe8de]" },
  { carb: true, id: "beans", label: "Beans", tone: "bg-[#b88068]" },
  { carb: true, id: "potato", label: "Potato", tone: "bg-[#d4b276]" },
  { carb: true, id: "corn", label: "Corn", tone: "bg-[#e2b94e]" },
  { carb: true, id: "oats", label: "Oats", tone: "bg-[#c9af88]" },
  { carb: false, id: "chicken", label: "Chicken", tone: "bg-[#d69b7b]" },
  { carb: false, id: "oil", label: "Olive oil", tone: "bg-[#9cae72]" },
] as const;

type PantryFoodId = (typeof pantryFoods)[number]["id"];

const plateFoods = [
  { category: "vegetable", id: "greens", label: "Leafy greens" },
  { category: "vegetable", id: "peppers", label: "Peppers" },
  { category: "vegetable", id: "broccoli", label: "Broccoli" },
  { category: "protein", id: "fish", label: "Fish" },
  { category: "protein", id: "tofu", label: "Tofu" },
  { category: "protein", id: "eggs", label: "Eggs" },
  { category: "carbohydrate", id: "brown-rice", label: "Brown rice" },
  { category: "carbohydrate", id: "beans", label: "Beans" },
  { category: "carbohydrate", id: "fruit", label: "Fruit" },
] as const;

type PlateCategory = (typeof plateFoods)[number]["category"];
type PlateFoodId = (typeof plateFoods)[number]["id"];

const favoriteScenarios = [
  {
    choices: [
      "Enjoy whole fruit as a carbohydrate food, with its fiber and natural structure.",
      "Avoid every fruit because it tastes sweet.",
      "Drink only fruit juice because whole fruit has carbohydrate.",
    ],
    correct: 0,
    icon: Apple,
    name: "Fruit",
    response:
      "Whole fruit can fit. It brings carbohydrate together with fiber, vitamins, minerals, water, and structure.",
  },
  {
    choices: [
      "Give bread a place in the carbohydrate portion and build the rest of the meal around it.",
      "Remove bread from the house forever.",
      "Call the whole meal unhealthy because bread is present.",
    ],
    correct: 0,
    icon: Wheat,
    name: "Bread",
    response:
      "Bread is a carbohydrate food, not a character test. Type, amount, and what joins it on the plate add context.",
  },
  {
    choices: [
      "Enjoy pizza, notice the portion, and add something such as salad if that works for you.",
      "Never join another pizza night.",
      "Skip the next meal to make up for it.",
    ],
    correct: 0,
    icon: Pizza,
    name: "Pizza",
    response:
      "Pizza can remain part of real life. Balance can be an addition, and one meal does not require punishment.",
  },
  {
    choices: [
      "Plan a dessert you enjoy without treating it as proof that you failed.",
      "Promise that celebrations will never include dessert again.",
      "Describe the entire day as ruined after one serving.",
    ],
    correct: 0,
    icon: CakeSlice,
    name: "Dessert",
    response:
      "Dessert is not a measure of worth. A personal meal plan can make room for enjoyment, context, and long-term patterns.",
  },
] as const;

const myths = [
  "People with diabetes must stop eating all carbohydrates.",
  "Fruit is unsafe because it contains sugar.",
  "One celebration meal ruins all your progress.",
  "The plate method is a flexible starting point, not the only correct way to eat.",
] as const;

const supportStatements = [
  { answer: "policing", text: "Are you sure you are allowed to eat that?" },
  { answer: "support", text: "Would it help if we planned a meal together?" },
  { answer: "policing", text: "You ruined the day with that dessert." },
  { answer: "support", text: "What kind of support would feel useful to you?" },
] as const;

const reflectionOptions = [
  "Carbohydrates feel less frightening.",
  "I can picture a balanced plate.",
  "I understand why fiber changes the pace.",
  "I feel more comfortable keeping favorite foods in my life.",
  "I want help adapting this to my culture or budget.",
  "I still want to discuss my own meal plan with a professional.",
] as const;

function DayFourHeading({ children, label }: { children: ReactNode; label?: string }) {
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
        "motion-tactile flex min-h-16 w-full items-start gap-4 rounded-[9px] border bg-card px-5 py-4 text-left leading-7 shadow-card",
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

function ConceptFeedback({ feedback }: { feedback: DayFourEvaluationFeedback }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "animate-slide-up rounded-[1rem] border p-5 sm:p-7",
        feedback.accurate ? "border-success/30 bg-info" : "border-warning/35 bg-warning/10",
      )}
      role="status"
    >
      <p className={cn("font-serif-display text-2xl italic", feedback.accurate && "text-success")}>
        {feedback.heading}
      </p>
      <p className="mt-2 leading-7 text-foreground/85">{feedback.body}</p>
      <div className="mt-5 border-t border-current/10 pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Why the other ideas do not fit
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground/75">
          {feedback.whyOthers.map((reason) => (
            <li className="flex gap-2" key={reason}>
              <span aria-hidden="true" className="text-accent-warm">
                •{" "}
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DayFourExperience({ lesson: experience }: { lesson: LessonPlayerViewModel }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [foodFear, setFoodFear] = useState<FoodFear | null>(null);
  const [tableParts, setTableParts] = useState<Set<TableMeaningId>>(() => new Set());
  const [activeTablePart, setActiveTablePart] = useState<TableMeaningId | null>(null);
  const [digestionStep, setDigestionStep] = useState(0);
  const [viewedNutrients, setViewedNutrients] = useState<Set<NutrientId>>(() => new Set());
  const [activeNutrient, setActiveNutrient] = useState<NutrientId | null>(null);
  const [pantrySelections, setPantrySelections] = useState<Set<PantryFoodId>>(() => new Set());
  const [pantryChecked, setPantryChecked] = useState(false);
  const [pantryAttempts, setPantryAttempts] = useState(0);
  const [pantryResolved, setPantryResolved] = useState(false);
  const [plateSelections, setPlateSelections] = useState<
    Partial<Record<PlateCategory, PlateFoodId>>
  >({});
  const [favoriteIndex, setFavoriteIndex] = useState(0);
  const [favoriteAnswer, setFavoriteAnswer] = useState<number | null>(null);
  const [favoriteCompleted, setFavoriteCompleted] = useState(0);
  const [mythIndex, setMythIndex] = useState(0);
  const [mythCompleted, setMythCompleted] = useState(0);
  const [mythFeedback, setMythFeedback] = useState<DayFourEvaluationFeedback | null>(null);
  const [supportIndex, setSupportIndex] = useState(0);
  const [supportAnswer, setSupportAnswer] = useState<"support" | "policing" | null>(null);
  const [supportCompleted, setSupportCompleted] = useState(0);
  const [receiptsSpread, setReceiptsSpread] = useState(false);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [reflection, setReflection] = useState<(typeof reflectionOptions)[number] | null>(null);
  const [evaluations, setEvaluations] = useState<
    Partial<Record<EvaluationKey, DayFourEvaluationFeedback>>
  >({});
  const [selectedAnswers, setSelectedAnswers] = useState<Partial<Record<EvaluationKey, string>>>(
    {},
  );
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const stageRef = useRef<HTMLDivElement>(null);
  const storageKey = `health-decoded:day-four:${experience.lessonProgressId}`;

  const correctPantryIds = pantryFoods.filter((food) => food.carb).map((food) => food.id);
  const pantryAccurate =
    pantryChecked &&
    pantrySelections.size === correctPantryIds.length &&
    correctPantryIds.every((id) => pantrySelections.has(id));

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

  async function evaluate(input: unknown, key: EvaluationKey, answer: string) {
    setSelectedAnswers((current) => ({ ...current, [key]: answer }));
    const result = await evaluateDayFourAction(input);
    if (result.ok) setEvaluations((current) => ({ ...current, [key]: result.data }));
    else setMessage(result.message);
  }

  function openTablePart(id: TableMeaningId) {
    setActiveTablePart(id);
    setTableParts((current) => new Set([...current, id]));
  }

  function openNutrient(id: NutrientId) {
    setActiveNutrient(id);
    setViewedNutrients((current) => new Set([...current, id]));
  }

  function togglePantryFood(id: PantryFoodId) {
    if (pantryResolved) return;
    setPantryChecked(false);
    setPantrySelections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function checkPantry() {
    const nextAttempt = pantryAttempts + 1;
    setPantryAttempts(nextAttempt);
    setPantryChecked(true);

    const accurateNow =
      pantrySelections.size === correctPantryIds.length &&
      correctPantryIds.every((id) => pantrySelections.has(id));

    if (!accurateNow && nextAttempt >= 2) {
      setPantrySelections(new Set(correctPantryIds));
      setPantryResolved(true);
    }
  }

  function choosePlateFood(category: PlateCategory, id: PlateFoodId) {
    setPlateSelections((current) => ({ ...current, [category]: id }));
  }

  function nextFavorite() {
    setFavoriteCompleted((current) => Math.max(current, favoriteIndex + 1));
    if (favoriteIndex < favoriteScenarios.length - 1) {
      setFavoriteIndex((current) => current + 1);
      setFavoriteAnswer(null);
    }
  }

  async function evaluateMyth(answer: "myth" | "more_accurate") {
    const result = await evaluateDayFourAction({ answer, stage: "myth", statement: mythIndex });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMythFeedback(result.data);
    if (mythIndex === myths.length - 1) setMythCompleted(myths.length);
  }

  function nextMyth() {
    setMythCompleted((current) => Math.max(current, mythIndex + 1));
    if (mythIndex < myths.length - 1) {
      setMythIndex((current) => current + 1);
      setMythFeedback(null);
    }
  }

  function classifySupport(answer: "support" | "policing") {
    setSupportAnswer(answer);
    if (supportIndex === supportStatements.length - 1)
      setSupportCompleted(supportStatements.length);
  }

  function nextSupport() {
    setSupportCompleted((current) => Math.max(current, supportIndex + 1));
    if (supportIndex < supportStatements.length - 1) {
      setSupportIndex((current) => current + 1);
      setSupportAnswer(null);
    }
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

  function canContinue() {
    if (stage === 0) return foodFear !== null;
    if (stage === 1) return tableParts.size === tableMeanings.length;
    if (stage === 2) return digestionStep === 3 && Boolean(evaluations.digestion);
    if (stage === 3)
      return viewedNutrients.size === nutrients.length && Boolean(evaluations.nutrient);
    if (stage === 4) return pantryAccurate || pantryResolved;
    if (stage === 5) return Boolean(evaluations.fiber);
    if (stage === 6)
      return Boolean(
        plateSelections.vegetable && plateSelections.protein && plateSelections.carbohydrate,
      );
    if (stage === 7) return Boolean(evaluations.plate);
    if (stage === 8) return Boolean(evaluations.drink);
    if (stage === 9) return favoriteCompleted === favoriteScenarios.length;
    if (stage === 10) return Boolean(evaluations.restaurant);
    if (stage === 11) return mythCompleted === myths.length;
    if (stage === 12) return supportCompleted === supportStatements.length;
    if (stage === 13) return receiptsSpread;
    if (stage === 14) return Boolean(evaluations.teachBack) && confidence !== null;
    return reflection !== null;
  }

  function stageRequirement() {
    const requirements = [
      "Choose the description closest to how food feels right now.",
      "Open all four meanings held at the table.",
      "Complete the digestion journey and answer the question.",
      "Listen to all three nutrient roles and answer the question.",
      "Check the carbohydrate shelf. After two attempts, the lesson will reveal the answer so you can continue.",
      "Choose which form usually moves through digestion more gradually.",
      "Add one food to every section of the plate.",
      "Choose the meal that uses balance rather than restriction.",
      "Choose an everyday drink and read the explanation.",
      "Practice keeping all four favorite foods in real life.",
      "Choose a flexible restaurant strategy.",
      "Open and classify all four cupboard statements.",
      "Classify all four comments as helpful support or controlling language.",
      "Spread the meal receipts to reveal the longer pattern.",
      "Choose a plain-language explanation and a confidence check.",
      "Choose one reflection to complete Day 4.",
    ];
    return requirements[stage];
  }

  function continueLabel() {
    const labels = [
      "Set the table",
      "Follow food into the body",
      "Meet the nutrient team",
      "Explore the carbohydrate shelf",
      "Watch fiber change the pace",
      "Build a plate",
      "See what balance adds",
      "Pour the drinks",
      "Keep favorite foods in the story",
      "Take the plate method out to eat",
      "Open the myth cupboard",
      "Invite support to the table",
      "Look beyond one meal",
      "Explain it in plain language",
      "Choose what you will carry forward",
    ] as const;
    return labels[stage] ?? "Continue";
  }

  function renderStage() {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-9">
            <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
              <DayFourHeading label="Day 04 · Food isn't the enemy">
                Your table still belongs to you.
              </DayFourHeading>
              <div className="border-l-2 border-accent-warm pl-6">
                <p className="editorial-number">04</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Today is about understanding food without turning meals into tests of worth.
                </p>
              </div>
            </div>
            <LessonStoryImage
              alt="Family and friends of several generations laugh while cooking rice, beans, vegetables, and flatbread together"
              caption="A diabetes-supportive meal does not require abandoning the foods, people, and traditions that make a table feel like home."
              emphasis="Culture belongs in the plan."
              priority
              src="/lessons/day-04/food-and-culture.jpg"
            />
            <div className="grid gap-7 border-y border-border py-8 sm:grid-cols-[1fr_0.9fr] sm:items-center">
              <div className="space-y-4 text-lg leading-8 text-foreground/80">
                <p>
                  After diagnosis, food can suddenly sound dangerous: no bread, no fruit, no
                  dessert, no family favorites. The rules multiply before anyone explains the body.
                </p>
                <p>
                  This lesson starts somewhere kinder and more useful: food provides nourishment,
                  carbohydrate has a normal job, and balance can add context without removing joy.
                </p>
              </div>
              <div
                aria-label="A warm teaching illustration of a set table with an open place waiting for the learner"
                className={cn(
                  styles.placeSetting,
                  "relative min-h-60 overflow-hidden rounded-[50%] bg-[#efe2d6]",
                )}
                role="img"
              >
                <span className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-card bg-[#f8f1e8] shadow-card" />
                <span className="absolute left-[20%] top-1/2 h-32 w-2 -translate-y-1/2 rounded-full bg-accent-warm/55" />
                <span className="absolute right-[20%] top-1/2 h-32 w-2 -translate-y-1/2 rounded-full bg-success/60" />
                <Heart
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-accent-warm"
                  strokeWidth={1.2}
                />
              </div>
            </div>
            <div className="space-y-4">
              <p className="font-semibold">What felt most uncertain about food after diagnosis?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {foodFears.map(([id, label]) => (
                  <AnswerChoice key={id} onClick={() => setFoodFear(id)} selected={foodFear === id}>
                    {label}
                  </AnswerChoice>
                ))}
              </div>
              {foodFear ? (
                <p className="animate-slide-up border-l-2 border-success bg-info p-5 leading-7">
                  {fearResponses[foodFear]}
                </p>
              ) : null}
            </div>
          </div>
        );
      case 1: {
        const selected = tableMeanings.find((part) => part.id === activeTablePart);
        return (
          <div className="space-y-9">
            <DayFourHeading label="Food is more than a nutrient label">
              Four things can be true at the same table.
            </DayFourHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Food can be fuel without becoming only fuel. Open every place setting to see what a
              meal can hold.
            </p>
            <div className="relative grid gap-3 rounded-[1rem] border border-accent-warm/25 bg-[#eee0d3] p-5 sm:grid-cols-4 sm:p-8">
              <span className="absolute inset-x-5 top-1/2 hidden h-px bg-accent-warm/20 sm:block" />
              {tableMeanings.map((part, index) => (
                <button
                  aria-pressed={activeTablePart === part.id}
                  className={cn(
                    styles.placeSetting,
                    "motion-tactile relative min-h-32 rounded-full border bg-card p-5 text-center shadow-card",
                    activeTablePart === part.id && "border-success bg-info",
                  )}
                  key={part.id}
                  onClick={() => openTablePart(part.id)}
                  style={{ animationDelay: `${index * 90}ms` }}
                  type="button"
                >
                  <span className="editorial-eyebrow">0{index + 1}</span>
                  <span className="mt-4 block font-serif-display text-2xl">{part.label}</span>
                  {tableParts.has(part.id) ? (
                    <Check aria-hidden="true" className="mx-auto mt-3 size-4 text-success" />
                  ) : null}
                </button>
              ))}
            </div>
            {selected ? (
              <blockquote className="animate-slide-up border-l-2 border-accent-warm py-3 pl-6 font-serif-display text-3xl leading-tight">
                {selected.body}
              </blockquote>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {tableParts.size} of {tableMeanings.length} places opened
            </p>
          </div>
        );
      }
      case 2:
        return (
          <div className="space-y-9">
            <DayFourHeading label="Digestion theatre">
              Food becomes small enough for the body to use.
            </DayFourHeading>
            <div className="max-w-3xl space-y-3 text-lg leading-8 text-foreground/80">
              <p>
                After eating, digestion breaks food into smaller components. Proteins can become
                amino acids, fats can become fatty acids, and many carbohydrates become glucose.
              </p>
              <p>Move one meal through the process. Nothing in this journey is a failure.</p>
            </div>
            <LessonMotionFigure variant="digestion-journey" />
            <div className="overflow-hidden rounded-[1rem] border border-accent-warm/25 bg-[#f0e3d8] p-6 sm:p-9">
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {[
                  ["01", "A meal"],
                  ["02", "Digestion"],
                  ["03", "Nutrients"],
                  ["04", "Energy and repair"],
                ].map(([number, label], index) => (
                  <div
                    className={cn(
                      "relative min-h-28 rounded-[9px] border p-3 transition duration-500 sm:p-4",
                      index <= digestionStep
                        ? "border-success bg-info"
                        : "border-border bg-card/60",
                    )}
                    key={number}
                  >
                    <span className="editorial-eyebrow">{number}</span>
                    <span className="mt-4 block font-serif-display text-sm leading-tight sm:text-xl">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div aria-hidden="true" className="relative mx-3 mt-7 h-12">
                <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-card" />
                {[0, 1, 2, 3].map((step) => (
                  <span
                    className={cn(
                      "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-success bg-card",
                      step <= digestionStep && "bg-success",
                    )}
                    key={step}
                    style={{ left: `${4 + (step / 3) * 92}%` }}
                  />
                ))}
                <span
                  className={cn(
                    styles.mealMarker,
                    "absolute top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-warm text-white shadow-card",
                  )}
                  style={{ left: `${4 + (digestionStep / 3) * 92}%` }}
                >
                  <Soup className="size-4" />
                </span>
              </div>
              <Button
                className="mt-7"
                disabled={digestionStep === 3}
                fullWidth={false}
                onClick={() => setDigestionStep((current) => Math.min(3, current + 1))}
                variant="secondary"
              >
                {digestionStep === 3 ? "The meal has been used" : "Move the meal forward"}
              </Button>
            </div>
            {digestionStep === 3 ? (
              <div className="animate-slide-up space-y-4">
                <p className="font-semibold">What is the challenge in Type 2 diabetes?</p>
                {(
                  [
                    [
                      "body_handling",
                      "Food supplies glucose normally; the body has more difficulty managing it effectively.",
                    ],
                    ["food_created_diabetes", "The meal creates diabetes as soon as it is eaten."],
                    ["glucose_is_bad", "The existence of glucose is itself the problem."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() =>
                      void evaluate({ answer, stage: "digestion" }, "digestion", answer)
                    }
                    selected={selectedAnswers.digestion === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
                {evaluations.digestion ? (
                  <ConceptFeedback feedback={evaluations.digestion} />
                ) : null}
              </div>
            ) : null}
          </div>
        );
      case 3: {
        const selected = nutrients.find((nutrient) => nutrient.id === activeNutrient);
        return (
          <div className="space-y-9">
            <DayFourHeading label="The nutrient orchestra">
              Different instruments. Different jobs.
            </DayFourHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              A balanced meal is not built by firing one member of the orchestra. Tap every
              instrument to hear the role it plays.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {nutrients.map((nutrient, index) => (
                <button
                  aria-pressed={activeNutrient === nutrient.id}
                  className={cn(
                    "motion-tactile relative min-h-52 overflow-hidden rounded-[1rem] border bg-card p-6 text-left shadow-card",
                    activeNutrient === nutrient.id && "border-accent-warm",
                  )}
                  key={nutrient.id}
                  onClick={() => openNutrient(nutrient.id)}
                  type="button"
                >
                  <span
                    className={cn("absolute right-6 top-6 size-9 rounded-full", nutrient.color)}
                  />
                  {activeNutrient === nutrient.id ? (
                    <>
                      <span
                        aria-hidden="true"
                        className={cn(
                          styles.note,
                          "absolute right-12 top-20 font-serif-display text-3xl text-accent-warm",
                        )}
                      >
                        ♪
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          styles.note,
                          "absolute right-24 top-28 font-serif-display text-xl text-success",
                        )}
                        style={{ animationDelay: "180ms" }}
                      >
                        ♪
                      </span>
                    </>
                  ) : null}
                  <span className="editorial-eyebrow">Instrument 0{index + 1}</span>
                  <span className="mt-12 block font-serif-display text-3xl">{nutrient.label}</span>
                  <span className="mt-3 block text-sm font-semibold text-muted-foreground">
                    {nutrient.role}
                  </span>
                </button>
              ))}
            </div>
            {selected ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-6 text-lg leading-8">
                {selected.body}
              </p>
            ) : null}
            {viewedNutrients.size === nutrients.length ? (
              <div className="animate-slide-up space-y-4 border-t border-border pt-7">
                <p className="font-semibold">
                  Which nutrient generally has the largest immediate effect on blood glucose?
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(["carbohydrate", "protein", "fat"] as const).map((answer) => (
                    <Button
                      key={answer}
                      onClick={() =>
                        void evaluate({ answer, stage: "nutrient" }, "nutrient", answer)
                      }
                      variant={selectedAnswers.nutrient === answer ? "primary" : "secondary"}
                    >
                      {answer[0]?.toUpperCase()}
                      {answer.slice(1)}
                    </Button>
                  ))}
                </div>
                {evaluations.nutrient ? <ConceptFeedback feedback={evaluations.nutrient} /> : null}
              </div>
            ) : null}
          </div>
        );
      }
      case 4:
        return (
          <div className="space-y-9">
            <DayFourHeading label="The carbohydrate shelf">
              Carbohydrates live in more places than dessert.
            </DayFourHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Tap every food that contains meaningful carbohydrate. Some may play more than one
              nutritional role; beans, for example, provide carbohydrate, fiber, and protein.
            </p>
            <div className="grid grid-cols-2 gap-3 rounded-[1rem] border border-border bg-[#ece2d5] p-4 sm:grid-cols-5 sm:p-7">
              {pantryFoods.map((food, index) => (
                <button
                  aria-pressed={pantrySelections.has(food.id)}
                  className={cn(
                    styles.pantryItem,
                    "motion-tactile min-h-28 rounded-[9px] border p-4 text-left shadow-card",
                    food.tone,
                    pantrySelections.has(food.id) && "border-success ring-2 ring-success/25",
                  )}
                  disabled={pantryResolved}
                  key={food.id}
                  onClick={() => togglePantryFood(food.id)}
                  style={{ animationDelay: `${index * 45}ms` }}
                  type="button"
                >
                  <span className="text-sm font-semibold">{food.label}</span>
                  {pantrySelections.has(food.id) ? (
                    <Check aria-hidden="true" className="mt-5 size-5 text-success" />
                  ) : null}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button disabled={pantryResolved} fullWidth={false} onClick={checkPantry}>
                {pantryResolved ? "Shelf revealed" : "Check the shelf"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {pantrySelections.size} foods selected · {Math.min(pantryAttempts, 2)} of 2 checks
              </span>
            </div>
            {pantryChecked ? (
              <div
                aria-live="polite"
                className={cn(
                  "animate-slide-up border-l-2 p-5 leading-7",
                  pantryAccurate ? "border-success bg-info" : "border-warning bg-warning/10",
                )}
              >
                {pantryResolved
                  ? "Here is the complete shelf so you can keep learning: bread, rice, fruit, milk, beans, potatoes, corn, and oats contain meaningful carbohydrate. Chicken and olive oil primarily play other nutrient roles."
                  : pantryAccurate
                    ? "You found the full shelf: bread, rice, fruit, milk, beans, potatoes, corn, and oats all contain carbohydrate. Chicken and olive oil primarily play other nutrient roles."
                    : "One more check is available. Look for grains, fruit, milk, beans, and starchy vegetables, not only foods that taste sweet."}
              </div>
            ) : null}
          </div>
        );
      case 5:
        return (
          <div className="space-y-9">
            <DayFourHeading label="The fiber funnel">
              The destination can match while the pace changes.
            </DayFourHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Whole fruit and fruit juice can both contribute carbohydrate. Fiber and food structure
              help explain why they may not travel through digestion at the same speed.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1rem] border border-success/30 bg-info p-6 text-center">
                <Apple
                  aria-hidden="true"
                  className="mx-auto size-12 text-success"
                  strokeWidth={1.3}
                />
                <h2 className="mt-4 font-serif-display text-2xl">Whole fruit</h2>
                <div className="relative mx-auto mt-6 h-44 w-32 overflow-hidden">
                  <div className="absolute inset-x-1 top-0 h-16 rounded-t-full border-x-2 border-t-2 border-success/50" />
                  <div className="absolute left-1/2 top-16 h-20 w-12 -translate-x-1/2 border-x-2 border-success/50" />
                  <span
                    className={cn(
                      styles.funnelDropSlow,
                      "absolute left-1/2 top-12 size-4 -translate-x-1/2 rounded-full bg-accent-warm",
                    )}
                  />
                  <span className="absolute left-1/2 top-[4.6rem] h-2 w-20 -translate-x-1/2 rotate-6 rounded-full bg-success/35" />
                </div>
                <p className="text-sm text-muted-foreground">More structure and fiber</p>
              </div>
              <div className="rounded-[1rem] border border-accent-warm/30 bg-[#f3e4dc] p-6 text-center">
                <CupSoda
                  aria-hidden="true"
                  className="mx-auto size-12 text-accent-warm"
                  strokeWidth={1.3}
                />
                <h2 className="mt-4 font-serif-display text-2xl">Fruit juice</h2>
                <div className="relative mx-auto mt-6 h-44 w-32 overflow-hidden">
                  <div className="absolute inset-x-1 top-0 h-16 rounded-t-full border-x-2 border-t-2 border-accent-warm/50" />
                  <div className="absolute left-1/2 top-16 h-20 w-12 -translate-x-1/2 border-x-2 border-accent-warm/50" />
                  <span
                    className={cn(
                      styles.funnelDropFast,
                      "absolute left-1/2 top-12 size-4 -translate-x-1/2 rounded-full bg-accent-warm",
                    )}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Less intact structure</p>
              </div>
            </div>
            <LessonMotionFigure variant="fiber-pace" />
            <p className="font-semibold">
              Which will usually move more gradually through digestion?
            </p>
            {(
              [
                ["whole_fruit", "Whole fruit, because its fiber and structure remain."],
                ["juice_same", "They always move at exactly the same speed."],
                ["fiber_blocks_all", "Whole fruit, because fiber blocks all glucose."],
              ] as const
            ).map(([answer, label]) => (
              <AnswerChoice
                key={answer}
                onClick={() => void evaluate({ answer, stage: "fiber" }, "fiber", answer)}
                selected={selectedAnswers.fiber === answer}
              >
                {label}
              </AnswerChoice>
            ))}
            {evaluations.fiber ? <ConceptFeedback feedback={evaluations.fiber} /> : null}
          </div>
        );
      case 6:
        return (
          <div className="space-y-9">
            <DayFourHeading label="Build, don't subtract">
              Make one plate with three useful roles.
            </DayFourHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Choose one food for each section. This is a flexible visual starting point, not a
              prescription for every cuisine, appetite, budget, or medical need.
            </p>
            <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div
                aria-label="An interactive plate with half for nonstarchy vegetables, one quarter for protein, and one quarter for carbohydrate foods"
                className="mx-auto grid aspect-square w-full max-w-[430px] grid-cols-2 grid-rows-2 overflow-hidden rounded-full border-[12px] border-card bg-card shadow-card ring-1 ring-border"
                role="img"
              >
                <div className="row-span-2 flex items-center justify-center border-r border-card bg-[#c9dbc9] p-5 text-center">
                  <div className={cn(plateSelections.vegetable && styles.platePiece)}>
                    <Carrot
                      aria-hidden="true"
                      className="mx-auto size-10 text-success"
                      strokeWidth={1.3}
                    />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em]">Half</p>
                    <p className="mt-2 font-serif-display text-xl">
                      {plateFoods.find((food) => food.id === plateSelections.vegetable)?.label ??
                        "Nonstarchy vegetables"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center border-b border-card bg-[#e4c8b7] p-4 text-center">
                  <div className={cn(plateSelections.protein && styles.platePiece)}>
                    <Soup
                      aria-hidden="true"
                      className="mx-auto size-8 text-accent-warm"
                      strokeWidth={1.3}
                    />
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em]">Quarter</p>
                    <p className="mt-1 font-serif-display text-lg">
                      {plateFoods.find((food) => food.id === plateSelections.protein)?.label ??
                        "Protein"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center bg-[#ead9a9] p-4 text-center">
                  <div className={cn(plateSelections.carbohydrate && styles.platePiece)}>
                    <Wheat
                      aria-hidden="true"
                      className="mx-auto size-8 text-[#9a712f]"
                      strokeWidth={1.3}
                    />
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em]">Quarter</p>
                    <p className="mt-1 font-serif-display text-lg">
                      {plateFoods.find((food) => food.id === plateSelections.carbohydrate)?.label ??
                        "Carbohydrate"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                {(["vegetable", "protein", "carbohydrate"] as const).map((category) => (
                  <section className="border-t border-border pt-4" key={category}>
                    <h2 className="text-sm font-bold capitalize tracking-wide">{category}</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {plateFoods
                        .filter((food) => food.category === category)
                        .map((food) => (
                          <button
                            aria-pressed={plateSelections[category] === food.id}
                            className={cn(
                              "motion-tactile min-h-12 rounded-full border bg-card px-4 py-2 text-sm font-semibold",
                              plateSelections[category] === food.id && "border-success bg-info",
                            )}
                            key={food.id}
                            onClick={() => choosePlateFood(category, food.id)}
                            type="button"
                          >
                            {food.label}
                          </button>
                        ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
            {plateSelections.vegetable &&
            plateSelections.protein &&
            plateSelections.carbohydrate ? (
              <p className="animate-slide-up border-l-2 border-success bg-info p-5 leading-7">
                You built the entire plate without labeling any food forbidden. Beans can sometimes
                fit in more than one section because foods can play more than one role.
              </p>
            ) : null}
          </div>
        );
      case 7:
        return (
          <div className="space-y-9">
            <DayFourHeading label="Same rice, wider meal">
              Balance changes the company a carbohydrate keeps.
            </DayFourHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Imagine someone wants rice for dinner. Which response uses the plate method without
              turning rice into the enemy?
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {(
                [
                  ["balanced_plate", "Keep a rice portion and add vegetables and a protein."],
                  ["remove_carbs", "Remove the rice because all carbohydrates are forbidden."],
                  [
                    "all_rice",
                    "Fill nearly the entire plate with rice and call balance unnecessary.",
                  ],
                ] as const
              ).map(([answer, label], index) => (
                <button
                  aria-pressed={selectedAnswers.plate === answer}
                  className={cn(
                    "motion-tactile min-h-48 rounded-[1rem] border bg-card p-6 text-left shadow-card",
                    selectedAnswers.plate === answer && "border-accent-warm bg-[#f2e5dc]",
                  )}
                  key={answer}
                  onClick={() => void evaluate({ answer, stage: "plate" }, "plate", answer)}
                  type="button"
                >
                  <span className="editorial-eyebrow">Option 0{index + 1}</span>
                  <span className="mt-8 block font-serif-display text-2xl leading-8">{label}</span>
                </button>
              ))}
            </div>
            {evaluations.plate ? <ConceptFeedback feedback={evaluations.plate} /> : null}
          </div>
        );
      case 8:
        return (
          <div className="space-y-9">
            <DayFourHeading label="What is in the glass?">
              Drinks can move faster than meals.
            </DayFourHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Liquid carbohydrate often arrives without much fiber to slow digestion. Pour each
              option by choosing it, then read what makes it different.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {(
                [
                  ["water", "Water", GlassWater, "bg-[#c8ddd6]"],
                  ["regular_soda", "Regular soda", CupSoda, "bg-[#bf745b]"],
                  ["fruit_juice", "Fruit juice", Apple, "bg-[#dfa94d]"],
                ] as const
              ).map(([answer, label, Icon, fill]) => (
                <button
                  aria-pressed={selectedAnswers.drink === answer}
                  className={cn(
                    "motion-tactile relative min-h-64 overflow-hidden rounded-[1rem] border bg-card p-6 text-left shadow-card",
                    selectedAnswers.drink === answer && "border-accent-warm",
                  )}
                  key={answer}
                  onClick={() => void evaluate({ answer, stage: "drink" }, "drink", answer)}
                  type="button"
                >
                  <Icon aria-hidden="true" className="relative z-10 size-9" strokeWidth={1.3} />
                  <span className="relative z-10 mt-8 block font-serif-display text-3xl">
                    {label}
                  </span>
                  <span className="relative z-10 mt-3 block text-sm text-muted-foreground">
                    {answer === "water"
                      ? "Hydration without carbohydrate"
                      : answer === "regular_soda"
                        ? "Sugar in liquid form"
                        : "Fruit carbohydrate with less fiber"}
                  </span>
                  {selectedAnswers.drink === answer ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        styles.pour,
                        "absolute inset-x-0 bottom-0 h-20 opacity-35",
                        fill,
                      )}
                    />
                  ) : null}
                </button>
              ))}
            </div>
            <p className="font-semibold">Which is the simplest everyday default?</p>
            {evaluations.drink ? <ConceptFeedback feedback={evaluations.drink} /> : null}
          </div>
        );
      case 9: {
        const scenario = favoriteScenarios[favoriteIndex]!;
        const Icon = scenario.icon;
        return (
          <div className="space-y-9">
            <DayFourHeading label="Favorite foods stay in the story">
              Practice a “yes, and” instead of a ban.
            </DayFourHeading>
            <LessonStoryImage
              alt="A diverse group of adult friends laugh and share varied dishes around a restaurant table"
              caption="A satisfying meal can include favorite food, helpful context, and connection. No plate at this table is a test of character."
              emphasis="Eating with joy is not failure."
              src="/lessons/day-04/table-without-guilt.jpg"
            />
            <div className="grid gap-7 rounded-[1rem] border border-accent-warm/25 bg-[#efe3d8] p-6 sm:grid-cols-[14rem_1fr] sm:items-center sm:p-9">
              <div className="flex aspect-square items-center justify-center rounded-full bg-card shadow-card">
                <Icon aria-hidden="true" className="size-20 text-accent-warm" strokeWidth={1.1} />
              </div>
              <div>
                <p className="editorial-eyebrow">
                  Favorite {favoriteIndex + 1} of {favoriteScenarios.length}
                </p>
                <h2 className="mt-4 font-serif-display text-4xl">{scenario.name}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Which response keeps this food in real life and adds useful context?
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {scenario.choices.map((choice, index) => (
                <AnswerChoice
                  key={choice}
                  onClick={() => setFavoriteAnswer(index)}
                  selected={favoriteAnswer === index}
                >
                  {choice}
                </AnswerChoice>
              ))}
            </div>
            {favoriteAnswer !== null ? (
              <div
                aria-live="polite"
                className={cn(
                  "animate-slide-up rounded-[1rem] border p-6",
                  favoriteAnswer === scenario.correct
                    ? "border-success/30 bg-info"
                    : "border-warning/35 bg-warning/10",
                )}
              >
                <p className="font-serif-display text-2xl italic">
                  {favoriteAnswer === scenario.correct
                    ? "Yes, and there is still room for health context."
                    : "That response makes the rule harsher than it needs to be."}
                </p>
                <p className="mt-3 leading-7">{scenario.response}</p>
                {favoriteIndex < favoriteScenarios.length - 1 ? (
                  <Button className="mt-5" fullWidth={false} onClick={nextFavorite}>
                    Keep the next favorite
                  </Button>
                ) : favoriteCompleted < favoriteScenarios.length ? (
                  <Button
                    className="mt-5"
                    fullWidth={false}
                    onClick={() => setFavoriteCompleted(favoriteScenarios.length)}
                  >
                    Keep all four
                  </Button>
                ) : null}
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {favoriteCompleted} of {favoriteScenarios.length} favorites practiced
            </p>
          </div>
        );
      }
      case 10:
        return (
          <div className="space-y-9">
            <DayFourHeading label="The restaurant question">
              Look for “more balanced,” not “perfect.”
            </DayFourHeading>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="relative min-h-80 rounded-t-full border border-accent-warm/25 bg-[#eadace] p-8 text-center">
                <ChefHat
                  aria-hidden="true"
                  className="mx-auto size-16 text-accent-warm"
                  strokeWidth={1.1}
                />
                <p className="mt-7 font-serif-display text-3xl">Tonight&apos;s menu</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Familiar foods, larger portions, imperfect information, and still more than one
                  reasonable choice.
                </p>
                <span
                  className={cn(
                    styles.steam,
                    "absolute left-[36%] top-24 h-10 w-px bg-accent-warm/40",
                  )}
                />
                <span
                  className={cn(
                    styles.steam,
                    "absolute right-[36%] top-20 h-12 w-px bg-success/40",
                  )}
                  style={{ animationDelay: "-700ms" }}
                />
              </div>
              <div className="space-y-3">
                {(
                  [
                    [
                      "build_balance",
                      "Ask what can provide vegetables, protein, a carbohydrate portion, and a drink that fits your needs.",
                    ],
                    [
                      "ban_carbs",
                      "Remove every carbohydrate before considering the rest of the meal.",
                    ],
                    ["find_perfect", "Search until you find the one flawless menu item."],
                  ] as const
                ).map(([answer, label]) => (
                  <AnswerChoice
                    key={answer}
                    onClick={() =>
                      void evaluate({ answer, stage: "restaurant" }, "restaurant", answer)
                    }
                    selected={selectedAnswers.restaurant === answer}
                  >
                    {label}
                  </AnswerChoice>
                ))}
              </div>
            </div>
            {evaluations.restaurant ? <ConceptFeedback feedback={evaluations.restaurant} /> : null}
          </div>
        );
      case 11:
        return (
          <div className="space-y-9">
            <DayFourHeading label="Open the myth cupboard">
              Some food rules were never facts.
            </DayFourHeading>
            <div className="relative min-h-80 overflow-hidden rounded-[1rem] border border-accent-warm/25 bg-[#e8d5c5] p-6 sm:p-10">
              <div className="absolute inset-6 rounded-[9px] border border-[#8f5d48]/30 bg-[#f7eee4] p-8 sm:inset-10">
                <p className="editorial-eyebrow">
                  Cupboard {mythIndex + 1} of {myths.length}
                </p>
                <blockquote className="mt-10 max-w-4xl font-serif-display text-3xl leading-tight sm:text-4xl">
                  “{myths[mythIndex]}”
                </blockquote>
              </div>
              {mythFeedback ? (
                <span className="absolute right-10 top-10 rounded-full border border-success/30 bg-info px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-success">
                  Opened
                </span>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => void evaluateMyth("myth")} variant="secondary">
                This is a rigid myth
              </Button>
              <Button onClick={() => void evaluateMyth("more_accurate")} variant="secondary">
                This is more accurate
              </Button>
            </div>
            {mythFeedback ? (
              <div className="space-y-4">
                <ConceptFeedback feedback={mythFeedback} />
                {mythIndex < myths.length - 1 ? (
                  <Button onClick={nextMyth}>Open the next cupboard</Button>
                ) : null}
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {mythCompleted} of {myths.length} statements opened
            </p>
          </div>
        );
      case 12: {
        const current = supportStatements[supportIndex]!;
        const correct = supportAnswer === current.answer;
        return (
          <div className="space-y-9">
            <DayFourHeading label="How family and friends can help">
              Does this comment preserve the person&apos;s choice?
            </DayFourHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              Helpful support asks permission and collaborates. A controlling comment uses shame,
              fear, or someone else&apos;s rules to take over the food decision.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[9px] border border-success/30 bg-info p-5">
                <p className="font-semibold">Helpful support</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  “Would you like help?” The person keeps the final choice.
                </p>
              </div>
              <div className="rounded-[9px] border border-accent-warm/30 bg-[#f2e5dc] p-5">
                <p className="font-semibold">Controlling comment</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  “You are not allowed.” Shame or permission replaces collaboration.
                </p>
              </div>
            </div>
            <div className="grid gap-7 rounded-[1rem] border border-border bg-card p-6 shadow-card sm:grid-cols-[auto_1fr] sm:items-center sm:p-10">
              <div className="flex size-36 items-center justify-center rounded-full bg-[#e4eee5]">
                <Heart aria-hidden="true" className="size-16 text-success" strokeWidth={1.1} />
              </div>
              <div>
                <p className="editorial-eyebrow">
                  Conversation {supportIndex + 1} of {supportStatements.length}
                </p>
                <blockquote className="mt-5 font-serif-display text-3xl leading-tight sm:text-4xl">
                  “{current.text}”
                </blockquote>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => classifySupport("support")} variant="secondary">
                Helpful support
              </Button>
              <Button onClick={() => classifySupport("policing")} variant="secondary">
                Controlling comment
              </Button>
            </div>
            {supportAnswer ? (
              <div
                aria-live="polite"
                className={cn(
                  "animate-slide-up rounded-[1rem] border p-6",
                  correct ? "border-success/30 bg-info" : "border-warning/35 bg-warning/10",
                )}
              >
                <p className="font-serif-display text-2xl italic">
                  {correct
                    ? "Yes. The difference is who keeps the choice."
                    : current.answer === "support"
                      ? "This comment offers help without taking over."
                      : "This comment takes control of someone else's food decision."}
                </p>
                <p className="mt-3 leading-7">
                  {current.answer === "support"
                    ? "It asks or collaborates, so the person with diabetes keeps agency and can say yes or no."
                    : "It uses fear, permission, or shame. That can increase anxiety without teaching a practical skill."}
                </p>
                {supportIndex < supportStatements.length - 1 ? (
                  <Button className="mt-5" fullWidth={false} onClick={nextSupport}>
                    Read the next comment
                  </Button>
                ) : null}
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {supportCompleted} of {supportStatements.length} conversations classified
            </p>
          </div>
        );
      }
      case 13:
        return (
          <div className="space-y-10">
            <DayFourHeading label="One meal is one receipt">
              A life is made from patterns, not one dinner.
            </DayFourHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              One balanced meal does not instantly change everything. One celebration meal does not
              erase everything. Spread two weeks of meal receipts to see the larger context.
            </p>
            <button
              aria-label="Spread fourteen fictional meal receipts to reveal the longer eating pattern"
              className="relative min-h-[28rem] w-full overflow-hidden rounded-[1rem] border border-accent-warm/25 bg-[#eee1d5] p-7 text-left"
              onClick={() => setReceiptsSpread(true)}
              type="button"
            >
              {!receiptsSpread ? (
                <>
                  <span className="editorial-eyebrow">Fourteen ordinary meals and moments</span>
                  <span className="mt-4 block font-serif-display text-3xl">
                    Tap to spread the receipts
                  </span>
                </>
              ) : null}
              <span
                className={cn(
                  "absolute inset-x-8 bottom-8 transition-[top] duration-500",
                  receiptsSpread ? "top-8" : "top-28",
                )}
              >
                {Array.from({ length: 14 }, (_, index) => {
                  const rotation = receiptsSpread ? (index - 6.5) * 2.2 : 0;
                  const left = receiptsSpread ? 4 + (index % 7) * 14 : 42;
                  const top = receiptsSpread ? Math.floor(index / 7) * 42 : index * 0.7;
                  return (
                    <span
                      className={cn(
                        styles.receipt,
                        "absolute h-40 w-28 border border-border bg-card p-3 shadow-card transition-all duration-500",
                        index === 9 && "border-accent-warm bg-[#f3e5dc]",
                      )}
                      key={index}
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        transform: `rotate(${rotation}deg)`,
                      }}
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Meal {index + 1}
                      </span>
                      <span className="mt-4 block h-px bg-border" />
                      <span className="mt-3 block h-px w-4/5 bg-border" />
                      <span className="mt-3 block font-serif-display text-sm">
                        {index === 9
                          ? "Celebration"
                          : index % 3 === 0
                            ? "Shared table"
                            : "Ordinary day"}
                      </span>
                    </span>
                  );
                })}
              </span>
            </button>
            {receiptsSpread ? (
              <div className="animate-slide-up grid gap-5 border-y border-border py-7 sm:grid-cols-2">
                <p className="font-serif-display text-2xl leading-8">
                  Consistency is something you return to, not something one meal can destroy.
                </p>
                <p className="text-lg leading-8 text-muted-foreground">
                  Patterns matter, and personal eating plans can still include culture, budget,
                  appetite, medicines, preferences, and celebrations.
                </p>
              </div>
            ) : null}
          </div>
        );
      case 14:
        return (
          <div className="space-y-9">
            <DayFourHeading label="Teach it back">
              How would you explain food and blood glucose now?
            </DayFourHeading>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">
              A friend says, “I have Type 2 diabetes, so I guess carbohydrates and every food I love
              are gone.” Which answer carries the lesson accurately?
            </p>
            {(
              [
                [
                  "food_with_context",
                  "Carbohydrates affect blood glucose, but they can remain part of meals. Fiber, balance, portions, patterns, preferences, and your care plan all add context.",
                ],
                ["carbs_forbidden", "Yes. Every carbohydrate needs to disappear immediately."],
                ["perfect_diet", "You only need to discover the one perfect diabetes diet."],
              ] as const
            ).map(([answer, label]) => (
              <AnswerChoice
                key={answer}
                onClick={() => void evaluate({ answer, stage: "teach_back" }, "teachBack", answer)}
                selected={selectedAnswers.teachBack === answer}
              >
                {label}
              </AnswerChoice>
            ))}
            {evaluations.teachBack ? <ConceptFeedback feedback={evaluations.teachBack} /> : null}
            {evaluations.teachBack ? (
              <div className="animate-slide-up border-y border-border py-7">
                <p className="font-semibold">
                  Could you build a balanced plate from foods you know?
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    "Yes, I could build one.",
                    "I understand the idea but want more practice.",
                    "I want help adapting it to my needs.",
                  ].map((choice) => (
                    <button
                      aria-pressed={confidence === choice}
                      className={cn(
                        "motion-tactile min-h-16 rounded-[9px] border bg-card p-4 text-left text-sm",
                        confidence === choice && "border-success bg-info",
                      )}
                      key={choice}
                      onClick={() => setConfidence(choice)}
                      type="button"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        );
      default:
        return (
          <div className="space-y-10">
            <div className="text-center">
              <p className="editorial-eyebrow">Let the rules loosen</p>
              <h1 className="mx-auto mt-5 max-w-4xl font-serif-display text-[length:var(--text-page-title)] font-normal leading-[0.94] text-balance">
                Four permissions are enough for today.
              </h1>
            </div>
            <div className="space-y-0 border-y border-border">
              {[
                ["01", "Food nourishes", "It is fuel, culture, connection, and celebration."],
                [
                  "02",
                  "Carbs can remain",
                  "They affect glucose, but they are not automatically forbidden.",
                ],
                [
                  "03",
                  "Balance can add",
                  "Vegetables, protein, fiber, and context can join the meal.",
                ],
                ["04", "Patterns matter", "One meal is not a verdict on an entire life."],
              ].map(([number, heading, body], index) => (
                <div
                  className="grid gap-3 py-6 sm:grid-cols-[5rem_13rem_1fr] sm:items-baseline"
                  key={number}
                >
                  <span className="font-serif-display text-4xl text-accent-warm/70">{number}</span>
                  <h2 className="font-serif-display text-2xl font-semibold">{heading}</h2>
                  <p className="leading-7 text-muted-foreground">{body}</p>
                  <span
                    aria-hidden="true"
                    className={cn(styles.permissionLine, "h-px bg-border sm:col-span-3")}
                    style={{ animationDelay: `${index * 90}ms` }}
                  />
                </div>
              ))}
            </div>
            <div className="border-l-2 border-success py-2 pl-6 sm:pl-9">
              <p className="editorial-eyebrow text-success">Reflection</p>
              <h2 className="mt-4 font-serif-display text-3xl sm:text-4xl">
                What feels more possible at the table now?
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {reflectionOptions.map((option) => (
                  <AnswerChoice
                    key={option}
                    onClick={() => setReflection(option)}
                    selected={reflection === option}
                  >
                    {option}
                  </AnswerChoice>
                ))}
              </div>
              {reflection ? (
                <p aria-live="polite" className="mt-5 bg-info p-5 leading-7">
                  {reflection.includes("professional") || reflection.includes("culture")
                    ? "That is a thoughtful next step. A registered dietitian nutritionist or diabetes education specialist can help shape this framework around your health needs, culture, budget, medicines, and preferences."
                    : "That is enough for today. Confidence can begin with one meal you understand, not a lifetime of perfect eating."}
                </p>
              ) : null}
            </div>
            {reflection ? (
              <div className="animate-slide-up space-y-7">
                <div className="grid gap-6 border-y border-accent-warm/25 bg-[#f1e5dc] p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                  <div>
                    <p className="editorial-eyebrow">Tomorrow · Day 5</p>
                    <h2 className="mt-3 font-serif-display text-3xl">Eating in real life</h2>
                    <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                      You will carry this flexible plate into portions, labels, drinks, snacks, and
                      repeatable meal choices, without searching for perfection.
                    </p>
                  </div>
                  <ShoppingBasketIllustration />
                </div>
                <Button disabled={isPending} onClick={finishExperience} size="lg">
                  {isPending
                    ? "Saving your progress…"
                    : experience.accessMode === "review"
                      ? "Return to lesson library"
                      : "Complete Day 4"}
                </Button>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button fullWidth={false} onClick={() => goToStage(4)} variant="text">
                    Review the carbohydrate shelf
                  </Button>
                  <Button fullWidth={false} onClick={() => goToStage(6)} variant="text">
                    Build another plate
                  </Button>
                  <Link
                    className={buttonVariants({ fullWidth: false, variant: "text" })}
                    href="/lessons/3"
                  >
                    Return to Day 3
                  </Link>
                </div>
              </div>
            ) : null}
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
            <p className="text-sm font-semibold text-accent-warm">Day 4</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Food Isn&apos;t the Enemy
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
            label={`Day 4 chapter ${stage + 1} of ${stageCount}`}
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
        title="Leave Day 4 for now?"
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
        title="Day 4 glossary"
      >
        <div className="max-h-[60dvh] space-y-5 overflow-y-auto pr-2">
          {dayFourGlossary.map((entry) => (
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

function ShoppingBasketIllustration() {
  return (
    <div
      aria-label="A simple teaching illustration of a grocery basket containing varied foods"
      className="relative flex size-28 items-end justify-center rounded-full bg-card"
      role="img"
    >
      <div className="mb-5 h-12 w-20 rounded-b-[1.5rem] border-2 border-accent-warm bg-[#ead8c8]" />
      <Apple aria-hidden="true" className="absolute left-7 top-7 size-8 text-accent-warm" />
      <Carrot aria-hidden="true" className="absolute right-7 top-6 size-9 rotate-12 text-success" />
      <Milk
        aria-hidden="true"
        className="absolute left-1/2 top-4 size-8 -translate-x-1/2 text-[#6f8f87]"
      />
    </div>
  );
}
