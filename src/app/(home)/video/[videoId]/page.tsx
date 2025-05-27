import { headers } from "next/headers";
import React from "react";

import {
  fetchVideos,
  getSubscriptionStatus,
  getVideoById,
} from "@/actions/video-actions";
// import { CommentSection } from "@/components/comment/comment-section";
import { SuggestionSection } from "@/components/suggestion-section";
import { auth } from "@/lib/auth/auth";

import { VideoView } from "./video-view";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session?.user?.id) return;

  const subscriptions = await getSubscriptionStatus(videoId, session.user.id);
  if (!subscriptions) return null;

  const subscription = subscriptions.isSubscribed;

  const video = await getVideoById(videoId);
  if (!video) return null;

  const res = await fetchVideos({
    page: 1,
    pageSize: 9,
  });

  return (
    <div className="w-full">
      <div className="mx-4 mb-10 flex flex-col pt-2.5">
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="flex-1">
            <VideoView video={video} subscription={subscription} />
            <div className="mt-4 block rounded-xl xl:hidden">
              <SuggestionSection
                initialVideos={res.videos}
                hasMore={res.hasMore}
              />
            </div>
            {/* <CommentSection video={video} /> */}
          </div>
          <div className="hidden w-full shrink-1 rounded-xl xl:block xl:w-[380px]">
            <SuggestionSection
              initialVideos={res.videos}
              hasMore={res.hasMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
