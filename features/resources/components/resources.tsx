"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, RotateCcw, ShieldCheck } from "lucide-react";

import type { Resource } from "@/features/stories/schemas/resource.schema";

import styles from "./resources.module.css";

type ResourceId = Resource["id"];

type Topic = {
  description: string;
  id: string;
  resourceIds: ResourceId[];
  title: string;
};

type Thumbnail = {
  alt: string;
  src: string;
};

const VIEWED_STORAGE_KEY = "health-decoded:resources:viewed";

const topics: Topic[] = [
  {
    description:
      "The diagnosis, A1C, and glucose readings—explained without making the first questions feel larger than they are.",
    id: "new-here",
    resourceIds: ["type-2-diabetes-basics", "understanding-a1c", "monitoring-blood-sugar"],
    title: "If you’re new here",
  },
  {
    description:
      "Practical ways to keep familiar food, culture, and workable movement in everyday life.",
    id: "daily-living",
    resourceIds: ["diabetes-meal-planning", "cultural-foods", "physical-activity"],
    title: "Food & daily living",
  },
  {
    description:
      "Treatment choices and the plans that are easiest to make before a difficult moment arrives.",
    id: "staying-safe",
    resourceIds: ["diabetes-treatments", "low-blood-sugar", "managing-sick-days"],
    title: "Medicines & staying safe",
  },
  {
    description:
      "Steady, fear-free guidance for protecting your heart, kidneys, eyes, feet, and mouth.",
    id: "long-term-health",
    resourceIds: [
      "heart-disease-and-stroke",
      "kidney-health",
      "eye-health",
      "foot-care",
      "oral-health",
    ],
    title: "Long-term health",
  },
  {
    description:
      "Emotional, educational, financial, and practical support for carrying care with less weight.",
    id: "living-confidently",
    resourceIds: [
      "diabetes-and-mental-health",
      "diabetes-education-and-support",
      "financial-help",
      "emergency-preparedness",
    ],
    title: "Living confidently",
  },
];

const thumbnails: Partial<Record<ResourceId, Thumbnail>> = {
  "diabetes-meal-planning": {
    alt: "A parent and child preparing a familiar meal together",
    src: "/resources/family-meal-editorial.jpg",
  },
  "emergency-preparedness": {
    alt: "Hands organizing glucose supplies, water, light, power, and a checklist in an emergency bag",
    src: "/resources/emergency-kit-natural.png",
  },
  "foot-care": {
    alt: "An adult calmly checking the sole of one foot with a hand mirror",
    src: "/resources/foot-check-natural.png",
  },
};

function shortSource(organization: string) {
  return organization.startsWith("Centers") ? "CDC" : "NIDDK";
}

