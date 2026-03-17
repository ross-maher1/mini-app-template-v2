import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthLoading() {
  return (
    <main className="space-y-10">
      <div className="space-y-2">
        <Skeleton width="6rem" height="0.75rem" />
        <Skeleton width="10rem" height="2rem" />
        <Skeleton width="16rem" height="0.875rem" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm max-w-md">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton width="3rem" height="0.875rem" />
            <Skeleton height="2.5rem" className="w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton width="4rem" height="0.875rem" />
            <Skeleton height="2.5rem" className="w-full" />
          </div>
          <div className="flex justify-end pt-2">
            <Skeleton width="6rem" height="2.25rem" />
          </div>
        </div>
      </div>
    </main>
  );
}
