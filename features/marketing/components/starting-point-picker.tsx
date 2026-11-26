"use client";

import { ArrowRight, BookOpen, Compass, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import {
  landingChoice,
  landingMuted,
  landingPanel,
  landingPrimaryLink,
} from "@/features/marketing/components/landing-ui";

type StepKind = "Lesson" | "Story" | "Tool";

type StartingPoint = {
  id: string;
  label: string;
  heading: string;
  note: string;
  steps: readonly { kind: StepKind; title: string; detail: string }[];
  next: string;
  cta: string;
  publicLink?: { href: string; label: string };
};

const startingPoints: readonly StartingPoint[] = [
  {
    id: "new",
    label: "I was just diagnosed",
    heading: "Start with the first five minutes.",
    note: "You don't need to learn everything this week. These cover what to hold onto first.",
    steps: [
      {
        kind: "Lesson",
        title: "The First Five Minutes After Diagnosis",
        detail: "Lesson 1 · about 5 minutes",
      },
      { kind: "Story", title: "Marcus, After the Appointment", detail: "About 7 minutes" },
      {
        kind: "Tool",
        title: "Appointment preparation",
        detail: "Write down questions before your follow-up",
      },
    ],
    next: "/lessons/1",
    cta: "Open Lesson 1",
  },
  {
    id: "numbers",
    label: "My numbers confuse me",
    heading: "Start with what the numbers mean.",
    note: "A1C, a single reading, and a trend each tell you something different.",
    steps: [
      { kind: "Lesson", title: "Making Sense of Your Glucose", detail: "Lesson 8" },
      { kind: "Story", title: "Devon, After Dinner", detail: "About 7 minutes" },
      { kind: "Tool", title: "Medical glossary", detail: "Look up any term in plain language" },
    ],
    next: "/lessons/8",
    cta: "Open Lesson 8",
  },
  {
    id: "food",
    label: "Food feels complicated",
    heading: "Start with food that still fits.",
    note: "Balanced meals, not a list of foods to fear.",
    steps: [
      { kind: "Lesson", title: "Food Is Not the Enemy", detail: "Lesson 4" },
      { kind: "Story", title: "Asha, Sunday Dinner", detail: "About 7 minutes" },
      {
        kind: "Tool",
        title: "Decode the Label",
        detail: "Practice on real-style nutrition labels",
      },
    ],
    next: "/lessons/4",
    cta: "Open Lesson 4",
  },
  {
    id: "medicine",
    label: "I have a new prescription",
    heading: "Start with what your medicine is for.",
    note: "Different bodies can need different tools. Needing medicine is not a failure.",
    steps: [
      { kind: "Lesson", title: "Medicines Are Tools, Not Judgments", detail: "Lesson 7" },
      { kind: "Story", title: "Nora, The Prescription Bag", detail: "About 7 minutes" },
      { kind: "Tool", title: "AI guide", detail: "Ask a question in your own words" },
    ],
    next: "/lessons/7",
    cta: "Open Lesson 7",
  },
  {
    id: "caregiver",
    label: "I'm helping someone else",
    heading: "Start on the caregiver path.",
    note: "Practical ways to help without taking over, and how to look after yourself too.",
    steps: [
      { kind: "Lesson", title: "Caregiver path", detail: "Short modules for family and friends" },
      {
        kind: "Lesson",
        title: "Support, Stigma, and the People Around You",
        detail: "From the main lessons",
      },
      { kind: "Tool", title: "Appointment preparation", detail: "Questions to bring to a visit" },
    ],
    next: "/caregiver",
    cta: "Open the caregiver path",
    publicLink: { href: "/caregiver/urgent-help", label: "Signs that need urgent help" },
  },
];

const stepIcon = { Lesson: BookOpen, Story: MessagesSquare, Tool: Compass } as const;

export function StartingPointPicker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = startingPoints.find((point) => point.id === selectedId) ?? null;
  const resultRef = useRef<HTMLDivElement>(null);

  function choose(id: string) {
    setSelectedId(id);
    // On narrow screens the result sits below the choices, so bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        }),
      );
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
      <div>
        <p className="editorial-eyebrow">Where are you starting?</p>
        <h2 className="mt-4 font-serif-display text-4xl font-normal leading-tight sm:text-5xl">
          Pick what fits. We&apos;ll point you to the right first step.
        </h2>
        <div
          aria-label="Choose your starting point"
          className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
          role="group"
        >
          {startingPoints.map((point) => (
            <button
              aria-pressed={point.id === selectedId}
              className={landingChoice}
              key={point.id}
              onClick={() => choose(point.id)}
              type="button"
            >
              {point.label}
            </button>
          ))}
        </div>
      </div>

      <div
        aria-live="polite"
        className={`${landingPanel} min-h-[22rem] scroll-mt-28`}
        ref={resultRef}
      >
        {selected ? (
          <div className="animate-fade-in" key={selected.id}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a85f4b]">
              Your first three steps
            </p>
            <h3 className="mt-3 font-serif-display text-3xl font-semibold leading-tight">
              {selected.heading}
            </h3>
            <p className={`mt-2 ${landingMuted}`}>{selected.note}</p>
            <ol className="mt-6 grid gap-3">
              {selected.steps.map((step, index) => {
                const Icon = stepIcon[step.kind];
                return (
                  <li
                    className="flex items-start gap-4 rounded-[14px] bg-[#f4ede4] px-4 py-4"
                    key={step.title}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fffaf3] text-[#a85f4b]">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#6b5b52]">
                        {index + 1}. {step.kind}
                      </span>
                      <span className="mt-1 block font-semibold text-[#382c26]">{step.title}</span>
                      <span className={`block text-sm ${landingMuted}`}>{step.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                className={landingPrimaryLink}
                href={`/login?next=${encodeURIComponent(selected.next)}`}
              >
                {selected.cta} <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              {selected.publicLink ? (
                <Link
                  className="font-semibold text-[#382c26] underline decoration-[#c97860]/50 decoration-2 underline-offset-[6px]"
                  href={selected.publicLink.href}
                >
                  {selected.publicLink.label}
                </Link>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="grid h-full min-h-[18rem] place-items-center text-center">
            <div>
              <p className="font-serif-display text-2xl text-[#493a32]">
                Choose the one that sounds most like you.
              </p>
              <p className={`mx-auto mt-2 max-w-xs ${landingMuted}`}>
                You&apos;ll see a lesson, a story, and a tool picked for where you are right now.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
