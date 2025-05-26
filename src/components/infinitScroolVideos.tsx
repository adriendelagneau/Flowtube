"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { fetchVideos } from "@/actions/video-actions";
import VideoCard from "@/components/cards/video-card";
import { Video } from "@/lib/generated";
import { cn } from "@/lib/utils";
import { VideoWithUserAndCount } from "@/types";

import VideoStudioRowCard from "./cards/studio-card";
import VideoCompactRawCard from "./cards/video-compact-row-card";

const limit = 9;

export default function InfiniteScrollMovies({
  initialVideos,
  hasMore: initialHasMore,
  liked, // New prop for liked videos
  history, // New prop for history
  subscribed,
  variant,
}: {
  initialVideos: Video[] | VideoWithUserAndCount[];
  hasMore: boolean;
  liked?: boolean; // User ID who liked the videos
  history?: boolean; // New prop for history
  subscribed?: boolean; // New prop for subscriptions
  variant?: string;
}) {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  const [videos, setVideos] = useState<(VideoWithUserAndCount | Video)[] | []>(
    initialVideos ?? []
  );

  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const query = searchParams.get("query") || "";
  const categorySlug = searchParams.get("category") || "";
  const orderBy =
    (searchParams.get("orderBy") as "newest" | "oldest" | "popular") ||
    "newest";

  // Reset videos and page when filters change
  useEffect(() => {
    const fetchInitialVideos = async () => {
      setLoading(true);
      try {
        const { videos: newVideos, hasMore: more } = await fetchVideos({
          query,
          categorySlug,
          page: 1,
          pageSize: limit,
          orderBy, // Pass the orderBy param
          liked, // Include liked in the initial fetch
          history,
          subscribed,
        });

        setVideos(newVideos);
        setPage(2);
        setHasMore(more);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialVideos();
  }, [query, categorySlug, orderBy, liked, history, subscribed]); // Add liked to dependencies

  // Load more when inView
  useEffect(() => {
    const loadMoreVideos = async () => {
      if (inView && hasMore && !loading) {
        setLoading(true);
        try {
          const { videos: newVideos, hasMore: more } = await fetchVideos({
            query,
            categorySlug,
            page,
            pageSize: limit,
            orderBy, // Pass orderBy also for infinite scroll
            liked, // Include liked when loading more
            history,
          });

          setVideos((prev) => [...prev, ...newVideos]);
          setPage((prev) => prev + 1);
          setHasMore(more);
        } catch (error) {
          console.error("Error loading more videos:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMoreVideos();
  }, [
    inView,
    hasMore,
    loading,
    page,
    query,
    categorySlug,
    orderBy,
    liked,
    history,
    subscribed,
  ]); // Add liked to dependencies

   const containerClass =
    variant === "search"
      ? "no-scrollbar mx-auto flex max-w-6xl flex-col gap-6"
      : variant === "studio"
      ? ""
      : "no-scrollbar grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3";

return variant === "studio" ? (
  <>
    {videos.map((video) => (
      <VideoStudioRowCard key={video.id} video={video as Video} />
    ))}
    {hasMore && (
      <tr ref={ref}>
        <td colSpan={7} className="text-center py-4">
          {loading && "Loading more videos..."}
        </td>
      </tr>
    )}
  </>
) : (
  <div className={cn(containerClass, "w-full")}>
    {videos.map((video) => (
      <div key={video.id}>
        {variant === "search" ? (
          <VideoCompactRawCard video={video as VideoWithUserAndCount} />
        ) : (
          <VideoCard video={video as VideoWithUserAndCount} />
        )}
      </div>
    ))}

    {hasMore && (
      <div className="col-span-full" ref={ref}>
        {loading && <p className="mt-4 text-center">Loading more videos...</p>}
      </div>
    )}
  </div>
);

}
