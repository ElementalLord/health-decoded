"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Check,
  CircleHelp,
  Droplets,
  Eye,
  Gauge,
  HeartPulse,
  MessageSquareText,
  Search,
  ShieldCheck,
  Smile,
  Stethoscope,
  Tags,
  Thermometer,
  Utensils,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { recognizeMilestone } from "@/features/achievements/lib/recognize-milestone.client";
import type { Resource } from "@/features/stories/schemas/resource.schema";
import { formatDateSafely } from "@/lib/dates/format-date";

import styles from "./resources.module.css";

type ResourceId = Resource["id"];
type TopicId =
  | "all"
  | "just-diagnosed"
  | "daily-living"
  | "staying-safe"
  | "long-term-health"
  | "living-confidently";

type ReadingProgressValue = {
  clearViewed: () => void;
  markViewed: (id: ResourceId) => void;
  persistenceAvailable: boolean;
  viewedIds: Set<ResourceId>;
};

type Topic = {
  description: string;
  id: Exclude<TopicId, "all">;
  label: string;
  resourceIds: readonly ResourceId[];
};

type ResourceVisual = {
  alt: string;
  icon?: LucideIcon;
  image?: string;
  tone: "blue" | "clay" | "gold" | "green" | "sage";
};

const VIEWED_STORAGE_KEY = "health-decoded:resources:viewed";

const ReadingProgressContext = createContext<ReadingProgressValue | null>(null);

const topics: readonly Topic[] = [
  {
    description: "Diagnosis, A1C, and daily readings.",
    id: "just-diagnosed",
    label: "Just diagnosed",
    resourceIds: ["type-2-diabetes-basics", "understanding-a1c", "monitoring-blood-sugar"],
  },
  {
    description: "Food, culture, and workable movement.",
    id: "daily-living",
    label: "Food & daily living",
    resourceIds: ["diabetes-meal-planning", "cultural-foods", "physical-activity"],
  },
  {
    description: "Medicines, lows, and sick-day plans.",
    id: "staying-safe",
    label: "Staying safe",
    resourceIds: ["diabetes-treatments", "low-blood-sugar", "managing-sick-days"],
  },
  {
    description: "Heart, kidneys, eyes, feet, and mouth.",
    id: "long-term-health",
    label: "Long-term health",
    resourceIds: [
      "heart-disease-and-stroke",
      "kidney-health",
      "eye-health",
      "foot-care",
      "oral-health",
    ],
  },
  {
    description: "Emotional, educational, financial, and practical support.",
    id: "living-confidently",
    label: "Living confidently",
    resourceIds: [
      "diabetes-and-mental-health",
      "diabetes-education-and-support",
      "financial-help",
      "emergency-preparedness",
    ],
  },
] as const;

const resourceVisuals: Record<ResourceId, ResourceVisual> = {
  "type-2-diabetes-basics": {
    alt: "An editorial illustration introducing the essentials of Type 2 diabetes",
    icon: BookOpenText,
    tone: "sage",
  },
  "understanding-a1c": {
    alt: "A patient and clinician calmly reviewing a laboratory report together",
    image: "/resources/a1c-explained-editorial.jpg",
    tone: "green",
  },
  "monitoring-blood-sugar": {
    alt: "An editorial illustration of a glucose reading seen in context",
    icon: Gauge,
    tone: "blue",
  },
  "diabetes-meal-planning": {
    alt: "A multigenerational family preparing a familiar meal together",
    image: "/resources/family-meal-editorial.jpg",
    tone: "gold",
  },
  "cultural-foods": {
    alt: "An editorial illustration celebrating familiar foods at the table",
    icon: Utensils,
    tone: "gold",
  },
  "physical-activity": {
    alt: "Two friends sharing an easy walk on a neighborhood path",
    image: "/resources/everyday-movement-editorial.jpg",
    tone: "green",
  },
  "diabetes-treatments": {
    alt: "An older woman and pharmacist building a medicine routine together",
    image: "/resources/pharmacist-routine-editorial.png",
    tone: "clay",
  },
  "low-blood-sugar": {
    alt: "An editorial illustration about recognizing and treating low blood sugar",
    icon: Droplets,
    tone: "blue",
  },
  "managing-sick-days": {
    alt: "An editorial illustration for a written diabetes sick-day plan",
    icon: Thermometer,
    tone: "clay",
  },
  "heart-disease-and-stroke": {
    alt: "An editorial illustration connecting diabetes and heart health",
    icon: HeartPulse,
    tone: "green",
  },
  "kidney-health": {
    alt: "An editorial illustration about the quiet work of kidney screening",
    icon: Droplets,
    tone: "sage",
  },
  "eye-health": {
    alt: "An editorial illustration about looking beyond clear vision",
    icon: Eye,
    tone: "blue",
  },
  "foot-care": {
    alt: "An adult calmly checking the sole of one foot with a hand mirror",
    image: "/resources/foot-check-natural.png",
    tone: "gold",
  },
  "oral-health": {
    alt: "An editorial illustration about diabetes and gum health",
    icon: Smile,
    tone: "gold",
  },
  "diabetes-and-mental-health": {
    alt: "Two people sharing calm, practical support",
    image: "/resources/everyday-support-natural.png",
    tone: "sage",
  },
  "diabetes-education-and-support": {
    alt: "A diabetes educator making care feel practical and approachable",
    image: "/resources/community-education-editorial.png",
    tone: "green",
  },
  "financial-help": {
    alt: "An editorial illustration about finding help with the cost of care",
    icon: WalletCards,
    tone: "clay",
  },
  "emergency-preparedness": {
    alt: "Hands organizing diabetes supplies and a checklist in an emergency bag",
    image: "/resources/emergency-kit-natural.png",
    tone: "blue",
  },
};

