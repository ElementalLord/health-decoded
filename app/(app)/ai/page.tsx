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
    <section className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-[720px] flex-col py-4 sm:py-6">
      <PageHeader
        description="Ask for a calm, plain-language explanation of Type 2 diabetes and today's learning."
        eyebrow="Educational support"
        title="Ask Health Decoded AI"
      />
      <AiChat />
    </section>
  );
}
