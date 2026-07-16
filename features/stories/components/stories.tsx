import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoryViewModel } from "@/features/stories/schemas/story-content.schema";
import { cn } from "@/lib/utils";

export function StoryList({ stories }: { stories: StoryViewModel[] }) {
  return (
    <ul className="stagger-children border-y border-border">
      {stories.map((story, index) => (
        <li className="border-b border-border py-8 last:border-b-0 sm:py-10" key={story.slug}>
          <article
            className={cn("grid gap-5 sm:grid-cols-[4.5rem_1fr]", index % 2 === 1 && "sm:ml-16")}
          >
            <span className="font-serif-display text-5xl font-light text-[#c9bdb1]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="max-w-2xl space-y-3">
              <div className="space-y-1.5">
                <h2 className="font-serif-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {story.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {story.estimated_reading_minutes} minute read
                  {story.journey_week ? ` · Week ${story.journey_week}` : ""}
                </p>
              </div>
              <p className="text-pretty leading-7 text-muted-foreground">{story.introduction}</p>
              <Link
                className={cn(
                  buttonVariants({ fullWidth: false, variant: "text" }),
                  "min-h-11 px-0",
                )}
                href={`/stories/${story.slug}`}
              >
                Read story
              </Link>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

export function StoryDetail({ story }: { story: StoryViewModel }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 py-6 sm:py-10">
      <PageHeader description={story.introduction} eyebrow="Patient stories" title={story.title} />
      <div className="space-y-12 border-t border-border pt-10">
        {story.content_blocks.map((block, index) => (
          <section
            className={cn("space-y-3", index % 2 === 1 && "border-l-2 border-accent-warm pl-6")}
            key={block.heading}
          >
            <h2 className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight">
              {block.heading}
            </h2>
            <p className="text-pretty leading-7 text-foreground/90 md:leading-8">{block.body}</p>
          </section>
        ))}
      </div>
      <Card tone="info" className="rounded-none border-x-0 border-y border-success/35 shadow-none">
        <CardHeader>
          <CardTitle>Key takeaway</CardTitle>
        </CardHeader>
        <CardContent>{story.key_takeaway}</CardContent>
      </Card>
      <Link
        className={cn(buttonVariants({ fullWidth: false, variant: "text" }), "min-h-11 px-0")}
        href="/stories"
      >
        Back to stories
      </Link>
    </article>
  );
}
