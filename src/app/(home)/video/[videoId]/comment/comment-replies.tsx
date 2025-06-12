import React from "react";

import { FullComment } from "@/types";

import CommentItem from "./comment-item";

interface CommentRepliesProps {
  comment: FullComment;
}

const CommentReplies = ({ comment }: CommentRepliesProps) => {
  console.log(comment);

  return (
    <div className="pl-14">
      <div className="mt-2 flex flex-col gap-4">
        {comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} variant="reply" />
        ))}
      </div>
    </div>
  );
};

export default CommentReplies;
