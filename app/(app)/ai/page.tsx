import { redirect } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { AiChat } from "@/features/ai/components/ai-chat";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

export const metadata = { title: "AI tutor" };

export default async function AiPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) {
    return (
      <EmptyState
        className="py-16"
        description="We could not load the educational assistant right now. Please try again later."
        headingLevel="h1"
        title="AI assistant unavailable"
      />
    );
  }
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-[760px] flex-col py-6 sm:py-9">
      <header className="border-b border-border pb-6">
        <h1 className="font-serif-display text-4xl tracking-tight sm:text-5xl">AI Tutor</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Ask about diabetes or something you&apos;re learning.
        </p>
      </header>
      <AiChat />
    </section>
  );
}
