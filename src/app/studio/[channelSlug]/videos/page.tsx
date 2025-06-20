import { notFound } from "next/navigation";
import React from "react";

import { getChannelVideosPage } from "@/actions/video-actions";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface PageProps {
  params: Promise<{ channelSlug: string }>;
}

export default async function VideosPage({ params }: PageProps) {
  const channel = await params;
  const { data: initialData, hasMore: hasMoreInitial } =
    await getChannelVideosPage(channel.channelSlug, 1);
  if (!initialData) notFound();

  return (
    <InfiniteScroll
      initalVideos={initialData}
      hasMoreInitial={hasMoreInitial}
      variant="studio-main"
      initialOrderBy="newest"
    />
  );
}
