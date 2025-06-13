import React from "react";

import { fetchVideos } from "@/actions/video-actions";
import { InfiniteScroll } from "@/components/infinite-scroll";

const StudioPage = async () => {
  const res = await fetchVideos({
    page: 1,
    pageSize: 9,
    user: true,
  });

  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <InfiniteScroll
        initalVideos={res.videos}
        hasMoreInitial={res.hasMore}
        variant="studio-main"
        initialOrderBy="newest"
        user={true} 
      />
    </div>
  );
};

export default StudioPage;