function useReadingProgress() {
  const value = useContext(ReadingProgressContext);
  if (!value) throw new Error("Reading progress must be used inside ResourcesList.");
  return value;
}

function saveViewed(ids: Set<ResourceId>) {
  try {
    window.localStorage.setItem(VIEWED_STORAGE_KEY, JSON.stringify([...ids]));
    return true;
  } catch {
    return false;
  }
}

function shortSource(organization: string) {
  return organization.startsWith("Centers") ? "CDC" : "NIDDK";
}

function reviewedLabel(verifiedAt: string) {
  return formatDateSafely(
    `${verifiedAt}T00:00:00Z`,
    { month: "short", timeZone: "UTC", year: "numeric" },
    "en-US",
  );
}

function ResourceMeta({
  resource,
  showReviewed = true,
}: {
  resource: Resource;
  showReviewed?: boolean;
}) {
  const { viewedIds } = useReadingProgress();
  const viewed = viewedIds.has(resource.id);

  return (
    <div className={styles.meta}>
      <span className={styles.sourceMark}>{shortSource(resource.organization)}</span>
      <span className={styles.verified}>
        <ShieldCheck aria-hidden="true" size={13} strokeWidth={1.9} />
        Verified
      </span>
      <span aria-hidden="true" className={styles.metaDot} />
      <span>{resource.reading_minutes} min read</span>
      <span aria-hidden="true" className={styles.metaDot} />
      <span>{resource.reading_level}</span>
      {showReviewed ? (
        <>
          <span aria-hidden="true" className={styles.metaDot} />
          <span>Reviewed {reviewedLabel(resource.verified_at)}</span>
        </>
      ) : null}
      {viewed ? (
        <>
          <span aria-hidden="true" className={styles.metaDot} />
          <span className={styles.viewedState}>
            <Check aria-hidden="true" size={13} strokeWidth={2.2} />
            Viewed
          </span>
        </>
      ) : null}
    </div>
  );
}

