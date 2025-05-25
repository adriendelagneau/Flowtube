import Image from "next/image";
import React from "react";

import { THUMBNAIL_FALLBACK } from "@/constants";
import { formatDuration } from "@/lib/utils";

interface VideoThumbnailProps {
  title: string;
  imageUrl?: string | null;
  previewUrl?: string | null;
  duration: number;
}

export const VideoThumbnail = ({
  title,
  imageUrl,
  previewUrl,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="group relative">
      {/** Thumbnail wrapper */}
      <div className="relative aspect-video w-full overflow-hidden rounded-sm">
        <Image
          src={imageUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="h-full w-full object-cover group-hover:opacity-0"
        />
        <Image
          src={previewUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
          unoptimized={!!previewUrl}
        />
      </div>

      {/** Video duration box */}
      <div className="absolute right-2 bottom-2 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
        {formatDuration(duration)}
      </div>
    </div>
  );
};
