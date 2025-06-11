"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import React, { useOptimistic, useTransition } from "react";

// import { dislikeVideoAction, likeVideoAction } from "@/actions/video-actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { VideoWithUser } from "@/types";

interface VideoReactionsProps {
  video: VideoWithUser;
}

const VideoReactions = ({ video }: VideoReactionsProps) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const viewerReaction = video.likes.some((l) => l.userId === user?.id)
    ? "like"
    : video.dislikes.some((d) => d.userId === user?.id)
      ? "dislike"
      : null;

  const [isPending, startTransition] = useTransition();
  console.log(isPending);

  const [optimisticState, updateOptimisticState] = useOptimistic(
    {
      reaction: viewerReaction,
      likeCount: video._count.likes,
      dislikeCount: video._count.dislikes,
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
      // if (type === "like") {
      //   await likeVideoAction(video.id);
      // } else {
      //   await dislikeVideoAction(video.id);
      // }
    });
  };

  return (
    <div className="flex flex-none items-center">
      <Button
        variant="secondary"
        className="cursor-pointer gap-2 rounded-lg rounded-r-none pr-4"
        onClick={() => handleReaction("like")}
        // disabled={isPending}
      >
        <ThumbsUpIcon
          className={cn(
            "size-5",
            optimisticState.reaction === "like" && "fill-secondary-foreground"
          )}
        />
        {optimisticState.likeCount}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="cursor-pointer rounded-lg rounded-l-none pl-3"
        onClick={() => handleReaction("dislike")}
        // disabled={isPending}
      >
        <ThumbsDownIcon
          className={cn(
            "size-5",
            optimisticState.reaction !== "like" && "fill-secondary-foreground"
          )}
        />
        {optimisticState.dislikeCount}
      </Button>
    </div>
  );
};

export default VideoReactions;
