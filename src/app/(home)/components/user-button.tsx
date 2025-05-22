"use client";

import {
  ClapperboardIcon,
  LogOutIcon,
  User2Icon,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  // Ensure image is either a valid string URL/Base64 or undefined
  const imageSrc =
    user?.image &&
    (user.image.startsWith("http") || user.image.startsWith("data:image"))
      ? user.image
      : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <Avatar className="mx-3 h-6 w-6">
          {imageSrc ? (
            <AvatarImage src={imageSrc} alt="User Avatar" />
          ) : (
            <AvatarFallback className="bg-sky-500">
              <UserRound strokeWidth={1} />
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <Link href={"/profile"} className="flex gap-x-2">
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
