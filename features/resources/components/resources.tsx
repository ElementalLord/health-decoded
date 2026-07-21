import {
  Activity,
  ArrowUpRight,
  BookOpenText,
  HandHeart,
  HeartPulse,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import type { Resource } from "@/features/stories/schemas/resource.schema";

const categoryDetails: Record<
  Resource["category"],
  { icon: LucideIcon; label: string; tone: string }
> = {
  "Start here": {
    icon: BookOpenText,
    label: "Start here",
    tone: "bg-[#efe4d4] text-[#765943]",
  },
  "Everyday habits": {
    icon: Activity,
    label: "Everyday habits",
    tone: "bg-[#e4ebe2] text-[#526b58]",
  },
  "Treatment & safety": {
    icon: ShieldCheck,
    label: "Treatment & safety",
    tone: "bg-[#eee0da] text-[#865443]",
  },
  "Whole-body health": {
    icon: HeartPulse,
    label: "Whole-body health",
    tone: "bg-[#e9e1e5] text-[#73596a]",
  },
  "Support & access": {
    icon: HandHeart,
    label: "Support & access",
    tone: "bg-[#e1e8e9] text-[#4d676b]",
  },
};

function ResourceCard({ resource }: { resource: Resource }) {
  const category = categoryDetails[resource.category];
  const Icon = category.icon;

  return (
    <li>
      <a
        aria-label={`${resource.title} from ${resource.organization} (opens in a new tab)`}
        className="group flex h-full min-h-52 flex-col rounded-[var(--radius-xl)] border border-border/90 bg-card p-5 shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:border-accent-warm/45 hover:shadow-[var(--shadow-card-hover)] sm:p-6"
        href={resource.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <span
            className={`inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.09em] ${category.tone}`}
          >
            <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
            {category.label}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-warm"
          />
        </div>

        <h2 className="font-serif-display text-[length:var(--text-card-title)] font-semibold leading-tight text-balance">
          {resource.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
        <p className="mt-auto border-t border-border/70 pt-4 text-xs font-semibold leading-5 text-foreground/75">
          {resource.organization}
        </p>
      </a>
    </li>
  );
}

export function ResourcesList({ resources }: { resources: Resource[] }) {
  const sourceCount = new Set(resources.map(({ organization }) => organization)).size;

  return (
    <section aria-labelledby="resource-library-heading" className="space-y-6">
      <div className="flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif-display text-xl font-semibold" id="resource-library-heading">
            The essential library
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {resources.length} focused guides from {sourceCount} trusted public-health sources
          </p>
        </div>
        <div aria-label="Topics in this library" className="flex flex-wrap gap-1.5">
          {Object.values(categoryDetails).map(({ label, tone }) => (
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`} key={label}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <ul className="motion-reveal-list stagger-children grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </ul>

      <p className="border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
        These guides support, but do not replace, advice from your health care team. Links open on
        official CDC or NIH websites.
      </p>
    </section>
  );
}
