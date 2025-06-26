import { getSubscriptionStatus, getVideoById } from "@/actions/video-actions";
import SuggestionSection from "@/components/suggestion-section";

import { CommentSection } from "./comment/comment-section";
import { VideoView } from "./video-view";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

    const subscriptions = await getSubscriptionStatus(videoId);
  if (!subscriptions) return null;

  const subscription = subscriptions.isSubscribed;

  const video = await getVideoById(videoId);
 

  if (!video) return null;

  return (
    <div className="w-full">
      <div className="mx-4 mb-10 flex flex-col pt-2.5">
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="flex-1">
            <VideoView video={video} subscription={subscription}  notifyLevel={video.notifyLevel}/>
            <div className="mt-4 block rounded-xl xl:hidden">
              <SuggestionSection />
            </div>
            <CommentSection video={video} />
          </div>
          <div className="hidden w-full shrink-1 rounded-xl xl:block xl:w-[420px]">
            <SuggestionSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
