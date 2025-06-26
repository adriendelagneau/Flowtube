"use client";

import React from "react";
import { useTransition, useOptimistic } from "react";

import {
  toggleSubscription,
  updateNotificationLevel,
} from "@/actions/video-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubscriptionButtonProps {
  channelId: string;
  subscription: boolean;
  notifyLevel?: "ALL" | "PERSONALIZED" | "NONE";
  className?: string;
}

export const SubscriptionButton = ({
  channelId,
  subscription,
  notifyLevel = "ALL",
  className,
}: SubscriptionButtonProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const [optimisticSubscribed, setOptimisticSubscribed] =
    useOptimistic(subscription);
  const [level, setLevel] = useOptimistic<"ALL" | "PERSONALIZED" | "NONE">(
    notifyLevel
  );

  const handleToggleSubscription = () => {
    startTransition(() => {
      setOptimisticSubscribed((prev) => !prev);
      toggleSubscription(channelId);
    });
  };

  const handleChangeNotification = (newLevel: typeof level) => {
    startTransition(() => {
      setLevel(newLevel);
      updateNotificationLevel(channelId, newLevel);
    });
  };

  if (!optimisticSubscribed) {
    return (
      <Button onClick={handleToggleSubscription} className={className}>
        Subscribe
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className={className}>
          Subscribed
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => handleChangeNotification("ALL")}>
          {level === "ALL" ? "✓ " : ""} All notifications
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChangeNotification("PERSONALIZED")}
        >
          {level === "PERSONALIZED" ? "✓ " : ""} Personalized
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChangeNotification("NONE")}>
          {level === "NONE" ? "✓ " : ""} None
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleToggleSubscription}
          className="text-red-500"
        >
          Unsubscribe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
