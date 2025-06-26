"use client";

import { formatDistanceToNow } from "date-fns";
import {
  MessageSquareIcon,
  MoreVerticalIcon,
  Trash2Icon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useTransition, useOptimistic } from "react";

import {
  deleteComment,
  dislikeCommentAction,
  likeCommentAction,
} from "@/actions/comment-actions";
import { UserAvatar } from "@/app/studio/components/sidebar/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { FullComment } from "@/types";

import CommentForm from "./comment-form";
import CommentReplies from "./comment-replies";

interface CommentItemProps {
  comment: FullComment;
  variant?: "reply" | "comment";
}

const CommentItem = ({
  comment: initialComment,
  variant = "comment",
}: CommentItemProps) => {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  interface ViewerReactionResult {
    reaction: "like" | "dislike" | null;
  }

  const viewerReaction: ViewerReactionResult["reaction"] = initialComment.commentLikes.some(
    (l: { userId: string }) => l.userId === userId
  )
    ? "like"
    : initialComment.commentDislikes.some((d: { userId: string }) => d.userId === userId)
      ? "dislike"
      : null;

  const [optimisticState, updateOptimisticState] = useOptimistic(
    {
      reaction: viewerReaction,
      likeCount: initialComment._count.commentLikes,
      dislikeCount: initialComment._count.commentDislikes,
    },
    (state, newReaction: "like" | "dislike") => {
      const alreadyReacted = state.reaction === newReaction;

      if (alreadyReacted) {
        return {
          ...state,
          reaction: null,
          likeCount:
            newReaction === "like" ? state.likeCount - 1 : state.likeCount,
          dislikeCount:
            newReaction === "dislike"
              ? state.dislikeCount - 1
              : state.dislikeCount,
        };
      }

      return {
        reaction: newReaction,
        likeCount:
          newReaction === "like"
            ? state.likeCount + 1
            : state.reaction === "like"
              ? state.likeCount - 1
              : state.likeCount,
        dislikeCount:
          newReaction === "dislike"
            ? state.dislikeCount + 1
            : state.reaction === "dislike"
              ? state.dislikeCount - 1
              : state.dislikeCount,
      };
    }
  );

  const handleReaction = (type: "like" | "dislike") => {
    startTransition(async () => {
      updateOptimisticState(type);
      if (type === "like") {
        await likeCommentAction(initialComment.id, initialComment.videoId);
      } else {
        await dislikeCommentAction(initialComment.id, initialComment.videoId);
      }
    });
  };

  const handleDelete = async () => {
    if (!userId) return;
    startTransition(async () => {
      try {
        await deleteComment(initialComment.id);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    });
  };

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${initialComment.userId}`}>
          <UserAvatar
            imageUrl={initialComment.user.image || "/user-sm.png"}
            name={initialComment.user.name || "john doe"}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-6">
            <div className="pr-3 pb-0.5 text-sm font-medium">
              {initialComment.user.name}
            </div>
            <div className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(initialComment.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>

          <p className="text-sm">{initialComment.content}</p>

          {/* Reactions Inline */}
          <div className="mt-2 flex flex-none items-center">
            <Button
              variant="secondary"
              className="cursor-pointer gap-2 rounded-full rounded-r-none pr-4"
              onClick={() => handleReaction("like")}
            >
              <ThumbsUpIcon
                className={cn(
                  "size-5",
                  optimisticState.reaction === "like" &&
                    "fill-secondary-foreground"
                )}
              />
              {optimisticState.likeCount}
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button
              variant="secondary"
              className="cursor-pointer rounded-full rounded-l-none pl-3"
              onClick={() => handleReaction("dislike")}
            >
              <ThumbsDownIcon
                className={cn(
                  "size-5",
                  optimisticState.reaction === "dislike" &&
                    "fill-secondary-foreground"
                )}
              />
              {optimisticState.dislikeCount}
            </Button>

            {/* Replies */}
            {variant === "comment" && (
              <Button
                variant={"ghost"}
                size={"sm"}
                className="ml-3 h-8 cursor-pointer"
                onClick={() => setIsReplyOpen(true)}
              >
                Reply
              </Button>
            )}
          </div>
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="size-8 cursor-pointer"
            >
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {variant === "comment" && (
              <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
                <MessageSquareIcon className="mr-2 size-4" />
                Reply
              </DropdownMenuItem>
            )}
            {initialComment.userId === userId && (
              <DropdownMenuItem onClick={handleDelete} disabled={isPending}>
                <Trash2Icon className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isReplyOpen && variant === "comment" && (
        <div className="mt-4 pl-14">
          <CommentForm
            videoId={initialComment.videoId}
            parentId={initialComment.id}
            onCancel={() => setIsReplyOpen(false)}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
            variant="reply"
          />
        </div>
      )}

      {initialComment.replies.length > 0 && variant === "comment" && (
        <div className="pl-14">
          <Button
            // variant={"tertiary"}
            size={"sm"}
            onClick={() => setIsRepliesOpen((current) => !current)}
          >
            {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {initialComment.replies.length} replies
          </Button>
        </div>
      )}
      {initialComment.replies.length > 0 &&
        variant === "comment" &&
        isRepliesOpen && <CommentReplies comment={initialComment} />}
    </div>
  );
};

export default CommentItem;
