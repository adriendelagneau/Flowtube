import React from "react";

import { fetchVideos } from "@/actions/video-actions";
import { InfiniteScroll } from "@/components/infinite-scroll";

const HistoryPage = async () => {
  const res = await fetchVideos({
    page: 1,
    pageSize: 9,
    user: true,
    isHistory: true,
  });

  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <InfiniteScroll
        initalVideos={res.videos}
        hasMoreInitial={res.hasMore}
        variant="studio-main"
        initialOrderBy="newest"
        user={true}
        isHistory={true}
      />
    </div>
  );
};

export default HistoryPage;
