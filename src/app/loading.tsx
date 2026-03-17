import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="space-y-10">
      <div className="space-y-2">
        <Skeleton width="6rem" height="0.75rem" />
        <Skeleton width="14rem" height="2rem" />
        <Skeleton width="20rem" height="0.875rem" />
      </div>

      <div className="space-y-3">
        <Skeleton height="3.5rem" className="w-full" />
        <Skeleton height="3.5rem" className="w-full" />
        <Skeleton height="3.5rem" className="w-full" />
      </div>
    </main>
  );
}
