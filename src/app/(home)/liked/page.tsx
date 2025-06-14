import React from "react";

import { fetchVideos } from "@/actions/video-actions";
import { InfiniteScroll } from "@/components/infinite-scroll";

const LikedPage = async () => {
  const res = await fetchVideos({
    page: 1,
    pageSize: 9,
    isLiked: true,
  });

  

  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <InfiniteScroll
        initalVideos={res.videos}
        hasMoreInitial={res.hasMore}
        variant="studio-main"
        initialOrderBy="newest"
        isLiked={true}
      />
    </div>
  );
};

export default LikedPage;