function ResourceLink({
  children,
  className,
  resource,
}: {
  children: ReactNode;
  className?: string | undefined;
  resource: Resource;
}) {
  const { markViewed } = useReadingProgress();

  return (
    <a
      aria-label={`${resource.title} from ${shortSource(resource.organization)} (opens in a new tab)`}
      className={className}
      href={resource.url}
      onClick={() => {
        markViewed(resource.id);
        if (resource.id === "diabetes-education-and-support") {
          void recognizeMilestone({
            event: "verified_support_resource_opened",
            resourceId: "diabetes-education-and-support",
          });
        }
      }}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

function ArticleLabel({ resource }: { resource: Resource }) {
  return (
    <p className={styles.articleLabel}>
      <span>{resource.editorial_label}</span>
      <span aria-hidden="true">/</span>
      <span>{resource.format}</span>
    </p>
  );
}

function ResourceArtwork({ resource }: { resource: Resource }) {
  const visual = resourceVisuals[resource.id] ?? {
    alt: `An editorial illustration for ${resource.title}`,
    icon: BookOpenText,
    tone: "sage",
  };
  const Icon = visual.icon ?? Activity;

  return (
    <div className={styles.resourceArtwork} data-tone={visual.tone}>
      {visual.image ? (
        <Image
          alt={visual.alt}
          fill
          sizes="(max-width: 42rem) 100vw, (max-width: 68rem) 50vw, 26vw"
          src={visual.image}
        />
      ) : (
        <div aria-label={visual.alt} className={styles.generatedArtwork} role="img">
          <span aria-hidden="true" className={styles.artCircle} />
          <span aria-hidden="true" className={styles.artLine} />
          <span aria-hidden="true" className={styles.artIcon}>
            <Icon size={42} strokeWidth={1.25} />
          </span>
          <span aria-hidden="true" className={styles.artIndex}>
            {resource.format}
          </span>
        </div>
      )}
    </div>
  );
}

function ResourceGridItem({ resource }: { resource: Resource }) {
  return (
    <ResourceLink className={styles.resourceLink} resource={resource}>
      <ResourceArtwork resource={resource} />
      <div className={styles.resourceCopy}>
        <ArticleLabel resource={resource} />
        <h3>{resource.title}</h3>
        <p>{resource.description}</p>
        <span className={styles.gridAction}>
          Read guide
          <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.9} />
        </span>
        <ResourceMeta resource={resource} />
      </div>
    </ResourceLink>
  );
}

function ResourceFilters({
  onReset,
  onSearchChange,
  onTopicChange,
  query,
  selectedTopic,
}: {
  onReset: () => void;
  onSearchChange: (query: string) => void;
  onTopicChange: (topic: TopicId) => void;
  query: string;
  selectedTopic: TopicId;
}) {
  const activeTopic = topics.find(({ id }) => id === selectedTopic);
  const filtersActive = query.length > 0 || selectedTopic !== "all";

  return (
    <aside aria-label="Resource filters" className={styles.filterRail}>
      <div className={styles.filterSticky}>
        <div className={styles.searchGroup}>
          <label htmlFor="resource-search">Search</label>
          <div className={styles.searchField}>
            <Search aria-hidden="true" size={17} strokeWidth={1.8} />
            <input
              autoComplete="off"
              id="resource-search"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search resources"
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="Clear resource search"
                onClick={() => onSearchChange("")}
                type="button"
              >
                <X aria-hidden="true" size={15} strokeWidth={2} />
              </button>
            ) : null}
          </div>
          <p>Search stays on this page and is never saved.</p>
        </div>

        <div className={styles.topicGroup}>
          <p className={styles.filterLabel}>Filter by topic</p>
          <div aria-label="Resource topics" className={styles.filterList} role="group">
            <button
              aria-pressed={selectedTopic === "all"}
              className={selectedTopic === "all" ? styles.activeFilter : undefined}
              onClick={() => onTopicChange("all")}
              type="button"
            >
              All resources <span>{18}</span>
            </button>
            {topics.map((topic) => (
              <button
                aria-pressed={selectedTopic === topic.id}
                className={selectedTopic === topic.id ? styles.activeFilter : undefined}
                key={topic.id}
                onClick={() => onTopicChange(topic.id)}
                type="button"
              >
                {topic.label} <span>{topic.resourceIds.length}</span>
              </button>
            ))}
          </div>
          <p className={styles.topicDescription}>
            {activeTopic?.description ?? "All 18 official CDC and NIDDK guides."}
          </p>
        </div>

        <button
          className={styles.resetFilters}
          disabled={!filtersActive}
          onClick={onReset}
          type="button"
        >
          Reset filters
        </button>
      </div>
    </aside>
  );
}

function ReadingProgressPanel({ total }: { total: number }) {
  const { clearViewed, persistenceAvailable, viewedIds } = useReadingProgress();
  const viewedCount = viewedIds.size;
  const percent = total === 0 ? 0 : Math.round((viewedCount / total) * 100);

  return (
    <section aria-labelledby="reading-record-title" className={styles.readingRecord}>
      <div className={styles.readingRecordHeading}>
        <div>
          <p>Your reading record</p>
          <h2 id="reading-record-title">
            {viewedCount} of {total} articles viewed
          </h2>
        </div>
        {viewedCount > 0 ? (
          <button onClick={clearViewed} type="button">
            Clear viewed history
          </button>
        ) : null}
      </div>
      <div
        aria-label={`${viewedCount} of ${total} resource articles viewed`}
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={viewedCount}
        className={styles.readingRecordTrack}
        role="progressbar"
      >
        <span style={{ transform: `scaleX(${percent / 100})` }} />
      </div>
      <p className={styles.readingRecordNote}>
        {persistenceAvailable
          ? "Articles receive a “Viewed” check when you open them. Your record stays in this browser."
          : "Viewed marks will last only until this page closes because browser storage is unavailable."}
      </p>
    </section>
  );
}

