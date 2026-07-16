import Image from "next/image";

import { Card } from "@/components/ui/card";
import type { LessonContentBlock } from "@/features/lessons/types/lesson-player";

export function LessonContentBlockView({ block }: { block: LessonContentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <div className="space-y-5">
          {block.heading ? (
            <h2 className="font-serif-display text-[length:var(--text-feature-title)] font-semibold tracking-[-0.02em]">
              {block.heading}
            </h2>
          ) : null}
          <p className="text-pretty text-lg leading-9 text-foreground/90">{block.body}</p>
        </div>
      );
    case "callout":
      return (
        <Card
          tone="info"
          className="space-y-3 rounded-none border-x-0 border-y border-success/35 p-6 shadow-none sm:p-8"
        >
          <h2 className="font-serif-display text-[length:var(--text-feature-title)] font-semibold tracking-[-0.02em]">
            {block.title}
          </h2>
          <p className="text-pretty text-lg leading-8 text-foreground/90">{block.body}</p>
        </Card>
      );
    case "summary":
      return (
        <div className="space-y-5">
          <h2 className="font-serif-display text-[length:var(--text-feature-title)] font-semibold tracking-[-0.02em]">
            {block.title ?? "Key points"}
          </h2>
          <ul className="border-y border-border text-lg leading-8 text-foreground/90">
            {block.points.map((point, index) => (
              <li className="flex gap-4 border-b border-border py-4 last:border-b-0" key={point}>
                <span className="font-serif-display text-2xl text-accent-warm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "image":
      return (
        <figure className="space-y-3">
          <Image
            alt={block.alt}
            className="w-full rounded-[var(--radius-xl)] border border-border/50 bg-muted object-cover"
            height={block.height}
            sizes="(min-width: 768px) 720px, 100vw"
            src={block.src}
            width={block.width}
          />
          {block.caption ? (
            <figcaption className="text-pretty text-sm leading-6 text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
  }
}
