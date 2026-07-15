import { ArrowRight, BookOpen, CalendarDays, MessageCircleQuestion, ShieldCheck, Sprout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Learn one small thing each day",
    description:
      "Bite-sized lessons arrive one at a time. No overwhelm, no jargon — just one clear idea you can sit with.",
  },
  {
    number: "02",
    title: "Check in with yourself",
    description:
      "A gentle daily confidence check helps you notice how your understanding shifts over time.",
  },
  {
    number: "03",
    title: "Ask when you're curious",
    description:
      "An AI tutor is ready when something doesn't make sense. Ask in your own words, get a plain-language answer.",
  },
];

const features = [
  { icon: CalendarDays, label: "Daily lessons" },
  { icon: BookOpen, label: "Patient stories" },
  { icon: MessageCircleQuestion, label: "AI tutor" },
  { icon: ShieldCheck, label: "Private & secure" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative">
        <div className="mx-auto max-w-[1152px] px-5 pb-20 pt-10 md:px-6 md:pb-28 md:pt-16 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
            <div className="animate-slide-up space-y-8">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Sprout className="size-3" strokeWidth={2.5} />
                </span>
                The first 90 days, decoded
              </span>

              <h1 className="font-serif-display text-[length:var(--text-page-title)] font-semibold leading-[1.08] tracking-[-0.02em] text-balance md:text-[2.75rem] lg:text-[3.25rem]">
                Understanding Type 2 diabetes, one calm step at a time.
              </h1>

              <p className="max-w-xl text-pretty text-[length:var(--text-supporting)] leading-7 text-muted-foreground md:text-base md:leading-8">
                Health Decoded is a private, guided learning companion for the first three months
                after diagnosis. No jargon, no overwhelm — just clear, practical education that
                builds confidence day by day.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className={cn(buttonVariants({ fullWidth: false }), "min-h-12 px-6")}
                  href="/signup"
                >
                  Start your journey
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ fullWidth: false, variant: "secondary" }),
                    "min-h-12 px-6",
                  )}
                  href="/login"
                >
                  Sign in
                </Link>
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                {features.map((feature) => (
                  <li
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                    key={feature.label}
                  >
                    <feature.icon aria-hidden="true" className="size-4 text-primary" strokeWidth={1.75} />
                    {feature.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-fade-in relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] border border-border/50 sm:aspect-[3/4]">
                <Image
                  alt="A person sitting calmly by a window with a cup of tea, representing peaceful self-care after a diabetes diagnosis"
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"
                  src="https://images.pexels.com/photos/6953538/pexels-photo-6953538.jpeg?auto=compress&cs=tinysrgb&w=800"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/50">
        <div className="mx-auto max-w-[1152px] px-5 py-16 md:px-6 md:py-24 lg:px-8">
          <div className="mb-12 max-w-2xl space-y-3">
            <p className="text-[length:var(--text-supporting)] font-semibold uppercase tracking-[0.1em] text-primary">
              How it works
            </p>
            <h2 className="font-serif-display text-[length:var(--text-section-title)] font-semibold tracking-tight text-balance md:text-3xl">
              Three simple steps, repeated gently over 90 days.
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border/50 bg-border/50 sm:grid-cols-3">
            {steps.map((step) => (
              <div className="bg-card p-6 sm:p-8" key={step.number}>
                <p className="font-serif-display text-3xl font-semibold text-primary/30">
                  {step.number}
                </p>
                <h3 className="mt-4 font-serif-display text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-pretty text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-[1152px] px-5 py-16 md:px-6 md:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] border border-border/50">
              <Image
                alt="A notebook and pen on a wooden table, representing reflective journaling"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 450px, 100vw"
                src="https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=800"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif-display text-[length:var(--text-section-title)] font-semibold tracking-tight text-balance md:text-3xl">
                Built for the moments that matter most.
              </h2>
              <blockquote className="border-l-2 border-primary/40 pl-5">
                <p className="font-serif-display text-pretty text-lg leading-8 text-foreground/90 italic">
                  &ldquo;The days after diagnosis can feel like a flood. Breaking it into small
                  pieces — one lesson, one day — made it feel manageable for the first time.&rdquo;
                </p>
              </blockquote>
              <p className="text-pretty leading-7 text-muted-foreground md:leading-8">
                Health Decoded breaks the first 90 days into manageable pieces — one lesson per day,
                at your own pace, with an AI tutor ready when you have questions.
              </p>
              <Link
                className={cn(
                  buttonVariants({ fullWidth: false, variant: "text" }),
                  "min-h-11 px-0 text-base",
                )}
                href="/signup"
              >
                Get started — it takes a minute
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
