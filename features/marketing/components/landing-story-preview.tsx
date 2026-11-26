"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type {
  LandingStory,
  LandingStoryChoice,
} from "@/features/marketing/content/landing-interactive-content";
import {
  landingChoice,
  landingLink,
  landingMuted,
  landingPanel,
} from "@/features/marketing/components/landing-ui";

export function LandingStoryPreview({
  choice,
  stories,
}: {
  choice: LandingStoryChoice | null;
  stories: readonly LandingStory[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const featured = stories[0];
  const others = stories.slice(1);
  const selected = choice?.options.find((option) => option.id === selectedId) ?? null;

  return (
    <div className="grid gap-10">
      {featured && choice ? (
        <div
          className={`${landingPanel} grid gap-8 overflow-hidden lg:grid-cols-[0.95fr_1.05fr] lg:p-0`}
        >
          <div className="relative -mx-5 -mt-5 aspect-[16/9] sm:-mx-8 sm:-mt-8 lg:m-0 lg:aspect-auto">
            <Image
              alt={featured.imageAlt}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              src={featured.imagePath}
            />
          </div>
          <div className="lg:py-10 lg:pr-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a85f4b]">
              {featured.name} · {featured.title}
            </p>
            <div className={`mt-4 grid gap-3 leading-7 ${landingMuted}`}>
              {choice.setup.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-6 font-serif-display text-2xl leading-snug text-[#382c26]">
              {choice.prompt}
            </p>
            <div aria-label="Choose a response" className="mt-4 grid gap-2.5" role="group">
              {choice.options.map((option) => (
                <button
                  aria-pressed={option.id === selectedId}
                  className={landingChoice}
                  key={option.id}
                  onClick={() => setSelectedId(option.id)}
                  type="button"
                >
                  &ldquo;{option.label}&rdquo;
                </button>
              ))}
            </div>
            <div aria-live="polite">
              {selected ? (
                <div
                  className="animate-fade-in mt-5 rounded-[16px] bg-[#f4ede4] p-5"
                  key={selected.id}
                >
                  <p className="leading-7 text-[#382c26]">{selected.feedback}</p>
                  {choice.after.length > 0 ? (
                    <div
                      className={`mt-4 grid gap-2 border-t border-[#e2d6ca] pt-4 leading-7 ${landingMuted}`}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6b5b52]">
                        What happened next
                      </p>
                      {choice.after.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-4 text-sm font-semibold text-[#493a32]">
                    {choice.learningPoint}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <p className="font-serif-display text-2xl text-[#382c26]">Three more stories</p>
        <ul className="mt-5 grid gap-6 md:grid-cols-3">
          {others.map((story) => (
            <li key={story.slug}>
              <Link
                className="group block rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c97860] focus-visible:ring-offset-4"
                href={`/login?next=${encodeURIComponent(`/stories/${story.slug}`)}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-[#efe6db]">
                  <Image
                    alt={story.imageAlt}
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    src={story.imagePath}
                  />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#a85f4b]">
                  {story.name} · {story.timeLabel}
                </p>
                <p className="mt-1 font-serif-display text-2xl text-[#382c26] group-hover:underline group-hover:decoration-[#c97860]/50 group-hover:underline-offset-4">
                  {story.title}
                </p>
                <p className={`mt-2 leading-7 ${landingMuted}`}>{story.introduction}</p>
              </Link>
            </li>
          ))}
        </ul>
        <Link className={`${landingLink} mt-6`} href="/login?next=%2Fstories">
          See all stories
        </Link>
      </div>
    </div>
  );
}
