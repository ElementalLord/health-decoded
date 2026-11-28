"use client";

import { animate, stagger } from "animejs";
import { ArrowDown } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { prefersReducedMotion } from "@/features/marketing/components/landing-motion";
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
  // The demo that is rendered; it lags behind `openId` while the panel closes.
  const [shownId, setShownId] = useState<GameId | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Partial<Record<GameId, HTMLButtonElement | null>>>({});

  // Close (or swap) smoothly: collapse the panel first, then change what it shows.
  useEffect(() => {
    const panel = panelRef.current;
    if (openId === shownId || !panel) return;
    if (shownId === null || prefersReducedMotion()) {
      setShownId(openId);
      return;
    }
    const collapse = animate(panel, {
      height: [panel.offsetHeight, 0],
      opacity: [1, 0],
      duration: openId ? 320 : 480,
      ease: "inOutQuad",
      onComplete: () => setShownId(openId),
    });
    return () => {
      collapse.pause();
    };
  }, [openId, shownId]);

  // Open: grow the panel to fit, then bring the demo's pieces in one after another.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel) return;
    if (!shownId || !content) {
      panel.style.height = "0px";
      return;
    }
    if (prefersReducedMotion()) {
      panel.style.height = "auto";
      panel.style.opacity = "1";
      return;
    }
    const target = content.offsetHeight;
    animate(panel, {
      height: [0, target],
      opacity: [0, 1],
      duration: 700,
      ease: "outExpo",
      onComplete: () => {
        panel.style.height = "auto";
      },
    });
    animate(content.querySelectorAll(":scope > * > *"), {
      opacity: [0, 1],
      y: [28, 0],
      duration: 800,
      delay: stagger(90, { start: 120 }),
      ease: "outExpo",
    });
    const top = panel.getBoundingClientRect().top;
    if (top > window.innerHeight * 0.75) {
      window.scrollBy({ top: top - window.innerHeight * 0.3, behavior: "smooth" });
    }
  }, [shownId]);

  const choose = (id: GameId) => {
    const card = cardRefs.current[id];
    if (card && !prefersReducedMotion()) {
      animate(card, { scale: [1, 0.96, 1], duration: 420, ease: "outBack" });
    }
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div>
      <ul
        className="grid gap-10 md:grid-cols-[1fr_1.25fr_1fr] md:gap-8"
        data-reveal="up"
        data-reveal-stagger=""
      >
        {games.map((game) => {
          const isOpen = game.id === openId;
          return (
            <li className="flex flex-col" key={game.id}>
              <button
                aria-controls="landing-game-panel"
                aria-expanded={isOpen}
                className={cn(
                  sketchStyles.sketchFrame,
                  "group flex min-h-60 flex-col items-center justify-center gap-5 px-5 py-8 text-center transition-[background-color,translate] duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c97860] focus-visible:ring-offset-4 md:min-h-[19rem]",
                  isOpen && "bg-[#f4ede4]",
                )}
                onClick={() => choose(game.id)}
                ref={(element) => {
                  cardRefs.current[game.id] = element;
                }}
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
                    className={cn(
                      "size-4 transition-transform duration-500",
                      isOpen && "rotate-180",
                    )}
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

      <div
        className="scroll-mt-28 overflow-hidden"
        id="landing-game-panel"
        ref={panelRef}
        style={{ height: 0 }}
      >
        {shownId ? (
          <div className="pt-10" ref={contentRef}>
            {demos[shownId]}
          </div>
        ) : null}
      </div>
    </div>
  );
}
