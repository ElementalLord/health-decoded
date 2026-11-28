import Link from "next/link";

import {
  CompanionIllustration,
  SteadyingHandIllustration,
} from "@/components/illustrations/editorial-illustrations";
import { TestUserAccess } from "@/features/auth/components/test-user-access";
import { GlucoseInsulinAnimation } from "@/features/marketing/components/glucose-insulin-animation";
import { LandingGlossaryLookup } from "@/features/marketing/components/landing-glossary-lookup";
import { LandingLabelCheck } from "@/features/marketing/components/landing-label-check";
import { LandingMythCheck } from "@/features/marketing/components/landing-myth-check";
import {
  LatticeDivider,
  PumpingHeart,
  sketchStyles,
  WavyRule,
} from "@/features/marketing/components/landing-sketch";
import { LandingStoryPreview } from "@/features/marketing/components/landing-story-preview";
import { StartingPointPicker } from "@/features/marketing/components/starting-point-picker";
import {
  getLandingMythCards,
  getMarcusChoice,
  landingGlossary,
  landingGlossarySuggestions,
  landingLabelQuestions,
  landingLabels,
  landingStories,
  totalMythCardCount,
} from "@/features/marketing/content/landing-interactive-content";

const phases = [
  ["01", "Understanding", "Get familiar with the basics, one idea at a time.", "Days 1–30"],
  ["02", "Adjusting", "Try small changes that work with your routines.", "Days 31–60"],
  ["03", "Living", "Use what you have learned in day-to-day care.", "Days 61–90"],
] as const;

