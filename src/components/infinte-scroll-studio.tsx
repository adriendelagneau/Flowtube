"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { getUserVideos } from "@/actions/video-actions";
import { Video } from "@/lib/generated";

import VideoStudioRowCard from "./cards/studio-card";

const limit = 9;

const InfiniteScrollStudio = ({
  initialVideos,
  hasMore: initialHasMore,
}: {
  initialVideos: Video[];
  hasMore: boolean;
}) => {
  const { ref, inView } = useInView();

  const [videos, setVideos] = useState<Video[] | []>(initialVideos ?? []);

  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  // Reset videos and page when filters change
  useEffect(() => {
    const fetchInitialVideos = async () => {
      setLoading(true);
      try {
        const { videos: newVideos, hasMore: more } = await getUserVideos({
          page: 1,
          pageSize: limit,
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
  }, []); // Add liked to dependencies

  // Load more when inView
  useEffect(() => {
    const loadMoreVideos = async () => {
      if (inView && hasMore && !loading) {
        setLoading(true);
        try {
          const { videos: newVideos, hasMore: more } = await getUserVideos({
            page,
            pageSize: limit,
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
  }, [inView, hasMore, loading, page]); // Add liked to dependencies
  return (
    <>
      {videos.map((video) => (
        <VideoStudioRowCard key={video.id} video={video as Video} />
      ))}
      {hasMore && (
        <tr ref={ref}>
          <td colSpan={7} className="py-4 text-center">
            {loading && <Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-600" />}
          </td>
        </tr>
      )}
    </>
  );
};

export default InfiniteScrollStudio;
