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
import { User } from "@/lib/generated/prisma";

import { LogoutButton } from "./logout-button";

export const UserButton = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <Avatar className="h-10 w-10 cursor-pointer">
          <AvatarImage src={user.img} alt="User Avatar" className="size-8" />
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
