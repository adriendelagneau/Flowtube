import React from "react";

// import VideoCard from "@/components/cards/video-card";
// import { Skeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoWithChannelAndCount } from "@/types";

import VideoCompactRawCard from "./video-compact-row-card";

interface SearchMainListProps {
  videos: VideoWithChannelAndCount[];
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

      {(isLoading || (isFetchingNextPage && hasNextPage)) &&
        Array.from({ length: 9 }).map((_, idx) => (
          <div className="group mt-2 flex min-w-0 gap-2" key={`${idx}`}>
            {/* Thumbnail */}
            <div className="h-[94px] w-[168px] overflow-hidden rounded-md">
              <Skeleton className="h-full w-full" />
            </div>

            {/* Info */}
            <div className="w-[420px] min-w-0 flex-1 space-y-2">
              {/* Title */}
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
              {/* New Badge */}
              <Skeleton className="h-5 w-12 rounded-md" />
            </div>

            {/* Menu Button */}
            <Skeleton className="h-8 w-8 rounded-md" />
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

export default SearchMainList;
