"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { fetchVideos } from "@/actions/video-actions";
import VideoCard from "@/components/cards/video-card";
import { VideoWithUserAndCount } from "@/types";

const limit = 9;

export default function InfiniteScrollMovies({
  initialVideos,
  hasMore: initialHasMore,
}: {
  initialVideos: VideoWithUserAndCount[];
  hasMore: boolean;
}) {

  console.log(initialVideos, ": initial videos");
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  const [videos, setVideos] = useState<VideoWithUserAndCount[]>(
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
  }, [query, categorySlug, orderBy]); // Add liked to dependencies

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
  }, [inView, hasMore, loading, page, query, categorySlug, orderBy]); // Add liked to dependencies

  return (
    <div
      className={
        "no-scrollbar grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {videos.map((video) => (
        <div key={video.id}>
          {/* <VideoCompactRawCard video={video}  /> */}

          <VideoCard video={video} />
        </div>
      ))}

      {hasMore && (
        <div className="col-span-full" ref={ref}>
          {loading && (
            <p className="mt-4 text-center">Loading more videos...</p>
          )}
        </div>
      )}
    </div>
  );
}
