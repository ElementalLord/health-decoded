import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoryViewModel } from "@/features/stories/schemas/story-content.schema";
import { cn } from "@/lib/utils";

export function DevelopmentStoryBanner() {
  return (
    <aside
      className="flex gap-3 rounded-[var(--radius-xl)] border border-info/40 bg-info/20 px-5 py-4"
      role="note"
    >
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-foreground">Development story content</p>
        <p className="text-sm leading-6 text-muted-foreground">
          This fictional composite is being used to test the experience and is not a real patient
          testimonial.
        </p>
      </div>
    </aside>
  );
}

export function StoryList({ stories }: { stories: StoryViewModel[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {stories.map((story) => (
        <li className="py-7" key={story.slug}>
          <article className="max-w-2xl space-y-3">
            <div className="space-y-1.5">
              <h2 className="font-serif-display text-[length:var(--text-card-title)] font-semibold tracking-tight">
                {story.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {story.estimated_reading_minutes} minute read
                {story.journey_week ? ` · Week ${story.journey_week}` : ""}
              </p>
            </div>
            <p className="text-pretty leading-7 text-muted-foreground">{story.introduction}</p>
            <Link
              className={cn(buttonVariants({ fullWidth: false, variant: "text" }), "min-h-11 px-0")}
              href={`/stories/${story.slug}`}
            >
              Read story
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}

export function StoryDetail({ story }: { story: StoryViewModel }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 py-6 sm:py-10">
      {story.development_notice ? <DevelopmentStoryBanner /> : null}
      <PageHeader description={story.introduction} eyebrow="Patient stories" title={story.title} />
      <div className="space-y-8">
        {story.content_blocks.map((block) => (
          <section className="space-y-2.5" key={block.heading}>
            <h2 className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight">
              {block.heading}
            </h2>
            <p className="text-pretty leading-7 text-foreground/90 md:leading-8">{block.body}</p>
          </section>
        ))}
      </div>
      <Card tone="info" className="rounded-[var(--radius-xl)]">
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
