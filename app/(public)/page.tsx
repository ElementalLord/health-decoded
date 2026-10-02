import {
  CompanionIllustration,
  SteadyingHandIllustration,
} from "@/components/illustrations/editorial-illustrations";
import { GlucoseInsulinAnimation } from "@/features/marketing/components/glucose-insulin-animation";

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
        <div className="mx-auto grid min-h-[calc(86svh-4.5rem)] max-w-[1440px] gap-[clamp(2rem,5vw,4rem)] px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(2.75rem,6vh,4.5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="motion-cascade">
            <p className="editorial-eyebrow">Type 2 diabetes education</p>
            <h1 className="mt-5 max-w-3xl font-serif-display text-[clamp(3rem,9.5vw,6.75rem)] font-normal leading-[1.02] tracking-[-0.045em] text-balance sm:mt-6 sm:leading-none sm:tracking-[-0.05em]">
              Understand
              <br />
              Type 2
              <br />
              <em className="font-normal">diabetes.</em>
            </h1>
            <p className="mt-6 max-w-[38rem] text-base leading-8 text-[#827168] sm:mt-7 sm:text-xl sm:leading-8">
              Learn how Type 2 works, practice everyday skills, and find useful answers when you
              need them. Start with the topic that matters to you.
            </p>
          </div>

          <figure className="mx-auto w-full max-w-[36rem] animate-fade-in [animation-delay:160ms] lg:translate-y-8">
            <CompanionIllustration />
            <figcaption className="mt-4 text-center text-xs font-bold uppercase tracking-[0.22em] text-[#8d7b70]">
              Built for everyday questions
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="home-scroll-fade px-5 py-20 text-center sm:py-24"
        aria-labelledby="first-ninety-days"
      >
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8d7b70]">Your first</p>
        <p
          className="mt-4 font-serif-display text-[clamp(8rem,24vw,18rem)] font-normal leading-[0.72] tracking-[-0.08em] text-[#382c26]"
          id="first-ninety-days"
        >
          90
        </p>
        <p className="mt-7 font-serif-display text-2xl text-[#8b786d] sm:text-3xl">
          days of practical learning.
        </p>
      </section>

      <section className="home-scroll-fade bg-[#f1ece4]/55 px-5 py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-4xl font-serif-display text-3xl font-normal leading-tight text-[#493a32] sm:text-5xl">
          Clear explanations for the questions that come after a diagnosis.
        </h2>
      </section>

      <section id="journey">
        <div className="home-scroll-fade mx-auto grid max-w-[1260px] gap-10 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:gap-16">
          <div>
            <h2 className="font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
              One short lesson at a time.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#827168]">
              Each lesson focuses on one useful idea, with plain examples and room to go at your own
              pace.
            </p>
          </div>
          <aside className="bg-[#f1ece4] px-8 py-10 sm:px-14 sm:py-12">
            <p className="font-serif-display text-8xl font-light leading-none text-[#c97860]">08</p>
            <p className="mt-5 text-xl font-semibold">minutes to read</p>
            <p className="mt-2 text-lg text-[#827168]">Most lessons take about eight minutes.</p>
          </aside>
        </div>
      </section>

      <section className="home-scroll-fade mx-auto max-w-[1260px] px-5 py-14 md:px-10 md:py-18">
        <p className="editorial-eyebrow mb-5">Here&apos;s an example</p>
        <GlucoseInsulinAnimation />
      </section>

      <section className="bg-[#f1ece4]/55" id="ask">
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

      <section id="stories">
        <div className="home-scroll-fade mx-auto grid max-w-[1260px] gap-10 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <figure>
            <SteadyingHandIllustration />
            <figcaption className="mt-3 text-center">
              <span className="block text-xs font-bold uppercase tracking-[0.24em] text-[#8d7b70]">
                Everyday situations
              </span>
              <span className="mt-2 block font-serif-display text-xl text-[#6f6058] sm:text-2xl">
                Practice decisions before they happen.
              </span>
            </figcaption>
          </figure>
          <div>
            <h2 className="font-serif-display text-4xl font-normal leading-tight sm:text-6xl">
              See how it looks in real life.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#827168]">
              Explore short stories about everyday routines, choices, and conversations around Type
              2.
            </p>
          </div>
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
        <p className="mt-4 text-lg text-[#827168]">Your progress is saved as you work.</p>
      </section>
    </>
  );
}
