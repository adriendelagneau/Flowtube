import React from "react";


import { VideoWithUser } from "@/types";

import { ShareButton } from "../share-button";
import { SubscriptionButton } from "./subscriptions-button";
import VideoDescription from "./video-description";
import VideoMenu from "./video-menu";
// import VideoOwner from "./video-owner";
import VideoReactions from "./video-reactions";
interface VideoTopRowProps {
  video: VideoWithUser;
   subscription: boolean;
   notifyLevel?: "ALL" | "PERSONALIZED" | "NONE";
}

const VideoTopRow = ({ video, notifyLevel }: VideoTopRowProps) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="text-xl font-semibold">
        <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SubscriptionButton
            channelId={video.channelId}
            subscription={video.subscription}
            notifyLevel={notifyLevel}
          />
          {/* <VideoOwner
            user={video.user}
            videoId={video.id}
            subscription={subscription}
          /> */}
          <div className="-mb-2 flex gap-2 overflow-x-auto pb-2 sm:mb-0 sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible sm:pb-0">
            <VideoReactions video={video} />
            <ShareButton
              url={`${process.env.NEXT_PUBLIC_URL}/video/${video.id}`}
            />
            <VideoMenu videoId={video.id} />
          </div>
        </div>
        <VideoDescription
          description={video.description}
          publshedDate={video.createdAt}
          numberOfViews={video.videoViews}
        />
      </div>
    </div>
  );
};

export default VideoTopRow;
