import { getVideoById } from "@/actions/video-actions";

import { CommentSection } from "./comment/comment-section";
import { VideoView } from "./video-view";

// import { SuggestionSection } from "@/components/suggestion-section";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  const video = await getVideoById(videoId);

  if (!video) return null;

  return (
    <div className="w-full">
      <div className="mx-4 mb-10 flex flex-col pt-2.5">
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="flex-1">
            <VideoView video={video} />
            <div className="mt-4 block rounded-xl xl:hidden">
              {/* <SuggestionSection
                initialVideos={res.videos}
                hasMore={res.hasMore}
              /> */}
            </div>
            <CommentSection video={video} />
          </div>
          <div className="hidden w-full shrink-1 rounded-xl xl:block xl:w-[380px]">
            {/* <SuggestionSection
              initialVideos={res.videos}
              hasMore={res.hasMore}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
