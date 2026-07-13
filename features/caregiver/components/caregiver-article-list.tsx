import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { CaregiverArticleViewModel } from "@/features/caregiver/types/caregiver";

export function CaregiverArticleList({ articles }: { articles: CaregiverArticleViewModel[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {articles.map((article) => (
        <li className="py-6 first:pt-5" key={article.id}>
          <article className="max-w-2xl space-y-3">
            <h2 className="text-[length:var(--text-card-title)] font-medium">{article.title}</h2>
            {article.support_tip ? (
              <p className="leading-7 text-muted-foreground">{article.support_tip}</p>
            ) : null}
            <Link
              aria-label={`Read caregiver guidance: ${article.title}`}
              className={buttonVariants({ fullWidth: false, variant: "text" })}
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
