import { ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import type { Resource } from "@/features/stories/schemas/resource.schema";
import { cn } from "@/lib/utils";

function getResourceSectionId(category: string) {
  const slug = category
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `resource-${slug || "other"}`;
}

export function ResourcesList({ resources }: { resources: Resource[] }) {
  return (
    <div className="space-y-10">
      {Object.entries(Object.groupBy(resources, ({ category }) => category)).map(
        ([category, items]) => {
          const sectionId = getResourceSectionId(category);

          return (
            <section aria-labelledby={sectionId} key={category}>
              <h2
                className="mb-4 font-serif-display text-[length:var(--text-section-title)] font-medium tracking-tight"
                id={sectionId}
              >
                {category}
              </h2>
              <ul className="overflow-hidden rounded-[14px] border border-border/70 bg-card shadow-[var(--shadow-card)] divide-y divide-border">
                {items?.map((resource) => (
                  <li className="px-5 py-6 sm:px-7" key={resource.id}>
                    <article className="max-w-2xl space-y-2.5">
                      <div>
                        <h3 className="font-serif-display text-[length:var(--text-card-title)] font-semibold tracking-tight">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{resource.organization}</p>
                      </div>
                      <p className="text-pretty leading-7 text-muted-foreground">
                        {resource.description}
                      </p>
                      <a
                        className={cn(
                          buttonVariants({ fullWidth: false, variant: "text" }),
                          "min-h-11 px-0",
                        )}
                        href={resource.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Visit {resource.organization}
                        <ExternalLink aria-hidden="true" className="size-4" />
                      </a>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          );
        },
      )}
    </div>
  );
}
