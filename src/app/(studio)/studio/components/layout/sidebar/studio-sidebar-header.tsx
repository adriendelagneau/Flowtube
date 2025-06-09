"use client";

import Link from "next/link";
import React from "react";

import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { User } from "@/lib/generated"; 
import { cn } from "@/lib/utils";

import { UserAvatar } from "./user-avatar";

interface StudioSidebarHeaderProps {
  user: User | null;
}

export const StudioSidebarHeader = ({ user }: StudioSidebarHeaderProps) => {
  const { state } = useSidebar();

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href={"/users/current"}>
        <UserAvatar
          imageUrl={user?.image || "/user.png"}
          name={user?.name ?? "John"}
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
        <p className="text-muted-foreground text-xs">{user?.name}</p>
      </div>
    </SidebarHeader>
  );
};
