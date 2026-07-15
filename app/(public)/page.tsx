import { Activity, ArrowRight, BookOpen, HeartPulse, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: HeartPulse,
    title: "Daily lessons",
    description: "Bite-sized, science-backed lessons that meet you where you are.",
  },
  {
    icon: BookOpen,
    title: "Patient stories",
    description: "Real-world composites that make the abstract feel personal.",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    description: "Your reflections stay yours. Nothing is shared without your say-so.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1152px] px-5 pb-16 pt-12 md:px-6 md:pb-24 md:pt-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
            <div className="animate-slide-up space-y-7">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-[var(--shadow-card)]">
                <span
                  aria-hidden="true"
                  className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Activity className="size-3.5" strokeWidth={2.5} />
                </span>
                The first 90 days, decoded
              </span>

              <h1 className="font-serif-display text-[length:var(--text-page-title)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance md:text-[2.75rem] lg:text-[3rem]">
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
                  className={cn(buttonVariants({ fullWidth: false, variant: "secondary" }), "min-h-12 px-6")}
                  href="/login"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="animate-fade-in relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-border/60 shadow-[0_20px_60px_rgb(20_35_40/0.12)] sm:aspect-[3/4]">
                <Image
                  alt="A person sitting calmly by a window with a cup of tea, representing peaceful self-care after a diabetes diagnosis"
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                  src="https://images.pexels.com/photos/6953538/pexels-photo-6953538.jpeg?auto=compress&cs=tinysrgb&w=800"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 hidden rounded-[14px] border border-border bg-card p-4 shadow-[var(--shadow-modal)] sm:block">
                <p className="text-[length:var(--text-caption)] font-medium uppercase tracking-wide text-muted-foreground">
                  Day 1
                </p>
                <p className="font-serif-display text-lg font-semibold">What just happened?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/50">
        <div className="mx-auto max-w-[1152px] px-5 py-14 md:px-6 md:py-20 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-3">
            {features.map((feature) => (
              <div className="space-y-3" key={feature.title}>
                <span
                  aria-hidden="true"
                  className="inline-flex size-11 items-center justify-center rounded-[12px] bg-primary/10 text-primary"
                >
                  <feature.icon className="size-5" strokeWidth={2} />
                </span>
                <h2 className="font-serif-display text-lg font-semibold tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-pretty text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-[1152px] px-5 py-16 md:px-6 md:py-24 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-border/60 shadow-[var(--shadow-card)]">
              <Image
                alt="A notebook and pen on a wooden table, representing reflective journaling"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 500px, 100vw"
                src="https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=800"
              />
            </div>
            <div className="space-y-5">
              <h2 className="font-serif-display text-[length:var(--text-section-title)] font-semibold tracking-tight text-balance md:text-3xl">
                Built for the moments that matter most.
              </h2>
              <p className="text-pretty leading-7 text-muted-foreground md:leading-8">
                The days after a diagnosis can feel like a flood of information. Health Decoded
                breaks it into manageable pieces — one lesson per day, at your own pace, with an AI
                tutor ready when you have questions.
              </p>
              <Link
                className={cn(buttonVariants({ fullWidth: false, variant: "text" }), "min-h-11 px-0 text-base")}
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