const appFeatures = [
  {
    number: "01",
    title: "Learn the essentials",
    body: "Follow 14 short lessons, revisit important ideas with spaced review, and track what you complete.",
    details: ["Short lessons", "Spaced review", "Progress", "Milestones"],
  },
  {
    number: "02",
    title: "Practice what you learn",
    body: "Sort fact from fiction, explain an idea in your own words, read a nutrition label, and make choices inside interactive stories.",
    details: ["Myth Check", "Explain It Back", "Decode the Label", "Stories"],
  },
  {
    number: "03",
    title: "Find clear information",
    body: "Look up unfamiliar terms, browse carefully selected resources, or search across Health Decoded when you need a direct answer.",
    details: ["Medical glossary", "Curated resources", "Search"],
  },
  {
    number: "04",
    title: "Prepare and support",
    body: "Prepare for appointments, ask the AI guide a question, or learn practical ways to support someone.",
    details: ["Appointment preparation", "AI guide", "Caregiver path"],
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section id="home">
        <div className="mx-auto grid max-w-[1440px] gap-[clamp(2rem,5vw,4rem)] px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(1.5rem,4vh,3rem)] pt-[clamp(2.75rem,6vh,4.5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="motion-cascade">
            <h1 className="max-w-3xl font-serif-display text-[clamp(3.25rem,9.5vw,7rem)] font-normal leading-[1] tracking-[-0.045em] text-balance">
              Your Companion
            </h1>
            <p className="mt-6 max-w-[36rem] text-lg leading-8 text-[#6b5b52] sm:mt-8 sm:text-xl sm:leading-9">
              Understand how Type 2 diabetes works, practice everyday skills, and feel self-reliant
              beyond the doctor&apos;s office.
            </p>
            <div className="mt-8 max-w-[32rem]">
              <TestUserAccess next="/journey" />
            </div>
          </div>

          <figure className="mx-auto w-full max-w-[34rem] animate-fade-in [animation-delay:160ms]">
            <div className={`${sketchStyles.sketchFrame} px-6 pt-6 sm:px-10 sm:pt-8`}>
              <CompanionIllustration title="Two people sharing a hug" />
            </div>
            <figcaption className="mt-5 text-center font-serif-display text-lg italic leading-snug text-[#6b5b52] sm:text-xl">
              We care about how this feels,
              <br />
              not{" "}
              <span className="underline decoration-[#c97860] decoration-2 underline-offset-4">
                just
              </span>{" "}
              the numbers.
            </figcaption>
          </figure>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="lesson-plan-title" className="scroll-mt-24" id="lesson-plan">
        <div className="home-scroll-fade mx-auto max-w-[1260px] px-5 py-12 md:px-10 md:py-16">
          <h2 className={sketchStyles.sectionTitle} id="lesson-plan-title">
            Lesson Plan
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[auto_auto_minmax(0,1fr)] lg:items-stretch lg:gap-12">
            <p className="flex items-end justify-center gap-3 whitespace-nowrap lg:justify-start">
              <span className="font-serif-display text-[clamp(8rem,17vw,14rem)] font-normal leading-[0.78] tracking-[-0.08em] text-[#382c26]">
                90
              </span>
              <span className="pb-2 font-serif-display text-3xl text-[#6b5b52] sm:text-4xl">
                days
              </span>
            </p>

            <WavyRule />

            <div className="grid content-center gap-8">
              <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                <div
                  className={`${sketchStyles.sketchFrame} flex items-center gap-4 px-6 py-5 sm:px-8`}
                >
                  <p className="font-serif-display text-3xl leading-none sm:text-4xl">
                    8 <span className="text-xl sm:text-2xl">minutes</span>
                  </p>
                  <span
                    aria-hidden="true"
                    className="font-serif-display text-5xl font-light leading-none text-[#c97860]"
                  >
                    {"}"}
                  </span>
                  <p className="font-serif-display text-3xl leading-none sm:text-4xl">
                    1 <span className="text-xl sm:text-2xl">lesson</span>
                  </p>
                </div>
                <p className="text-lg leading-8 text-[#6b5b52]">
                  Each lesson focuses on one useful idea, with plain examples and room to go at your
                  own pace.
                </p>
              </div>

              <p className="font-serif-display text-xl text-[#493a32] sm:text-2xl">
                <span aria-hidden="true" className="mr-2 text-[#c97860]">
                  *
                </span>
                <span className={sketchStyles.wavyUnderline}>With helpful imagery!</span>
              </p>

              <GlucoseInsulinAnimation />
            </div>
          </div>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="caregiver-title" className="scroll-mt-24" id="caregiver">
        <div className="home-scroll-fade mx-auto max-w-[1260px] px-5 py-12 md:px-10 md:py-16">
          <h2 className={sketchStyles.sectionTitle} id="caregiver-title">
            Caregiver
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_auto_minmax(0,1.6fr)_auto] lg:items-center lg:gap-12">
            <div className="mx-auto w-full max-w-[18rem]">
              <SteadyingHandIllustration title="One person steadying another" />
            </div>

            <WavyRule className="self-stretch" />

            <div>
              <blockquote className="font-serif-display text-3xl leading-snug text-[#382c26] sm:text-4xl">
                &ldquo;You don&apos;t have to navigate diabetes alone.&rdquo;
              </blockquote>
              <div aria-hidden="true" className="my-7 grid gap-1.5">
                <span className="h-0.5 w-full bg-[#382c26]" />
                <span className="h-0.5 w-11/12 bg-[#382c26]/60" />
              </div>
              <p className="max-w-2xl text-lg leading-8 text-[#6b5b52]">
                Whether you&apos;re a family member, partner, or caregiver, Health Decoded helps you
                learn alongside them.
              </p>
              <Link
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[#382c26] underline decoration-[#c97860]/50 decoration-2 underline-offset-[6px] hover:decoration-[#c97860]"
                href="/caregiver"
              >
                Explore the caregiver path
              </Link>
            </div>

            <PumpingHeart className="mx-auto w-28 lg:w-36" />
          </div>
        </div>
      </section>

      <LatticeDivider />

      <section className="scroll-mt-24 bg-[#f1ece4]/55" id="start">
        <div className="home-scroll-fade mx-auto max-w-[1260px] px-5 py-16 md:px-10 md:py-24">
          <StartingPointPicker />
        </div>
      </section>

      <section className="scroll-mt-24" id="games">
        <div className="home-scroll-fade mx-auto grid max-w-[1260px] gap-10 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <p className="editorial-eyebrow">Try it here</p>
            <h2 className="mt-4 font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
              Test what you&apos;ve heard.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#6b5b52]">
              After a diagnosis, everyone has advice. Five common claims, each checked against
              sources like the American Diabetes Association and the CDC.
            </p>
          </div>
          <LandingMythCheck cards={getLandingMythCards()} totalCount={totalMythCardCount} />
        </div>
      </section>

      <section className="scroll-mt-24 bg-[#f1ece4]/55" id="companion">
        <div className="home-scroll-fade mx-auto max-w-[1120px] px-5 py-16 md:px-10 md:py-20">
          <div>
            <h2 className="font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
              Ask a direct question.
            </h2>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-[#827168]">
              Ask the AI guide about a lesson or a Type 2 diabetes topic. Answers use everyday
              language and include sources when needed.
            </p>
            <div className="mt-7 flex flex-wrap items-end gap-4">
              <span className="font-serif-display text-6xl text-[#6f947a] sm:text-8xl">24/7</span>
              <span className="pb-2 text-[#827168]">available at any time</span>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-mt-24" id="stories">
        <div className="home-scroll-fade mx-auto max-w-[1260px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="editorial-eyebrow">Interactive stories</p>
              <h2 className="mt-4 max-w-3xl font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
                Practice the hard moments before they happen.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6b5b52]">
                Short stories about everyday routines, choices, and conversations around Type 2. You
                decide what happens next. Try one moment from Marcus&apos;s story below.
              </p>
            </div>
            <div className="hidden w-48 lg:block">
              <SteadyingHandIllustration />
            </div>
          </div>
          <div className="mt-10">
            <LandingStoryPreview choice={getMarcusChoice()} stories={landingStories} />
          </div>
        </div>
      </section>

      <section className="bg-[#f1ece4]/55" id="labels">
        <div className="home-scroll-fade mx-auto max-w-[1260px] px-5 py-16 md:px-10 md:py-24">
          <p className="editorial-eyebrow">Decode the Label</p>
          <h2 className="mt-4 max-w-3xl font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
            Two yogurts. Which one would you pick?
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6b5b52]">
            Nutrition labels are easier once you know where to look. Answer three quick questions
            using the labels below.
          </p>
          <div className="mt-10">
            <LandingLabelCheck labels={landingLabels} questions={landingLabelQuestions} />
          </div>
        </div>
      </section>

      <section className="scroll-mt-24" id="resources">
        <div className="home-scroll-fade mx-auto grid max-w-[1260px] gap-10 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          <div>
            <p className="editorial-eyebrow">Medical glossary</p>
            <h2 className="mt-4 font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
              Heard a word you didn&apos;t know?
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#6b5b52]">
              Doctors move fast. Type a word from your visit summary and get a plain definition,
              plus what it often gets confused with.
            </p>
          </div>
          <LandingGlossaryLookup
            entries={landingGlossary}
            suggestions={landingGlossarySuggestions}
          />
        </div>
      </section>

      <section className="bg-[#f1ece4]/55">
        <div className="home-scroll-fade mx-auto max-w-[1120px] px-5 py-16 md:px-10 md:py-20">
          <p className="editorial-eyebrow">The 90-day plan</p>
          <h2 className="mt-4 font-serif-display text-4xl font-normal sm:text-5xl">
            Three phases, each with a different focus.
          </h2>
          <ol className="home-scroll-fade-list mt-8">
            {phases.map(([number, title, body, days]) => (
              <li
                className="grid gap-2 py-5 sm:grid-cols-[4rem_1fr_auto] sm:items-start sm:gap-5"
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

          <div className="mt-16 sm:mt-20">
            <p className="editorial-eyebrow">Everything in one place</p>
            <h2 className="mt-4 max-w-4xl font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
              Tools to use between lessons.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#827168]">
              Health Decoded includes lessons, practice activities, reference material, appointment
              preparation and caregiver guidance.
            </p>

            <div className="home-scroll-fade-list mt-10 grid gap-x-14 gap-y-12 md:grid-cols-2 md:gap-y-14">
              {appFeatures.map((feature) => (
                <article
                  className="grid min-w-0 grid-cols-[3.25rem_1fr] items-start gap-x-5 border-t border-[#cfbfb1] pt-7"
                  key={feature.number}
                >
                  <span className="font-serif-display text-4xl font-light leading-none text-[#c97860]">
                    {feature.number}
                  </span>
                  <div>
                    <h3 className="font-serif-display text-3xl font-semibold leading-tight text-[#382c26]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[#827168]">{feature.body}</p>
                    <ul className="mt-4 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                      {feature.details.map((detail) => (
                        <li
                          className="flex items-start gap-2.5 text-sm font-semibold leading-6 text-[#6f5e55]"
                          key={detail}
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-[#c97860]"
                          />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-scroll-fade px-5 py-20 text-center sm:py-24">
        <h2 className="font-serif-display text-5xl font-normal sm:text-7xl">
          Choose where to start.
        </h2>
        <p className="mt-4 text-lg text-[#6b5b52]">Your progress is saved as you work.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link
            className="inline-flex min-h-12 items-center rounded-[12px] bg-[#382c26] px-6 font-semibold text-[#fffaf3] shadow-[0_3px_0_#211814] transition hover:-translate-y-px hover:bg-[#4b3931]"
            href="#start"
          >
            Find my starting point
          </Link>
          <Link
            className="inline-flex min-h-12 items-center font-semibold text-[#382c26] underline decoration-[#c97860]/50 decoration-2 underline-offset-[6px]"
            href="/login"
          >
            Log in
          </Link>
        </div>
      </section>
    </>
  );
}
