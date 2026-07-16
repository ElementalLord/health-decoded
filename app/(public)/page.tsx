import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  CompanionIllustration,
  SteadyingHandIllustration,
} from "@/components/illustrations/editorial-illustrations";
import { buttonVariants } from "@/components/ui/button";
import { GlucoseInsulinAnimation } from "@/features/marketing/components/glucose-insulin-animation";
import { cn } from "@/lib/utils";

const phases = [
  ["01", "Understanding", "What’s happening in your body. Calm, clear, never scary.", "Days 1–30"],
  ["02", "Adjusting", "Small, sustainable changes that fit your real life.", "Days 31–60"],
  ["03", "Living", "Confidence, questions, and a rhythm that belongs to you.", "Days 61–90"],
] as const;

export default function HomePage() {
  return (
    <>
      <section className="border-b border-[#e5ddd2]" id="home">
        <div className="mx-auto grid min-h-[calc(100dvh-4.75rem)] max-w-[1440px] gap-10 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-14">
          <div className="motion-cascade">
            <p className="editorial-eyebrow">A companion for the first 90 days</p>
            <h1 className="mt-7 max-w-3xl font-serif-display text-[clamp(3.8rem,7vw,7.25rem)] font-normal leading-[0.83] tracking-[-0.055em] text-balance">
              You&apos;re not
              <br />
              fighting
              <br />
              <em className="font-normal">sugar</em> alone.
            </h1>
            <p className="mt-9 max-w-[38rem] text-lg leading-9 text-[#827168] sm:text-xl">
              A private, compassionate companion for life after a Type 2 diagnosis. One calm lesson
              at a time—at your own pace, with a guide by your side.
            </p>
            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Link
                className={cn(buttonVariants({ fullWidth: false, size: "lg" }), "min-w-64")}
                href="/signup"
              >
                Begin your journey <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <a
                className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-[#382c26] underline decoration-[#c97860]/45 decoration-2 underline-offset-[7px] hover:decoration-[#c97860]"
                href="#ask"
              >
                Talk to your guide <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>

          <figure className="mx-auto w-full max-w-[36rem] animate-fade-in [animation-delay:160ms] lg:translate-y-8">
            <CompanionIllustration />
            <figcaption className="mt-4 text-center text-xs font-bold uppercase tracking-[0.22em] text-[#8d7b70]">
              The guardian&apos;s embrace
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="home-scroll-fade border-b border-[#e5ddd2] px-5 py-28 text-center sm:py-36"
        aria-labelledby="first-ninety-days"
      >
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8d7b70]">Your first</p>
        <p
          className="mt-6 font-serif-display text-[clamp(8rem,24vw,18rem)] font-normal leading-[0.72] tracking-[-0.08em] text-[#382c26]"
          id="first-ninety-days"
        >
          90
        </p>
        <p className="mt-10 font-serif-display text-2xl text-[#8b786d] sm:text-3xl">
          days, gently decoded.
        </p>
      </section>

      <section className="home-scroll-fade border-b border-[#e5ddd2] px-5 py-24 text-center sm:py-32">
        <blockquote className="mx-auto max-w-4xl font-serif-display text-3xl italic leading-tight text-[#493a32] sm:text-5xl">
          “A diagnosis isn&apos;t the end of your story.
          <br />
          It&apos;s the beginning of a gentler one.”
        </blockquote>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-[#8d7b70]">
          — The Health Decoded team
        </p>
      </section>

      <section className="border-b border-[#e5ddd2]" id="journey">
        <div className="home-scroll-fade mx-auto grid max-w-[1260px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:gap-20">
          <div>
            <p className="editorial-eyebrow">Chapter one</p>
            <h2 className="mt-5 font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
              One calm lesson each day.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-[#827168]">
              Small, clear, and never overwhelming. Progress at the pace that feels right for you.
              No streaks. No pressure. Just gentle, daily understanding.
            </p>
            <Link className="mt-8 inline-flex items-center gap-2 font-semibold" href="/signup">
              See today&apos;s lesson <ArrowRight className="size-4" />
            </Link>
          </div>
          <aside className="bg-[#f1ece4] px-8 py-12 sm:px-14 sm:py-16">
            <p className="font-serif-display text-8xl font-light leading-none text-[#c97860]">08</p>
            <p className="mt-5 text-xl font-semibold">minutes to read</p>
            <p className="mt-2 text-lg text-[#827168]">
              That&apos;s less than one song on the radio.
            </p>
          </aside>
        </div>
      </section>

      <section className="home-scroll-fade mx-auto max-w-[1260px] px-5 py-20 md:px-10 md:py-28">
        <GlucoseInsulinAnimation />
      </section>

      <section className="border-y border-[#e5ddd2]" id="ask">
        <div className="home-scroll-fade mx-auto max-w-[1120px] px-5 py-20 md:px-10 md:py-28">
          <div className="border-l-2 border-[#c97860] pl-7 sm:pl-14">
            <p className="editorial-eyebrow">Chapter two</p>
            <h2 className="mt-5 font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
              A warm companion for hard questions.
            </h2>
            <p className="mt-7 max-w-4xl text-lg leading-9 text-[#827168]">
              Our AI guide speaks in plain, gentle language. No medical jargon. No judgment. Just
              clear educational answers whenever you need them—at 3 AM, between meetings, or while
              waiting for the kettle to boil.
            </p>
            <div className="mt-10 flex flex-wrap items-end gap-4">
              <span className="font-serif-display text-6xl text-[#6f947a] sm:text-8xl">24/7</span>
              <span className="pb-2 text-[#827168]">always here, never rushing you</span>
            </div>
            <Link className="mt-9 inline-flex items-center gap-2 font-semibold" href="/signup">
              Ask a question <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e5ddd2]" id="stories">
        <div className="home-scroll-fade mx-auto grid max-w-[1260px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-24">
          <figure>
            <SteadyingHandIllustration />
            <figcaption className="mt-3 text-center text-xs font-bold uppercase tracking-[0.24em] text-[#8d7b70]">
              The steadying hand
            </figcaption>
          </figure>
          <div>
            <p className="editorial-eyebrow">Chapter three</p>
            <h2 className="mt-5 font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
              When you stumble, we help you up.
            </h2>
            <p className="mt-7 text-lg leading-9 text-[#827168]">
              Fictional composite stories of people living with Type 2—because knowing you&apos;re
              not alone changes everything. Real emotions, real setbacks, real grace.
            </p>
            <Link className="mt-8 inline-flex items-center gap-2 font-semibold" href="/signup">
              Read a story <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e5ddd2]">
        <div className="home-scroll-fade mx-auto max-w-[1120px] px-5 py-20 md:px-10 md:py-28">
          <p className="editorial-eyebrow">Your journey ahead</p>
          <h2 className="mt-5 font-serif-display text-4xl font-normal sm:text-5xl">
            Ninety days, three gentle phases.
          </h2>
          <ol className="home-scroll-fade-list mt-14">
            {phases.map(([number, title, body, days]) => (
              <li
                className="grid gap-3 border-b border-[#ded5ca] py-8 sm:grid-cols-[4rem_1fr_auto] sm:items-start sm:gap-5"
                key={number}
              >
                <span className="font-serif-display text-4xl font-light text-[#c9bdb1]">
                  {number}
                </span>
                <div>
                  <h3 className="font-serif-display text-2xl font-semibold">{title}</h3>
                  <p className="mt-2 text-[#827168]">{body}</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#8d7b70] sm:pt-2">
                  {days}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-scroll-fade border-b border-[#e5ddd2] px-5 py-28 text-center sm:py-36">
        <h2 className="font-serif-display text-5xl font-normal sm:text-7xl">
          Your fighter is ready.
        </h2>
        <p className="mt-6 text-lg text-[#827168]">Take the first gentle step today.</p>
        <Link
          className={cn(buttonVariants({ fullWidth: false, size: "lg" }), "mt-9 min-w-64")}
          href="/signup"
        >
          Start your journey <ArrowRight className="size-4" />
        </Link>
      </section>

      <footer className="mx-auto max-w-[1440px] px-5 py-12 text-[#827168] md:px-10 lg:px-14">
        <p className="text-xs font-bold uppercase tracking-[0.22em]">
          Educational support, not medical advice
        </p>
        <p className="mt-3 text-sm">
          © 2026 Health Decoded — A compassionate companion for the first 90 days.
        </p>
      </footer>
    </>
  );
}
