"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { VideoWithChannelAndCount } from "@/types";

import SearchMainList from "./search-main-list";

export const InfiniteScrollSuggestions: React.FC = () => {
  const { ref, inView } = useInView({ rootMargin: "200px" });

  const query = useInfiniteQuery({
    queryKey: ["suggestedVideos"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      const qs = new URLSearchParams({
        page: pageParam.toString(),
        pageSize: "9",
        orderBy: "newest",
      });
      const res = await fetch(`/api/videos/get-videos-paginated?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json() as Promise<{
        videos: VideoWithChannelAndCount[];
        hasMore: boolean;
      }>;
    },
    getNextPageParam: (
      lastPage: { videos: VideoWithChannelAndCount[]; hasMore: boolean },
      pages
    ) => (lastPage.hasMore ? pages.length + 1 : undefined),
    refetchOnWindowFocus: false,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    query;
  const videos = data?.pages.flatMap((p) => p.videos) || [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SearchMainList
      videos={videos}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      refObserver={ref}
    />
  );
};

export default InfiniteScrollSuggestions;
