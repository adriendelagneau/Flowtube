import Link from "next/link";
import React from "react";

import { UserAvatar } from "@/app/studio/components/sidebar/user-avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { User } from "@/lib/generated/prisma";

import UserInfo from "./user-info";

// import { SubscriptionButton } from "@/components/subscription-button";

interface VideoOwnerProps {
  user: User;
  videoId: string;
  subscription: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VideoOwner = ({ user, videoId, subscription }: VideoOwnerProps) => {
  const { data: session } = authClient.useSession();
  const isOwner = session?.user?.id === user.id;

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">
      <Link href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-start gap-3">
          <UserAvatar
            imageUrl={user.image || ""}
            name={user.name || "Unknown User"}
          />
          <div className="flex min-w-0 flex-col gap-1">
            <UserInfo size="lg" name={user.name || "Unknown User"} />
            <span className="text-muted-foreground line-clamp-1 text-sm">
              {123} subscribers {/* Replace with real count */}
            </span>
          </div>
        </div>
      </Link>

      {isOwner ? (
        <Button variant="secondary" className="rounded-full" asChild>
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        // <SubscriptionButton
        //   creatorId={user.id}
        //   className=""
        //   subscription={subscription}
        // />

        <Button>Subscibe</Button>
      )}
    </div>
  );
};

export default VideoOwner;
