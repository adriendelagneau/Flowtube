"use client";

import { LogOutIcon, VideoIcon } from "lucide-react";
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

  return (
    <Sidebar className="z-40 pt-16" collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu>
            {/** Menu & Logo */}
            <div className="flex flex-shrink-0 items-center md:hidden">
              <SidebarTrigger className="cursor-pointer" />
              <Link href={"/"}>
                <div className="flex items-center gap-1 p-4">
                  <Image src="/logo3.png" alt="logo" width={32} height={32} />
                  <p className="text-xl font-semibold tracking-tight">Studio</p>
                </div>
              </Link>
            </div>

            <StudioSidebarHeader />
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/studio"}
                tooltip={"Video"}
                asChild
              >
                <Link href={"/studio"}>
                  <VideoIcon size={5} />
                  <span className="text-sm">Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Separator />

            <SidebarMenuItem>
              <SidebarMenuButton tooltip={"Exit studio"} asChild>
                <Link href={"/"}>
                  <LogOutIcon size={5} />
                  <span className="text-sm">Exit studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
