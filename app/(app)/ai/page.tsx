import { redirect } from "next/navigation";
import { MessagesSquare } from "lucide-react";

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
      <section
        aria-label="Ask Health Decoded chat workspace"
        className="relative mt-8 overflow-hidden rounded-[28px] border border-[#d7c5b7] bg-[#fffaf3] shadow-[0_28px_80px_rgb(68_47_37/0.10),0_3px_0_rgb(68_47_37/0.05)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent-warm/8 blur-3xl"
        />
        <header className="relative flex flex-col gap-4 border-b border-[#ddcec2] bg-[#f3e9e1]/75 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-success/20 bg-info text-success shadow-[0_2px_0_rgb(61_47_41/0.06)]">
              <MessagesSquare aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="editorial-eyebrow text-accent-warm">
                Your private learning conversation
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Ask one question at a time. Your guide will meet you where you are.
              </p>
            </div>
          </div>
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-success/20 bg-info px-3 py-1.5 text-xs font-semibold text-success">
            <span aria-hidden="true" className="size-2 rounded-full bg-success" />
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
