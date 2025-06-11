"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { fetchVideosPaginated } from "@/actions/video-actions";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust path to your skeleton component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import VideoStudioRowCard from "./studio-card";

export default function StudioMain() {
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
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[510px] pl-6">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="pr-6 text-right">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            
            {videos.map((video) => (
              <VideoStudioRowCard key={video.id} video={video} />
            ))}

            {(isLoading || (isFetchingNextPage && hasNextPage)) &&
              Array.from({ length: skeletonCount }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell className="w-[510px] pl-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-[80px] w-36 rounded-md" />
                      <div className="flex w-full max-w-xs flex-col gap-2 pr-6">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-14 rounded-md" />
                  </TableCell>

                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-6 rounded-md" />
                  </TableCell>

                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-6 rounded-md" />
                  </TableCell>

                  <TableCell className="pr-6 text-right">
                    <Skeleton className="h-4 w-6 rounded-md" />
                  </TableCell>
                </TableRow>
              ))}

            {hasNextPage && (
              <tr>
                <td colSpan={7} ref={ref} />
              </tr>
            )}

            {!hasNextPage && videos.length === 0 && !isLoading && (
              <tr>
                <td colSpan={7} className="text-center text-teal-800">
                  No videos found.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
