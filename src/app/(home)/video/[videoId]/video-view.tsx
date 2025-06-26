"use client";

import React, { useRef } from "react";

import {
  incrementVideoView,
  updateWatchHistory,
} from "@/actions/video-actions";
// import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { VideoWithUser } from "@/types";

import VideoBanner from "./video-banner";
import VideoPlayer from "./video-player";
import VideoTopRow from "./video-top-row";
// import VideoTopRow from "./video-top-row";

interface VideoSectionProps {
  video: VideoWithUser;
  subscription: boolean;
  notifyLevel?: "ALL" | "PERSONALIZED" | "NONE";
}

export const VideoView = ({ video, subscription, notifyLevel }: VideoSectionProps) => {
  const hasCountedView = useRef(false);
  const lastReportedRef = useRef(0);

  // const {
  //   data: session,
  //   // isPending, //loading state
  //   // error, //error object
  //   // refetch, //refetch the session
  // } = authClient.useSession();

  // console.log(session?.user.id);

  // Fires when video is played
  const handleVideoPlay = async () => {
    if (hasCountedView.current) return;

    try {
      await incrementVideoView(video.id);
      hasCountedView.current = true;
      console.log("Video view tracked.");
    } catch (error) {
      console.error("Error tracking video view:", error);
    }
  };

  // Fires periodically during video playback
  const handleTimeUpdate = async (
    event: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const target = event.target as HTMLVideoElement;
    const currentTime = Math.floor(target.currentTime);
    const duration = Math.floor(target.duration);
    const progress = (currentTime / duration) * 100;

    // Only update every 5 seconds
    if (currentTime - lastReportedRef.current >= 5) {
      lastReportedRef.current = currentTime;
      try {
        await updateWatchHistory(video.id, currentTime * 1000, progress, false);
        console.log("Watch history updated:", currentTime, progress);
      } catch (err) {
        console.error("Failed to update watch history:", err);
      }
    }
  };

  // Fires when video ends
  const handleVideoEnded = async () => {
    try {
      await updateWatchHistory(video.id, video.duration, 100, true);
      console.log("Watch history completed.");
    } catch (err) {
      console.error("Failed to finalize watch history:", err);
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
          onPlay={handleVideoPlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus || ""} />
      <VideoTopRow video={video} subscription={subscription} notifyLevel={notifyLevel} />
    </>
  );
};
