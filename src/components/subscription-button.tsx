"use client";

import React from "react";
import { useTransition, useOptimistic } from "react";

import { toggleSubscription } from "@/actions/video-actions"; 
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscriptionButtonProps {
  creatorId: string;

  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  subscription: boolean;
}

export const SubscriptionButton = ({
  creatorId,
 
  className,
  size,
  subscription,
}: SubscriptionButtonProps) => {
  const [isPending, startTransition] = useTransition();
  console.log(isPending);

  // initialize useOptimistic with server subscription state
  const [optimisticSubscribed, setOptimisticSubscribed] =
    useOptimistic(subscription);

  const handleSubscription = () => {
    startTransition(() => {
      setOptimisticSubscribed((prev) => !prev); // toggle optimistic
      toggleSubscription(creatorId); // actually run server action
    });
  };

  return (
    <Button
      size={size}
      variant={optimisticSubscribed ? "secondary" : "default"}
      className={cn(
        "rounded flex-none",
         className
        )}
      onClick={handleSubscription}
      // disabled={isPending}
    >
      {optimisticSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
