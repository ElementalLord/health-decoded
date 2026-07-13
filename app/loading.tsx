import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div aria-label="Loading page" className="space-y-8" role="status">
      <span className="sr-only">Loading page</span>
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3 max-w-80" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </div>
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    </div>
  );
}
