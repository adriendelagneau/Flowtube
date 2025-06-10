"use client";

import Link from "next/link";
import React from "react";

import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

import { UserAvatar } from "./user-avatar";

export const StudioSidebarHeader = () => {
  const { state } = useSidebar();
  const {
    data: session,
    isPending, //loading state
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error,
  } = authClient.useSession();

  if (isPending) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4 mb-4">
        <div className="flex flex-col items-center">
          <Skeleton
            className={cn(
              "rounded-full",
              state === "collapsed" ? "h-8 w-8" : "h-[112px] w-[112px]"
            )}
          />
          <div
            className={cn(
              "mt-2 flex flex-col items-center gap-y-1 transition-all duration-200",
              state === "collapsed" &&
                "h-0 overflow-hidden text-[0px] opacity-0"
            )}
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </SidebarHeader>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href={"/users/current"}>
        <UserAvatar
          imageUrl={session?.user?.image || "/user.png"}
          name={session?.user?.name ?? "John"}
          className={cn(
            "transition-all duration-200 hover:opacity-80",
            state === "collapsed" ? "size-8" : "size-[112px]"
          )}
          //   onClick={() => {}}
        />
      </Link>
      <div
        className={cn(
          "mt-2 flex flex-col items-center gap-y-1 transition-all duration-200",
          state === "collapsed" && "h-0 overflow-hidden text-[0px] opacity-0"
        )}
      >
        <p className="text-sm font-medium">Your profile</p>
        <p className="text-muted-foreground text-xs">{session?.user?.name}</p>
      </div>
    </SidebarHeader>
  );
};
