// app/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 space-y-4">
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
            {/* Thumbnail skeleton */}
            <Skeleton className="h-72 w-full rounded-md" />

            <div className="mt-3 flex items-start justify-between px-1">
              <div className="flex min-w-0 flex-1 gap-3">
                {/* Avatar */}
                <Skeleton className="h-7 w-7 rounded-full" />

                {/* Text content */}
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>

              {/* Dropdown button placeholder */}
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
