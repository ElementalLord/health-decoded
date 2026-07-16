import Image from "next/image";

import { Textarea } from "@/components/ui/textarea";
import type { RenderableLessonContentBlock } from "@/features/lessons/types/lesson-player";
import { cn } from "@/lib/utils";

type Presentation = NonNullable<RenderableLessonContentBlock["presentation"]>;

const widthClasses: Record<NonNullable<Presentation["width"]>, string> = {
  reading: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-none",
};

const alignClasses: Record<NonNullable<Presentation["align"]>, string> = {
  left: "mr-auto",
  center: "mx-auto text-center",
  offset_left: "mr-auto lg:mr-[12%]",
  offset_right: "ml-auto lg:ml-[12%]",
};

const spacingClasses: Record<NonNullable<Presentation["spacing"]>, string> = {
  compact: "py-5 sm:py-7",
  standard: "py-9 sm:py-12",
  expansive: "py-14 sm:py-20",
};

const toneClasses: Record<NonNullable<Presentation["tone"]>, string> = {
  canvas: "bg-transparent",
  paper: "border border-border bg-card px-6 sm:px-9",
  warm: "border-y border-accent-warm/30 bg-[#f3e7df] px-6 sm:px-9",
  sage: "border-y border-success/30 bg-info px-6 sm:px-9",
  charcoal: "bg-primary px-6 text-primary-foreground sm:px-9",
};

function defaultPresentation(block: RenderableLessonContentBlock, index: number): Presentation {
  switch (block.type) {
    case "hero":
      return { align: "left", spacing: "expansive", tone: "canvas", width: "full" };
    case "image":
    case "comparison":
    case "timeline":
    case "diagram":
      return { align: "center", spacing: "expansive", tone: "canvas", width: "wide" };
    case "quote":
    case "statistic":
      return { align: "center", spacing: "expansive", tone: "canvas", width: "wide" };
    case "story":
      return {
        align: index % 2 === 0 ? "offset_left" : "offset_right",
        spacing: "expansive",
        tone: "paper",
        width: "reading",
      };
    case "myth_fact":
      return { align: "center", spacing: "expansive", tone: "canvas", width: "wide" };
    case "callout":
      return { align: "center", spacing: "standard", tone: "sage", width: "wide" };
    case "takeaway":
      return { align: "center", spacing: "expansive", tone: "warm", width: "wide" };
    default:
      return { align: "center", spacing: "standard", tone: "canvas", width: "reading" };
  }
}

function LessonBlockFrame({
  block,
  children,
  index,
}: {
  block: RenderableLessonContentBlock;
  children: React.ReactNode;
  index: number;
}) {
  const defaults = defaultPresentation(block, index);
  const presentation = { ...defaults, ...block.presentation };

  return (
    <div
      className={cn(
        "motion-reveal w-full text-foreground",
        widthClasses[presentation.width ?? "reading"],
        alignClasses[presentation.align ?? "center"],
        spacingClasses[presentation.spacing ?? "standard"],
        toneClasses[presentation.tone ?? "canvas"],
      )}
    >
      {children}
    </div>
  );
}

function EditorialHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif-display text-[length:var(--text-feature-title)] font-normal leading-tight tracking-[-0.025em] text-balance">
      {children}
    </h2>
  );
}

function Eyebrow({ children }: { children?: React.ReactNode }) {
  return children ? <p className="editorial-eyebrow">{children}</p> : null;
}

