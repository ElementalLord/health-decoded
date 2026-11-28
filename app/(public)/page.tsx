import { ArrowUpRight, Check, Minus, ShieldCheck, X } from "lucide-react";
import Image from "next/image";

import { CompanionIllustration } from "@/components/illustrations/editorial-illustrations";
import { TestUserAccess } from "@/features/auth/components/test-user-access";
import { GlucoseInsulinAnimation } from "@/features/marketing/components/glucose-insulin-animation";
import { LandingExplainBack } from "@/features/marketing/components/landing-explain-back";
import { LandingGames } from "@/features/marketing/components/landing-games";
import { LandingGlossaryLookup } from "@/features/marketing/components/landing-glossary-lookup";
import { LandingHeart } from "@/features/marketing/components/landing-heart";
import { LandingJourneyCta } from "@/features/marketing/components/landing-journey-cta";
import { LandingLabelCheck } from "@/features/marketing/components/landing-label-check";
import { LandingLiftIllustration } from "@/features/marketing/components/landing-lift-illustration";
import {
  LandingMotion,
  landingRevealBootScript,
} from "@/features/marketing/components/landing-motion";
import { LandingMythCheck } from "@/features/marketing/components/landing-myth-check";
import {
  LatticeDivider,
  sketchStyles,
  WavyRule,
} from "@/features/marketing/components/landing-sketch";
import { LandingStorybook } from "@/features/marketing/components/landing-storybook";
import {
  getLandingConfusedPairs,
  getLandingExplainDemo,
  getLandingMythCards,
  landingGlossary,
  landingGlossarySuggestions,
  landingLabelQuestions,
  landingLabels,
  landingResources,
  landingStories,
  totalMythCardCount,
  totalResourceCount,
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

type Support = "yes" | "partly" | "no";

const comparisonColumns = [
  { name: "Health Decoded", note: "Learning companion" },
  { name: "mySugr", note: "Diabetes logbook app" },
  { name: "Omada", note: "Employer-sponsored program" },
] as const;

// Based on each product's public descriptions. Review before sharing: features change over time.
const comparisonGroups: readonly {
  readonly label: string;
  readonly rows: readonly (readonly [string, Support, Support, Support])[];
}[] = [
  {
    label: "How it feels",
    rows: [
      ["Talks about how diabetes feels, not just the numbers", "yes", "partly", "yes"],
      ["Practice hard moments through interactive stories", "yes", "no", "no"],
      ["A learning path for family and caregivers", "yes", "no", "no"],
      ["Learn at your own pace, without judgment", "yes", "yes", "partly"],
    ],
  },
  {
    label: "What you learn",
    rows: [
      ["Eight-minute daily lessons on a 90-day plan", "yes", "no", "partly"],
      ["Games that check what you know", "yes", "partly", "no"],
      ["Plain-language medical glossary", "yes", "no", "no"],
      ["AI answers that cite trusted sources", "yes", "no", "no"],
    ],
  },
  {
    label: "Day-to-day tools",
    rows: [
      ["Glucose and meal logging", "no", "yes", "yes"],
      ["Open to anyone, no employer or insurer needed", "yes", "yes", "no"],
    ],
  },
];

const supportLabel: Record<Support, string> = { yes: "Yes", partly: "Partly", no: "No" };

function SupportMark({ value, highlight }: { value: Support; highlight?: boolean }) {
  if (value === "yes") {
    return (
      <span
        className={`mx-auto grid size-8 place-items-center rounded-full ${highlight ? "bg-[#6f947a] text-white" : "bg-[#e3ece4] text-[#4f7a5c]"}`}
      >
        <Check aria-hidden="true" className="size-4.5" strokeWidth={3} />
        <span className="sr-only">{supportLabel[value]}</span>
      </span>
    );
  }
  if (value === "partly") {
    return (
      <span className="mx-auto grid size-8 place-items-center rounded-full bg-[#f3e6cf] text-[#a8782c]">
        <Minus aria-hidden="true" className="size-4.5" strokeWidth={3} />
        <span className="sr-only">{supportLabel[value]}</span>
      </span>
    );
  }
  return (
    <span className="mx-auto grid size-8 place-items-center rounded-full bg-[#efe7de] text-[#a08f83]">
      <X aria-hidden="true" className="size-4" strokeWidth={2.5} />
      <span className="sr-only">{supportLabel[value]}</span>
    </span>
  );
}

const sectionShell = "mx-auto max-w-[1440px] px-[clamp(1.25rem,4vw,3.5rem)] py-8 md:py-10";

export default function HomePage() {
  const explainDemo = getLandingExplainDemo();
  const confusedPairs = getLandingConfusedPairs(2);
  const featuredStories = landingStories.slice(0, 2);
  const storybookPages = landingStories.map((story) => ({
    image: story.imagePath,
    imageAlt: story.imageAlt,
    name: story.name,
    title: story.title,
    line: story.introduction,
  }));

  return (
    <LandingMotion>
      <script dangerouslySetInnerHTML={{ __html: landingRevealBootScript }} />

      <section id="home">
        <div className="mx-auto grid max-w-[1440px] gap-[clamp(2rem,5vw,4rem)] px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(1rem,3vh,2rem)] pt-[clamp(2.75rem,6vh,4.5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div data-reveal="up" data-reveal-stagger="">
            <h1 className="max-w-3xl font-serif-display text-[clamp(3.25rem,9.5vw,7rem)] font-normal leading-[1] tracking-[-0.045em] text-balance">
              Your Companion
            </h1>
            <p className="mt-6 max-w-[36rem] text-lg leading-8 text-[#6b5b52] sm:mt-8 sm:text-xl sm:leading-9">
              Understand how Type 2 diabetes works, practice everyday skills, and feel self-reliant
              beyond the doctor&apos;s office.
            </p>
            <p className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[#d9cabd] bg-[#fffaf3] px-4 py-3 text-sm font-semibold leading-6 text-[#493a32]">
              <ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-[#6f947a]" />
              Under review by endocrinologists and the Houston Food Bank
            </p>
            <div className="mt-8 max-w-[32rem]">
              <TestUserAccess next="/journey" />
            </div>
          </div>

          <figure
            className="mx-auto w-full max-w-[34rem]"
            data-reveal="scale"
            data-reveal-delay="200"
          >
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
        <div className={sectionShell}>
          <h2 className={sketchStyles.sectionTitle} data-reveal="left" id="lesson-plan-title">
            Lesson Plan
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_auto_minmax(0,1.6fr)] lg:gap-14">
            <div className="flex flex-col gap-8">
              <p className="flex items-end gap-3 whitespace-nowrap" data-reveal="scale">
                <span className="font-serif-display text-[clamp(7rem,13vw,11rem)] font-normal leading-[0.78] tracking-[-0.08em] text-[#382c26]">
                  90
                </span>
                <span className="pb-1 font-serif-display text-3xl text-[#6b5b52] sm:text-4xl">
                  days
                </span>
              </p>
              <ol className="grid flex-1 gap-4" data-reveal="left" data-reveal-stagger="">
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

            <div className="flex flex-col gap-8" data-reveal="right" data-reveal-stagger="">
              <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
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
                  own pace.
                </p>
              </div>

              <p className="font-serif-display text-xl text-[#493a32] sm:text-2xl">
                <span aria-hidden="true" className="mr-2 text-[#c97860]">
                  *
                </span>
                <span className={sketchStyles.wavyUnderline}>With helpful imagery!</span>
              </p>

              <div className="flex-1 [&>section]:h-full">
                <GlucoseInsulinAnimation />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="caregiver-title" className="scroll-mt-24" id="caregiver">
        <div className={sectionShell}>
          <h2 className={sketchStyles.sectionTitle} data-reveal="left" id="caregiver-title">
            Caregiver
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.25fr)] lg:items-center lg:gap-14">
            <div className="mx-auto w-full max-w-[36rem]" data-reveal="scale">
              <LandingLiftIllustration />
            </div>

            <WavyRule className="self-stretch" />

            <div data-reveal="right" data-reveal-stagger="">
              <blockquote className="text-balance text-center font-serif-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-snug text-[#382c26]">
                &ldquo;You don&apos;t have to navigate diabetes alone.&rdquo;
              </blockquote>
              <div aria-hidden="true" className="my-7 grid gap-1.5">
                <span className="h-0.5 w-full bg-[#382c26]" />
                <span className="h-0.5 w-full bg-[#382c26]/60" />
              </div>
              <p className="text-center text-lg leading-8 text-[#6b5b52]">
                Whether you&apos;re a family member, partner, or caregiver, Health Decoded helps you
                learn alongside them.
              </p>
              <div className="mt-8 grid items-center gap-8 sm:grid-cols-[minmax(0,17rem)_1fr]">
                <LandingHeart className="mx-auto w-full max-w-[17rem]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a85f4b]">
                    Five short caregiver modules
                  </p>
                  <ol className="mt-3 grid gap-2.5">
                    {caregiverModules.map((title, index) => (
                      <li
                        className="flex items-baseline gap-3 rounded-[14px] bg-[#f1ece4] px-4 py-2.5 text-[15px] font-semibold leading-snug text-[#493a32]"
                        key={title}
                      >
                        <span className="font-serif-display text-lg font-normal text-[#c97860]">
                          {index + 1}
                        </span>
                        {title}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="games-title" className="scroll-mt-24" id="games">
        <div className={sectionShell}>
          <div className="text-center" data-reveal="up">
            <h2 className={sketchStyles.sectionTitle} id="games-title">
              Games
            </h2>
          </div>
          <div className="mt-10">
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
        <div
          className={`${sectionShell} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14`}
        >
          <div className="flex flex-col" data-reveal="left" data-reveal-stagger="">
            <h2 className={`${sketchStyles.sectionTitle} self-start`} id="glossary-title">
              Medical Glossary
            </h2>
            <p className="mt-8 font-serif-display text-3xl leading-tight sm:text-4xl">
              Heard a word you didn&apos;t know?
            </p>
            <p className="mt-4 text-lg leading-8 text-[#6b5b52]">
              Doctors move fast. Type a word from your visit summary and get a plain definition,
              plus what it often gets confused with.
            </p>
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a85f4b]">
                Often mixed up
              </p>
              <ul className="mt-3 grid gap-3">
                {confusedPairs.map((pair) => (
                  <li
                    className="rounded-[16px] border border-[#e2d6ca] bg-[#fffaf3] px-5 py-4"
                    key={pair.term}
                  >
                    <p className="font-serif-display text-lg text-[#382c26]">
                      {pair.term} <span className="text-[#a08f83]">≠</span> {pair.confusedWith}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#6b5b52]">{pair.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:pt-2 [&>div]:h-full" data-reveal="right">
            <LandingGlossaryLookup
              entries={landingGlossary}
              initialQuery="A1C"
              suggestions={landingGlossarySuggestions}
            />
          </div>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="resources-title" className="scroll-mt-24" id="resources">
        <div className={sectionShell}>
          <h2 className={sketchStyles.sectionTitle} data-reveal="left" id="resources-title">
            Resources and Tools
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1fr)] lg:items-stretch lg:gap-14">
            <ul className="grid gap-5 sm:grid-cols-2" data-reveal="up" data-reveal-stagger="">
              {landingResources.map((resource) => (
                <li key={resource.id}>
                  <a
                    className={`${sketchStyles.sketchFrame} group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1`}
                    href={resource.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden">
                      <Image
                        alt={resource.imageAlt}
                        className="object-cover transition duration-700 group-hover:scale-105"
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
                        src={resource.image}
                      />
                    </span>
                    <span className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a85f4b]">
                        {resource.source} · {resource.minutes} min read
                      </span>
                      <span className="mt-1.5 font-serif-display text-xl leading-tight text-[#382c26]">
                        {resource.title}
                      </span>
                      <span className="mt-2 flex-1 text-sm leading-6 text-[#6b5b52]">
                        {resource.description}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#382c26] underline decoration-[#c97860]/50 decoration-2 underline-offset-4 group-hover:decoration-[#c97860]">
                        Read on {resource.source}.gov
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <WavyRule />

            <div
              className="flex flex-col justify-center gap-10"
              data-reveal="right"
              data-reveal-stagger=""
            >
              <div>
                <p className="font-serif-display text-2xl leading-snug text-[#382c26] sm:text-3xl">
                  Explore practical guides, helpful tools, and trusted educational materials to make
                  diabetes management easier.
                </p>
                <p className="mt-4 text-base leading-7 text-[#6b5b52]">
                  {totalResourceCount} reviewed guides from the CDC and NIDDK, sorted by where you
                  are: just diagnosed, food and daily living, staying safe, and long-term health.
                </p>
              </div>

              <div
                className={`${sketchStyles.sketchFrame} flex scroll-mt-28 items-center gap-5 p-5 sm:gap-7 sm:p-7`}
                id="companion"
              >
                <span className="relative size-24 shrink-0 overflow-hidden rounded-full bg-[#eee2d3] ring-2 ring-[#d5c3b2] sm:size-28">
                  <Image
                    alt="The Health Decoded AI companion"
                    className="object-contain object-bottom"
                    fill
                    sizes="112px"
                    src="/ai/your-companion.png"
                  />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a85f4b]">
                    Ask Health Decoded
                  </p>
                  <p className="mt-1.5 font-serif-display text-2xl leading-snug text-[#382c26] sm:text-3xl">
                    Your AI companion for questions outside the clinic.
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
        <div
          className={`${sectionShell} grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-14`}
        >
          <div data-reveal="left" data-reveal-stagger="">
            <h2 className={sketchStyles.sectionTitle} id="stories-title">
              Interactive Stories
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6b5b52]">
              Short stories about everyday routines, choices, and conversations around Type 2. You
              decide what happens next.
            </p>
            <div className="mt-6">
              <LandingStorybook pages={storybookPages} />
            </div>
          </div>

          <WavyRule className="self-stretch" />

          <ul className="grid gap-8" data-reveal="right" data-reveal-stagger="">
            {featuredStories.map((story) => (
              <li
                className="grid grid-cols-[7rem_1fr] items-start gap-5 sm:grid-cols-[11rem_1fr]"
                key={story.slug}
              >
                <span
                  className={`${sketchStyles.sketchFrame} relative block aspect-square overflow-hidden`}
                >
                  <Image
                    alt={story.imageAlt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 640px) 176px, 112px"
                    src={story.imagePath}
                  />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#a85f4b]">
                    {story.name} · {story.timeLabel}
                  </span>
                  <span className="mt-1.5 block font-serif-display text-2xl leading-tight text-[#382c26] sm:text-3xl">
                    {story.title}
                  </span>
                  <span className="mt-2 block text-base leading-7 text-[#6b5b52]">
                    {story.introduction}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LatticeDivider />

      <section aria-labelledby="compare-title" className="scroll-mt-24" id="compare">
        <div className={sectionShell}>
          <div
            className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-14"
            data-reveal="up"
            data-reveal-stagger=""
          >
            <h2 className={sketchStyles.sectionTitle} id="compare-title">
              How We Compare
            </h2>
            <p className="max-w-3xl text-lg leading-8 text-[#6b5b52]">
              Most diabetes apps track numbers. Health Decoded is built for the feelings, questions,
              and conversations that come with them, for you and the people beside you.
            </p>
          </div>

          <div
            className="mt-10 overflow-hidden rounded-[24px] border-2 border-[#5a4a41] bg-[#fffaf3] shadow-[5px_6px_0_-1px_#f8f4ed,5px_6px_0_1px_#b8a493]"
            data-reveal="up"
          >
            <table className="w-full table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[40%] sm:w-[46%]" />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr className="border-b-2 border-[#5a4a41]">
                  <th
                    className="px-3 py-5 align-bottom text-xs font-bold uppercase tracking-[0.18em] text-[#8d7b70] sm:px-6"
                    scope="col"
                  >
                    What matters
                  </th>
                  {comparisonColumns.map((column, index) => (
                    <th
                      className={`px-1 py-5 text-center align-bottom sm:px-3 ${index === 0 ? "bg-[#382c26] text-[#fffaf3]" : "text-[#382c26]"}`}
                      key={column.name}
                      scope="col"
                    >
                      <span className="block font-serif-display text-base font-normal leading-tight sm:text-2xl">
                        {column.name}
                      </span>
                      <span
                        className={`mt-1 hidden text-xs font-semibold sm:block ${index === 0 ? "text-[#e5d8cb]" : "text-[#8d7b70]"}`}
                      >
                        {column.note}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              {comparisonGroups.map((group) => (
                <tbody key={group.label}>
                  <tr className="bg-[#f1ece4]">
                    <th
                      className="px-3 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#a85f4b] sm:px-6"
                      colSpan={4}
                      scope="colgroup"
                    >
                      {group.label}
                    </th>
                  </tr>
                  {group.rows.map(([feature, ...values]) => (
                    <tr className="border-t border-[#e2d6ca]" key={feature}>
                      <th
                        className="px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#382c26] sm:px-6 sm:text-base"
                        scope="row"
                      >
                        {feature}
                      </th>
                      {values.map((value, index) => (
                        <td
                          className={`px-1 py-3.5 text-center ${index === 0 ? "bg-[#382c26]/[0.06]" : ""}`}
                          key={comparisonColumns[index]!.name}
                        >
                          <SupportMark highlight={index === 0} value={value} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#8d7b70]">
            Comparison based on each product&apos;s public description. mySugr and Omada are
            trademarks of their owners; Health Decoded is not affiliated with either.
          </p>
        </div>
      </section>

      <LatticeDivider />

      <section className={`${sectionShell} pb-12 md:pb-16`} data-reveal="scale">
        <LandingJourneyCta />
      </section>
    </LandingMotion>
  );
}
