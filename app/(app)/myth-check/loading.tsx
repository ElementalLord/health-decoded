import { PageLoadingState } from "@/components/shared/page-loading-state";

export default function MythCheckLoading() {
  return (
    <PageLoadingState label="Opening Diabetes Myth Check">
      <div className="h-20 max-w-2xl animate-pulse rounded bg-muted" />
      <div className="h-72 animate-pulse rounded bg-muted" />
    </PageLoadingState>
  );
}
