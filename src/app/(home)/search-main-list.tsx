import React from "react";

// import VideoCard from "@/components/cards/video-card";
import VideoCompactRawCard from "@/components/cards/video-compact-row-card";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoWithUser } from "@/types";

interface SearchMainListProps {
  videos: VideoWithUser[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  refObserver: (node?: Element | null) => void;
}

const SearchMainList = ({
  videos,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  refObserver,
}: SearchMainListProps) => {
  return (
    <div className="no-scrollbar">
      {videos.map((video) => (
        <VideoCompactRawCard video={video} key={video.id} />
      ))}

      {/* {(isLoading || (isFetchingNextPage && hasNextPage)) &&
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
        ))} */}

      {hasNextPage && <div className="col-span-full" ref={refObserver} />}

      {!hasNextPage && videos.length === 0 && !isLoading && (
        <p className="col-span-full text-center text-teal-800">
          No videos found.
        </p>
      )}
    </div>
  );
};

export default SearchMainList;
