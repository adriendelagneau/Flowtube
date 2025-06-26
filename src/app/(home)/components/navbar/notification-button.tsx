"use client";

import { useQuery } from "@tanstack/react-query";
import { BellRingIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const fetchUnreadNotificationStatus = async (): Promise<{
  hasUnread: boolean;
}> => {
  const res = await fetch("/api/notifications/unread");
  if (!res.ok) throw new Error("Failed to fetch notification status");
  return res.json();
};

export const NotificationButton = () => {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isLoading, isError } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: fetchUnreadNotificationStatus,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // 1 minute
  });

  const hasUnread = data?.hasUnread ?? false;

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
