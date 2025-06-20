import { formatDistanceToNow } from "date-fns";
import { MoreVertical } from "lucide-react";
import millify from "millify";
import Image from "next/image";
import Link from "next/link"; // <<< Import Link
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VideoThumbnail } from "@/components/video-thumbnail";
import { VideoWithChannelAndCount } from "@/types";


interface VideoCardProps {
  video: VideoWithChannelAndCount;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const formatedDate = formatDistanceToNow(video.createdAt, {
    addSuffix: true,
  });

  return (
    <div className="overflow-hidden rounded-sm pb-2">
      <Link href={`/video/${video.id}`}>
        <VideoThumbnail
          imageUrl={video.thumbnailUrl}
          previewUrl={video.previewUrl}
          title={video.title}
          duration={video.duration}
        />
      </Link>

      <div className="mt-3 flex items-start justify-between px-1">
        {/* Video details */}
        <div className="flex min-w-0 flex-1 gap-3">
          <Link href={`/user/${video.channel.id}`}>
            <Image
              src={video.channel.image || "placeholder.svg"}
              alt={video.channel.name || "John Doe"}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
          </Link>

          <div className="flex flex-col gap-1">
            <Link href={`/video/${video.id}`} className="">
              <h3 className="line-clamp-2 text-sm font-semibold">
                {video.title}
              </h3>
            </Link>

            <Link href={`/user/${video.channel.id}`}>
              <p className="text-muted-foreground text-sm">{video.channel.name}</p>
            </Link>
            <Link href={`/video/${video.id}`}>
              <div className="text-muted-foreground flex gap-2 text-xs">
                <span>{millify(video.videoViews)} views</span>
                <span>-</span>
                <span>{formatedDate}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default VideoCard;
