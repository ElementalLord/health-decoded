import { redirect } from "next/navigation";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { AiChat } from "@/features/ai/components/ai-chat";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = { title: "AI tutor", icons: sectionIcons("ai") };

export default async function AiPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) {
    return (
      <EmptyState
        action={
          <Link className={buttonVariants({ fullWidth: false })} href="/ai">
            Try again
          </Link>
        }
        className="py-16"
        description="We couldn’t load the educational assistant right now. Try again when you’re ready."
        headingLevel="h1"
        title="AI assistant unavailable"
      />
    );
  }
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-[760px] flex-col py-6 sm:py-9">
      <header className="border-b border-border pb-5">
        <p className="editorial-eyebrow mb-3">Learning support</p>
        <h1 className="font-serif-display text-4xl tracking-tight sm:text-5xl">AI Tutor</h1>
        <p className="mt-2 max-w-xl text-base leading-7 text-muted-foreground">
          Ask about diabetes or something you&apos;re learning.
        </p>
      </header>
      <AiChat />
    </section>
  );
}
