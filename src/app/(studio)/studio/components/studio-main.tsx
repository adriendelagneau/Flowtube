"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { fetchVideosPaginated } from "@/actions/video-actions";
import { Video } from "@/generated";

import VideoStudioRowCard from "../studio-card";

export default function StudioMain() {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView({ threshold: 0 });

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

  // Trigger load more when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const videos = data?.pages.flatMap((page) => page.videos) || [];

  return (
    <div className="no-scrollbar grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoStudioRowCard key={video.id} video={video as Video} />
      ))}

      {hasNextPage && (
        <div className="col-span-full" ref={ref}>
          {isFetchingNextPage && (
            <p className="mt-4 text-center">Loading more videos...</p>
          )}
        </div>
      )}

      {!hasNextPage && videos.length === 0 && !isLoading && (
        <p className="text-muted col-span-full text-center">No videos found.</p>
      )}
    </div>
  );
}
