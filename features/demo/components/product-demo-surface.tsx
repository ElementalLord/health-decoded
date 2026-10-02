"use client";

import {
  BookOpen,
  Bot,
  HeartHandshake,
  Library,
  Route,
  Sparkles,
  Trophy,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type KeyboardEvent, type MouseEvent, useRef, useState } from "react";

import { SunCupIllustration } from "@/components/illustrations/editorial-illustrations";
import { MilestonesPage } from "@/features/achievements/components/milestones-page";
import { AiChat } from "@/features/ai/components/ai-chat";
import { CaregiverLanding } from "@/features/caregiver/components/landing/caregiver-landing";
import { JourneyGreeting } from "@/features/journeys/components/journey-greeting";
import { JourneyProgressSummary } from "@/features/journeys/components/journey-progress-summary";
import { DiabetesMythCheck } from "@/features/mythbusters/components/diabetes-myth-check";
import { JourneyProgressExperience } from "@/features/progress/components/journey-progress-experience";
import { ResourcesList } from "@/features/resources/components/resources";
import { StoryLanding } from "@/features/stories/components/story-landing";
import type { Resource } from "@/features/stories/schemas/resource.schema";
import { type2DiabetesResources } from "@/content/resources/type-2-diabetes-resources";

import { demoJourneyProgress, demoMilestones, demoProgress } from "../content/demo-content";
import styles from "./demo.module.css";

const features = [
  { id: "journey", label: "Journey", icon: Route },
  { id: "ai", label: "AI Tutor", icon: Bot },
  { id: "myth", label: "Myth Check", icon: Sparkles },
  { id: "caregiver", label: "Caregiver", icon: HeartHandshake },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "milestones", label: "Milestones", icon: Trophy },
  { id: "resources", label: "Resources", icon: Library },
  { id: "stories", label: "Stories", icon: BookOpen },
] as const;

export type DemoFeatureId = (typeof features)[number]["id"];

function isFeatureId(value: string | null): value is DemoFeatureId {
  return features.some((feature) => feature.id === value);
}

function JourneyDemo() {
  return (
    <div className={styles.reusedJourney}>
      <JourneyGreeting
        completedLessons={8}
        currentLessonStatus="not_started"
        displayName="Alex"
        totalLessons={14}
      />
      <section className={styles.reusedJourneyNext}>
        <div>
          <p className="editorial-eyebrow">Your next lesson</p>
          <h2>Preparing for the unexpected</h2>
          <p>Build a simple plan for days when your usual routine changes.</p>
        </div>
        <SunCupIllustration />
      </section>
      <JourneyProgressSummary journeyTitle="Foundation" progress={demoJourneyProgress} />
    </div>
  );
}

function ProductPanel({ feature }: { feature: DemoFeatureId }) {
  switch (feature) {
    case "journey":
      return <JourneyDemo />;
    case "ai":
      return (
        <div className={styles.reusedAi}>
          <header>
            <p className="editorial-eyebrow">Learning support</p>
            <h1 className="font-serif-display">Ask Health Decoded</h1>
            <p>Ask for a plain-language explanation from the reviewed local knowledge library.</p>
          </header>
          <AiChat demo />
        </div>
      );
    case "myth":
      return <DiabetesMythCheck demo />;
    case "caregiver":
      return <CaregiverLanding />;
    case "progress":
      return (
        <div className={styles.reusedProgress}>
          <header>
            <p className="editorial-eyebrow">Your learning journey</p>
            <h1 className="font-serif-display">Your progress</h1>
            <p>This is a record of the lessons and milestones Alex has completed.</p>
          </header>
          <JourneyProgressExperience achievement={null} data={demoProgress} />
        </div>
      );
    case "milestones":
      return <MilestonesPage items={demoMilestones} />;
    case "resources":
      return <ResourcesList resources={[...type2DiabetesResources] as Resource[]} />;
    case "stories":
      return <StoryLanding />;
  }
}

export function ProductDemoSurface({
  compact = false,
  initialFeature,
}: {
  compact?: boolean;
  initialFeature?: DemoFeatureId;
}) {
  const searchParams = useSearchParams();
  const requestedFeature = searchParams.get("feature");
  const [active, setActive] = useState<DemoFeatureId>(
    initialFeature ?? (isFeatureId(requestedFeature) ? requestedFeature : "journey"),
  );
  const [notice, setNotice] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function selectFeature(feature: DemoFeatureId) {
    setActive(feature);
    setNotice(null);
    requestAnimationFrame(() => panelRef.current?.scrollTo({ top: 0 }));
  }

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % features.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + features.length) % features.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = features.length - 1;
    else return;

    event.preventDefault();
    const nextFeature = features[nextIndex];
    if (!nextFeature) return;
    selectFeature(nextFeature.id);
    event.currentTarget.parentElement
      ?.querySelector<HTMLButtonElement>(`#demo-feature-${nextFeature.id}`)
      ?.focus();
  }

  function keepInsideDemo(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const anchor = target.closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href?.startsWith("/") || href.startsWith("/demo")) return;

    event.preventDefault();
    setNotice(
      "That screen belongs to the signed-in app. This public demo does not change real data.",
    );
  }

  return (
    <div className={styles.productDemo} data-compact={compact || undefined}>
      <nav
        aria-label="Explore Health Decoded features"
        className={styles.productTabs}
        role="tablist"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <button
              aria-controls="demo-feature-panel"
              aria-current={active === feature.id ? "page" : undefined}
              aria-selected={active === feature.id}
              id={`demo-feature-${feature.id}`}
              key={feature.id}
              onClick={() => selectFeature(feature.id)}
              onKeyDown={(event) => navigateTabs(event, index)}
              role="tab"
              tabIndex={active === feature.id ? 0 : -1}
              type="button"
            >
              <Icon aria-hidden="true" />
              <span>{feature.label}</span>
            </button>
          );
        })}
      </nav>
      {notice ? (
        <p aria-live="polite" className={styles.demoNotice} role="status">
          {notice}
        </p>
      ) : null}
      {compact ? (
        <div className={styles.compactToolbar}>
          <span>{features.find((feature) => feature.id === active)?.label}</span>
          <Link href={`/demo/explore?feature=${active}`}>Open larger</Link>
        </div>
      ) : null}
      <div
        className={`app-page-container ${styles.productPanel}`}
        data-feature={active}
        id="demo-feature-panel"
        key={active}
        onClickCapture={keepInsideDemo}
        ref={panelRef}
        role="tabpanel"
      >
        <ProductPanel feature={active} />
      </div>
    </div>
  );
}
