// components/cards/video-studio-row-card.tsx

"use client";

import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// import { updateVideoThumbnail } from "@/actions/video-actions";
import { TableCell, TableRow } from "@/components/ui/table";
import { VideoThumbnail } from "@/components/video-thumbnail";
import { Video } from "@/lib/generated/prisma";
import { snakeCaseToTitle } from "@/lib/utils";

export default function VideoStudioRowCard({ video }: { video: Video }) {
  const router = useRouter();

  return (
    <TableRow
      key={video.id}
      className="cursor-pointer"
      onClick={() => router.push(`/studio/video/${video.id}`)}
    >
      <TableCell className="w-[510px] pl-6">
        <Link
          href={`/studio/video/${video.id}`}
          className="flex items-center gap-4"
        >
          <div className="relative aspect-video w-36 shrink-0">
            <VideoThumbnail
              title={video.title}
              imageUrl={video.thumbnailUrl}
              previewUrl={video.previewUrl}
              duration={video.duration || 0}
            />
          </div>
          <div className="whitespace-normal">
            <p className="line-clamp-1 text-sm">{video.title}</p>
            <div className="line-clamp-1 w-full max-w-xs pr-6">
              {video.description}
            </div>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {video.visibility === "private" ? (
            <LockIcon className="mr-2 size-4" />
          ) : (
            <Globe2Icon className="mr-2 size-4" />
          )}
          {snakeCaseToTitle(video.visibility)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {snakeCaseToTitle(video.muxStatus || "error")}
        </div>
      </TableCell>
      <TableCell className="truncate text-sm">
        {format(new Date(video.createdAt), "d MMM yyyy")}
      </TableCell>
      <TableCell className="text-right text-sm">{24}</TableCell>
      <TableCell className="text-right text-sm">{7}</TableCell>
      <TableCell className="pr-6 text-right text-sm">{10}</TableCell>
    </TableRow>
  );
}
