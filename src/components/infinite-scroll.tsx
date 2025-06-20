"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

// import { HomeMainGrid } from "@/app/(home)/home-main-grid";
// import SearchMainList from "@/app/(home)/search-main-list";
import { HomeMainGrid } from "@/app/(home)/home-main-grid";
import { StudioMainList } from "@/app/studio/components/studio-main-list";
import { Video } from "@/lib/generated/prisma";

interface InfiniteScrollProps {
  initalVideos: Video[];
  hasMoreInitial: boolean;
  initialQuery?: string;
  initialCategorySlug?: string;
  initialOrderBy: "newest" | "oldest" | "popular";
  variant: "home-main" | "studio-main" | "suggestion" | "search-main";
  user?: boolean;
  isPrivate?: boolean;
  isLiked?: boolean; // ✅ Add isLiked prop
  isHistory?: boolean;
}

export const InfiniteScroll = ({
  initalVideos,
  hasMoreInitial,
  initialQuery,
  initialCategorySlug,
  initialOrderBy,
  variant,
  user,
  isPrivate,
  isLiked,
  isHistory,
}: InfiniteScrollProps) => {
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
    queryKey: [
      "videos",
      query,
      categorySlug,
      orderBy,
      user,
      isPrivate,
      isLiked,
      isHistory,
    ], // ✅ include isLiked
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        pageSize: "9",
        query,
        categorySlug,
        orderBy,
      });

      if (user !== undefined) params.set("user", String(user));
      if (isPrivate !== undefined) params.set("private", String(isPrivate));
      if (isLiked !== undefined) params.set("liked", String(isLiked)); // ✅ add to query
      if (isHistory !== undefined) params.set("isHistory", String(isHistory));

      const res = await fetch(
        `/api/videos/get-videos-paginated?${params.toString()}`
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

    case "suggestion":
      return (
        // <SearchMainList
        //   videos={videos}
        //   isLoading={isLoading}
        //   isFetchingNextPage={isFetchingNextPage}
        //   hasNextPage={hasNextPage ?? false}
        //   refObserver={ref}
        // />
        <div></div>
      );

    case "search-main":
      return (
        // <SearchMainList
        //   videos={videos}
        //   isLoading={isLoading}
        //   isFetchingNextPage={isFetchingNextPage}
        //   hasNextPage={hasNextPage ?? false}
        //   refObserver={ref}
        // />
        <div></div>
      );

    default:
      return <p>Unknown variant: {variant}</p>;
  }
};
