// app/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 space-y-4">
      {/* Simulate loading categories carousel */}
      <div className="flex space-x-2 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>

      {/* Simulate loading videos */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
