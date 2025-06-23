// app/studio/[channelId]/videos/page.tsx
import { notFound } from "next/navigation";

import { fetchChannelVideos } from "@/actions/video-actions";
import { InfiniteScrollStudiMain } from "@/components/infinite-scroll-studio-main";

interface PageProps {
  params: Promise<{ channelId: string }>;
}

export default async function VideosPage({ params }: PageProps) {
  const { channelId } = await params;

  // console.log(channelId, "channel id")
  const { videos: initialVideos, hasMore: hasMoreInitial } =
    await fetchChannelVideos({
      channelId,
      page: 1,
    });


  if (!initialVideos) notFound();

  return (
    <InfiniteScrollStudiMain
      channelId={channelId}
      initalVideos={initialVideos}
      hasMoreInitial={hasMoreInitial}
      variant="studio-main"
      initialOrderBy="newest"
    />
  );
}