function reviewedLabel(verifiedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${verifiedAt}T00:00:00Z`));
}

function mustFind(resources: Resource[], id: ResourceId) {
  const resource = resources.find((item) => item.id === id);
  if (!resource) throw new Error(`Missing curated resource: ${id}`);
  return resource;
}

function resourceKind(resource: Resource, startHere: boolean) {
  if (startHere) return "Start here";
  if (resource.format === "Checklist") return "Checklist";
  if (resource.reading_level === "Deeper read") return "Deeper read";
  return resource.format;
}

function saveViewed(ids: Set<ResourceId>) {
  try {
    window.localStorage.setItem(VIEWED_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Reading progress is a convenience; links must still work when storage is unavailable.
  }
}

function ResourceMeta({ resource }: { resource: Resource }) {
  return (
    <div className={styles.meta}>
      <span className={styles.sourceMark}>{shortSource(resource.organization)}</span>
      <span className={styles.verified}>
        <ShieldCheck aria-hidden="true" size={14} strokeWidth={1.8} />
        Verified
      </span>
      <span>{resource.reading_level}</span>
      <span>{resource.reading_minutes} min read</span>
      <span>Reviewed {reviewedLabel(resource.verified_at)}</span>
    </div>
  );
}

function ViewedMark({ viewed }: { viewed: boolean }) {
  if (!viewed) return null;

  return (
    <span className={styles.viewedMark}>
      <Check aria-hidden="true" size={15} strokeWidth={2} />
      Viewed
    </span>
  );
}

function ResourceLink({
  children,
  className,
  onView,
  resource,
}: {
  children: React.ReactNode;
  className?: string | undefined;
  onView: (id: ResourceId) => void;
  resource: Resource;
}) {
  return (
    <a
      aria-label={`${resource.title} from ${shortSource(resource.organization)} (opens in a new tab)`}
      className={className}
      href={resource.url}
      onClick={() => onView(resource.id)}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

function RecommendedResource({
  onView,
  primary = false,
  resource,
  viewed,
}: {
  onView: (id: ResourceId) => void;
  primary?: boolean;
  resource: Resource;
  viewed: boolean;
}) {
  return (
    <article className={primary ? styles.recommendedPrimary : styles.recommendedSecondary}>
      <ResourceLink onView={onView} resource={resource}>
        <div className={styles.recommendedTopline}>
          <span>{primary ? "A clear first read" : resource.format}</span>
          <ViewedMark viewed={viewed} />
        </div>
        <h3>{resource.title}</h3>
        <p>{resource.description}</p>
        <ResourceMeta resource={resource} />
        <ArrowUpRight
          aria-hidden="true"
          className={styles.linkArrow}
          size={20}
          strokeWidth={1.65}
        />
      </ResourceLink>
    </article>
  );
}

function ResourceRow({
  onView,
  resource,
  startHere = false,
  viewed,
}: {
  onView: (id: ResourceId) => void;
  resource: Resource;
  startHere?: boolean;
  viewed: boolean;
}) {
  const thumbnail = thumbnails[resource.id];

  return (
    <article className={startHere ? styles.resourceRowStart : styles.resourceRow}>
      <ResourceLink className={styles.resourceRowLink} onView={onView} resource={resource}>
        <div className={styles.resourceType}>{resourceKind(resource, startHere)}</div>
        <div className={styles.resourceMain}>
          {thumbnail ? (
            <div className={styles.thumbnail}>
              <Image
                alt={thumbnail.alt}
                fill
                sizes="(max-width: 48rem) 112px, 148px"
                src={thumbnail.src}
              />
            </div>
          ) : null}
          <div>
            <div className={styles.resourceTitleLine}>
              <h3>{resource.title}</h3>
              <ViewedMark viewed={viewed} />
            </div>
            <p>{resource.description}</p>
          </div>
        </div>
        <ResourceMeta resource={resource} />
        <ArrowUpRight aria-hidden="true" className={styles.rowArrow} size={19} strokeWidth={1.6} />
      </ResourceLink>
    </article>
  );
}

function ProgressMeter({
  onClear,
  total,
  viewedCount,
}: {
  onClear: () => void;
  total: number;
  viewedCount: number;
}) {
  const percent = total === 0 ? 0 : Math.round((viewedCount / total) * 100);

  return (
    <section aria-labelledby="reading-progress-title" className={styles.progressPanel}>
      <div className={styles.progressCopy}>
        <div>
          <p className={styles.eyebrow}>Your reading progress</p>
          <h2 id="reading-progress-title">
            {viewedCount} of {total} guides viewed
          </h2>
        </div>
        {viewedCount > 0 ? (
          <button className={styles.clearProgress} onClick={onClear} type="button">
            <RotateCcw aria-hidden="true" size={15} strokeWidth={1.8} />
            Clear viewed history
          </button>
        ) : null}
      </div>
      <div
        aria-label={`${viewedCount} of ${total} resource guides viewed`}
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={viewedCount}
        className={styles.progressTrack}
        role="progressbar"
      >
        <span className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
      <p className={styles.progressNote}>
        A guide is marked viewed when you open it. This progress stays only in this browser.
      </p>
    </section>
  );
}

export function ResourcesList({ resources }: { resources: Resource[] }) {
  const [viewedIds, setViewedIds] = useState<Set<ResourceId>>(new Set());
  const validIds = useMemo(() => new Set(resources.map(({ id }) => id)), [resources]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(VIEWED_STORAGE_KEY);
      if (!stored) return;

      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed)) return;

      setViewedIds(
        new Set(
          parsed.filter(
            (value): value is ResourceId => typeof value === "string" && validIds.has(value),
          ),
        ),
      );
    } catch {
      try {
        window.localStorage.removeItem(VIEWED_STORAGE_KEY);
      } catch {
        // Ignore unavailable browser storage and leave progress at its safe default.
      }
    }
  }, [validIds]);

  const markViewed = (id: ResourceId) => {
    setViewedIds((current) => {
      if (current.has(id)) return current;

      const next = new Set(current);
      next.add(id);
      saveViewed(next);
      return next;
    });
  };

  const clearViewed = () => {
    try {
      window.localStorage.removeItem(VIEWED_STORAGE_KEY);
    } catch {
      // The visible state can still reset when browser storage is unavailable.
    }
    setViewedIds(new Set());
  };

  const pick = (id: ResourceId) => mustFind(resources, id);
  const a1c = pick("understanding-a1c");
  const mealPlanning = pick("diabetes-meal-planning");
  const movement = pick("physical-activity");

  return (
    <main className={styles.resourceCenter}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Trusted Type 2 diabetes guidance</p>
        <h1>Start with the question you have today.</h1>
        <p className={styles.introCopy}>
          Eighteen clear, useful guides from the CDC and NIH, arranged to help you find the next
          answer without sorting through a wall of information.
        </p>
        <p className={styles.introMeta}>18 guides · 2 official sources · reviewed July 2026</p>
      </header>

      <ProgressMeter onClear={clearViewed} total={resources.length} viewedCount={viewedIds.size} />

      <section aria-labelledby="recommended-heading" className={styles.recommendedSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Recommended starting points</p>
          <h2 id="recommended-heading">Three useful places to begin</h2>
          <p>Choose the one closest to your question. There is no required order.</p>
        </div>
        <div className={styles.recommendedGrid}>
          <RecommendedResource
            onView={markViewed}
            primary
            resource={a1c}
            viewed={viewedIds.has(a1c.id)}
          />
          <div className={styles.recommendedRail}>
            <RecommendedResource
              onView={markViewed}
              resource={mealPlanning}
              viewed={viewedIds.has(mealPlanning.id)}
            />
            <RecommendedResource
              onView={markViewed}
              resource={movement}
              viewed={viewedIds.has(movement.id)}
            />
          </div>
        </div>
      </section>

      <nav aria-label="Resource topics" className={styles.topicNav}>
        <p>Browse by topic</p>
        <div>
          {topics.map((topic) => (
            <a href={`#${topic.id}`} key={topic.id}>
              <span>{topic.title}</span>
              <small>{topic.resourceIds.length}</small>
            </a>
          ))}
        </div>
      </nav>

      <div className={styles.library}>
        {topics.map((topic) => (
          <section
            aria-labelledby={`${topic.id}-heading`}
            className={styles.topicSection}
            id={topic.id}
            key={topic.id}
          >
            <div className={styles.topicHeading}>
              <div>
                <p className={styles.eyebrow}>Topic</p>
                <h2 id={`${topic.id}-heading`}>{topic.title}</h2>
              </div>
              <p>{topic.description}</p>
              <span>
                {topic.resourceIds.length} {topic.resourceIds.length === 1 ? "guide" : "guides"}
              </span>
            </div>
            <div className={styles.resourceList}>
              {topic.resourceIds.map((resourceId, index) => {
                const resource = pick(resourceId);
                return (
                  <ResourceRow
                    key={resource.id}
                    onView={markViewed}
                    resource={resource}
                    startHere={index === 0}
                    viewed={viewedIds.has(resource.id)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <aside className={styles.sourceTrust}>
        <p className={styles.eyebrow}>Why these sources?</p>
        <div>
          <h2>Official guidance, chosen for different kinds of questions.</h2>
          <p>
            <strong>CDC</strong> offers practical public-health guidance for daily routines and
            safety. <strong>NIDDK</strong>, part of NIH, provides deeper explainers on tests,
            treatments, and whole-body health. Every destination is an official .gov page.
          </p>
        </div>
      </aside>

      <footer className={styles.disclaimer}>
        <ShieldCheck aria-hidden="true" size={20} strokeWidth={1.55} />
        <p>
          These readings support, but do not replace, advice from your health care team. Every link
          opens on an official CDC or NIH website in a new tab.
        </p>
      </footer>
    </main>
  );
}
