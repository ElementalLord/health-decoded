import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { CaregiverArticleViewModel } from "@/features/caregiver/types/caregiver";
import { cn } from "@/lib/utils";

export function CaregiverArticleList({ articles }: { articles: CaregiverArticleViewModel[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {articles.map((article, index) => (
        <li className="py-6" key={article.id}>
          <article className="grid max-w-3xl gap-4 sm:grid-cols-[4rem_1fr]">
            <span className="font-serif-display text-4xl font-light text-[#c9bdb1]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="space-y-3">
              <h2 className="font-serif-display text-[length:var(--text-card-title)] font-semibold tracking-tight">
                {article.title}
              </h2>
              {article.support_tip ? (
                <p className="text-pretty leading-7 text-muted-foreground">{article.support_tip}</p>
              ) : null}
              <Link
                className={cn(
                  buttonVariants({ fullWidth: false, variant: "text" }),
                  "min-h-11 px-0",
                )}
                href={`/caregiver/${article.slug}`}
              >
                Read guidance
              </Link>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
