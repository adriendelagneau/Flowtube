"use client";

import Image from "next/image";
import React from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export const SidebarHeader = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="flex flex-shrink-0 items-center pl-2 pt-4 pb-2">
      <SidebarTrigger className=" cursor-pointer" />
        <div className="flex items-center gap-1 pl-4 ">
          <Image src="/logo.svg" alt="logo" width={32} height={32} />
          <p className="text-xl font-semibold tracking-tight">FLOWTUBE</p>
        </div>
    
    </div>
  );
};
