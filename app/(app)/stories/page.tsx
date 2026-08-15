import { redirect } from "next/navigation";

import { StoryLanding } from "@/features/stories/components/story-landing";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = { title: "Stories", icons: sectionIcons("library") };

export default async function StoriesPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  return <StoryLanding />;
}
