import { PageLoadingState } from "@/components/shared/page-loading-state";

export default function GlossaryLoading() {
  return (
    <PageLoadingState label="Opening the Medical Glossary">
      <div className="h-16 max-w-2xl animate-pulse rounded bg-muted" />
      <div className="h-48 animate-pulse rounded bg-muted" />
    </PageLoadingState>
  );
}
