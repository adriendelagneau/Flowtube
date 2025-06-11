import { Skeleton } from "@/components/ui/skeleton";

const VideoCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-sm pb-2">
      {/* Thumbnail skeleton */}
      <Skeleton className="aspect-video w-full rounded-sm" />

      <div className="mt-3 flex justify-between items-start px-1">
        {/* Left side: Avatar + Text */}
        <div className="flex gap-3">
          <Skeleton className="h-7 w-7 rounded-full" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>

        {/* Right side: 3-dot menu */}
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
