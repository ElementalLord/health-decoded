import { PageLoadingState } from "@/components/shared/page-loading-state";

export default function AppointmentPreparationLoading() {
  return (
    <PageLoadingState label="Opening your preparation workspace">
      <div className="h-14 max-w-xl animate-pulse rounded bg-muted" />
      <div className="h-32 animate-pulse rounded bg-muted" />
    </PageLoadingState>
  );
}
