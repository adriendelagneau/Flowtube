import Image from "next/image";
import Link from "next/link";
import React from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";

export const SidebarHeader = () => {
  return (
    <div className="flex flex-shrink-0 items-center pl-1 md:hidden">
      <SidebarTrigger className="cursor-pointer ml-3" />
      <Link href={"/"}>
        <div className="flex items-center gap-1 p-4">
          <Image src="/logo.svg" alt="logo" width={32} height={32} />
          <p className="text-xl font-semibold tracking-tight">FLOWTUBE</p>
        </div>
      </Link>
    </div>
  );
};
