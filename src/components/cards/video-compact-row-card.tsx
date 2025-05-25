"use client";

import { cva, VariantProps } from "class-variance-authority";
import { formatDistanceToNow } from "date-fns";
import millify from "millify";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { VideoThumbnail } from "@/app/(studio)/studio/components/video-thumbnail";
import { cn } from "@/lib/utils";
import { VideoWithUserAndCount } from "@/types";

// import VideoMenu from "../section/video/video-menu";

const videoRowCardVariants = cva("group flex min-w-0", {
  variants: {
    size: {
      default: "gap-4",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const tumbnailVariants = cva("relative flex-none", {
  variants: {
    size: {
      default: "w-[35%] min-w-[276px]",
      compact: "w-[148px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface VideoCompactRawCardProps
  extends VariantProps<typeof videoRowCardVariants> {
  size?: VariantProps<typeof videoRowCardVariants>["size"];
  video: VideoWithUserAndCount;
  onRemove?: (video: VideoWithUserAndCount) => void;
}

const VideoCompactRawCard = ({
  video,
  size,
  onRemove,
}: VideoCompactRawCardProps) => {
  const formatedDate = formatDistanceToNow(video.createdAt, {
    addSuffix: true,
  });
  const isNew =
    new Date(video.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  console.log(onRemove);

  return (
    <div className={videoRowCardVariants({ size })}>
      <Link href={`/video/${video.id}`} className={tumbnailVariants({ size })}>
        <VideoThumbnail
          imageUrl={video.thumbnailUrl}
          previewUrl={video.previewUrl}
          title={video.title}
          duration={video.duration}
        />
      </Link>

      {/* Infos*/}

      <div className="w-[370px] min-w-0 flex-1">
        <div className="flex justify-between gap-x-2">
          <Link href={`/video/${video.id}`} className="min-w-0">
            <h3
              className={cn(
                "line-clamp-2 font-semibold capitalize",
                size === "default" ? "text-sm" : "text-base"
              )}
            >
              {video.title}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {millify(video.videoViews)} views • {formatedDate}
            </p>
          </Link>
        </div>
        {size !== "compact" && (
          <div className="mt-3 flex flex-col gap-3">
            <Link
              href={`/user/${video.user.id}`}
              className="flex items-center gap-2"
            >
              <Image
                src={video.user.image || "placeholder.svg"}
                alt={video.user.name || "John Doe"}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
              <p className="text-muted-foreground text-sm">{video.user.name}</p>
            </Link>

            <Link href={`/video/${video.id}`}>
              <p className="text-muted-foreground line-clamp-1 text-sm">
                {video.description}
              </p>
            </Link>
          </div>
        )}
        {isNew && (
          <div
            className={cn(
              "mt-2 inline-block bg-black p-1",
              size === "compact" ? "mt-2 text-xs" : "text-sm"
            )}
          >
            New
          </div>
        )}
      </div>
      {/* <div className="flex-none">
        <VideoMenu videoId={video.id} variant="outline" />
      </div> */}
    </div>
  );
};

export default VideoCompactRawCard;
