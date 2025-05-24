// app/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      {/* Simulate loading categories carousel */}
      <div className="flex gap-x-3 overflow-x-auto">
        {Array.from({ length: 14 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-60 rounded-full" />
        ))}
      </div>

      {/* Simulated loading VideoCards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-sm pb-2">
            {/* Thumbnail */}
            <Skeleton className="aspect-video w-full rounded-sm" />

            {/* Video meta */}
            <div className="mt-3 flex items-start justify-between px-1">
              <div className="flex min-w-0 flex-1 gap-3">
                <Skeleton className="h-7 w-7 rounded-full" />

                <div className="flex w-full flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>

              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
