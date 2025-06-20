import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Video } from "@/lib/generated/prisma"; 

import VideoStudioRowCard from "./studio-card";


interface StudioMainListProps {
  videos: Video[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  refObserver: (node?: Element | null) => void;
}

export const  StudioMainList = ({
  videos,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  refObserver,
}: StudioMainListProps) => {
  const skeletonCount = 9;

  return (
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
          {videos.map((video) => (
            <VideoStudioRowCard key={video.id} video={video} />
          ))}

          {(isLoading || (isFetchingNextPage && hasNextPage)) &&
            Array.from({ length: skeletonCount }).map((_, idx) => (
              <TableRow key={`skeleton-${idx}`}>
                <TableCell className="w-[510px]">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-[80px] w-36 rounded-md" />
                    <div className="flex w-full max-w-xs flex-col gap-2 pr-6">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-16 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-14 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-6 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-6 rounded-md" />
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Skeleton className="h-4 w-6 rounded-md" />
                </TableCell>
              </TableRow>
            ))}

          {hasNextPage && (
            <TableRow>
              <TableCell colSpan={7} ref={refObserver} />
            </TableRow>
          )}

          {!hasNextPage && videos.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-red-700">
                No studio videos found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
