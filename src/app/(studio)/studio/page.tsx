import React from "react";

import { fetchVideos } from "@/actions/video-actions";
import InfiniteScroll from "@/app/(home)/infinite-scroll";

const StudioPage = async () => {
  const res = await fetchVideos({
    page: 1,
    pageSize: 9,
  });

  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <InfiniteScroll
        initalVideos={res.videos}
        hasMoreInitial={res.hasMore}
        variant="studio-main"
        initialOrderBy="newest"
      />
    </div>
  );
};

export default StudioPage;
