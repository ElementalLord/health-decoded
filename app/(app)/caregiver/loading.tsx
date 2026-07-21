import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function CaregiverLoading() {
  return (
    <PageLoadingState
      className="mx-auto max-w-4xl space-y-6 py-6 sm:py-10"
      label="Gathering caregiver guidance"
    >
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-14 w-full max-w-2xl" />
      <Skeleton className="h-24 w-full max-w-2xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    </PageLoadingState>
  );
}
