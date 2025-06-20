import { notFound } from "next/navigation";
import React from "react";

import { getVideosPage } from "@/actions/video-actions";
import { InfiniteScroll } from "@/components/infinite-scroll";

// interface PageProps {
//   params: Promise<{ channelSlug: string }>;
// }

export default async function HomePage() {

  const { data: initialData, hasMore: hasMoreInitial } =
    await getVideosPage( 1);
  if (!initialData) notFound();

  return (
    <InfiniteScroll
      initalVideos={initialData}
      hasMoreInitial={hasMoreInitial}
      variant="home-main"
      initialOrderBy="newest"
    />
  );
}