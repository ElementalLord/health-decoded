import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DevelopmentStoryBanner, StoryList } from "@/features/stories/components/stories";
import { listStories } from "@/features/stories/services/stories.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function StoriesPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");
  const stories = await listStories();
  if (!stories.ok)
    return (
      <EmptyState
        title="Stories are unavailable"
        description="We couldn’t load stories right now. Please try again in a moment."
        headingLevel="h1"
      />
    );
  return (
    <section className="mx-auto max-w-4xl space-y-8 py-6 sm:py-10">
      <PageHeader
        title="Patient stories"
        description="Thoughtful perspectives for moments that can feel unfamiliar."
      />
      {stories.data[0]?.content_status === "development" ? <DevelopmentStoryBanner /> : null}
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
