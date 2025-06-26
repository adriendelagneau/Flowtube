"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

// import { HomeMainGrid } from "@/app/(home)/home-main-grid";
// import SearchMainList from "@/app/(home)/search-main-list";
import { HomeMainGrid } from "@/app/(home)/home-main-grid";
import { Video } from "@/lib/generated/prisma";

interface InfiniteScrollLikedProps {
  initalVideos: Video[];
  hasMoreInitial: boolean;
  initialQuery?: string;
  initialCategorySlug?: string;
  initialOrderBy: "newest" | "oldest" | "popular";
  variant: "home-main" | "studio-main" | "suggestion" | "search-main";

}

export const InfiniteScrollLiked = ({
  initalVideos,
  hasMoreInitial,
  initialQuery,
  initialCategorySlug,
  initialOrderBy,

}: InfiniteScrollLikedProps) => {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView({ rootMargin: "30px" });

  const query = searchParams.get("query") || "";
  const categorySlug = searchParams.get("category") || "";
  const orderBy =
    (searchParams.get("orderBy") as "newest" | "oldest" | "popular") ||
    "newest";

  const shouldUseInitialData =
    (query || "") === (initialQuery || "") &&
    (categorySlug || "") === (initialCategorySlug || "") &&
    orderBy === initialOrderBy;

  const queryResult = useInfiniteQuery({
    queryKey: ["videos", query, categorySlug, orderBy], // ✅ include isLiked
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        pageSize: "9",
        query,
        categorySlug,
        orderBy,
      });

      const res = await fetch(
        `/api/videos/get-liked-videos-paginated?${params.toString()}`,
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


      return (
        <HomeMainGrid
          videos={videos}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage ?? false}
          refObserver={ref}
        />
      );


  
};
