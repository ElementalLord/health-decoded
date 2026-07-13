import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CaregiverArticleViewModel } from "@/features/caregiver/types/caregiver";

function ArticleBlock({ block }: { block: CaregiverArticleViewModel["content_blocks"][number] }) {
  if (block.type === "list") {
    return (
      <section className="space-y-3">
        <h2 className="text-[length:var(--text-section-title)] font-semibold tracking-tight">
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
        <h2 className="text-[length:var(--text-section-title)] font-semibold tracking-tight">
          {title}
        </h2>
      ) : null}
      <p className="text-base leading-7 text-foreground/90">{block.body}</p>
    </section>
  );
}

export function CaregiverArticle({ article }: { article: CaregiverArticleViewModel }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 py-6 sm:py-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">Caregiver companion</p>
        <h1 className="text-[length:var(--text-page-title)] font-semibold tracking-tight">
          {article.title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Support can be practical, kind, and led by the person living with diabetes.
        </p>
      </header>

      <div className="space-y-8">
        {article.content_blocks.map((block, index) => (
          <ArticleBlock block={block} key={`${block.type}-${index}`} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {article.support_tip ? (
          <Card tone="info">
            <CardHeader>
              <CardTitle>Ways to support</CardTitle>
            </CardHeader>
            <CardContent>{article.support_tip}</CardContent>
          </Card>
        ) : null}
        {article.what_not_to_say ? (
          <Card>
            <CardHeader>
              <CardTitle>What not to say</CardTitle>
            </CardHeader>
            <CardContent>{article.what_not_to_say}</CardContent>
          </Card>
        ) : null}
      </div>

      {article.conversation_prompt ? (
        <Card>
          <CardHeader>
            <CardTitle>Conversation starter</CardTitle>
          </CardHeader>
          <CardContent>{article.conversation_prompt}</CardContent>
        </Card>
      ) : null}

      <Link
        className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-primary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        href="/caregiver"
      >
        Back to caregiver guidance
      </Link>
    </article>
  );
}
