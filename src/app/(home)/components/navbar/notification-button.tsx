"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BellRingIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { pusherClient } from "@/lib/pusher-client";
const fetchUnreadNotificationStatus = async (): Promise<{
  hasUnread: boolean;
}> => {
  const res = await fetch("/api/notifications/unread");
  if (!res.ok) throw new Error("Failed to fetch notification status");
  return res.json();
};

export const NotificationButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: fetchUnreadNotificationStatus,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // 1 minute
  });

  const hasUnread = data?.hasUnread ?? false;

  useEffect(() => {
    const userId = "<CURRENT_USER_ID>"; // Replace with actual user ID from context/session

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind("new-notification", () => {
      // Invalidate to refetch unread state
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
    });

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [queryClient]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className="relative cursor-pointer"
      onClick={() => router.push("/notifications")}
    >
      <BellRingIcon className="h-5 w-5" />
      {!isLoading && hasUnread && (
        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-700" />
      )}
    </Button>
  );
};
