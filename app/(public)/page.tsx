import { ArrowRight, Bot, HeartPulse, ShieldCheck, Sprout, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

import {
  CompanionIllustration,
  SteadyingHandIllustration,
} from "@/components/illustrations/editorial-illustrations";
import { TestUserAccess } from "@/features/auth/components/test-user-access";
import { GlucoseInsulinAnimation } from "@/features/marketing/components/glucose-insulin-animation";
import { LandingExplainBack } from "@/features/marketing/components/landing-explain-back";
import { LandingGames } from "@/features/marketing/components/landing-games";
import { LandingGlossaryLookup } from "@/features/marketing/components/landing-glossary-lookup";
import { LandingLabelCheck } from "@/features/marketing/components/landing-label-check";
import { LandingMythCheck } from "@/features/marketing/components/landing-myth-check";
import {
  LatticeDivider,
  PumpingHeart,
  sketchStyles,
  WavyRule,
} from "@/features/marketing/components/landing-sketch";
import {
  getLandingExplainDemo,
  getLandingMythCards,
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

const caregiverModules = [
  "What They May Be Feeling",
  "Support Without Taking Over",
  "Everyday Support That Actually Helps",
  "When Something Feels Wrong",
  "The Caregiver Matters Too",
] as const;

const exampleResources = [
  {
    icon: Sprout,
    title: "Just diagnosed",
    body: "Diagnosis, A1C, and daily readings.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food & daily living",
    body: "Food, culture, and workable movement.",
  },
  {
    icon: ShieldCheck,
    title: "Staying safe",
    body: "Medicines, lows, and sick-day plans.",
  },
  {
    icon: HeartPulse,
    title: "Long-term health",
    body: "Heart, kidneys, eyes, feet, and mouth.",
  },
] as const;

const comparisonColumns = ["Health Decoded", "Tracking apps", "Health websites"] as const;

const comparisonRows: readonly (readonly [string, boolean, boolean, boolean])[] = [
  ["Short daily lessons on a 90-day plan", true, false, false],
  ["Practice games with instant feedback", true, false, false],
  ["Interactive stories about real moments", true, false, false],
  ["A learning path for caregivers", true, false, false],
  ["Plain-language medical glossary", true, false, true],
  ["AI answers that cite trusted sources", true, false, false],
  ["Built on ADA, CDC, and NIDDK guidance", true, false, true],
  ["Works on phone and computer", true, true, true],
];

export default function HomePage() {
  const explainDemo = getLandingExplainDemo();

  return (
    <>
      <section id="home">
        <div className="mx-auto grid max-w-[1440px] gap-[clamp(2rem,5vw,4rem)] px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(1rem,3vh,2rem)] pt-[clamp(2.75rem,6vh,4.5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
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
        <div className="home-scroll-fade mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,3.5rem)] py-8 md:py-10">
          <h2 className={sketchStyles.sectionTitle} id="lesson-plan-title">
            Lesson Plan
          </h2>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_auto_minmax(0,1.6fr)] lg:gap-10">
            <div className="flex flex-col gap-6">
              <p className="flex items-end gap-3 whitespace-nowrap">
                <span className="font-serif-display text-[clamp(7rem,13vw,11rem)] font-normal leading-[0.78] tracking-[-0.08em] text-[#382c26]">
                  90
                </span>
                <span className="pb-1 font-serif-display text-3xl text-[#6b5b52] sm:text-4xl">
                  days
                </span>
              </p>
              <ol className="grid flex-1 gap-3">
                {phases.map(([number, title, body, days]) => (
                  <li
                    className={`${sketchStyles.sketchFrame} grid grid-cols-[2.5rem_1fr] gap-x-3 px-5 py-4`}
                    key={number}
                  >
                    <span className="font-serif-display text-3xl font-light leading-none text-[#c97860]">
                      {number}
                    </span>
                    <span>
                      <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-serif-display text-xl text-[#382c26]">{title}</span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d7b70]">
                          {days}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[#6b5b52]">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <WavyRule />

            <div className="flex flex-col gap-6">
              <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
                <div
                  className={`${sketchStyles.sketchFrame} flex items-center gap-4 px-6 py-4 sm:px-8`}
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
                  own pace.{" "}
                  <span className="font-serif-display text-[#493a32]">
                    <span aria-hidden="true" className="text-[#c97860]">
                      *{" "}
                    </span>
                    <span className={sketchStyles.wavyUnderline}>With helpful imagery!</span>
                  </span>
                </p>
              </div>

              <div className="flex-1 [&>section]:h-full">
                <GlucoseInsulinAnimation />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="caregiver-title" className="scroll-mt-24" id="caregiver">
        <div className="home-scroll-fade mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,3.5rem)] py-8 md:py-10">
          <h2 className={sketchStyles.sectionTitle} id="caregiver-title">
            Caregiver
          </h2>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_auto_minmax(0,1.6fr)] lg:items-center lg:gap-10">
            <div className="mx-auto w-full max-w-[24rem]">
              <SteadyingHandIllustration title="One person steadying another" />
            </div>

            <WavyRule className="self-stretch" />

            <div>
              <div className="flex items-start gap-5">
                <blockquote className="flex-1 font-serif-display text-3xl leading-snug text-[#382c26] sm:text-4xl">
                  &ldquo;You don&apos;t have to navigate diabetes alone.&rdquo;
                </blockquote>
                <PumpingHeart className="w-16 shrink-0 sm:w-24" />
              </div>
              <div aria-hidden="true" className="my-6 grid gap-1.5">
                <span className="h-0.5 w-full bg-[#382c26]" />
                <span className="h-0.5 w-11/12 bg-[#382c26]/60" />
              </div>
              <p className="text-lg leading-8 text-[#6b5b52]">
                Whether you&apos;re a family member, partner, or caregiver, Health Decoded helps you
                learn alongside them.
              </p>
              <ol className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {caregiverModules.map((title, index) => (
                  <li
                    className="flex items-baseline gap-3 rounded-[14px] bg-[#f1ece4] px-4 py-3 text-[15px] font-semibold leading-snug text-[#493a32]"
                    key={title}
                  >
                    <span className="font-serif-display text-lg font-normal text-[#c97860]">
                      {index + 1}
                    </span>
                    {title}
                  </li>
                ))}
                <li className="flex">
                  <Link
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#382c26] px-4 py-3 text-[15px] font-semibold text-[#fffaf3] transition hover:bg-[#4b3931]"
                    href="/caregiver"
                  >
                    Explore the caregiver path <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="games-title" className="scroll-mt-24" id="games">
        <div className="home-scroll-fade mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,3.5rem)] py-8 md:py-10">
          <div className="text-center">
            <h2 className={sketchStyles.sectionTitle} id="games-title">
              Games
            </h2>
          </div>
          <div className="mt-8">
            <LandingGames
              demos={{
                myth: (
                  <div className="mx-auto max-w-3xl">
                    <LandingMythCheck
                      cards={getLandingMythCards()}
                      totalCount={totalMythCardCount}
                    />
                  </div>
                ),
                label: (
                  <LandingLabelCheck labels={landingLabels} questions={landingLabelQuestions} />
                ),
                explain: explainDemo ? (
                  <div className="mx-auto max-w-3xl">
                    <LandingExplainBack demo={explainDemo} />
                  </div>
                ) : null,
              }}
            />
          </div>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="glossary-title" className="scroll-mt-24" id="glossary">
        <div className="home-scroll-fade mx-auto grid max-w-[1440px] gap-10 px-[clamp(1.25rem,4vw,3.5rem)] py-8 md:py-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          <div>
            <h2 className={sketchStyles.sectionTitle} id="glossary-title">
              Medical Glossary
            </h2>
            <p className="mt-8 font-serif-display text-3xl leading-tight sm:text-4xl">
              Heard a word you didn&apos;t know?
            </p>
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

      <LatticeDivider />

      <section aria-labelledby="resources-title" className="scroll-mt-24" id="resources">
        <div className="home-scroll-fade mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,3.5rem)] py-8 md:py-10">
          <h2 className={sketchStyles.sectionTitle} id="resources-title">
            Resources and Tools
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.15fr)] lg:items-stretch lg:gap-12">
            <ul className="grid grid-cols-2 gap-4 sm:gap-5">
              {exampleResources.map(({ icon: Icon, title, body }) => (
                <li key={title}>
                  <Link
                    className={`${sketchStyles.sketchFrame} flex h-full flex-col gap-3 p-5 transition duration-200 hover:-translate-y-1 sm:p-6`}
                    href="/login?next=%2Fresources"
                  >
                    <Icon aria-hidden="true" className="size-7 text-[#c97860]" />
                    <span className="font-serif-display text-xl leading-tight text-[#382c26] sm:text-2xl">
                      {title}
                    </span>
                    <span className="text-sm leading-6 text-[#6b5b52]">{body}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <WavyRule />

            <div className="grid content-center gap-10">
              <p className="font-serif-display text-2xl leading-snug text-[#382c26] sm:text-3xl">
                Explore practical guides, helpful tools, and trusted educational materials to make
                diabetes management easier.
              </p>

              <div
                className={`${sketchStyles.sketchFrame} flex scroll-mt-28 items-center gap-5 p-5 sm:gap-7 sm:p-7`}
                id="companion"
              >
                <span className="grid size-20 shrink-0 place-items-center rounded-full border-2 border-[#382c26] bg-[#f4ede4] sm:size-24">
                  <span className="grid justify-items-center">
                    <Bot aria-hidden="true" className="size-7 text-[#6f947a] sm:size-8" />
                    <span className="mt-0.5 text-sm font-bold tracking-[0.12em] text-[#382c26]">
                      AI
                    </span>
                  </span>
                </span>
                <div>
                  <p className="font-serif-display text-2xl leading-snug text-[#382c26] sm:text-3xl">
                    An AI for questions you may have outside the clinic.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6b5b52]">
                    Everyday language, sources when needed, any time of day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="stories-title" className="scroll-mt-24" id="stories">
        <div className="home-scroll-fade mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,3.5rem)] py-8 md:py-10">
          <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-12">
            <h2 className={sketchStyles.sectionTitle} id="stories-title">
              Interactive Stories
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-[#6b5b52]">
              Short stories about everyday routines, choices, and conversations around Type 2. You
              decide what happens next.
            </p>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {landingStories.map((story) => (
              <li key={story.slug}>
                <Link
                  className={`${sketchStyles.sketchFrame} group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1`}
                  href={`/login?next=${encodeURIComponent(`/stories/${story.slug}`)}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={story.imageAlt}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                    src={story.imagePath}
                  />
                  <span className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a85f4b]">
                      {story.name} · {story.timeLabel}
                    </span>
                    <span className="mt-1.5 font-serif-display text-2xl leading-tight text-[#382c26] group-hover:underline group-hover:decoration-[#c97860] group-hover:underline-offset-4">
                      {story.title}
                    </span>
                    <span className="mt-2 text-sm leading-6 text-[#6b5b52]">
                      {story.introduction}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="compare-title" className="scroll-mt-24" id="compare">
        <div className="home-scroll-fade mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,3.5rem)] py-8 md:py-10">
          <table className="w-full table-fixed border-separate border-spacing-x-1.5 border-spacing-y-0 sm:border-spacing-x-6">
            <colgroup>
              <col className="w-[34%] sm:w-[31%]" />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <td className="pb-6 pr-2 align-bottom">
                  <h2
                    className="font-serif-display text-2xl leading-tight text-[#382c26] sm:text-5xl"
                    id="compare-title"
                  >
                    How we compare
                  </h2>
                  <p className="mt-2 hidden text-base leading-7 text-[#6b5b52] sm:block">
                    Everything in one place, instead of spread across apps and websites.
                  </p>
                </td>
                {comparisonColumns.map((column, index) => (
                  <th className="pb-6 align-bottom" key={column} scope="col">
                    <span
                      className={`${sketchStyles.sketchFrame} flex min-h-20 items-center justify-center px-1.5 py-4 font-serif-display text-sm font-normal leading-tight sm:min-h-28 sm:px-3 sm:text-2xl ${index === 0 ? "!bg-[#382c26] text-[#fffaf3]" : "text-[#382c26]"}`}
                    >
                      {column}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(([feature, ...values]) => (
                <tr key={feature}>
                  <th
                    className="border-t border-[#cfbfb1] py-3 pr-1 text-left text-xs font-semibold leading-5 text-[#493a32] sm:py-4 sm:text-base"
                    scope="row"
                  >
                    {feature}
                  </th>
                  {values.map((value, index) => (
                    <td
                      className="border-t border-[#cfbfb1] py-3 text-center sm:py-4"
                      key={comparisonColumns[index]}
                    >
                      {value ? (
                        <span className="font-serif-display text-2xl leading-none text-[#4f7a5c] sm:text-3xl">
                          ✓<span className="sr-only">Yes</span>
                        </span>
                      ) : (
                        <span className="font-serif-display text-2xl leading-none text-[#b8a493] sm:text-3xl">
                          ✗<span className="sr-only">No</span>
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <LatticeDivider />

      <section className="home-scroll-fade px-[clamp(1.25rem,4vw,3.5rem)] pb-4 pt-6">
        <div className="mx-auto flex max-w-[1330px] flex-col items-center gap-8 rounded-[28px] bg-[#382c26] px-6 py-14 text-center text-[#fffaf3] sm:py-16 lg:flex-row lg:justify-between lg:px-16 lg:text-left">
          <div>
            <h2 className="font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
              Start Your Journey Today
            </h2>
            <p className="mt-3 text-lg text-[#e5d8cb]">
              Lessons, games, and stories in one place. Your progress is saved as you go.
            </p>
          </div>
          <Link
            className="inline-flex min-h-16 shrink-0 items-center gap-3 rounded-[18px] bg-[#fffaf3] px-10 font-serif-display text-3xl text-[#382c26] shadow-[0_4px_0_#c97860] transition duration-200 hover:-translate-y-1 sm:px-12 sm:text-4xl"
            href="/login"
          >
            Begin <ArrowRight aria-hidden="true" className="size-7 sm:size-8" />
          </Link>
        </div>
      </section>
    </>
  );
}
