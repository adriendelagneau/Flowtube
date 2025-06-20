// components/video-views/HomeMainGrid.tsx

// import { RefObject } from "react";

import { Skeleton } from "@/components/ui/skeleton";
// import { Video } from "@/generated";
import { VideoWithChannelAndCount} from "@/types";

import VideoCard from "./video-card";

interface HomeMainGridProps {
  videos: VideoWithChannelAndCount[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  refObserver: (node?: Element | null) => void; // ✅ fix here
}

export const HomeMainGrid = ({
  videos,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  refObserver,
}: HomeMainGridProps) => {
  return (
    <div className="no-scrollbar grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard video={video} key={video.id} />
      ))}

      {(isLoading || (isFetchingNextPage && hasNextPage)) &&
        Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="overflow-hidden rounded-sm pb-2"
          >
            <Skeleton className="aspect-video w-full rounded-sm" />
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

      {hasNextPage && <div className="col-span-full" ref={refObserver} />}

      {!hasNextPage && videos.length === 0 && !isLoading && (
        <p className="col-span-full text-center text-teal-800">
          No videos found.
        </p>
      )}
    </div>
  );
};
