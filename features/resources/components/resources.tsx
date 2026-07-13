import { ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import type { Resource } from "@/features/stories/schemas/resource.schema";

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
    <div className="space-y-9">
      {Object.entries(Object.groupBy(resources, ({ category }) => category)).map(
        ([category, items]) => {
          const sectionId = getResourceSectionId(category);

          return (
            <section aria-labelledby={sectionId} key={category}>
              <h2
                className="mb-3 text-[length:var(--text-section-title)] font-medium"
                id={sectionId}
              >
                {category}
              </h2>
              <ul className="divide-y divide-border border-y border-border">
                {items?.map((resource) => (
                  <li className="py-5" key={resource.id}>
                    <article className="max-w-2xl space-y-2">
                      <div>
                        <h3 className="text-[length:var(--text-card-title)] font-medium">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{resource.organization}</p>
                      </div>
                      <p className="leading-7">{resource.description}</p>
                      <a
                        className={buttonVariants({ fullWidth: false, variant: "text" })}
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
