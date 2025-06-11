"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { fetchVideos } from "@/actions/video-actions";
import VideoCardSkeleton from "@/components/cards/video-card-skeleton";
import InfiniteScrollVideos from "@/components/infinitScroolVideos";
import { NoResults } from "@/components/no-results"; 
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VideoWithUserAndCount } from "@/types";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query") || "";
  const orderBy =
    (searchParams.get("orderBy") as "newest" | "oldest" | "popular" | null) ||
    "newest";

  const [videos, setVideos] = useState<VideoWithUserAndCount[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialVideos = async () => {
      setIsLoading(true);
      const res = await fetchVideos({
        query: query,
        page: 1,
        pageSize: 9,
        orderBy,
      });
      setVideos(res.videos);
      setHasMore(res.hasMore);
      setIsLoading(false);
    };

    fetchInitialVideos();
  }, [query, orderBy]);

  const handleOrderChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("orderBy", value);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="">
      {/* Sort Dropdown */}
      <div className="mt-4 mb-3 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-4">
              {orderBy
                ? orderBy.charAt(0).toUpperCase() + orderBy.slice(1)
                : "Sort By"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleOrderChange("newest")}>
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOrderChange("oldest")}>
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOrderChange("popular")}>
              Most Popular
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Videos or No Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, idx) => (
            <VideoCardSkeleton key={idx} />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <NoResults />
          <p className="text-muted-foreground mt-4">
            No videos found for your search.
          </p>
        </div>
      ) : (
        <InfiniteScrollVideos
        
          initialVideos={videos}
          hasMore={hasMore}
    
        />
      )}
    </div>
  );
};

export default SearchPage;