function FloatingTools() {
  const reduceMotion = useReducedMotion();
  const boundaryRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const { scrollYProgress } = useScroll({
    offset: ["start 14%", "end 86%"],
    target: boundaryRef,
  });
  const scrollTravel = useTransform(scrollYProgress, [0, 1], [0, scrollRange]);
  const smoothScrollTravel = useSpring(scrollTravel, {
    damping: 18,
    mass: 0.95,
    stiffness: 48,
  });
  const smoothTransform = useTransform(
    smoothScrollTravel,
    (value) => `translate3d(0, ${value}px, 0)`,
  );

  useEffect(() => {
    const boundary = boundaryRef.current;
    const tools = toolsRef.current;
    if (!boundary || !tools) return;

    const updateScrollRange = () => {
      setScrollRange(Math.max(0, boundary.clientHeight - tools.offsetHeight));
    };
    const resizeObserver = new ResizeObserver(updateScrollRange);

    updateScrollRange();
    resizeObserver.observe(boundary);
    resizeObserver.observe(tools);
    window.addEventListener("resize", updateScrollRange);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollRange);
    };
  }, []);

  return (
    <div className={styles.toolRailBoundary} ref={boundaryRef}>
      <motion.nav
        aria-label="Health Decoded tools"
        className={styles.floatingTools}
        ref={toolsRef}
        style={{ transform: reduceMotion ? "none" : smoothTransform }}
      >
        <div className={styles.floatingToolsIntro}>
          <p>Health Decoded tools</p>
          <strong>Turn reading into practice</strong>
          <span>Use a quick activity when a source leaves you with a question.</span>
        </div>
        <Link aria-label="Diabetes Myth Check" href="/myth-check">
          <CircleHelp aria-hidden="true" size={20} strokeWidth={1.65} />
          <span className={styles.floatingToolCopy}>
            <span>
              <strong>Diabetes Myth Check</strong>
              <small>Test common claims against the evidence.</small>
            </span>
            <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />
          </span>
        </Link>
        <Link aria-label="Decode the Label" href="/decode-the-label">
          <Tags aria-hidden="true" size={20} strokeWidth={1.65} />
          <span className={styles.floatingToolCopy}>
            <span>
              <strong>Decode the Label</strong>
              <small>Find the useful details on a nutrition label.</small>
            </span>
            <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />
          </span>
        </Link>
        <Link aria-label="Explain It Back" href="/explain-it-back">
          <MessageSquareText aria-hidden="true" size={20} strokeWidth={1.65} />
          <span className={styles.floatingToolCopy}>
            <span>
              <strong>Explain It Back</strong>
              <small>Put a diabetes concept into your own words.</small>
            </span>
            <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />
          </span>
        </Link>
      </motion.nav>
    </div>
  );
}

function SourceNote() {
  return (
    <aside className={styles.sourceNote}>
      <div className={styles.sourceNoteHeading}>
        <Stethoscope aria-hidden="true" size={24} strokeWidth={1.45} />
        <div>
          <p>Editor&apos;s source note</p>
          <h2>Why these sources?</h2>
        </div>
      </div>
      <div className={styles.sourceExplanation}>
        <div>
          <span>CDC</span>
          <p>Practical public-health guidance for the routines and decisions of daily life.</p>
        </div>
        <div>
          <span>NIDDK</span>
          <p>NIH health explainers with deeper detail on tests, treatments, and the whole body.</p>
        </div>
      </div>
      <p className={styles.sourceNoteFooter}>
        Every destination is an official .gov page and was rechecked in July 2026.
      </p>
    </aside>
  );
}

