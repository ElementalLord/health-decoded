import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { SteadyingHandIllustration } from "@/components/illustrations/editorial-illustrations";
import { EmptyState } from "@/components/shared/empty-state";
import { StoryList } from "@/features/stories/components/stories";
import { listStories } from "@/features/stories/services/stories.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function StoriesPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const stories = await listStories();

  if (!stories.ok) {
    return (
      <EmptyState
        title="Stories are unavailable"
        description="We couldn't load stories right now. Please try again in a moment."
        headingLevel="h1"
      />
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-12 py-6 sm:py-10">
      <div className="grid gap-8 border-b border-border pb-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <PageHeader
          description="Thoughtful perspectives for moments that can feel unfamiliar."
          eyebrow="Lived experience"
          title="Stories that help you back up"
        />
        <SteadyingHandIllustration className="mx-auto max-w-sm" />
      </div>
      {stories.data.length ? (
        <StoryList stories={stories.data} />
      ) : (
        <EmptyState
          title="No stories are available yet"
          description="Reviewed stories will appear here when they are ready."
        />
      )}
    </section>
  );
}
