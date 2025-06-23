"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { StudioMainList } from "@/app/studio/components/studio-main-list";
import type { Video } from "@/lib/generated/prisma";

interface InfiniteScrollProps {
  initalVideos: Video[];
  hasMoreInitial: boolean;
  initialOrderBy: "newest" | "oldest" | "popular";
  variant: "studio-main"; // only for studio pages
  channelId?: string; // optional, used for studio main
}

export const InfiniteScrollStudioMain = ({
  initalVideos,
  hasMoreInitial,
  initialOrderBy,
  channelId,
}: InfiniteScrollProps) => {
  const searchParams = useSearchParams();
  const orderBy =
    (searchParams.get("orderBy") as "newest" | "oldest" | "popular") ??
    initialOrderBy;

  const { ref, inView } = useInView({ rootMargin: "30px" });

  const queryKey = ["videos", channelId, orderBy];

  const queryFn = async ({ pageParam = 1 }) => {
    const qs = new URLSearchParams({
      page: pageParam.toString(),
      pageSize: "9",
      orderBy,
    });
    const res = await fetch(
      `/api/videos/${channelId}/get-channel-videos?${qs}`
    );
    if (!res.ok) throw new Error("Failed to fetch videos");
    return res.json();
  };

  const queryResult = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam: (last) => (last.hasMore ? last.nextPage : undefined),
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    initialData: {
      pages: [{ videos: initalVideos, hasMore: hasMoreInitial }],
      pageParams: [1],
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    queryResult;


  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const videos = data?.pages.flatMap((p) => p.videos) || [];

  return (
    <StudioMainList
      videos={videos}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      refObserver={ref}
    />
  );
};
