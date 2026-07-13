import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoryViewModel } from "@/features/stories/schemas/story-content.schema";

export function DevelopmentStoryBanner() {
  return <aside className="rounded-xl border border-info bg-info/35 p-4 text-sm" role="note"><p className="font-semibold">Development story content</p><p className="mt-1 text-muted-foreground">This fictional composite is being used to test the experience and is not a real patient testimonial.</p></aside>;
}

export function StoryList({ stories }: { stories: StoryViewModel[] }) {
  return <ul className="grid gap-4 sm:grid-cols-2">{stories.map((story) => <li key={story.slug}><Card className="flex h-full flex-col"><CardHeader><CardTitle>{story.title}</CardTitle><p className="text-sm text-muted-foreground">{story.estimated_reading_minutes} minute read{story.journey_week ? ` · Week ${story.journey_week}` : ""}</p></CardHeader><CardContent><p>{story.introduction}</p><Link className="mt-4 inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-primary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring" href={`/stories/${story.slug}`}>Read story</Link></CardContent></Card></li>)}</ul>;
}

export function StoryDetail({ story }: { story: StoryViewModel }) {
  return <article className="mx-auto max-w-3xl space-y-8 py-6 sm:py-10">{story.development_notice ? <DevelopmentStoryBanner /> : null}<header className="space-y-3"><p className="text-sm font-semibold text-primary">Patient stories</p><h1 className="text-[length:var(--text-page-title)] font-semibold tracking-tight">{story.title}</h1><p className="text-base leading-7 text-muted-foreground">{story.introduction}</p></header><div className="space-y-7">{story.content_blocks.map((block) => <section className="space-y-2" key={block.heading}><h2 className="text-[length:var(--text-section-title)] font-semibold">{block.heading}</h2><p className="leading-7">{block.body}</p></section>)}</div><Card tone="info"><CardHeader><CardTitle>Key takeaway</CardTitle></CardHeader><CardContent>{story.key_takeaway}</CardContent></Card><Link className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-primary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring" href="/stories">Back to stories</Link></article>;
}
