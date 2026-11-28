"use client";

import { ArrowDown } from "lucide-react";
import { useState, type ReactNode } from "react";

import { sketchStyles } from "@/features/marketing/components/landing-sketch";
import { cn } from "@/lib/utils";

type GameId = "myth" | "label" | "explain";

type Game = {
  readonly id: GameId;
  readonly title: ReactNode;
  readonly heading: string;
  readonly body: string;
  readonly visual: ReactNode;
};

const games: readonly Game[] = [
  {
    id: "myth",
    title: (
      <>
        Myth Buster
        <br />
        Demo
      </>
    ),
    heading: "Test what you've heard",
    body: "After a diagnosis, everyone has advice. Check these claims against the ADA and CDC.",
    visual: (
      <span className="flex flex-wrap justify-center gap-2" aria-hidden="true">
        {["Myth", "Fact", "It depends"].map((label) => (
          <span
            className="rounded-full border border-[#d9cabd] bg-[#fffdf8] px-3 py-1 text-xs font-semibold text-[#6b5b52]"
            key={label}
          >
            {label}
          </span>
        ))}
      </span>
    ),
  },
  {
    id: "label",
    title: (
      <>
        Decode the
        <br />
        Label Demo
      </>
    ),
    heading: "Read labels with confidence",
    body: "Nutrition labels are easier once you know where to look.",
    visual: (
      <span
        aria-hidden="true"
        className="mx-auto grid w-40 gap-1 border-2 border-[#382c26] bg-[#fffdf8] p-2 text-left text-[10px] leading-tight text-[#382c26]"
      >
        <span className="border-b-4 border-[#382c26] pb-0.5 font-serif-display text-sm font-bold">
          Nutrition Facts
        </span>
        <span className="flex justify-between border-b border-[#382c26]/40">
          <b>Total Carbohydrate</b> <span>15g</span>
        </span>
        <span className="flex justify-between border-b border-[#382c26]/40 pl-2">
          <span>Total Sugars</span> <span>12g</span>
        </span>
        <span className="flex justify-between pl-4">
          <span>Added Sugars</span> <span>9g</span>
        </span>
      </span>
    ),
  },
  {
    id: "explain",
    title: (
      <>
        Explain it
        <br />
        Back Demo
      </>
    ),
    heading: "Put it in your own words",
    body: "Test your knowledge with our AI, with custom feedback for every response.",
    visual: (
      <span aria-hidden="true" className="mx-auto grid w-44 gap-2 text-left text-[11px]">
        <span className="rounded-[12px] rounded-bl-sm bg-[#fffdf8] px-3 py-2 text-[#6b5b52] shadow-sm">
          Blood glucose is the sugar in your blood…
        </span>
        <span className="ml-auto rounded-[12px] rounded-br-sm bg-[#6f947a] px-3 py-2 font-semibold text-[#fffaf3]">
          You got the idea.
        </span>
      </span>
    ),
  },
];

export function LandingGames({ demos }: { demos: Record<GameId, ReactNode> }) {
  const [openId, setOpenId] = useState<GameId | null>(null);
  const openGame = games.find((game) => game.id === openId);

  return (
    <div>
      <ul className="grid gap-10 md:grid-cols-[1fr_1.25fr_1fr] md:gap-8">
        {games.map((game) => {
          const isOpen = game.id === openId;
          return (
            <li className="flex flex-col" key={game.id}>
              <button
                aria-controls="landing-game-panel"
                aria-expanded={isOpen}
                className={cn(
                  sketchStyles.sketchFrame,
                  "group flex min-h-60 flex-col md:min-h-[19rem] items-center justify-center gap-5 px-5 py-8 text-center transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c97860] focus-visible:ring-offset-4",
                  isOpen && "bg-[#f4ede4]",
                )}
                onClick={() => setOpenId(isOpen ? null : game.id)}
                type="button"
              >
                <span className="font-serif-display text-3xl leading-tight text-[#382c26] sm:text-4xl">
                  {game.title}
                </span>
                {game.visual}
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#a85f4b]">
                  {isOpen ? "Close demo" : "Try it"}
                  <ArrowDown
                    aria-hidden="true"
                    className={cn("size-4 transition-transform", isOpen && "rotate-180")}
                  />
                </span>
              </button>
              <div className="mt-5 text-center">
                <h3 className="font-serif-display text-2xl text-[#382c26]">{game.heading}</h3>
                <p className="mx-auto mt-2 max-w-xs leading-7 text-[#6b5b52]">{game.body}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="scroll-mt-28" id="landing-game-panel">
        {openGame ? (
          <div className="animate-fade-in mt-10" key={openGame.id}>
            {demos[openGame.id]}
          </div>
        ) : null}
      </div>
    </div>
  );
}
