"use client";

import { formatDistanceToNow } from "date-fns";
import { MoreVerticalIcon } from "lucide-react";
import millify from "millify";
import Link from "next/link";
import React from "react";

import { VideoWithUserAndCount } from "@/types";

import { Button } from "../ui/button";
import { VideoThumbnail } from "../video-thumbnail";

interface VideoCompactRawCardProps {
  video: VideoWithUserAndCount;
  onRemove?: (video: VideoWithUserAndCount) => void;
}

const VideoCompactRawCard = ({
  video,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRemove,
}: VideoCompactRawCardProps) => {
  const formatedDate = formatDistanceToNow(video.createdAt, {
    addSuffix: true,
  });
  const isNew =
    new Date(video.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="group mt-2 flex min-w-0 gap-2">
      <Link href={`/video/${video.id}`} className="w-[168px]">
        <VideoThumbnail
          imageUrl={video.thumbnailUrl}
          previewUrl={video.previewUrl}
          title={video.title}
          duration={video.duration}
        />
      </Link>

      {/* Infos*/}

      <div className="w-[420px] min-w-0 flex-1">
        <div>
          <Link href={`/video/${video.id}`} className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-medium capitalize">
              {video.title}
            </h3>
          </Link>

          <Link
            href={`/user/${video.user.id}`}
            className="flex items-center gap-2"
          >
            <p className="text-muted-foreground capitalize text-xs pt-1">{video.user.name}</p>
          </Link>

          <p className="text-muted-foreground text-xs">
            {millify(video.videoViews)} views • {formatedDate}
          </p>

          {isNew && (
            <div className="mt-1 inline-block bg-black p-1 text-sm">New</div>
          )}
        </div>
      </div>
      <Button variant={"outline"}>
        <MoreVerticalIcon />
      </Button>
    </div>
  );
};

export default VideoCompactRawCard;
