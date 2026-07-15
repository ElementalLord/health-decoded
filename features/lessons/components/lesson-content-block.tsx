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
          <p className="text-pretty text-lg leading-8 text-foreground/90">{block.body}</p>
        </div>
      );
    case "callout":
      return (
        <Card tone="info" className="space-y-3 rounded-[16px] p-6 sm:p-7">
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
          <ul className="space-y-3.5 text-lg leading-8 text-foreground/90">
            {block.points.map((point) => (
              <li className="flex gap-3.5" key={point}>
                <span
                  aria-hidden="true"
                  className="mt-3 size-2 shrink-0 rounded-full bg-primary"
                />
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
            className="w-full rounded-[14px] border border-border/60 bg-muted object-cover"
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
