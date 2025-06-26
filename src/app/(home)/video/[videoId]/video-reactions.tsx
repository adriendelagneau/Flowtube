"use client";

// import confetti from "canvas-confetti";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import React, { useOptimistic, useRef, useTransition } from "react";
import { toast } from "sonner";

import { dislikeVideoAction, likeVideoAction } from "@/actions/video-actions";
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

  const likeButtonRef = useRef<HTMLButtonElement>(null);

  // look at doing it in the frontend ?
  const viewerReaction = video.likes.some((l) => l.userId === user?.id)
    ? "like"
    : video.dislikes.some((d) => d.userId === user?.id)
      ? "dislike"
      : null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

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
    if (!user) return toast("Sign-in to react !");
    // const wasAlreadyLiked = optimisticState.reaction === "like";
    startTransition(async () => {
      updateOptimisticState(type);
      // if (type === "like" && !wasAlreadyLiked) {
      //   fireConfetti();
      // }
      if (type === "like") {
        await likeVideoAction(video.id);
      } else {
        await dislikeVideoAction(video.id);
      }
    });
  };

  return (
    <div className="flex flex-none items-center">
      <Button
        ref={likeButtonRef}
        variant="secondary"
        className="cursor-pointer gap-2 rounded-lg rounded-r-none pr-4"
        onClick={() => handleReaction("like")}
      >
        <ThumbsUpIcon
          strokeWidth={1.1}
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
      >
        <ThumbsDownIcon
          strokeWidth={1.1}
          className={cn(
            "size-5",
            optimisticState.reaction === "dislike" &&
              "fill-secondary-foreground"
          )}
        />
        {optimisticState.dislikeCount}
      </Button>
    </div>
  );
};

export default VideoReactions;
