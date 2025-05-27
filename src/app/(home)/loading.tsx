// app/loading.tsx
import SkeletonMainVideos from "@/components/skeleton-main-videos";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      {/* Simulate loading categories carousel */}
      <div className="scrollbar-hide scrollbar scrollbar-none w-full overflow-x-auto">
        <div className="flex w-max flex-nowrap gap-x-3">
          {Array.from({ length: 14 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-36 rounded-full" />
          ))}
        </div>
      </div>

      {/* Simulated loading VideoCards */}
          <SkeletonMainVideos/>
    </div>
  );
}
