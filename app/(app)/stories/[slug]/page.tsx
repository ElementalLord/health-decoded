import { notFound, redirect } from "next/navigation";
import { StoryDetail } from "@/features/stories/components/stories";
import { getStory } from "@/features/stories/services/stories.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");
  const story = await getStory(slug);
  if (!story.ok && story.error.code === "not_found") notFound();
  if (!story.ok) notFound();
  return <StoryDetail story={story.data} />;
}
