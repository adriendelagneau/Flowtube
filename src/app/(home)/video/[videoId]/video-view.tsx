"use client";

import React from "react";

// import { incrementVideoView, updateWatchHistory } from "@/actions/video-actions";
import { cn } from "@/lib/utils";
import { VideoWithUser } from "@/types";

import VideoBanner from "./video-banner";
import VideoPlayer from "./video-player";
// import VideoTopRow from "./video-top-row";

interface VideoSectionProps {
  video: VideoWithUser;
  
}
export const VideoView = ({ video }: VideoSectionProps) => {


  // const handleVideoPlay = async () => {
  //   try {
  //     await incrementVideoView(video.id);
  //     console.log("Video view tracked.");
  //   } catch (error) {
  //     console.error("Error tracking video view:", error);
  //   }
  // };

  return (
    <>
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-xl bg-black",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          // autoPlay
          onPlay={() => {}}
          // onTimeUpdate={handleTimeUpdate}
          onEnded={() => {}}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus || ""} />
      {/* <VideoTopRow video={video} subscription={subscription} /> */}
    </>
  );
};