export function LessonContentBlockView({
  block,
  index = 0,
}: {
  block: RenderableLessonContentBlock;
  index?: number;
}) {
  let content: React.ReactNode;

  switch (block.type) {
    case "text":
      content = (
        <div className="space-y-5 text-left">
          <Eyebrow>{block.eyebrow}</Eyebrow>
          {block.heading ? <EditorialHeading>{block.heading}</EditorialHeading> : null}
          <p className="whitespace-pre-line text-pretty text-lg leading-9 opacity-90">
            {block.body}
          </p>
        </div>
      );
      break;
    case "hero":
      content = (
        <div className="max-w-5xl space-y-7 text-left">
          <Eyebrow>{block.eyebrow}</Eyebrow>
          <h2 className="font-serif-display text-[clamp(3.25rem,8vw,7rem)] font-normal leading-[0.9] tracking-[-0.045em] text-balance">
            {block.title}
          </h2>
          {block.body ? (
            <p className="max-w-3xl whitespace-pre-line text-pretty text-xl leading-9 opacity-75">
              {block.body}
            </p>
          ) : null}
        </div>
      );
      break;
    case "callout":
      content = (
        <div className="grid gap-5 text-left sm:grid-cols-[0.45fr_1.55fr] sm:gap-9">
          <div>
            <Eyebrow>{block.label ?? "Worth noticing"}</Eyebrow>
            <EditorialHeading>{block.title}</EditorialHeading>
          </div>
          <p className="whitespace-pre-line text-pretty text-lg leading-9 opacity-85">
            {block.body}
          </p>
        </div>
      );
      break;
    case "summary":
      content = (
        <div className="space-y-6 text-left">
          <Eyebrow>Review</Eyebrow>
          <EditorialHeading>{block.title ?? "Key points"}</EditorialHeading>
          <ol className="border-y border-current/15 text-lg leading-8">
            {block.points.map((point, pointIndex) => (
              <li
                className="flex gap-5 border-b border-current/15 py-5 last:border-b-0"
                key={point}
              >
                <span className="font-serif-display text-2xl text-accent-warm">
                  {String(pointIndex + 1).padStart(2, "0")}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </div>
      );
      break;
    case "image":
      content = (
        <figure className="space-y-4 text-left">
          <Image
            alt={block.alt}
            className="h-auto w-full border border-border/60 bg-muted object-cover"
            height={block.height}
            priority={index === 0}
            sizes="(min-width: 1280px) 1080px, (min-width: 768px) 88vw, 100vw"
            src={block.src}
            width={block.width}
          />
          {block.caption ? (
            <figcaption className="max-w-3xl text-pretty text-sm leading-6 opacity-70">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
      break;
    case "statistic":
      content = (
        <div className="mx-auto max-w-4xl border-y border-border py-10 text-center sm:py-14">
          <p className="font-serif-display text-[clamp(5rem,16vw,11rem)] font-light leading-[0.7] tracking-[-0.06em] text-accent-warm">
            {block.value}
          </p>
          <h2 className="mx-auto mt-8 max-w-2xl font-serif-display text-3xl font-normal leading-tight sm:text-5xl">
            {block.label}
          </h2>
          {block.body ? (
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-8 opacity-75">
              {block.body}
            </p>
          ) : null}
        </div>
      );
      break;
    case "quote":
      content = (
        <figure className="mx-auto max-w-4xl text-center">
          <blockquote className="font-serif-display text-3xl italic leading-tight sm:text-5xl">
            “{block.quote}”
          </blockquote>
          {block.attribution ? (
            <figcaption className="mt-7 text-xs font-bold uppercase tracking-[0.2em] opacity-65">
              — {block.attribution}
            </figcaption>
          ) : null}
        </figure>
      );
      break;
    case "story":
      content = (
        <article className="space-y-5 text-left">
          <Eyebrow>{block.eyebrow ?? "A moment from real life"}</Eyebrow>
          {block.title ? <EditorialHeading>{block.title}</EditorialHeading> : null}
          <p className="whitespace-pre-line text-pretty font-serif-display text-2xl leading-9 opacity-85">
            {block.body}
          </p>
        </article>
      );
      break;
    case "definition":
      content = (
        <div className="grid gap-6 border-y border-border py-8 text-left sm:grid-cols-[0.7fr_1.3fr] sm:gap-10">
          <div>
            <Eyebrow>Definition</Eyebrow>
            <EditorialHeading>{block.term}</EditorialHeading>
          </div>
          <div className="space-y-5">
            <p className="text-pretty text-lg leading-8">{block.definition}</p>
            {block.plain_language ? (
              <p className="border-l-2 border-success pl-5 text-pretty leading-7 opacity-75">
                <strong className="text-foreground">In plain language:</strong>{" "}
                {block.plain_language}
              </p>
            ) : null}
          </div>
        </div>
      );
      break;
    case "myth_fact":
      content = (
        <div className="grid border-y border-border text-left md:grid-cols-2">
          <section className="space-y-4 py-8 md:pr-10">
            <p className="editorial-eyebrow text-accent-warm">The misconception</p>
            <h2 className="font-serif-display text-3xl font-normal leading-tight">
              “{block.myth}”
            </h2>
          </section>
          <section className="space-y-4 border-t border-border py-8 md:border-l md:border-t-0 md:pl-10">
            <p className="editorial-eyebrow text-success">What is more accurate</p>
            <p className="text-pretty text-lg leading-8">{block.fact}</p>
          </section>
        </div>
      );
      break;
    case "comparison":
      content = (
        <div className="space-y-7 text-left">
          <div className="max-w-3xl space-y-3">
            <Eyebrow>{block.eyebrow ?? "Compare"}</Eyebrow>
            {block.title ? <EditorialHeading>{block.title}</EditorialHeading> : null}
          </div>
          <div className="grid border-y border-border md:grid-flow-col md:auto-cols-fr">
            {block.columns.map((column, columnIndex) => (
              <section
                className="space-y-4 border-b border-border py-7 last:border-b-0 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                key={`${column.title}-${columnIndex}`}
              >
                <h3 className="font-serif-display text-2xl font-semibold">{column.title}</h3>
                {column.body ? <p className="leading-7 opacity-75">{column.body}</p> : null}
                {column.points ? (
                  <ul className="space-y-3">
                    {column.points.map((point) => (
                      <li className="flex gap-3 leading-7" key={point}>
                        <span
                          aria-hidden="true"
                          className="mt-3 size-1.5 shrink-0 rounded-full bg-accent-warm"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      );
      break;
    case "timeline":
      content = (
        <div className="space-y-8 text-left">
          <div className="max-w-3xl space-y-3">
            <Eyebrow>{block.eyebrow ?? "Follow the sequence"}</Eyebrow>
            <EditorialHeading>{block.title}</EditorialHeading>
          </div>
          <ol className="border-y border-border">
            {block.items.map((item, itemIndex) => (
              <li
                className="grid gap-3 border-b border-border py-6 last:border-b-0 sm:grid-cols-[4rem_10rem_1fr] sm:gap-6"
                key={`${item.title}-${itemIndex}`}
              >
                <span className="font-serif-display text-3xl font-light text-[#c9bdb1]">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent-warm">
                  {item.label ?? `Step ${itemIndex + 1}`}
                </span>
                <div>
                  <h3 className="font-serif-display text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-pretty leading-7 opacity-75">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
      break;
    case "diagram":
      content = (
        <div className="space-y-8 text-left">
          <div className="max-w-3xl space-y-3">
            <Eyebrow>{block.eyebrow ?? "How the parts connect"}</Eyebrow>
            <EditorialHeading>{block.title}</EditorialHeading>
            {block.description ? (
              <p className="text-lg leading-8 opacity-75">{block.description}</p>
            ) : null}
          </div>
          <ol className="grid border-y border-border md:grid-flow-col md:auto-cols-fr">
            {block.nodes.map((node, nodeIndex) => (
              <li
                className="relative border-b border-border px-2 py-7 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:last:border-r-0"
                key={`${node.label}-${nodeIndex}`}
              >
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent-warm">
                  {String(nodeIndex + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-serif-display text-2xl font-semibold">{node.label}</h3>
                {node.body ? <p className="mt-2 leading-7 opacity-70">{node.body}</p> : null}
              </li>
            ))}
          </ol>
        </div>
      );
      break;
    case "expandable":
      content = (
        <div className="space-y-7 text-left">
          <div className="space-y-3">
            <Eyebrow>{block.eyebrow ?? "Look closer"}</Eyebrow>
            {block.title ? <EditorialHeading>{block.title}</EditorialHeading> : null}
          </div>
          <div className="border-y border-border">
            {block.items.map((item) => (
              <details
                className="group border-b border-border py-1 last:border-b-0"
                key={item.title}
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 font-serif-display text-xl font-semibold focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  {item.title}
                  <span
                    aria-hidden="true"
                    className="text-2xl font-light transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 text-pretty leading-7 opacity-75">{item.body}</p>
              </details>
            ))}
          </div>
        </div>
      );
      break;
    case "glossary":
      content = (
        <div className="space-y-6 text-left">
          <Eyebrow>Words to keep nearby</Eyebrow>
          <EditorialHeading>{block.title ?? "A small glossary"}</EditorialHeading>
          <dl className="divide-y divide-border border-y border-border">
            {block.terms.map((entry) => (
              <div className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6" key={entry.term}>
                <dt className="font-serif-display text-xl font-semibold">{entry.term}</dt>
                <dd className="leading-7 opacity-75">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
      break;
    case "reflection":
      content = (
        <div className="space-y-6 border-l-2 border-success pl-6 text-left sm:pl-9">
          <Eyebrow>{block.eyebrow ?? "Reflection"}</Eyebrow>
          <EditorialHeading>{block.prompt}</EditorialHeading>
          <label className="grid gap-2 text-sm font-medium" htmlFor={`lesson-reflection-${index}`}>
            Your private note
            <Textarea
              className="min-h-28 rounded-none border-x-0 border-t-0 bg-transparent px-0 shadow-none"
              id={`lesson-reflection-${index}`}
              placeholder={block.helper_text ?? "There is no right answer here."}
            />
          </label>
          <p className="text-xs leading-5 opacity-65">
            This reflection stays on this page and is not saved.
          </p>
        </div>
      );
      break;
    case "takeaway":
      content = (
        <div className="space-y-5 text-left">
          <Eyebrow>{block.label ?? "Today’s takeaway"}</Eyebrow>
          <p className="max-w-4xl text-pretty font-serif-display text-3xl italic leading-tight sm:text-5xl">
            {block.body}
          </p>
        </div>
      );
      break;
  }

  return (
    <LessonBlockFrame block={block} index={index}>
      {content}
    </LessonBlockFrame>
  );
}
