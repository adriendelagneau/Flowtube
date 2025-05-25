import InfiniteScrollMovies from "@/components/infinitScroolVideos";
import {
  Table,
  TableBody,

  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Video } from "@/lib/generated";


interface StudioSectionProps {
  videos: Video[];
  hasMore: boolean;
}

export const StudioSection = ({ videos, hasMore }: StudioSectionProps) => {



  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[510px] pl-6">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="pr-6 text-right">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            <InfiniteScrollMovies initialVideos={videos} hasMore={hasMore} />

            <InfiniteScrollMovies
              initialVideos={videos}
              hasMore={hasMore}
              variant="studio"
            />

            {/* {videos.map((video) => (
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
            ))} */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
