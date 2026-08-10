import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { NextLearningAction } from "@/features/cohesion/types/concept";

export function ContextualNextStep({
  action,
  label = "Practice this",
}: {
  readonly action: NextLearningAction;
  readonly label?: string;
}) {
  return (
    <div className="border-t border-border pt-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-warm">{label}</p>
      <Link
        className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline decoration-accent-warm/35 decoration-2 underline-offset-[6px] transition-[text-decoration-color] duration-150 hover:decoration-accent-warm"
        href={action.href}
      >
        {action.title} <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
