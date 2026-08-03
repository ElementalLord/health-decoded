import { PageLoadingState } from "@/components/shared/page-loading-state";
export default function MilestonesLoading() {
  return <PageLoadingState label="Opening milestones"><div className="h-20 animate-pulse rounded bg-muted" /><div className="h-72 animate-pulse rounded bg-muted" /></PageLoadingState>;
}
