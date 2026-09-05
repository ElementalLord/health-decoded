"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { aiTutorDialog } from "@/features/ai/components/ai-tutor-dialog";
import { cn } from "@/lib/utils";

function AiTutorTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Dialog.Trigger className={className} handle={aiTutorDialog} type="button">
      {children}
    </Dialog.Trigger>
  );
}

function FloatingAiTutorTrigger() {
  return (
    <div className="ai-companion-trigger fixed right-4 z-[41] sm:right-6 lg:right-8">
      <AiTutorTrigger className="group inline-flex min-h-16 items-center gap-2.5 rounded-full border border-[#d5c7b5] bg-[#f8eedf]/95 p-1.5 pr-4 text-left text-[#3f352f] shadow-[0_10px_30px_rgb(92_69_55/0.16)] backdrop-blur-md transition-[border-color,background-color,transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-[#b96c55]/45 hover:bg-[#f3e5d5] hover:shadow-[0_14px_36px_rgb(92_69_55/0.2)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]">
        <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#eee2d3] ring-1 ring-[#d5c3b2]">
          <Image
            alt=""
            className="object-contain object-bottom transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover:scale-[1.04]"
            fill
            sizes="48px"
            src="/ai/your-companion.png"
          />
        </span>
        <span className="whitespace-nowrap text-sm font-semibold leading-5">Your companion</span>
      </AiTutorTrigger>
    </div>
  );
}

function AiTutorActionRow({
  className,
  compact = false,
  description,
  title,
}: {
  className?: string;
  compact?: boolean;
  description: string;
  title: string;
}) {
  return (
    <AiTutorTrigger
      className={cn(
        "group flex w-full items-center justify-between gap-5 px-0 text-left transition duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-ring",
        compact ? "min-h-0 py-4" : "min-h-24 py-7",
        className,
      )}
    >
      <span className={cn("min-w-0", compact ? "space-y-1" : "space-y-1.5")}>
        <span
          className={cn(
            "block font-serif-display font-normal leading-tight text-foreground",
            compact ? "text-xl" : "text-2xl",
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "block text-pretty text-muted-foreground",
            compact ? "text-sm leading-5" : "text-base leading-6",
          )}
        >
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex shrink-0 items-center justify-center text-muted-foreground transition duration-[var(--duration-fast)] group-hover:text-primary",
          compact ? "size-9" : "size-11",
        )}
      >
        <ArrowRight
          className={cn(
            "transition-transform group-hover:translate-x-1",
            compact ? "size-5" : "size-6",
          )}
        />
      </span>
    </AiTutorTrigger>
  );
}

export { AiTutorActionRow, AiTutorTrigger, FloatingAiTutorTrigger };
