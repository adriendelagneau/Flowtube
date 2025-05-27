import React from "react";

import { VideoWithUserAndCount } from "@/types";

import VideoCompactRawCard from "./cards/video-compact-row-card";

export const SuggestionSection = ({
  initialVideos,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasMore,
}: {
  initialVideos: VideoWithUserAndCount[];
  hasMore: boolean;
}) => {
  return (
    <div className="rouded-lg flex h-full xl:w-[370px] flex-col gap-5  p-1">
      {initialVideos?.map((video) => (
        <VideoCompactRawCard video={video} key={video.id} size={"compact"}/>
      ))}
    </div>
  );
};
