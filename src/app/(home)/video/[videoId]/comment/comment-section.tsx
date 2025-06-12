import { getCommentsByVideoId } from "@/actions/comment-actions"; 
import { VideoWithUser } from "@/types";

import CommentForm from "./comment-form";
import CommentItem from "./comment-item";

interface CommentSectionProps {
  video: VideoWithUser;
}

export const CommentSection = async ({ video }: CommentSectionProps) => {
  const comments = await getCommentsByVideoId(video.id);

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="font-semibold">{comments?.length} Comments</h1>
        <CommentForm videoId={video.id} variant="comment" />

        {comments.map((comment, i) => {
          if (!comment.parentId) {
            return <CommentItem key={i} comment={comment} />;
          }
          return null;
        })}
      </div>
    </div>
  );
};
