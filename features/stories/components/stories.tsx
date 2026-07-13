import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoryViewModel } from "@/features/stories/schemas/story-content.schema";

export function DevelopmentStoryBanner() {
  return (
    <aside className="border-l-4 border-info bg-info/35 p-4 text-sm" role="note">
      <p className="font-medium">Development story content</p>
      <p className="mt-1 text-muted-foreground">
        This fictional composite is being used to test the experience and is not a real patient
        testimonial.
      </p>
    </aside>
  );
}

export function StoryList({ stories }: { stories: StoryViewModel[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {stories.map((story) => (
        <li className="py-6" key={story.slug}>
          <article className="max-w-2xl space-y-3">
            <div className="space-y-1">
              <h2 className="text-[length:var(--text-card-title)] font-medium">{story.title}</h2>
              <p className="text-sm text-muted-foreground">
                {story.estimated_reading_minutes} minute read
                {story.journey_week ? ` · Week ${story.journey_week}` : ""}
              </p>
            </div>
            <p className="leading-7">{story.introduction}</p>
            <Link
              className={buttonVariants({ fullWidth: false, variant: "text" })}
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
      <div className="space-y-7">
        {story.content_blocks.map((block) => (
          <section className="space-y-2" key={block.heading}>
            <h2 className="text-[length:var(--text-section-title)] font-medium">{block.heading}</h2>
            <p className="leading-7">{block.body}</p>
          </section>
        ))}
      </div>
      <Card tone="info">
        <CardHeader>
          <CardTitle>Key takeaway</CardTitle>
        </CardHeader>
        <CardContent>{story.key_takeaway}</CardContent>
      </Card>
      <Link className={buttonVariants({ fullWidth: false, variant: "text" })} href="/stories">
        Back to stories
      </Link>
    </article>
  );
}
