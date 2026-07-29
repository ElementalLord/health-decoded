import { redirect } from "next/navigation";
import { MessageCircleHeart, MessagesSquare } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
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
    <section className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-[960px] flex-col py-4 sm:py-6">
      <div className="grid gap-6 border-b border-[#d8d2c8] pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <PageHeader
          description="Ask for a calm, plain-language explanation of Type 2 diabetes or today’s lesson. There is no rush, and you can always ask for simpler words."
          eyebrow="A gentle place for learning questions"
          title="Ask Health Decoded"
        />
        <div className="flex max-w-64 items-center gap-3 rounded-[14px] bg-[#edf3ee] px-4 py-3 text-[#557164]">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-[#dce8df]">
            <MessageCircleHeart aria-hidden="true" className="size-4" />
          </span>
          <p className="text-sm leading-5">One question at a time is enough.</p>
        </div>
      </div>
      <section
        aria-label="Ask Health Decoded chat workspace"
        className="relative mt-8 overflow-hidden rounded-[16px] border border-[#cbd8d0] bg-[#fdfbf6]"
      >
        <header className="relative grid gap-5 border-b border-[#d5dfd8] bg-[#eef4ef] px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-[#dce9e0] text-[#557164]">
              <MessagesSquare aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="editorial-eyebrow text-[#806f63]">Your private learning conversation</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Start wherever you are. Short, specific, and unfinished questions are welcome.
              </p>
            </div>
          </div>
          <p className="inline-flex w-fit items-center gap-2 rounded-[12px] bg-[#f8f4ec] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#607c6d]">
            <span aria-hidden="true" className="size-2 rounded-full bg-[#789987]" />
            Ready when you are
          </p>
        </header>
        <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
          <AiChat />
        </div>
      </section>
    </section>
  );
}
