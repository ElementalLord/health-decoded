import { redirect } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { ProfileContent } from "@/features/profile/components/profile-forms";
import { getProfileSettings } from "@/features/profile/services/profile-settings.server";
export default async function ProfilePage() { const data = await getProfileSettings(); if (!data.ok) return <EmptyState title="Profile unavailable" description="We couldn’t load your profile right now. Please try again in a moment." />; if (!data.data.onboardingComplete) redirect("/onboarding"); return <ProfileContent data={data.data} />; }
