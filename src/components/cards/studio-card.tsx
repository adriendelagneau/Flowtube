// components/cards/video-studio-row-card.tsx

"use client";

import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { VideoThumbnail } from "@/app/(studio)/studio/components/video-thumbnail";
import { Video } from "@/lib/generated";
import { snakeCaseToTitle } from "@/lib/utils";

export default function VideoStudioRowCard({ video }: { video: Video }) {
  const router = useRouter();

  return (
    <tr
      key={video.id}
      className="hover:bg-muted cursor-pointer"
      onClick={() => router.push(`/studio/video/${video.id}`)}
    >
      <td className="w-[510px] pl-6">
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
      </td>
      <td>
        <div className="flex items-center">
          {video.visibility === "private" ? (
            <LockIcon className="mr-2 size-4" />
          ) : (
            <Globe2Icon className="mr-2 size-4" />
          )}
          {snakeCaseToTitle(video.visibility)}
        </div>
      </td>
      <td>
        <div className="flex items-center">
          {snakeCaseToTitle(video.muxStatus || "error")}
        </div>
      </td>
      <td className="truncate text-sm">
        {format(new Date(video.createdAt), "d MMM yyyy")}
      </td>
      <td className="text-right text-sm">{24}</td>
      <td className="text-right text-sm">{7}</td>
      <td className="pr-6 text-right text-sm">{10}</td>
    </tr>
  );
}
