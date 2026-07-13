import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressLoading() {
  return (
    <section
      aria-label="Loading your progress"
      className="mx-auto max-w-4xl space-y-8 py-6 sm:py-10"
    >
      <Skeleton className="h-20 w-full max-w-2xl" />
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-44 w-full" />
    </section>
  );
}
