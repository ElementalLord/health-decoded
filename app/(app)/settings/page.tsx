import { redirect } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { SettingsContent } from "@/features/profile/components/profile-forms";
import { getProfileSettings } from "@/features/profile/services/profile-settings.server";
export default async function SettingsPage() { const data = await getProfileSettings(); if (!data.ok) return <EmptyState title="Settings unavailable" description="We couldn’t load your settings right now. Please try again in a moment." />; if (!data.data.onboardingComplete) redirect("/onboarding"); return <SettingsContent data={data.data} />; }
