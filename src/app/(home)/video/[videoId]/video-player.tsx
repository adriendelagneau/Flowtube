"use client";
import MuxPlayer from "@mux/mux-player-react";

import { THUMBNAIL_FALLBACK } from "@/constants";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTimeUpdate?: (event: any) => Promise<void>;
  onEnded?: () => void;
}

const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
  onTimeUpdate,
  onEnded,
}: VideoPlayerProps) => {
  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl || THUMBNAIL_FALLBACK}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className="h-full w-full object-cover"
      accentColor="#ff2056"
      onPlay={onPlay}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
    />
  );
};

export default VideoPlayer;
