import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  HeartPulse,
  Quote,
  Salad,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

import type { Resource } from "@/features/stories/schemas/resource.schema";

import styles from "./resources.module.css";

type ResourceId = Resource["id"];

type ReadingPath = {
  count: string;
  description: string;
  href: string;
  icon: LucideIcon;
  title: string;
};

const readingPaths: ReadingPath[] = [
  {
    count: "3 reads",
    description: "Start with the diagnosis, A1C, and daily readings.",
    href: "#new-here",
    icon: BookOpenText,
    title: "Just diagnosed",
  },
  {
    count: "3 reads",
    description: "Keep familiar food and workable movement in the picture.",
    href: "#daily-living",
    icon: Salad,
    title: "Food & daily living",
  },
  {
    count: "3 reads",
    description: "Make a plan for medicines, lows, and sick days.",
    href: "#staying-safe",
    icon: ClipboardCheck,
    title: "Staying safe",
  },
  {
    count: "5 reads",
    description: "Look after your heart, kidneys, eyes, feet, and mouth.",
    href: "#long-term-health",
    icon: HeartPulse,
    title: "Long-term health",
  },
  {
    count: "4 reads",
    description: "Find emotional, practical, and financial support.",
    href: "#living-confidently",
    icon: Sparkles,
    title: "Living confidently",
  },
];

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

