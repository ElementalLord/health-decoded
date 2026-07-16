import { redirect } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { AiChat } from "@/features/ai/components/ai-chat";
import { getCurrentProfile } from "@/features/profile/services/profile.server";

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
    <section className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-[960px] flex-col py-4 sm:py-6">
      <div className="grid gap-8 border-b border-border pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <PageHeader
          description="Ask for a calm, plain-language explanation of Type 2 diabetes and today’s learning."
          eyebrow="A warm companion for hard questions"
          title="Ask Health Decoded"
        />
        <p className="flex items-end gap-3">
          <span className="font-serif-display text-6xl font-light text-success sm:text-7xl">
            24/7
          </span>
          <span className="max-w-28 pb-2 text-sm leading-5 text-muted-foreground">
            here when a question arrives
          </span>
        </p>
      </div>
      <AiChat />
    </section>
  );
}
