"use client";

import React, { useState } from "react";

import { incrementVideoView, updateWatchHistory } from "@/actions/video-actions";
import { cn } from "@/lib/utils";
import { VideoWithUser } from "@/types";

import VideoBanner from "./video-banner";
import VideoPlayer from "./video-player";
import VideoTopRow from "./video-top-row";

interface VideoSectionProps {
  video: VideoWithUser;
  subscription: boolean;
}
export const VideoView = ({ video, subscription }: VideoSectionProps) => {
  const [lastReportedTime, setLastReportedTime] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTimeUpdate = async (event: any) => {

    const currentTime = Math.floor(event.target.currentTime);
    const duration = Math.floor(event.target.duration);
    const progress = (currentTime / duration) * 100;
    
    // Update every 15 seconds of progress (optional)
    if (currentTime - lastReportedTime >= 5) {
      setLastReportedTime(currentTime);
      console.log("timeUpdate");
      await updateWatchHistory(video.id, currentTime * 1000, progress, false);
    }
  };

  const handleVideoEnded = async () => {

    await updateWatchHistory(video.id, video.duration, 100, true);
  };

  const handleVideoPlay = async () => {
    try {
      await incrementVideoView(video.id);
      console.log("Video view tracked.");
    } catch (error) {
      console.error("Error tracking video view:", error);
    }
  };

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
          onPlay={handleVideoPlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus || ""} />
      <VideoTopRow video={video} subscription={subscription} />
    </>
  );
};
