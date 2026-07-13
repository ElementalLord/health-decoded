import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { CaregiverArticleViewModel } from "@/features/caregiver/types/caregiver";

export function CaregiverArticleList({ articles }: { articles: CaregiverArticleViewModel[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {articles.map((article) => (
        <li key={article.id}>
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            {article.support_tip ? <CardContent>{article.support_tip}</CardContent> : null}
            <CardFooter className="mt-auto">
              <Link
                aria-label={`Read caregiver guidance: ${article.title}`}
                className={buttonVariants({ fullWidth: false, variant: "secondary" })}
                href={`/caregiver/${article.slug}`}
              >
                Read guidance
              </Link>
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}