export function ResourcesList({ resources }: { resources: Resource[] }) {
  const [viewedIds, setViewedIds] = useState<Set<ResourceId>>(new Set());
  const [persistenceAvailable, setPersistenceAvailable] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicId>("all");
  const reduceMotion = useReducedMotion();
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
      setPersistenceAvailable(false);
      try {
        window.localStorage.removeItem(VIEWED_STORAGE_KEY);
      } catch {
        // Keep the safe empty state if storage is unavailable.
      }
    }
  }, [validIds]);

  const markViewed = (id: ResourceId) => {
    if (viewedIds.has(id)) return;
    const next = new Set(viewedIds);
    next.add(id);
    setViewedIds(next);
    if (!saveViewed(next)) setPersistenceAvailable(false);
  };

  const clearViewed = () => {
    try {
      window.localStorage.removeItem(VIEWED_STORAGE_KEY);
    } catch {
      setPersistenceAvailable(false);
    }
    setViewedIds(new Set());
  };

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const activeTopic = topics.find(({ id }) => id === selectedTopic);
    const topicIds = activeTopic ? new Set(activeTopic.resourceIds) : null;

    return resources.filter((resource) => {
      if (topicIds && !topicIds.has(resource.id)) return false;
      if (!normalizedQuery) return true;
      return [
        resource.title,
        resource.description,
        resource.organization,
        resource.editorial_label,
        resource.format,
        resource.reading_level,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    });
  }, [query, resources, selectedTopic]);

  const resetFilters = () => {
    setQuery("");
    setSelectedTopic("all");
  };

  const activeTopicLabel = topics.find(({ id }) => id === selectedTopic)?.label;

  return (
    <ReadingProgressContext.Provider
      value={{ clearViewed, markViewed, persistenceAvailable, viewedIds }}
    >
      <div className={styles.readingRoom}>
        <header className={styles.masthead}>
          <div className={styles.mastheadRule}>
            <span>Health Decoded reading room</span>
            <span>The July edit</span>
          </div>
          <div className={styles.mastheadCopy}>
            <h1>Good information should feel like someone chose it for you.</h1>
            <div>
              <p>
                Eighteen clear, useful reads for the questions that stay with you between
                appointments, selected from official CDC and NIH guidance.
              </p>
              <span>18 guides · 2 trusted sources · reviewed July 2026</span>
            </div>
          </div>
        </header>

        <section
          aria-label="Reading progress and source information"
          className={styles.informationSection}
        >
          <ReadingProgressPanel total={resources.length} />
          <SourceNote />
        </section>

        <section aria-labelledby="browse-resources-heading" className={styles.browseSection}>
          <FloatingTools />
          <div className={styles.browseHeading}>
            <div>
              <p>Curated library</p>
              <h2 id="browse-resources-heading">Browse all resources</h2>
            </div>
            <p>Follow the question you have today, or search across every reviewed guide.</p>
          </div>

          <div className={styles.browseLayout}>
            <ResourceFilters
              onReset={resetFilters}
              onSearchChange={setQuery}
              onTopicChange={setSelectedTopic}
              query={query}
              selectedTopic={selectedTopic}
            />

            <div className={styles.resultsPanel}>
              <div className={styles.resultsHeading}>
                <p aria-live="polite" role="status">
                  {filteredResources.length}{" "}
                  {filteredResources.length === 1 ? "resource" : "resources"}
                  {activeTopicLabel ? ` · ${activeTopicLabel}` : " · All topics"}
                </p>
                {query ? (
                  <span>Matching “{query.trim()}”</span>
                ) : (
                  <span>Official CDC & NIDDK guidance</span>
                )}
              </div>

              {filteredResources.length > 0 ? (
                <motion.div className={styles.resourceGrid} layout={!reduceMotion}>
                  <AnimatePresence initial={false} mode="popLayout">
                    {filteredResources.map((resource) => (
                      <motion.article
                        animate={{ opacity: 1, transform: "translateY(0px)" }}
                        exit={{ opacity: 0, transform: reduceMotion ? "none" : "translateY(-6px)" }}
                        initial={{
                          opacity: 0,
                          transform: reduceMotion ? "none" : "translateY(8px)",
                        }}
                        key={resource.id}
                        layout={reduceMotion ? false : "position"}
                        transition={{
                          duration: reduceMotion ? 0.01 : 0.18,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                      >
                        <ResourceGridItem resource={resource} />
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className={styles.emptyResults}>
                  <Search aria-hidden="true" size={24} strokeWidth={1.45} />
                  <h3>No reviewed guide matches that search.</h3>
                  <p>Try a broader phrase or return to all resources.</p>
                  <button onClick={resetFilters} type="button">
                    Show all resources
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className={styles.disclaimer}>
          <ShieldCheck aria-hidden="true" size={20} strokeWidth={1.55} />
          <p>
            These readings support, but do not replace, advice from your health care team. Every
            link opens on an official CDC or NIH website.
          </p>
        </footer>
      </div>
    </ReadingProgressContext.Provider>
  );
}