function ResourceMeta({ resource, compact = false }: { compact?: boolean; resource: Resource }) {
  return (
    <div className={styles.meta}>
      <span className={styles.sourceMark}>{shortSource(resource.organization)}</span>
      <span className={styles.verified}>
        <ShieldCheck aria-hidden="true" size={13} strokeWidth={1.9} />
        Verified
      </span>
      <span aria-hidden="true" className={styles.metaDot} />
      <span>{resource.reading_level}</span>
      <span aria-hidden="true" className={styles.metaDot} />
      <span className={styles.readingTime}>{resource.reading_minutes} min read</span>
      {!compact ? (
        <>
          <span aria-hidden="true" className={styles.metaDot} />
          <span>Reviewed {reviewedLabel(resource.verified_at)}</span>
        </>
      ) : null}
    </div>
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

function ExternalArrow() {
  return (
    <span aria-hidden="true" className={styles.externalArrow}>
      <ArrowUpRight size={18} strokeWidth={1.7} />
    </span>
  );
}

function FeaturedLead({ resource }: { resource: Resource }) {
  return (
    <article className={styles.featuredLead}>
      <a
        aria-label={`${resource.title} from ${shortSource(resource.organization)} (opens in a new tab)`}
        className={styles.featuredLink}
        href={resource.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.featuredImage}>
          <Image
            alt="A patient and clinician calmly reviewing a laboratory report together"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 66vw"
            src="/resources/a1c-explained-editorial.jpg"
          />
        </div>
        <div className={styles.featuredCopy}>
          <ArticleLabel resource={resource} />
          <h2>{resource.title}</h2>
          <p>{resource.description}</p>
          <ResourceMeta resource={resource} />
          <ExternalArrow />
        </div>
      </a>
    </article>
  );
}

function FeaturedSide({
  alt,
  image,
  resource,
}: {
  alt: string;
  image: string;
  resource: Resource;
}) {
  return (
    <article className={styles.featuredSide}>
      <a
        aria-label={`${resource.title} from ${shortSource(resource.organization)} (opens in a new tab)`}
        href={resource.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.sideImage}>
          <Image alt={alt} fill sizes="(max-width: 767px) 100vw, 34vw" src={image} />
        </div>
        <div className={styles.sideCopy}>
          <ArticleLabel resource={resource} />
          <h3>{resource.title}</h3>
          <p>{resource.description}</p>
          <ResourceMeta compact resource={resource} />
          <ExternalArrow />
        </div>
      </a>
    </article>
  );
}

function SectionHeading({
  count,
  description,
  eyebrow,
  id,
  title,
}: {
  count: string;
  description: string;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        <p>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
      <p className={styles.sectionDescription}>{description}</p>
      <span>{count}</span>
    </div>
  );
}

function LeadArticle({ index, resource }: { index: string; resource: Resource }) {
  return (
    <article className={styles.leadArticle}>
      <a
        aria-label={`${resource.title} from ${shortSource(resource.organization)} (opens in a new tab)`}
        href={resource.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span aria-hidden="true" className={styles.articleNumber}>
          {index}
        </span>
        <div>
          <ArticleLabel resource={resource} />
          <h3>{resource.title}</h3>
          <p>{resource.description}</p>
          <ResourceMeta resource={resource} />
        </div>
        <ExternalArrow />
      </a>
    </article>
  );
}

function CompactArticle({ resource }: { resource: Resource }) {
  return (
    <article className={styles.compactArticle}>
      <a
        aria-label={`${resource.title} from ${shortSource(resource.organization)} (opens in a new tab)`}
        href={resource.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ArticleLabel resource={resource} />
        <h3>{resource.title}</h3>
        <p>{resource.description}</p>
        <ResourceMeta compact resource={resource} />
        <ExternalArrow />
      </a>
    </article>
  );
}

function ChecklistArticle({ note, resource }: { note: string; resource: Resource }) {
  return (
    <article className={styles.checklistArticle}>
      <a
        aria-label={`${resource.title} from ${shortSource(resource.organization)} (opens in a new tab)`}
        href={resource.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.checkIcon}>
          <Check aria-hidden="true" size={20} strokeWidth={1.8} />
        </div>
        <p className={styles.checkNote}>{note}</p>
        <h3>{resource.title}</h3>
        <p>{resource.description}</p>
        <ResourceMeta compact resource={resource} />
        <ExternalArrow />
      </a>
    </article>
  );
}

function Perspective({ children }: { children: string }) {
  return (
    <aside aria-label="Composite learner perspective" className={styles.perspective}>
      <Quote aria-hidden="true" size={34} strokeWidth={1.25} />
      <blockquote>{children}</blockquote>
      <p>Composite learner perspective</p>
      <small>Drawn from recurring patient questions—not an individual testimonial.</small>
    </aside>
  );
}

function SourceNote() {
  return (
    <aside className={styles.sourceNote}>
      <div className={styles.sourceNoteIntro}>
        <Stethoscope aria-hidden="true" size={26} strokeWidth={1.45} />
        <p>Editor&apos;s source note</p>
        <h2>Why these two sources?</h2>
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

function WideFeature({ resource }: { resource: Resource }) {
  return (
    <article className={styles.wideFeature}>
      <a
        aria-label={`${resource.title} from ${shortSource(resource.organization)} (opens in a new tab)`}
        href={resource.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.wideFeatureTitle}>
          <ArticleLabel resource={resource} />
          <h3>{resource.title}</h3>
        </div>
        <div className={styles.wideFeatureCopy}>
          <p>{resource.description}</p>
          <ResourceMeta resource={resource} />
        </div>
        <ExternalArrow />
      </a>
    </article>
  );
}

function SupportFeature({ resource }: { resource: Resource }) {
  return (
    <article className={styles.supportFeature}>
      <a
        aria-label={`${resource.title} from ${shortSource(resource.organization)} (opens in a new tab)`}
        href={resource.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <CircleDollarSign aria-hidden="true" size={28} strokeWidth={1.35} />
        <ArticleLabel resource={resource} />
        <h3>{resource.title}</h3>
        <p>{resource.description}</p>
        <ResourceMeta compact resource={resource} />
        <ExternalArrow />
      </a>
    </article>
  );
}

function mustFind(resources: Resource[], id: ResourceId) {
  const resource = resources.find((item) => item.id === id);
  if (!resource) throw new Error(`Missing curated resource: ${id}`);
  return resource;
}

export function ResourcesList({ resources }: { resources: Resource[] }) {
  const pick = (id: ResourceId) => mustFind(resources, id);

  const a1c = pick("understanding-a1c");
  const mealPlanning = pick("diabetes-meal-planning");
  const movement = pick("physical-activity");
  const basics = pick("type-2-diabetes-basics");
  const monitoring = pick("monitoring-blood-sugar");
  const culturalFoods = pick("cultural-foods");
  const treatments = pick("diabetes-treatments");
  const lowBloodSugar = pick("low-blood-sugar");
  const sickDays = pick("managing-sick-days");
  const heart = pick("heart-disease-and-stroke");
  const kidney = pick("kidney-health");
  const eyes = pick("eye-health");
  const feet = pick("foot-care");
  const oral = pick("oral-health");
  const mentalHealth = pick("diabetes-and-mental-health");
  const education = pick("diabetes-education-and-support");
  const financialHelp = pick("financial-help");
  const emergency = pick("emergency-preparedness");

  return (
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
              appointments—selected from official CDC and NIH guidance.
            </p>
            <span>18 guides · 2 trusted sources · reviewed July 2026</span>
          </div>
        </div>
      </header>

      <section aria-labelledby="recommended-heading" className={styles.featuredSection}>
        <div className={styles.featuredHeading}>
          <p>This week&apos;s recommended reading</p>
          <h2 id="recommended-heading">Three places worth starting</h2>
          <span>Selected by the Health Decoded editorial team</span>
        </div>
        <div className={styles.featuredGrid}>
          <FeaturedLead resource={a1c} />
          <div className={styles.featuredRail}>
            <FeaturedSide
              alt="A multigenerational family preparing a familiar meal together"
              image="/resources/family-meal-editorial.jpg"
              resource={mealPlanning}
            />
            <FeaturedSide
              alt="Two friends sharing an easy walk on a neighborhood path"
              image="/resources/everyday-movement-editorial.jpg"
              resource={movement}
            />
          </div>
        </div>
      </section>

      <nav aria-label="Curated reading paths" className={styles.pathSection}>
        <div className={styles.pathIntro}>
          <p>Curated paths</p>
          <h2>Follow the question you have today.</h2>
        </div>
        <div className={styles.pathGrid}>
          {readingPaths.map(({ count, description, href, icon: Icon, title }) => (
            <a className={styles.pathCard} href={href} key={title}>
              <Icon aria-hidden="true" size={20} strokeWidth={1.55} />
              <div>
                <span>{count}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <ArrowRight aria-hidden="true" size={17} strokeWidth={1.6} />
            </a>
          ))}
        </div>
      </nav>

      <section aria-labelledby="new-here-heading" className={styles.librarySection} id="new-here">
        <SectionHeading
          count="3 reads across this issue"
          description="A diagnosis, a lab result, a meter reading—begin with the language underneath them."
          eyebrow="If you’re new here"
          id="new-here-heading"
          title="Make the first questions less mysterious."
        />
        <div className={styles.newHereGrid}>
          <LeadArticle index="01" resource={basics} />
          <CompactArticle resource={monitoring} />
        </div>
      </section>

      <SourceNote />

      <section
        aria-labelledby="daily-living-heading"
        className={styles.librarySection}
        id="daily-living"
      >
        <SectionHeading
          count="3 reads across this issue"
          description="Useful care should make room for the food, people, and movement already in your life."
          eyebrow="Food & daily living"
          id="daily-living-heading"
          title="Keep the life. Adjust the pattern."
        />
        <div className={styles.dailyLivingGrid}>
          <LeadArticle index="02" resource={culturalFoods} />
          <Perspective>
            I thought diabetes meant giving up every food I loved. What I needed was a way to keep
            the table familiar and make balance visible.
          </Perspective>
        </div>
      </section>

      <section
        aria-labelledby="staying-safe-heading"
        className={styles.librarySection}
        id="staying-safe"
      >
        <SectionHeading
          count="3 reads"
          description="The practical plans that are easiest to make before the difficult moment arrives."
          eyebrow="Medicines & staying safe"
          id="staying-safe-heading"
          title="Know the next move before you need it."
        />
        <WideFeature resource={treatments} />
        <div className={styles.checklistGrid}>
          <ChecklistArticle note="Recognize · Treat · Recheck" resource={lowBloodSugar} />
          <ChecklistArticle note="Monitor · Hydrate · Know when to call" resource={sickDays} />
        </div>
      </section>

      <section
        aria-labelledby="long-term-health-heading"
        className={styles.librarySection}
        id="long-term-health"
      >
        <SectionHeading
          count="5 reads"
          description="Prevention is not about fear. It is about finding quiet changes while there is time to act."
          eyebrow="Long-term health"
          id="long-term-health-heading"
          title="The whole body deserves a place in the plan."
        />
        <WideFeature resource={heart} />
        <div className={styles.healthGrid}>
          <CompactArticle resource={kidney} />
          <CompactArticle resource={eyes} />
          <ChecklistArticle note="Look · Feel · Act early" resource={feet} />
          <CompactArticle resource={oral} />
        </div>
      </section>

      <section
        aria-labelledby="living-confidently-heading"
        className={styles.librarySection}
        id="living-confidently"
      >
        <SectionHeading
          count="4 reads"
          description="Support can be emotional, educational, financial, or simply ready before the weather turns."
          eyebrow="Living confidently"
          id="living-confidently-heading"
          title="Care works better when it does not all sit on you."
        />
        <div className={styles.confidenceGrid}>
          <LeadArticle index="03" resource={mentalHealth} />
          <Perspective>
            I was doing the tasks, but I was tired of thinking about diabetes all day. Naming that
            feeling was the first useful step.
          </Perspective>
          <WideFeature resource={education} />
          <SupportFeature resource={financialHelp} />
          <ChecklistArticle note="Records · Supplies · Backup plan" resource={emergency} />
        </div>
      </section>

      <footer className={styles.disclaimer}>
        <ShieldCheck aria-hidden="true" size={20} strokeWidth={1.55} />
        <p>
          These readings support—but do not replace—advice from your health care team. Every link
          opens on an official CDC or NIH website.
        </p>
      </footer>
    </div>
  );
}
