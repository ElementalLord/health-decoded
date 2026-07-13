import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Resource } from "@/features/stories/schemas/resource.schema";

export function ResourcesList({ resources }: { resources: Resource[] }) {
  return <div className="space-y-8">{Object.entries(Object.groupBy(resources, ({ category }) => category)).map(([category, items]) => <section aria-labelledby={`resource-${category}`} key={category}><h2 className="mb-3 text-[length:var(--text-section-title)] font-semibold" id={`resource-${category}`}>{category}</h2><ul className="grid gap-4 sm:grid-cols-2">{items?.map((resource) => <li key={resource.id}><Card className="h-full"><CardHeader><CardTitle>{resource.title}</CardTitle><p className="text-sm text-muted-foreground">{resource.organization}</p></CardHeader><CardContent><p>{resource.description}</p><a className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-primary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring" href={resource.url} rel="noopener noreferrer" target="_blank">Visit {resource.organization}<ExternalLink aria-hidden="true" className="size-4" /></a></CardContent></Card></li>)}</ul></section>)}</div>;
}
