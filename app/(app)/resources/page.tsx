import { redirect } from "next/navigation";
import { ResourcesList } from "@/features/resources/components/resources";
import { listReviewedResources } from "@/features/resources/services/resources.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export default async function ResourcesPage() { const profile = await getCurrentProfile(); if (!profile.ok) redirect("/journey"); if (!profile.data.onboarding_completed_at) redirect("/onboarding"); const resources = listReviewedResources(); return <section className="mx-auto max-w-4xl space-y-8 py-6 sm:py-10"><header className="max-w-2xl space-y-2"><h1 className="text-[length:var(--text-page-title)] font-semibold">Learning resources</h1><p className="leading-7 text-muted-foreground">Trusted external information to explore at your own pace.</p></header><ResourcesList resources={resources} /></section>; }
