import { notFound, redirect } from "next/navigation";
import { InteractiveStoryPlayer } from "@/features/stories/components/interactive-story-player";
import { StoryDetail } from "@/features/stories/components/stories";
import { ashaRiceOnTheTableStory } from "@/features/stories/content/asha-rice-on-the-table";
import { marcusParkingLotStory } from "@/features/stories/content/marcus-parking-lot";
import { getStory } from "@/features/stories/services/stories.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export const metadata = { title: "Learning story" };

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");
  if (slug === marcusParkingLotStory.slug) {
    return <InteractiveStoryPlayer story={marcusParkingLotStory} />;
  }
  if (slug === ashaRiceOnTheTableStory.slug) {
    return <InteractiveStoryPlayer story={ashaRiceOnTheTableStory} />;
  }
  const story = await getStory(slug);
  if (!story.ok && story.error.code === "not_found") notFound();
  if (!story.ok) notFound();
  return <StoryDetail story={story.data} />;
}
