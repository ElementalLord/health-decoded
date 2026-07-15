import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { CaregiverArticleViewModel } from "@/features/caregiver/types/caregiver";
import { cn } from "@/lib/utils";

export function CaregiverArticleList({ articles }: { articles: CaregiverArticleViewModel[] }) {
  return (
    <ul className="overflow-hidden rounded-[14px] border border-border/70 bg-card shadow-[var(--shadow-card)] divide-y divide-border">
      {articles.map((article) => (
        <li className="px-5 py-6 sm:px-7" key={article.id}>
          <article className="max-w-2xl space-y-3">
            <h2 className="font-serif-display text-[length:var(--text-card-title)] font-semibold tracking-tight">
              {article.title}
            </h2>
            {article.support_tip ? (
              <p className="text-pretty leading-7 text-muted-foreground">{article.support_tip}</p>
            ) : null}
            <Link
              className={cn(buttonVariants({ fullWidth: false, variant: "text" }), "min-h-11 px-0")}
              href={`/caregiver/${article.slug}`}
            >
              Read guidance
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}
