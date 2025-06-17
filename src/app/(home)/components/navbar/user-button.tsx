"use client";

import { ClapperboardIcon, LogOutIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";


import { LogoutButton } from "./logout-button";

export const UserButton = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center h-10 w-10 cursor-pointer">
        <Avatar className="">
          <AvatarImage src={user?.image || undefined} alt="User Avatar" className="h-7 w-7" />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <Link href={"/user"} className="flex gap-x-2">
          <DropdownMenuItem className="w-full cursor-pointer">
            <User2Icon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>

        <Link href={"/studio"} className="flex gap-x-2">
          <DropdownMenuItem className="w-full cursor-pointer">
            <ClapperboardIcon className="mr-2 h-4 w-4" />
            Studio
          </DropdownMenuItem>
        </Link>

        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
