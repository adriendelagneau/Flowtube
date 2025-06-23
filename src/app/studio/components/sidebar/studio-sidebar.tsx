"use client";

import { LogOutIcon, VideoIcon, ListVideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { StudioSidebarHeader } from "./studio-sidebar-header";

export const StudioSidebar = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const channelId = segments[2]; // ex. "abc123"

  const isVideosPage = pathname === `/studio/${channelId}/videos`;
  const isPlaylistsPage = pathname === `/studio/${channelId}/playlists`;

  return (
    <Sidebar className="z-40 pt-16" collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu>
            {/* Logo & burger menu */}
            <div className="flex flex-shrink-0 items-center md:hidden">
              <SidebarTrigger className="cursor-pointer" />
              <Link href={"/studio"}>
                <div className="flex items-center gap-1 p-4">
                  <Image src="/logo3.png" alt="logo" width={32} height={32} />
                  <p className="text-xl font-semibold tracking-tight">Studio</p>
                </div>
              </Link>
            </div>

            <StudioSidebarHeader />

            {/* Videos */}
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isVideosPage} asChild>
                <Link href={`/studio/${channelId}/videos`}>
                  <VideoIcon size={20} />
                  <span className="text-sm">Videos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Playlists */}
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isPlaylistsPage} asChild>
                <Link href={`/studio/${channelId}/playlists`}>
                  <ListVideoIcon size={20} />
                  <span className="text-sm">Playlists</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Separator />

            {/* Exit */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <LogOutIcon size={20} />
                  <span className="text-sm">Exit Studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
