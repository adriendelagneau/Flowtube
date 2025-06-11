"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { fetchVideosPaginated } from "@/actions/video-actions";
import VideoCard from "@/components/cards/video-card";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust path to your skeleton component

export default function HomeMain() {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView({ rootMargin: "30px" });

  const query = searchParams.get("query") || "";
  const categorySlug = searchParams.get("category") || "";
  const orderBy =
    (searchParams.get("orderBy") as "newest" | "oldest" | "popular") ||
    "newest";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["videos", query, categorySlug, orderBy],
      queryFn: ({ pageParam = 1 }) =>
        fetchVideosPaginated({
          pageParam,
          query,
          categorySlug,
          orderBy,
          pageSize: 9,
        }),

      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasMore ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const videos = data?.pages.flatMap((page) => page.videos) || [];

  // Number of skeletons to show during loading
  const skeletonCount = 9;

  return (
    <div className="no-scrollbar grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      
      {videos.map((video) => (
          <VideoCard video={video} key={video.id}/> 
      ))}

      {/* Render skeleton placeholders during initial load */}
      {(isLoading || (isFetchingNextPage && hasNextPage)) &&
        Array.from({ length: skeletonCount }).map((_, idx) => (
         <div key={`skeleton-${idx}`} className="overflow-hidden rounded-sm pb-2">
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

      {hasNextPage && (
        <div className="col-span-full" ref={ref}>
        </div>
      )}

      {!hasNextPage && videos.length === 0 && !isLoading && (
        <p className="text-teal-800 col-span-full text-center">No videos found.</p>
      )}
    </div>
  );
}


