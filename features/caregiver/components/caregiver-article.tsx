import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import type { CaregiverArticleViewModel } from "@/features/caregiver/types/caregiver";
import { cn } from "@/lib/utils";

function ArticleBlock({ block }: { block: CaregiverArticleViewModel["content_blocks"][number] }) {
  if (block.type === "list") {
    return (
      <section className="space-y-3">
        <h2 className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight">
          {block.title}
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-foreground/90">
          {block.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>
    );
  }

  const title = block.type === "callout" ? block.title : block.heading;
  return (
    <section className="space-y-3">
      {title ? (
        <h2 className="font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight">
          {title}
        </h2>
      ) : null}
      <p className="text-pretty text-base leading-7 text-foreground/90">{block.body}</p>
    </section>
  );
}

export function CaregiverArticle({ article }: { article: CaregiverArticleViewModel }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 py-6 sm:py-10">
      <PageHeader
        description="Support can be practical, kind, and led by the person living with diabetes."
        eyebrow="Caregiver companion"
        title={article.title}
      />

      <div className="space-y-8">
        {article.content_blocks.map((block, index) => (
          <ArticleBlock block={block} key={`${block.type}-${index}`} />
        ))}
      </div>

      <div className="grid gap-8 border-y border-border py-7 sm:grid-cols-2">
        {article.support_tip ? (
          <section className="space-y-2">
            <h2 className="font-serif-display text-[length:var(--text-card-title)] font-medium">Ways to support</h2>
            <p className="leading-7">{article.support_tip}</p>
          </section>
        ) : null}
        {article.what_not_to_say ? (
          <section className="space-y-2">
            <h2 className="font-serif-display text-[length:var(--text-card-title)] font-medium">What not to say</h2>
            <p className="leading-7">{article.what_not_to_say}</p>
          </section>
        ) : null}
      </div>

      {article.conversation_prompt ? (
        <section className="space-y-2 border-b border-border pb-7">
          <h2 className="font-serif-display text-[length:var(--text-card-title)] font-medium">Conversation starter</h2>
          <p className="leading-7">{article.conversation_prompt}</p>
        </section>
      ) : null}

      <Link className={cn(buttonVariants({ fullWidth: false, variant: "text" }), "min-h-11 px-0")} href="/caregiver">
        Back to caregiver guidance
      </Link>
    </article>
  );
}
