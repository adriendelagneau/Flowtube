"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

// import { fetchVideosPaginated } from "@/actions/video-actions";
import { Video } from "@/generated";

import HomeMainGrid from "./home-main-grid";
import StudioMainList from "../(studio)/studio/studio-main-list";

interface InfiniteScrollProps {
  initalVideos: Video[];
  hasMoreInitial: boolean;
  initialQuery?: string;
  initialCategorySlug?: string;
  initialOrderBy: "newest" | "oldest" | "popular";
  variant: "home-main" | "studio-main";
}

export default function InfiniteScroll({
  initalVideos,
  hasMoreInitial,
  initialQuery,
  initialCategorySlug,
  initialOrderBy,
  variant,
}: InfiniteScrollProps) {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView({ rootMargin: "30px" });

  const query = searchParams.get("query") || "";
  const categorySlug = searchParams.get("category") || "";
  const orderBy =
    (searchParams.get("orderBy") as "newest" | "oldest" | "popular") ||
    "newest";

  const shouldUseInitialData =
    query === initialQuery &&
    categorySlug === initialCategorySlug &&
    orderBy === initialOrderBy;

  const queryResult = useInfiniteQuery({
    queryKey: ["videos", query, categorySlug, orderBy],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/videos/get-videos-paginated?page=${pageParam}&query=${query}&categorySlug=${categorySlug}&orderBy=${orderBy}&pageSize=9`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch videos");
      }
      return res.json();
    },

    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    ...(shouldUseInitialData && {
      initialData: {
        pages: [
          {
            videos: initalVideos,
            hasMore: hasMoreInitial,
          },
        ],
        pageParams: [1],
      },
    }),
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    queryResult;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const videos = data?.pages.flatMap((page) => page.videos) || [];

  switch (variant) {
    case "home-main":
      return (
        <HomeMainGrid
          videos={videos}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage ?? false}
          refObserver={ref}
        />
      );

    case "studio-main":
      return (
        <StudioMainList
          videos={videos}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage ?? false}
          refObserver={ref}
        />
      );

    default:
      return <p>Unknown variant: {variant}</p>;
  }
}
