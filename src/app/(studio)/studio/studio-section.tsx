// import InfiniteScrollStudio from "@/components/infinte-scroll-studio";
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

  console.log(videos, hasMore);
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
            {/* {JSON.stringify(videos)} */}
            {/* <InfiniteScrollStudio initialVideos={videos} hasMore={hasMore} /> */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
